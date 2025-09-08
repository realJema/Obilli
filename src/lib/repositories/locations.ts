import { Database } from '@/lib/types/database';
import { supabase } from '@/lib/db/client';

export interface Location {
  id: number;
  location_en: string;
  location_fr: string;
  parent_id: number | null;
  created_at: string;
}

export interface LocationHierarchy {
  id: number;
  location_en: string;
  location_fr: string;
  region?: string;
  city?: string;
  quarter?: string;
  level: 'region' | 'city' | 'quarter';
}

export interface LocationOption {
  value: number;
  label: string;
  region: string;
  city?: string;
  quarter?: string;
}

export interface LocationWithChildren extends Location {
  children?: LocationWithChildren[];
}

class LocationsRepository {
  async getAll(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('location_en', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getRegions(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .is('parent_id', null)
      .order('location_en', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getCitiesByRegion(regionId: number): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('parent_id', regionId)
      .order('location_en', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getQuartersByCity(cityId: number): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('parent_id', cityId)
      .order('location_en', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getLocationHierarchy(locationId: number): Promise<LocationHierarchy | null> {
    // For now, manually build hierarchy since we don't have the RPC function yet
    return this.buildLocationHierarchy(locationId);
  }

  private async buildLocationHierarchy(locationId: number): Promise<LocationHierarchy | null> {
    const location = await this.getById(locationId);
    if (!location) return null;

    const hierarchy: LocationHierarchy = {
      id: location.id,
      location_en: location.location_en,
      location_fr: location.location_fr,
      level: 'quarter'
    };

    // If it has a parent, get the city
    if (location.parent_id) {
      const city = await this.getById(location.parent_id);
      if (city) {
        hierarchy.city = city.location_en;
        hierarchy.level = 'quarter';

        // If city has a parent, get the region
        if (city.parent_id) {
          const region = await this.getById(city.parent_id);
          if (region) {
            hierarchy.region = region.location_en;
          }
        }
      }
    } else {
      // Check if this location is a city (has children but is not a region)
      const children = await this.getCitiesByRegion(location.id);
      if (children.length > 0) {
        // Check if children have children (making this a region)
        const grandChildren = await this.getQuartersByCity(children[0].id);
        if (grandChildren.length > 0) {
          hierarchy.level = 'region';
        } else {
          hierarchy.level = 'city';
        }
      } else {
        hierarchy.level = 'quarter';
      }
    }

    return hierarchy;
  }

  async getQuarterOptions(): Promise<LocationOption[]> {
    // Get all quarters with their full hierarchy
    const { data, error } = await supabase
      .from('locations')
      .select(`
        id,
        location_en,
        location_fr,
        city:parent_id(
          location_en,
          region:parent_id(
            location_en
          )
        )
      `)
      .not('parent_id', 'is', null)
      .order('location_en', { ascending: true });

    if (error) {
      // Fallback: get quarters manually
      return this.getQuarterOptionsManually();
    }

    return (data || []).map((location: Location & { city?: { location_en: string; region?: { location_en: string } } }) => ({
      value: location.id,
      label: `${location.city?.location_en}, ${location.location_en} (${location.city?.region?.location_en})`,
      region: location.city?.region?.location_en || '',
      city: location.city?.location_en || '',
      quarter: location.location_en,
    }));
  }

  private async getQuarterOptionsManually(): Promise<LocationOption[]> {
    const quarters: LocationOption[] = [];
    const regions = await this.getRegions();

    for (const region of regions) {
      const cities = await this.getCitiesByRegion(region.id);
      for (const city of cities) {
        const cityQuarters = await this.getQuartersByCity(city.id);
        for (const quarter of cityQuarters) {
          quarters.push({
            value: quarter.id,
            label: `${city.location_en}, ${quarter.location_en} (${region.location_en})`,
            region: region.location_en,
            city: city.location_en,
            quarter: quarter.location_en,
          });
        }
      }
    }

    return quarters.sort((a, b) => a.label.localeCompare(b.label));
  }

  async getById(id: number): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data;
  }

  async getHierarchical(): Promise<LocationWithChildren[]> {
    // Get all locations
    const { data: allLocations, error } = await supabase
      .from('locations')
      .select('*')
      .order('location_en', { ascending: true });

    if (error) throw error;

    const locations = allLocations || [];
    
    // Build hierarchy
    const locationMap = new Map<number, LocationWithChildren>();
    const rootLocations: LocationWithChildren[] = [];

    // First pass: create all location objects
    locations.forEach(location => {
      locationMap.set(location.id, {
        ...location,
        children: []
      });
    });

    // Second pass: build the tree structure
    locations.forEach(location => {
      const locationWithChildren = locationMap.get(location.id)!;
      
      if (location.parent_id === null) {
        // This is a root location (region)
        rootLocations.push(locationWithChildren);
      } else {
        // This is a child location (city or quarter)
        const parent = locationMap.get(location.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(locationWithChildren);
        }
      }
    });

    return rootLocations;
  }

  async search(query: string): Promise<LocationOption[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .or(`location_en.ilike.%${query}%,location_fr.ilike.%${query}%`)
      .not('parent_id', 'is', null) // Only search quarters (non-null parent_id)
      .order('location_en', { ascending: true })
      .limit(50);

    if (error) throw error;
    
    const options: LocationOption[] = [];
    const locations: Location[] = data || [];
    
    for (const location of locations) {
      const hierarchy = await this.buildLocationHierarchy(location.id);
      if (hierarchy && hierarchy.region && hierarchy.city) {
        options.push({
          value: location.id,
          label: `${hierarchy.city}, ${location.location_en} (${hierarchy.region})`,
          region: hierarchy.region,
          city: hierarchy.city,
          quarter: location.location_en,
        });
      }
    }
    
    return options;
  }
}

export const locationsRepo = new LocationsRepository();
