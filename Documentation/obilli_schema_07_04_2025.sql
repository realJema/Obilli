--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-07 11:54:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 13 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 531 (class 1255 OID 29183)
-- Name: get_listing_rating(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_listing_rating(listing_id uuid) RETURNS TABLE(average_rating numeric, total_reviews bigint)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY
    SELECT
        ROUND(AVG(rating)::numeric, 1) as average_rating,
        COUNT(*) as total_reviews
    FROM reviews
    WHERE reviews.listing_id = $1;
END;
$_$;


ALTER FUNCTION public.get_listing_rating(listing_id uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 288 (class 1259 OID 29111)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    subtitle text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 29127)
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    category_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    condition text NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    location_id uuid,
    address character varying
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 36140)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    parent_id uuid,
    type character varying NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT locations_type_check CHECK (((type)::text = ANY ((ARRAY['town'::character varying, 'quarter'::character varying])::text[])))
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 29095)
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    bio text,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone_number text
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 29147)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    listing_id uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    parent_id uuid,
    is_reply boolean DEFAULT false NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 3897 (class 0 OID 29111)
-- Dependencies: 288
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, parent_id, created_at, subtitle) FROM stdin;
55828acf-b3eb-416d-8cda-e3908e8cf636	Electronics	electronics	\N	2024-04-27 10:00:00+00	Latest gadgets and devices
8d723702-91df-48a0-9cfe-bad2ebd666bf	Vehicles	vehicles	\N	2024-04-27 10:00:00+00	New and used vehicles
c613992f-e355-4f7d-8506-822b0d96534e	Real Estate	real-estate	\N	2024-04-27 10:00:00+00	Property listings and rentals
8e39c996-448b-46ce-953c-19e3daeacf03	Jobs	jobs	\N	2024-04-27 10:00:00+00	Job listings from top companies
5eb52597-e2d9-4e80-b588-f05c715efcd3	Services	services	\N	2024-04-27 10:00:00+00	Professional and personal services
df28a61f-dd5c-4285-9d37-1b1f79d04f11	Fashion	fashion	\N	2024-04-27 10:00:00+00	Clothing and accessories
594d56a0-c764-4a5b-86ab-704f9e51dbbf	Home & Garden	home-garden	\N	2024-04-27 10:00:00+00	Home improvement and gardening
538ca497-e6f4-4367-83cc-2e3eaba43ee4	Pets	pets	\N	2024-04-27 10:00:00+00	Pet supplies and animals
8cf837c8-c671-492f-9d5d-ecd31c2742cb	Sports & Outdoors	sports-outdoors	\N	2024-04-27 10:00:00+00	Sports equipment and fitness gear
6b6c18aa-f209-48d7-b515-37cbc86a6b4c	Books & Hobbies	books-hobbies	\N	2024-04-27 10:00:00+00	Books and hobby items
deb2d0e9-a282-4f85-8801-06e93daa4ad8	Mobile Devices	electronics-mobile-devices	55828acf-b3eb-416d-8cda-e3908e8cf636	2024-04-27 10:00:00+00	Smartphones and feature phones
5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	Computers & Laptops	electronics-computers-laptops	55828acf-b3eb-416d-8cda-e3908e8cf636	2024-04-27 10:00:00+00	Desktops
a6803e5a-a1c9-414c-8189-56344f0b7764	Audio & Video	electronics-audio-video	55828acf-b3eb-416d-8cda-e3908e8cf636	2024-04-27 10:00:00+00	Home theater and sound systems
b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	Cameras & Imaging	electronics-cameras-imaging	55828acf-b3eb-416d-8cda-e3908e8cf636	2024-04-27 10:00:00+00	Imaging devices and accessories
888d10d4-e6ee-4c79-8333-fb980fd81e10	Gaming & VR	electronics-gaming-vr	55828acf-b3eb-416d-8cda-e3908e8cf636	2024-04-27 10:00:00+00	Consoles and virtual reality
5b0502fe-3601-448d-9ed7-81853e873782	iPhones	electronics-mobile-devices-iphones	deb2d0e9-a282-4f85-8801-06e93daa4ad8	2024-04-27 10:00:00+00	Apple smartphones
a9b777a4-8caa-4448-ac25-65e49dd106fe	Android Phones	electronics-mobile-devices-android	deb2d0e9-a282-4f85-8801-06e93daa4ad8	2024-04-27 10:00:00+00	Android-based smartphones
9be07622-c7ed-4b0d-9ed5-5db7f0a9196d	Basic Phones	electronics-mobile-devices-basic	deb2d0e9-a282-4f85-8801-06e93daa4ad8	2024-04-27 10:00:00+00	Feature phones and basics
ce1055e8-7584-4d94-9b5d-8e4f85ddd16a	Phone Accessories	electronics-mobile-devices-accessories	deb2d0e9-a282-4f85-8801-06e93daa4ad8	2024-04-27 10:00:00+00	Cases and covers
291e998d-322c-4ed2-8dc1-ac3fd03bbc11	Refurbished Phones	electronics-mobile-devices-refurbished	deb2d0e9-a282-4f85-8801-06e93daa4ad8	2024-04-27 10:00:00+00	Certified pre-owned phones
8c6ae800-6d64-45c3-bc4f-345c69e5905e	Gaming Laptops	electronics-computers-laptops-gaming	5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	2024-04-27 10:00:00+00	Laptops for gaming
f5cc0abb-422d-4023-8bbd-f81c32904b15	Business Laptops	electronics-computers-laptops-business	5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	2024-04-27 10:00:00+00	Professional laptops
fb636425-e75b-4d0e-8b6b-7948542582af	Desktop PCs	electronics-computers-laptops-desktops	5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	2024-04-27 10:00:00+00	Desktop computers and workstations
cd7d7e2e-7c24-49f2-b534-e7d6166372bc	Computer Components	electronics-computers-laptops-components	5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	2024-04-27 10:00:00+00	Hardware and parts
ce1c0d19-f59a-4584-911d-d631dc907a2a	Tablets	electronics-computers-laptops-tablets	5a4f1927-962b-45ad-a1ea-896a1bcbb8a0	2024-04-27 10:00:00+00	Tablet computers and iPads
eef68e23-d3f2-4cd8-92e0-630bce5a5042	Smart TVs	electronics-audio-video-smart-tvs	a6803e5a-a1c9-414c-8189-56344f0b7764	2024-04-27 10:00:00+00	Internet-connected televisions
41fd06b9-e3e1-4468-9f08-5777aeb881d6	Speakers	electronics-audio-video-speakers	a6803e5a-a1c9-414c-8189-56344f0b7764	2024-04-27 10:00:00+00	Audio speakers and systems
872f1036-d262-40b0-b8e6-7a57ccebda9b	Headphones	electronics-audio-video-headphones	a6803e5a-a1c9-414c-8189-56344f0b7764	2024-04-27 10:00:00+00	Wireless and wired headphones
f8701023-432f-49ac-bc3c-06b8e6d90f12	Home Theater Systems	electronics-audio-video-home-theater	a6803e5a-a1c9-414c-8189-56344f0b7764	2024-04-27 10:00:00+00	Complete home cinema setups
087332c6-e4dc-4022-b35e-6778060b402d	Projectors	electronics-audio-video-projectors	a6803e5a-a1c9-414c-8189-56344f0b7764	2024-04-27 10:00:00+00	Video projectors and screens
6ec7f73a-5855-44c7-ae2f-654173f82630	DSLRs	electronics-cameras-imaging-dslrs	b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	2024-04-27 10:00:00+00	Digital single lens reflex cameras
d88b79c8-27bf-4a22-8ee0-f83475537608	Mirrorless Cameras	electronics-cameras-imaging-mirrorless	b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	2024-04-27 10:00:00+00	Compact mirrorless cameras
2af6afbc-853b-4487-996d-d7629ef381d6	Action Cameras	electronics-cameras-imaging-action	b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	2024-04-27 10:00:00+00	Cameras for adventure filming
1182c877-4c09-4718-bf71-b124c4ade57e	Digital Cameras	electronics-cameras-imaging-digital	b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	2024-04-27 10:00:00+00	Point and shoot cameras
6560083a-3c21-43b6-9848-45ef2c303baa	Camera Accessories	electronics-cameras-imaging-accessories	b1c5d709-e2ef-4da0-b590-01c6bd7c46a8	2024-04-27 10:00:00+00	Lenses and camera gear
1d69478f-094d-4b8b-a431-38285f77b448	Gaming Consoles	electronics-gaming-vr-consoles	888d10d4-e6ee-4c79-8333-fb980fd81e10	2024-04-27 10:00:00+00	Home gaming systems
ae833af1-fa61-4244-83c1-d87a180922bf	Gaming Accessories	electronics-gaming-vr-accessories	888d10d4-e6ee-4c79-8333-fb980fd81e10	2024-04-27 10:00:00+00	Accessories for gaming
aceb968c-2f64-42e8-b226-9b91c35871ee	VR Headsets	electronics-gaming-vr-headsets	888d10d4-e6ee-4c79-8333-fb980fd81e10	2024-04-27 10:00:00+00	Virtual reality headsets
615160e5-ee2a-4373-bea0-afb33cc5b336	PC Gaming Peripherals	electronics-gaming-vr-pc-peripherals	888d10d4-e6ee-4c79-8333-fb980fd81e10	2024-04-27 10:00:00+00	Accessories for PC gaming
6940f401-9a72-4cb8-85de-63721b350b15	Streaming Devices	electronics-gaming-vr-streaming	888d10d4-e6ee-4c79-8333-fb980fd81e10	2024-04-27 10:00:00+00	Devices for online streaming
270fecf6-20f6-4ce8-beb3-9bd158161666	Cars	electronics-vehicles-cars	8d723702-91df-48a0-9cfe-bad2ebd666bf	2024-04-27 10:00:00+00	New and used cars
6ff0f806-636c-48e4-b79f-95b19ef7e333	Motorcycles	electronics-vehicles-motorcycles	8d723702-91df-48a0-9cfe-bad2ebd666bf	2024-04-27 10:00:00+00	Two wheeled vehicles
bf259eba-6bf2-425c-bd6f-b1deb1ca3568	Commercial Vehicles	electronics-vehicles-commercial	8d723702-91df-48a0-9cfe-bad2ebd666bf	2024-04-27 10:00:00+00	Business and commercial vehicles
3d13951f-2c19-4240-810d-5aedc07b35c5	Boats & Marine	electronics-vehicles-boats-marine	8d723702-91df-48a0-9cfe-bad2ebd666bf	2024-04-27 10:00:00+00	Marine vehicles and boats
261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	Auto Parts & Accessories	electronics-vehicles-auto-parts	8d723702-91df-48a0-9cfe-bad2ebd666bf	2024-04-27 10:00:00+00	Vehicle parts and accessories
66644b4b-2189-40ce-8e38-d7bba97326e5	Luxury Cars	electronics-vehicles-cars-luxury	270fecf6-20f6-4ce8-beb3-9bd158161666	2024-04-27 10:00:00+00	High-end luxury vehicles
ed7bf95c-62f5-4950-ab4b-f67924ac4e73	SUVs	electronics-vehicles-cars-suvs	270fecf6-20f6-4ce8-beb3-9bd158161666	2024-04-27 10:00:00+00	Sport utility vehicles
9045bfbf-cd55-47fd-8d41-c7b23a138749	Sedans	electronics-vehicles-cars-sedans	270fecf6-20f6-4ce8-beb3-9bd158161666	2024-04-27 10:00:00+00	Family and passenger cars
930bba5b-5181-4add-9e3c-7285c372c4b7	Sports Cars	electronics-vehicles-cars-sports	270fecf6-20f6-4ce8-beb3-9bd158161666	2024-04-27 10:00:00+00	Performance vehicles
05c3dd77-17d3-4976-9ad8-da2d902fa3e1	Electric Cars	electronics-vehicles-cars-electric	270fecf6-20f6-4ce8-beb3-9bd158161666	2024-04-27 10:00:00+00	Electric vehicles
c51779d7-47c7-4183-a89c-ea7012a9adda	Sport Bikes	electronics-vehicles-motorcycles-sport	6ff0f806-636c-48e4-b79f-95b19ef7e333	2024-04-27 10:00:00+00	High performance motorcycles
216ef2a7-221a-406e-b2a9-f2384294105e	Cruiser Bikes	electronics-vehicles-motorcycles-cruiser	6ff0f806-636c-48e4-b79f-95b19ef7e333	2024-04-27 10:00:00+00	Cruiser style motorcycles
ae1a4700-b188-4247-ab6c-2e9a9bb74b3b	Touring Bikes	electronics-vehicles-motorcycles-touring	6ff0f806-636c-48e4-b79f-95b19ef7e333	2024-04-27 10:00:00+00	Long-distance motorcycles
cdf10523-d7d4-4db9-8e69-c1abde8b53e4	Off-Road Bikes	electronics-vehicles-motorcycles-offroad	6ff0f806-636c-48e4-b79f-95b19ef7e333	2024-04-27 10:00:00+00	Dirt and trail bikes
695c05e5-eeb8-434b-b621-1c4db461ce0c	Scooters	electronics-vehicles-motorcycles-scooters	6ff0f806-636c-48e4-b79f-95b19ef7e333	2024-04-27 10:00:00+00	Motor scooters
a729dbd7-dcdb-4975-abe2-e18c5f2851c3	Trucks	electronics-vehicles-commercial-trucks	bf259eba-6bf2-425c-bd6f-b1deb1ca3568	2024-04-27 10:00:00+00	Commercial trucks
fda4012f-1ffd-4404-8cb6-033fabfb8245	Vans	electronics-vehicles-commercial-vans	bf259eba-6bf2-425c-bd6f-b1deb1ca3568	2024-04-27 10:00:00+00	Commercial vans
e386760d-74af-49ea-bac8-93be3017028e	Buses	electronics-vehicles-commercial-buses	bf259eba-6bf2-425c-bd6f-b1deb1ca3568	2024-04-27 10:00:00+00	Passenger buses
03bf696c-0e2a-454d-b908-97a4bceadc92	Construction Vehicles	electronics-vehicles-commercial-construction	bf259eba-6bf2-425c-bd6f-b1deb1ca3568	2024-04-27 10:00:00+00	Construction machinery
838a0c4d-70d9-4744-aa03-954dad791a72	Agricultural Vehicles	electronics-vehicles-commercial-agricultural	bf259eba-6bf2-425c-bd6f-b1deb1ca3568	2024-04-27 10:00:00+00	Farming vehicles and machinery
2bfa6f3b-dcfb-4b0e-9c67-505a4ccf10f7	Motor Boats	electronics-vehicles-boats-marine-motor	3d13951f-2c19-4240-810d-5aedc07b35c5	2024-04-27 10:00:00+00	Powered recreational boats
74285a0d-b598-4962-9c1e-072a3b845268	Sailing Boats	electronics-vehicles-boats-marine-sailing	3d13951f-2c19-4240-810d-5aedc07b35c5	2024-04-27 10:00:00+00	Wind-powered vessels
2abb8fc7-33a4-4ff2-a5c2-1f5d3a34438c	Fishing Boats	electronics-vehicles-boats-marine-fishing	3d13951f-2c19-4240-810d-5aedc07b35c5	2024-04-27 10:00:00+00	Boats for fishing
172f2d43-eb00-48da-9459-2184af3ff5f7	Boat Parts	electronics-vehicles-boats-marine-parts	3d13951f-2c19-4240-810d-5aedc07b35c5	2024-04-27 10:00:00+00	Marine parts and accessories
26ea646f-5151-4c18-a396-3fd2d037c16e	Personal Watercraft	electronics-vehicles-boats-marine-personal	3d13951f-2c19-4240-810d-5aedc07b35c5	2024-04-27 10:00:00+00	Jet skis and water scooters
5b5352a9-f59f-46fd-9dfd-aac542dac42c	Engine Parts	electronics-vehicles-auto-parts-engine	261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	2024-04-27 10:00:00+00	Engine and mechanical components
e5b180d7-bfec-4e6f-9f57-bb77d1797b9c	Body Parts	electronics-vehicles-auto-parts-body	261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	2024-04-27 10:00:00+00	External body components
669ba615-3f3c-48a3-95ac-abf8663e4480	Interior Parts	electronics-vehicles-auto-parts-interior	261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	2024-04-27 10:00:00+00	Vehicle interior components
183983ce-a0d2-4a17-ac9a-62ce2be89cfb	Wheels & Tires	electronics-vehicles-auto-parts-wheels	261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	2024-04-27 10:00:00+00	Wheels
f5cce7b2-5b89-4fac-b4a4-f9d4bcb95ac7	Car Electronics	electronics-vehicles-auto-parts-electronics	261cd321-9c0d-4d0f-ba9e-90a09ed9c1cb	2024-04-27 10:00:00+00	Vehicle electronics and accessories
ee10e6a6-e588-4b59-ae20-1a5c643e12a4	Residential Sales	real-estate-residential-sales	c613992f-e355-4f7d-8506-822b0d96534e	2024-04-27 10:00:00+00	Properties for sale
5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	Residential Rentals	real-estate-residential-rentals	c613992f-e355-4f7d-8506-822b0d96534e	2024-04-27 10:00:00+00	Properties for rent
c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	Commercial Properties	real-estate-commercial	c613992f-e355-4f7d-8506-822b0d96534e	2024-04-27 10:00:00+00	Business properties
3e4b3890-beae-442d-aa4c-70a372e0a997	Land & Plots	real-estate-land-plots	c613992f-e355-4f7d-8506-822b0d96534e	2024-04-27 10:00:00+00	Plots and land
3b5f526e-40a7-4e09-955f-48c09b69c216	Vacation & Luxury	real-estate-vacation-luxury	c613992f-e355-4f7d-8506-822b0d96534e	2024-04-27 10:00:00+00	Holiday homes and rentals
561107e2-4455-4b62-8122-ddb0de016aa0	Apartments for Sale	real-estate-residential-sales-apartments	ee10e6a6-e588-4b59-ae20-1a5c643e12a4	2024-04-27 10:00:00+00	Apartments available for sale
10455463-f7d1-4a54-baa5-7b59fb07badf	Single Family Homes	real-estate-residential-sales-single-family	ee10e6a6-e588-4b59-ae20-1a5c643e12a4	2024-04-27 10:00:00+00	Individual houses
8cc2178d-c515-4c3b-9277-4d897cf4b1ce	Townhouses	real-estate-residential-sales-townhouses	ee10e6a6-e588-4b59-ae20-1a5c643e12a4	2024-04-27 10:00:00+00	Row houses
dadfb791-1afd-4f52-a583-016b364b59da	Condominiums	real-estate-residential-sales-condos	ee10e6a6-e588-4b59-ae20-1a5c643e12a4	2024-04-27 10:00:00+00	Condominium units
f600b00c-cc5f-4b79-b408-9add2fe66740	New Construction Homes	real-estate-residential-sales-new	ee10e6a6-e588-4b59-ae20-1a5c643e12a4	2024-04-27 10:00:00+00	Newly built properties
c06fd895-5f3d-4678-9633-d0ea2728dce3	Apartments for Rent	real-estate-residential-rentals-apartments	5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	2024-04-27 10:00:00+00	Apartments available for rent
5734a746-356c-497a-8e5d-dac75da475b8	Houses for Rent	real-estate-residential-rentals-houses	5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	2024-04-27 10:00:00+00	Houses available for rent
d880762e-296b-4525-91eb-df2109ea9780	Shared Rooms	real-estate-residential-rentals-shared	5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	2024-04-27 10:00:00+00	Room rentals
fbcdc6d2-6aa5-4c14-995a-93ea6cfeb4c9	Student Housing	real-estate-residential-rentals-student	5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	2024-04-27 10:00:00+00	Student accommodation
088c4403-6535-4a9e-97d2-50e3d8debf08	Short Term Rentals	real-estate-residential-rentals-short	5c3c16e7-5a6e-4ca0-9285-7f3ac853e9a2	2024-04-27 10:00:00+00	Temporary housing rentals
48d96a00-4a99-4ff1-9e06-a1325be626c4	Office Spaces	real-estate-commercial-offices	c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	2024-04-27 10:00:00+00	Office buildings and suites
abd7ec84-2018-4cd3-84f5-e459af9021a8	Retail Spaces	real-estate-commercial-retail	c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	2024-04-27 10:00:00+00	Shops and retail locations
84a69511-5e68-4817-837b-dab97f8752cc	Industrial Spaces	real-estate-commercial-industrial	c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	2024-04-27 10:00:00+00	Warehouses and factories
5416f940-4c33-4191-b255-0dadcfae216c	Mixed Use Properties	real-estate-commercial-mixed	c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	2024-04-27 10:00:00+00	Combined commercial spaces
885da1f7-0ebf-41d7-8d57-740ff36ec266	Warehouses	real-estate-commercial-warehouses	c53c5d04-7f0e-4f60-ae4c-d1b5d94e3ee2	2024-04-27 10:00:00+00	Storage and industrial spaces
05aa1241-2a59-45f7-bc3a-760cb7494304	Agricultural Land	real-estate-land-plots-agricultural	3e4b3890-beae-442d-aa4c-70a372e0a997	2024-04-27 10:00:00+00	Farming plots
49fb259e-edf2-43c6-b17f-f6aab9fc48ba	Residential Plots	real-estate-land-plots-residential	3e4b3890-beae-442d-aa4c-70a372e0a997	2024-04-27 10:00:00+00	Housing development land
64d9501a-bc5c-4add-b78b-63a5973c0b59	Commercial Plots	real-estate-land-plots-commercial	3e4b3890-beae-442d-aa4c-70a372e0a997	2024-04-27 10:00:00+00	Business development land
25112560-0752-4e40-8aea-57530a7f8dd0	Industrial Land	real-estate-land-plots-industrial	3e4b3890-beae-442d-aa4c-70a372e0a997	2024-04-27 10:00:00+00	Industrial development plots
f54ddc36-0d2f-44bc-9c7d-a8eaacb0d4ec	Investment Land	real-estate-land-plots-investment	3e4b3890-beae-442d-aa4c-70a372e0a997	2024-04-27 10:00:00+00	Land for investment
34645bfa-7008-4648-9553-e5de18e33342	Beach Houses	real-estate-vacation-luxury-beach	3b5f526e-40a7-4e09-955f-48c09b69c216	2024-04-27 10:00:00+00	Coastal vacation homes
a0c77263-156a-4842-8ebd-a1caf447c830	Mountain Cabins	real-estate-vacation-luxury-mountain	3b5f526e-40a7-4e09-955f-48c09b69c216	2024-04-27 10:00:00+00	Mountain retreat properties
a8f66541-f175-4b2c-9b62-325bcf3728b8	Lake Houses	real-estate-vacation-luxury-lake	3b5f526e-40a7-4e09-955f-48c09b69c216	2024-04-27 10:00:00+00	Lakefront properties
b6da9a4a-008d-4954-b255-db969dfa4192	Vacation Condos	real-estate-vacation-luxury-condos	3b5f526e-40a7-4e09-955f-48c09b69c216	2024-04-27 10:00:00+00	Holiday condominiums
c1260e74-9574-4853-b029-d3ded36b6868	Timeshares	real-estate-vacation-luxury-timeshares	3b5f526e-40a7-4e09-955f-48c09b69c216	2024-04-27 10:00:00+00	Shared vacation properties
1ce4fe49-976b-4ff9-9185-30c6a03753b0	Jobs - Technology	jobs-technology	8e39c996-448b-46ce-953c-19e3daeacf03	2024-04-27 10:00:00+00	IT and tech jobs
dd9da53f-cf97-400a-9c50-7f8d124a2634	Jobs - Healthcare	jobs-healthcare	8e39c996-448b-46ce-953c-19e3daeacf03	2024-04-27 10:00:00+00	Medical and healthcare positions
ac61a0da-e69e-4115-ba2d-231a8f901c10	Jobs - Education	jobs-education	8e39c996-448b-46ce-953c-19e3daeacf03	2024-04-27 10:00:00+00	Teaching and academic jobs
d440491f-4cc8-4dfc-903c-afb83b1c2b8f	Jobs - Finance	jobs-finance	8e39c996-448b-46ce-953c-19e3daeacf03	2024-04-27 10:00:00+00	Banking and finance positions
060ed039-6750-4d5c-a0d9-6c5334c8bc84	Jobs - Sales & Marketing	jobs-sales-marketing	8e39c996-448b-46ce-953c-19e3daeacf03	2024-04-27 10:00:00+00	Sales and marketing jobs
abf81b3b-2ef9-4802-9629-74b55c20a6c9	Software Development	jobs-technology-software	1ce4fe49-976b-4ff9-9185-30c6a03753b0	2024-04-27 10:00:00+00	Develop software applications
7b83bdce-3311-4cbf-8827-99e69bd7d918	IT Support	jobs-technology-it-support	1ce4fe49-976b-4ff9-9185-30c6a03753b0	2024-04-27 10:00:00+00	Technical support roles
12f930ab-71bb-432d-9be3-6ccbc12a5246	Cybersecurity	jobs-technology-cybersecurity	1ce4fe49-976b-4ff9-9185-30c6a03753b0	2024-04-27 10:00:00+00	Security and protection roles
c71a47d5-198d-491c-9775-3c48639f8b4d	Data Science	jobs-technology-data-science	1ce4fe49-976b-4ff9-9185-30c6a03753b0	2024-04-27 10:00:00+00	Data analysis and modeling
eb1087c2-2582-4bed-816b-70bb7968837d	Network Administration	jobs-technology-network	1ce4fe49-976b-4ff9-9185-30c6a03753b0	2024-04-27 10:00:00+00	Manage IT networks
d84d5a5d-b240-4b0d-820e-045abe092e3d	Nursing	jobs-healthcare-nursing	dd9da53f-cf97-400a-9c50-7f8d124a2634	2024-04-27 10:00:00+00	Registered nurses
04b136da-40b4-4080-a026-ea70df9e407c	Medical Technicians	jobs-healthcare-technicians	dd9da53f-cf97-400a-9c50-7f8d124a2634	2024-04-27 10:00:00+00	Medical support staff
fb8e5479-7ee9-4d26-927a-84e1ae9be082	Physicians	jobs-healthcare-physicians	dd9da53f-cf97-400a-9c50-7f8d124a2634	2024-04-27 10:00:00+00	Doctors and specialists
110e1c81-bf18-40d9-91a8-e93cd1fc5ab4	Medical Equipment Sales	jobs-healthcare-equipment	dd9da53f-cf97-400a-9c50-7f8d124a2634	2024-04-27 10:00:00+00	Sales in medical devices
f8bb5483-cf52-4f6f-88ef-93608dbbba67	Health Administration	jobs-healthcare-administration	dd9da53f-cf97-400a-9c50-7f8d124a2634	2024-04-27 10:00:00+00	Healthcare management
58780482-be50-41a9-8547-0f8bfbd53ea6	Teaching Positions	jobs-education-teaching	ac61a0da-e69e-4115-ba2d-231a8f901c10	2024-04-27 10:00:00+00	Classroom teaching jobs
d2922f22-9a12-4751-94fd-d6c5995e8632	Academic Tutoring	jobs-education-tutoring	ac61a0da-e69e-4115-ba2d-231a8f901c10	2024-04-27 10:00:00+00	Subject tutoring services
25c9e983-e4ce-405e-b766-4b48f192c448	Online Courses	jobs-education-online	ac61a0da-e69e-4115-ba2d-231a8f901c10	2024-04-27 10:00:00+00	Digital education platforms
48670832-96fe-4cf2-8772-30a01fe32e39	Research Roles	jobs-education-research	ac61a0da-e69e-4115-ba2d-231a8f901c10	2024-04-27 10:00:00+00	Academic research positions
fc384ae2-2f0a-4ee0-82d4-52ad64796b3e	School Administration	jobs-education-administration	ac61a0da-e69e-4115-ba2d-231a8f901c10	2024-04-27 10:00:00+00	School management roles
1e5dd65f-26e8-49ef-b937-a1a0cc5adc0e	Banking	jobs-finance-banking	d440491f-4cc8-4dfc-903c-afb83b1c2b8f	2024-04-27 10:00:00+00	Banking positions
2af74b81-9029-493c-b71e-539e949eb0b9	Investments	jobs-finance-investments	d440491f-4cc8-4dfc-903c-afb83b1c2b8f	2024-04-27 10:00:00+00	Investment roles
0ffd3336-3265-4334-9465-8ee7b62647e3	Accounting	jobs-finance-accounting	d440491f-4cc8-4dfc-903c-afb83b1c2b8f	2024-04-27 10:00:00+00	Financial record keeping
01c2446b-7fdc-44bf-be94-71c5a43fafe3	Insurance	jobs-finance-insurance	d440491f-4cc8-4dfc-903c-afb83b1c2b8f	2024-04-27 10:00:00+00	Insurance positions
6d99ad3c-1f95-49f2-a175-e464bcea732d	Financial Analysis	jobs-finance-analysis	d440491f-4cc8-4dfc-903c-afb83b1c2b8f	2024-04-27 10:00:00+00	Data analysis in finance
68412348-72d7-4e62-9500-a13346af475e	Retail Sales	jobs-sales-retail	060ed039-6750-4d5c-a0d9-6c5334c8bc84	2024-04-27 10:00:00+00	Sales in retail sector
5d956de3-01be-402f-bbd9-e30b11c293a9	Wholesale Sales	jobs-sales-wholesale	060ed039-6750-4d5c-a0d9-6c5334c8bc84	2024-04-27 10:00:00+00	Sales in bulk trade
b8a83583-17c2-4ea4-b627-56e0b34cb961	Digital Marketing	jobs-sales-digital	060ed039-6750-4d5c-a0d9-6c5334c8bc84	2024-04-27 10:00:00+00	Online marketing roles
1465f912-8ab5-4407-ad3d-f8c9efbcce6b	Advertising	jobs-sales-advertising	060ed039-6750-4d5c-a0d9-6c5334c8bc84	2024-04-27 10:00:00+00	Advertising positions
4ad1dd51-2b45-4d1a-8849-b9cf063a75fc	Customer Service	jobs-sales-customer	060ed039-6750-4d5c-a0d9-6c5334c8bc84	2024-04-27 10:00:00+00	Client support roles
de7219b0-00cd-4a0d-ad8b-a4b53e69d651	Services - Home	services-home	5eb52597-e2d9-4e80-b588-f05c715efcd3	2024-04-27 10:00:00+00	Household maintenance services
56f235a6-2729-44fc-b03b-a8def319125d	Services - Business	services-business	5eb52597-e2d9-4e80-b588-f05c715efcd3	2024-04-27 10:00:00+00	Professional business services
63b6450f-f37d-4671-851c-bcd52065c74d	Services - Education Training	services-education-training	5eb52597-e2d9-4e80-b588-f05c715efcd3	2024-04-27 10:00:00+00	Training and tutoring services
973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	Services - Health Wellness	services-health-wellness	5eb52597-e2d9-4e80-b588-f05c715efcd3	2024-04-27 10:00:00+00	Health and fitness services
05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	Services - Event Photography	services-event-photography	5eb52597-e2d9-4e80-b588-f05c715efcd3	2024-04-27 10:00:00+00	Event planning and photography
14930830-7cad-4dd6-812c-8007eb7a0291	Cleaning Services	services-home-cleaning	de7219b0-00cd-4a0d-ad8b-a4b53e69d651	2024-04-27 10:00:00+00	Home cleaning services
ce5b16c4-10c8-4070-8bf7-803e16a4d089	Plumbing	services-home-plumbing	de7219b0-00cd-4a0d-ad8b-a4b53e69d651	2024-04-27 10:00:00+00	Plumbing repair services
659460c5-d3b6-48f1-aad6-675878bc9766	Electrical Work	services-home-electrical	de7219b0-00cd-4a0d-ad8b-a4b53e69d651	2024-04-27 10:00:00+00	Electrical repair services
01d34b4b-ca6a-4243-a3dc-522581ff73cc	Moving Services	services-home-moving	de7219b0-00cd-4a0d-ad8b-a4b53e69d651	2024-04-27 10:00:00+00	Relocation services
1686b2bf-0bfb-4af3-9cb9-3584cf474982	Landscaping Services	services-home-landscaping	de7219b0-00cd-4a0d-ad8b-a4b53e69d651	2024-04-27 10:00:00+00	Garden maintenance services
c6bb0cae-1ba2-4277-abe4-af72aef40633	Consulting	services-business-consulting	56f235a6-2729-44fc-b03b-a8def319125d	2024-04-27 10:00:00+00	Business consulting services
b2662d62-25a8-486d-8169-10ad1d80ddf1	Marketing Services	services-business-marketing	56f235a6-2729-44fc-b03b-a8def319125d	2024-04-27 10:00:00+00	Marketing and advertising services
d47c2063-acc6-4582-8610-9f6da75ae39b	Legal Services	services-business-legal	56f235a6-2729-44fc-b03b-a8def319125d	2024-04-27 10:00:00+00	Business legal assistance
02f1d12c-1469-4cc2-b882-892b135bee0b	Accounting Services	services-business-accounting	56f235a6-2729-44fc-b03b-a8def319125d	2024-04-27 10:00:00+00	Financial and accounting services
e3eb61d3-f727-43d6-96b0-1432f321e641	IT Support Services	services-business-it	56f235a6-2729-44fc-b03b-a8def319125d	2024-04-27 10:00:00+00	Technology and IT support
5722be08-abf5-435d-bf93-1cc58b4d8417	Language Classes	services-education-training-language	63b6450f-f37d-4671-851c-bcd52065c74d	2024-04-27 10:00:00+00	Language learning courses
01aefa9c-f89d-4ffb-b016-f71294013b27	Academic Tutoring	services-education-training-academic	63b6450f-f37d-4671-851c-bcd52065c74d	2024-04-27 10:00:00+00	School subject tutoring
687588ad-a9b5-4402-9608-b7b5645c9423	Professional Training	services-education-training-professional	63b6450f-f37d-4671-851c-bcd52065c74d	2024-04-27 10:00:00+00	Career skills development
69c5f73d-80b4-44f2-8ea9-f88cdcf8d436	Art Classes	services-education-training-art	63b6450f-f37d-4671-851c-bcd52065c74d	2024-04-27 10:00:00+00	Art and craft instruction
c8563b83-833d-4abf-8099-016053384c24	Music Lessons	services-education-training-music	63b6450f-f37d-4671-851c-bcd52065c74d	2024-04-27 10:00:00+00	Musical instrument training
548fd856-c2d1-4457-8378-31d39ac84067	Yoga & Meditation	services-health-wellness-yoga	973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	2024-04-27 10:00:00+00	Yoga and mindfulness services
f49d9768-7bee-4d73-b206-e6fc1ae69789	Massage Therapy	services-health-wellness-massage	973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	2024-04-27 10:00:00+00	Therapeutic massage services
34bdc5df-e193-4682-9365-24783c048337	Personal Training	services-health-wellness-personal	973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	2024-04-27 10:00:00+00	Fitness training services
298d765b-e398-446c-82ca-bd0c5a58dfaf	Nutrition Consulting	services-health-wellness-nutrition	973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	2024-04-27 10:00:00+00	Diet and nutrition consulting
6f6b0dd2-ebc8-4bb0-8e0b-281f6aa1092c	Counseling	services-health-wellness-counseling	973664cf-fcab-4bf4-8f5c-7fcabf1e18d2	2024-04-27 10:00:00+00	Mental health services
02efb656-0275-4aca-9d59-db0dbfb2dddc	Wedding Photography	services-event-photography-wedding	05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	2024-04-27 10:00:00+00	Wedding photo services
abfc15c6-127a-459b-9bae-43df8180dfd6	Event Planning	services-event-photography-event	05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	2024-04-27 10:00:00+00	Event organization services
6fbd022a-6e80-4ecb-a31d-f76b10e484d2	Portrait Photography	services-event-photography-portrait	05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	2024-04-27 10:00:00+00	Professional portrait photography
7e2bc80d-180c-4a53-9521-c49a8482f7e2	Commercial Photography	services-event-photography-commercial	05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	2024-04-27 10:00:00+00	Business photography services
9575e015-9a32-4045-bc8c-69bb35a129cb	Videography	services-event-photography-videography	05ecf61c-69db-4d7f-90e5-b8f6bb9d415c	2024-04-27 10:00:00+00	Video production services
770d1705-543d-48a1-9529-885108d05b3f	Fashion - Men's	fashion-mens	df28a61f-dd5c-4285-9d37-1b1f79d04f11	2024-04-27 10:00:00+00	Men's clothing and accessories
52e25413-ed0c-4a13-a2c8-68e3e820db0c	Fashion - Women's	fashion-womens	df28a61f-dd5c-4285-9d37-1b1f79d04f11	2024-04-27 10:00:00+00	Women's clothing and accessories
81d0b464-7350-4d1b-9e58-d5821495a500	Fashion - Kids	fashion-kids	df28a61f-dd5c-4285-9d37-1b1f79d04f11	2024-04-27 10:00:00+00	Children's clothing
edba1ef2-271b-4649-8823-b445915211e0	Fashion - Shoes	fashion-shoes	df28a61f-dd5c-4285-9d37-1b1f79d04f11	2024-04-27 10:00:00+00	Footwear for all
54cc93fd-b88a-4d52-a0ff-737623c14980	Fashion - Accessories	fashion-accessories-unique	df28a61f-dd5c-4285-9d37-1b1f79d04f11	2024-04-27 10:00:00+00	Fashion accessories and more
62b92e01-e32f-489a-9be6-727998083e36	Shirts & Tops	fashion-mens-shirts	770d1705-543d-48a1-9529-885108d05b3f	2024-04-27 10:00:00+00	Men's shirts and t-shirts
19ac5843-499e-4e98-910a-198bde653d0a	Pants & Jeans	fashion-mens-pants	770d1705-543d-48a1-9529-885108d05b3f	2024-04-27 10:00:00+00	Men's trousers and jeans
e8ad22be-e7cb-4915-912e-5a412e51c9a1	Suits & Blazers	fashion-mens-suits	770d1705-543d-48a1-9529-885108d05b3f	2024-04-27 10:00:00+00	Men's formal wear
d9dcdfa5-3b7f-4b42-9171-2d7b9a123742	Outerwear	fashion-mens-outerwear	770d1705-543d-48a1-9529-885108d05b3f	2024-04-27 10:00:00+00	Men's jackets and coats
83b20414-94b7-4e81-8aa9-071f87322561	Activewear	fashion-mens-activewear	770d1705-543d-48a1-9529-885108d05b3f	2024-04-27 10:00:00+00	Men's sports and gym wear
d9509efe-e1eb-4800-a285-d474c8cfee5b	Dresses	fashion-womens-dresses	52e25413-ed0c-4a13-a2c8-68e3e820db0c	2024-04-27 10:00:00+00	Women's dresses
8d3b3bff-8b59-4b90-af4c-fd0a2a1560ba	Tops & Blouses	fashion-womens-tops	52e25413-ed0c-4a13-a2c8-68e3e820db0c	2024-04-27 10:00:00+00	Women's shirts and blouses
e5db44ff-5bd9-4fd1-99be-307d63b9f105	Skirts & Pants	fashion-womens-bottoms	52e25413-ed0c-4a13-a2c8-68e3e820db0c	2024-04-27 10:00:00+00	Women's bottoms
155b5e60-fb46-4367-a7e7-b194ce9857d0	Formal Wear	fashion-womens-formal	52e25413-ed0c-4a13-a2c8-68e3e820db0c	2024-04-27 10:00:00+00	Women's formal attire
e92debf6-d01c-417b-8693-bd58273aca2c	Swimwear	fashion-womens-swimwear	52e25413-ed0c-4a13-a2c8-68e3e820db0c	2024-04-27 10:00:00+00	Women's swimming attire
ac03c7e0-8f11-466e-8441-9f3fde9fa996	Boys' Clothing	fashion-kids-boys	81d0b464-7350-4d1b-9e58-d5821495a500	2024-04-27 10:00:00+00	Clothing for boys
d228df7f-7b5b-4b99-ad2c-98150f9fbeb8	Girls' Clothing	fashion-kids-girls	81d0b464-7350-4d1b-9e58-d5821495a500	2024-04-27 10:00:00+00	Clothing for girls
93b3b6e0-f9c2-4a22-a4b3-98a55ec71a5d	Baby Clothing	fashion-kids-baby	81d0b464-7350-4d1b-9e58-d5821495a500	2024-04-27 10:00:00+00	Clothing for infants
191071cc-122b-4312-9ed5-0362ff590116	School Uniforms	fashion-kids-uniforms	81d0b464-7350-4d1b-9e58-d5821495a500	2024-04-27 10:00:00+00	School dress code attire
d39613be-677c-427b-817d-8e0fcb89bd33	Kids' Accessories	fashion-kids-accessories	81d0b464-7350-4d1b-9e58-d5821495a500	2024-04-27 10:00:00+00	Accessories for children
1e619473-4bb9-4db5-9df7-3616f80b36e0	Athletic Shoes	fashion-shoes-athletic	edba1ef2-271b-4649-8823-b445915211e0	2024-04-27 10:00:00+00	Sports and running shoes
2b9f3d65-8968-4572-8793-c7348a516184	Casual Shoes	fashion-shoes-casual	edba1ef2-271b-4649-8823-b445915211e0	2024-04-27 10:00:00+00	Everyday footwear
8055a395-e8ca-4d13-a64b-15c0bab45fa2	Formal Shoes	fashion-shoes-formal	edba1ef2-271b-4649-8823-b445915211e0	2024-04-27 10:00:00+00	Dress and business shoes
e465f2b3-b16a-4583-b800-fec10fcfdf69	Boots	fashion-shoes-boots	edba1ef2-271b-4649-8823-b445915211e0	2024-04-27 10:00:00+00	All types of boots
6301236d-97d3-48f6-9166-7a62981937be	Sandals	fashion-shoes-sandals	edba1ef2-271b-4649-8823-b445915211e0	2024-04-27 10:00:00+00	Sandals and flip-flops
5af080a0-2370-4dba-a5a3-c45d72e26e1a	Jewelry	fashion-accessories-jewelry	54cc93fd-b88a-4d52-a0ff-737623c14980	2024-04-27 10:00:00+00	Necklaces and rings
8f95582b-5772-49a4-8161-974630c00954	Watches	fashion-accessories-watches	54cc93fd-b88a-4d52-a0ff-737623c14980	2024-04-27 10:00:00+00	Wristwatches and smartwatches
1e03fd68-0e03-4adb-9362-5867a6c900f6	Bags & Wallets	fashion-accessories-bags	54cc93fd-b88a-4d52-a0ff-737623c14980	2024-04-27 10:00:00+00	Handbags and wallets
fedbafc5-753a-4b76-a3a8-4c8cf33ed406	Belts	fashion-accessories-belts	54cc93fd-b88a-4d52-a0ff-737623c14980	2024-04-27 10:00:00+00	Fashion belts
b2e4fb37-c887-412d-a1ee-fa98843ab7fb	Sunglasses	fashion-accessories-sunglasses	54cc93fd-b88a-4d52-a0ff-737623c14980	2024-04-27 10:00:00+00	Fashion eyewear
cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	Home-Garden Furniture	home-garden-furniture	594d56a0-c764-4a5b-86ab-704f9e51dbbf	2024-04-27 10:00:00+00	Home and office furniture
828defcf-b776-4481-9739-b12cc28a10f9	Home-Garden GardenOutdoor	home-garden-garden-outdoor	594d56a0-c764-4a5b-86ab-704f9e51dbbf	2024-04-27 10:00:00+00	Gardening and outdoor items
597b221d-6fa6-4b49-8a63-2e15318bac23	Home-Garden Decor	home-garden-decor	594d56a0-c764-4a5b-86ab-704f9e51dbbf	2024-04-27 10:00:00+00	Decorative items
e7ec03a0-6005-4652-ad46-9b3395865ed1	Home-Garden Tools	home-garden-tools	594d56a0-c764-4a5b-86ab-704f9e51dbbf	2024-04-27 10:00:00+00	DIY and hardware tools
c3663e0d-51f0-43c2-819b-70dee3573e08	Home-Garden Appliances	home-garden-appliances	594d56a0-c764-4a5b-86ab-704f9e51dbbf	2024-04-27 10:00:00+00	Household appliances
963ebe51-3191-4929-9b75-eb21a3ca47c8	Living Room Furniture	home-garden-furniture-living	cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	2024-04-27 10:00:00+00	Furniture for living rooms
fca6d7b6-a0c2-4c28-ad9e-71b7fea93ff4	Bedroom Furniture	home-garden-furniture-bedroom	cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	2024-04-27 10:00:00+00	Furniture for bedrooms
2c730916-b228-415e-b154-dc1572a1e080	Dining Room Furniture	home-garden-furniture-dining	cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	2024-04-27 10:00:00+00	Furniture for dining rooms
cbd1a295-fb2b-4387-ba6a-b140bab9ec0e	Office Furniture	home-garden-furniture-office	cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	2024-04-27 10:00:00+00	Furniture for offices
1956eef6-7f8a-4605-8d4b-3cf31dc9388a	Storage Furniture	home-garden-furniture-storage	cdd99ef9-9bc7-42e9-a2e6-83a9cd4e09b8	2024-04-27 10:00:00+00	Storage solutions for furniture
e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	Plants & Seeds	home-garden-garden-outdoor-plants	828defcf-b776-4481-9739-b12cc28a10f9	2024-04-27 10:00:00+00	Garden plants and seeds
9a083015-34fa-4fcf-9334-64663ab04e7e	Outdoor Furniture	home-garden-garden-outdoor-furniture	828defcf-b776-4481-9739-b12cc28a10f9	2024-04-27 10:00:00+00	Patio and garden furniture
77819dbb-2727-4c37-ad31-932de43ab296	Gardening Tools	home-garden-garden-outdoor-tools	828defcf-b776-4481-9739-b12cc28a10f9	2024-04-27 10:00:00+00	Tools for gardening
985fec0f-4704-41a1-a9cd-088b0fa70204	Landscaping Materials	home-garden-garden-outdoor-landscaping	828defcf-b776-4481-9739-b12cc28a10f9	2024-04-27 10:00:00+00	Materials for landscaping
4d905f0c-169f-49e6-ad56-98224cf0bfde	Outdoor Lighting	home-garden-garden-outdoor-lighting	828defcf-b776-4481-9739-b12cc28a10f9	2024-04-27 10:00:00+00	Garden and patio lighting
da78c67f-e03e-4c66-97ef-dab6575831c9	Wall Art	home-garden-decor-wall-art	597b221d-6fa6-4b49-8a63-2e15318bac23	2024-04-27 10:00:00+00	Pictures and wall decorations
94255d9e-3197-448f-8e26-af3c2ee77611	Lighting Fixtures	home-garden-decor-lighting	597b221d-6fa6-4b49-8a63-2e15318bac23	2024-04-27 10:00:00+00	Decorative lighting
69182bab-4734-4c7b-932e-6aef6230df8e	Rugs & Carpets	home-garden-decor-rugs	597b221d-6fa6-4b49-8a63-2e15318bac23	2024-04-27 10:00:00+00	Floor coverings
50efc8ae-2b24-4f81-9b6f-ab2121c25ff1	Curtains & Blinds	home-garden-decor-curtains	597b221d-6fa6-4b49-8a63-2e15318bac23	2024-04-27 10:00:00+00	Window treatments
a19b8021-7226-40bb-a6d2-ea07f320a97f	Decorative Accents	home-garden-decor-accents	597b221d-6fa6-4b49-8a63-2e15318bac23	2024-04-27 10:00:00+00	Small decorative items
e8dcfbee-7e5a-49e8-8ae0-3f874a80a798	Power Tools	home-garden-tools-power	e7ec03a0-6005-4652-ad46-9b3395865ed1	2024-04-27 10:00:00+00	Electric and battery tools
10796edc-b5ae-4dad-9a79-163a37c1bfc3	Hand Tools	home-garden-tools-hand	e7ec03a0-6005-4652-ad46-9b3395865ed1	2024-04-27 10:00:00+00	Manual tools
734e6e98-ce68-4f45-8981-9cac70a20931	Tool Storage	home-garden-tools-storage	e7ec03a0-6005-4652-ad46-9b3395865ed1	2024-04-27 10:00:00+00	Tool boxes and storage
839cba00-c9f8-4b82-9a21-c149b3059086	Safety Equipment	home-garden-tools-safety	e7ec03a0-6005-4652-ad46-9b3395865ed1	2024-04-27 10:00:00+00	Work safety gear
95e3883c-01f3-4f99-b0a7-530f6a78e0e3	Measuring Tools	home-garden-tools-measuring	e7ec03a0-6005-4652-ad46-9b3395865ed1	2024-04-27 10:00:00+00	Measuring and marking tools
c7914ea3-8197-458e-86bf-180573e0d9b7	Kitchen Appliances	home-garden-appliances-kitchen	c3663e0d-51f0-43c2-819b-70dee3573e08	2024-04-27 10:00:00+00	Cooking and food prep appliances
6d769a3c-38df-4555-8487-ab25dd586f4b	Laundry Appliances	home-garden-appliances-laundry	c3663e0d-51f0-43c2-819b-70dee3573e08	2024-04-27 10:00:00+00	Washers and dryers
ff6cec3a-375e-4573-851d-98a979145e51	Refrigeration	home-garden-appliances-refrigeration	c3663e0d-51f0-43c2-819b-70dee3573e08	2024-04-27 10:00:00+00	Fridges and freezers
753e253c-b3c7-463e-aaa7-d72cc61422bb	Climate Control	home-garden-appliances-climate	c3663e0d-51f0-43c2-819b-70dee3573e08	2024-04-27 10:00:00+00	AC and heating units
130aa7ca-7d6e-4e18-b677-302b6df88b54	Small Appliances	home-garden-appliances-small	c3663e0d-51f0-43c2-819b-70dee3573e08	2024-04-27 10:00:00+00	Counter-top appliances
21579aea-9a15-49e8-9225-528cb90c769a	Pets - Dogs	pets-dogs	538ca497-e6f4-4367-83cc-2e3eaba43ee4	2024-04-27 10:00:00+00	Dog supplies and accessories
65bd905c-0867-433b-bb6b-f10d92f27844	Pets - Cats	pets-cats	538ca497-e6f4-4367-83cc-2e3eaba43ee4	2024-04-27 10:00:00+00	Cat supplies and accessories
fa97459e-5664-4eed-a9e6-9fcefefc6fb3	Pets - Fish & Aquariums	pets-fish-aquariums	538ca497-e6f4-4367-83cc-2e3eaba43ee4	2024-04-27 10:00:00+00	Aquarium supplies and accessories
0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	Pets - Birds	pets-birds	538ca497-e6f4-4367-83cc-2e3eaba43ee4	2024-04-27 10:00:00+00	Bird supplies and accessories
c9a291e9-c1d7-409c-af75-92c7dac5aaa4	Pets - Small & Others	pets-small-others	538ca497-e6f4-4367-83cc-2e3eaba43ee4	2024-04-27 10:00:00+00	Supplies for small animals
c08fd4d2-e9c5-4804-b91d-1cff440883eb	Dog Food	pets-dogs-food	21579aea-9a15-49e8-9225-528cb90c769a	2024-04-27 10:00:00+00	Dog food and treats
d49b5af8-6ae3-432b-b49c-1293483a88f5	Beds & Furniture	pets-dogs-beds	21579aea-9a15-49e8-9225-528cb90c769a	2024-04-27 10:00:00+00	Dog beds and furniture
a0b2a2d4-976d-4e3e-916c-ef13280abdcf	Toys & Accessories	pets-dogs-toys	21579aea-9a15-49e8-9225-528cb90c769a	2024-04-27 10:00:00+00	Dog toys and gear
673c6f6d-7524-49ba-99af-e98481220954	Health Care	pets-dogs-health	21579aea-9a15-49e8-9225-528cb90c769a	2024-04-27 10:00:00+00	Dog health products
50051349-e32c-453d-b275-087e0c564417	Training & Behavior	pets-dogs-training	21579aea-9a15-49e8-9225-528cb90c769a	2024-04-27 10:00:00+00	Dog training supplies
eefd873a-4f2b-43ec-9c02-f2511d6454d0	Cat Food	pets-cats-food	65bd905c-0867-433b-bb6b-f10d92f27844	2024-04-27 10:00:00+00	Cat food and treats
2b1613a7-8686-40a6-b95c-3079944694a5	Litter & Supplies	pets-cats-litter	65bd905c-0867-433b-bb6b-f10d92f27844	2024-04-27 10:00:00+00	Cat litter products
b9d839ed-3618-40c2-bda5-11fbfa3a5301	Cat Furniture	pets-cats-furniture	65bd905c-0867-433b-bb6b-f10d92f27844	2024-04-27 10:00:00+00	Cat trees and scratching posts
ceecb087-d63f-4942-a7e9-e1bb8587cb4d	Cat Toys	pets-cats-toys	65bd905c-0867-433b-bb6b-f10d92f27844	2024-04-27 10:00:00+00	Cat entertainment items
06bf3b74-8ad5-440e-b233-86f1731c45dc	Cat Health Care	pets-cats-health	65bd905c-0867-433b-bb6b-f10d92f27844	2024-04-27 10:00:00+00	Cat health products
05f8c74b-7b49-4c4e-856c-9bc63034f098	Aquariums	pets-fish-aquariums-aquariums	fa97459e-5664-4eed-a9e6-9fcefefc6fb3	2024-04-27 10:00:00+00	Fish tanks and accessories
f583585d-808f-45e1-91f3-c9aaea9e48b5	Fish Food	pets-fish-aquariums-food	fa97459e-5664-4eed-a9e6-9fcefefc6fb3	2024-04-27 10:00:00+00	Fish food and treats
e46c65ad-0ef5-40c6-8d4c-0a843734cb81	Water Care	pets-fish-aquariums-water	fa97459e-5664-4eed-a9e6-9fcefefc6fb3	2024-04-27 10:00:00+00	Aquarium maintenance supplies
039dd3f5-62b6-456b-a4b4-95972c630668	Aquarium Decorations	pets-fish-aquariums-decor	fa97459e-5664-4eed-a9e6-9fcefefc6fb3	2024-04-27 10:00:00+00	Aquarium decorative items
4a31a222-dc1d-4857-aba0-4fb78adde49d	Equipment & Filters	pets-fish-aquariums-equipment	fa97459e-5664-4eed-a9e6-9fcefefc6fb3	2024-04-27 10:00:00+00	Pumps and filters
f321a35e-fa61-4c23-a2fd-fabb06862647	Bird Food	pets-birds-food	0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	2024-04-27 10:00:00+00	Bird feed and treats
8889420e-db01-49ea-8c73-29c569f3fcc2	Cages & Stands	pets-birds-cages	0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	2024-04-27 10:00:00+00	Bird housing equipment
9474c0e7-f557-4149-bcd4-fbb8fc2dcf0b	Bird Toys	pets-birds-toys	0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	2024-04-27 10:00:00+00	Bird entertainment items
df0a32bd-5c84-4757-908a-37d8eb266df0	Health Supplies	pets-birds-health	0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	2024-04-27 10:00:00+00	Bird health products
90963af6-2e18-4b1a-a1c1-dfe22f336e25	Grooming Supplies	pets-birds-grooming	0f9475fd-e85d-4bbb-96d3-c7ac7ba5a75f	2024-04-27 10:00:00+00	Bird grooming products
c0e74d13-47ab-4de7-bda3-85874de91fbd	Hamster Supplies	pets-small-others-hamsters	c9a291e9-c1d7-409c-af75-92c7dac5aaa4	2024-04-27 10:00:00+00	Hamster care products
852bc84e-727f-4b23-8117-f79b8f0fad01	Guinea Pig Supplies	pets-small-others-guinea	c9a291e9-c1d7-409c-af75-92c7dac5aaa4	2024-04-27 10:00:00+00	Guinea pig care items
4daf0ac6-8dcd-444d-826d-43f5fd552c68	Rabbit Supplies	pets-small-others-rabbit	c9a291e9-c1d7-409c-af75-92c7dac5aaa4	2024-04-27 10:00:00+00	Rabbit care products
4acbd8ae-d558-4cf1-9893-b3032db9c935	Reptile Supplies	pets-small-others-reptile	c9a291e9-c1d7-409c-af75-92c7dac5aaa4	2024-04-27 10:00:00+00	Reptile care items
cc9935bd-41e1-4ab1-bafe-a8ddd9ceae35	Ferret Supplies	pets-small-others-ferret	c9a291e9-c1d7-409c-af75-92c7dac5aaa4	2024-04-27 10:00:00+00	Ferret care products
c64be675-1794-484e-9938-8448c14cd903	Sports-Outdoors - Exercise	sports-outdoors-exercise	8cf837c8-c671-492f-9d5d-ecd31c2742cb	2024-04-27 10:00:00+00	Exercise and fitness equipment
255e8d24-13a0-4d86-99b1-a0065afc681c	Sports-Outdoors - Team	sports-outdoors-team	8cf837c8-c671-492f-9d5d-ecd31c2742cb	2024-04-27 10:00:00+00	Equipment for team sports
06342c60-4396-4ef2-821c-0bbf88f22623	Sports-Outdoors - Outdoor	sports-outdoors-outdoor	8cf837c8-c671-492f-9d5d-ecd31c2742cb	2024-04-27 10:00:00+00	Camping and hiking gear
eec75fad-8537-4163-aef7-4eb2cd8e2c8e	Sports-Outdoors - Water	sports-outdoors-water	8cf837c8-c671-492f-9d5d-ecd31c2742cb	2024-04-27 10:00:00+00	Swimming and water sports equipment
0d600000-62cb-444a-a221-7918a2c9fbbe	Sports-Outdoors - Cycling	sports-outdoors-cycling	8cf837c8-c671-492f-9d5d-ecd31c2742cb	2024-04-27 10:00:00+00	Bikes and cycling accessories
ff5a42b4-fd32-4bdd-b3b0-92beca788ab1	Cardio Machines	sports-outdoors-exercise-cardio	c64be675-1794-484e-9938-8448c14cd903	2024-04-27 10:00:00+00	Treadmills and cardio equipment
f3e6a421-0209-4aa1-a122-05cac32e0957	Weight Training	sports-outdoors-exercise-weight	c64be675-1794-484e-9938-8448c14cd903	2024-04-27 10:00:00+00	Weight lifting equipment
8aa044aa-5606-4268-8bf8-c001086f7879	Yoga & Pilates	sports-outdoors-exercise-yoga	c64be675-1794-484e-9938-8448c14cd903	2024-04-27 10:00:00+00	Yoga and pilates gear
345db22e-c530-45c6-b7e6-ee60ca4fed18	Home Gyms	sports-outdoors-exercise-homegyms	c64be675-1794-484e-9938-8448c14cd903	2024-04-27 10:00:00+00	Multi-station gym equipment
3859f331-6389-4862-bf37-3a80b2010e08	Exercise Accessories	sports-outdoors-exercise-accessories	c64be675-1794-484e-9938-8448c14cd903	2024-04-27 10:00:00+00	Fitness accessories
1f155973-a716-4c49-bd23-682933a12ab8	Soccer	sports-outdoors-team-soccer	255e8d24-13a0-4d86-99b1-a0065afc681c	2024-04-27 10:00:00+00	Soccer equipment and gear
dfc606a6-4d8b-4124-926c-3843a335f3df	Basketball	sports-outdoors-team-basketball	255e8d24-13a0-4d86-99b1-a0065afc681c	2024-04-27 10:00:00+00	Basketball equipment
35de68ea-7db1-4fb3-bac4-991fccef83e8	Baseball/Softball	sports-outdoors-team-baseball	255e8d24-13a0-4d86-99b1-a0065afc681c	2024-04-27 10:00:00+00	Baseball and softball gear
4ca3a537-8d29-4db7-a857-7105c2580d09	Hockey	sports-outdoors-team-hockey	255e8d24-13a0-4d86-99b1-a0065afc681c	2024-04-27 10:00:00+00	Ice and field hockey equipment
f652bf6f-16d4-4149-a316-d069e9f9f21e	Volleyball	sports-outdoors-team-volleyball	255e8d24-13a0-4d86-99b1-a0065afc681c	2024-04-27 10:00:00+00	Volleyball equipment
1f5b091b-a72e-4ad1-bf40-c0fbd5463eb9	Camping Gear	sports-outdoors-outdoor-camping	06342c60-4396-4ef2-821c-0bbf88f22623	2024-04-27 10:00:00+00	Tents and camping equipment
cc0fb716-c00e-463d-847b-bd96451f493a	Hiking Equipment	sports-outdoors-outdoor-hiking	06342c60-4396-4ef2-821c-0bbf88f22623	2024-04-27 10:00:00+00	Hiking and trekking gear
d395688d-5a5a-4483-b310-eb37f3cdf50f	Climbing Gear	sports-outdoors-outdoor-climbing	06342c60-4396-4ef2-821c-0bbf88f22623	2024-04-27 10:00:00+00	Rock climbing equipment
7cf7f208-6b3d-473d-8729-586822f9a237	Outdoor Clothing	sports-outdoors-outdoor-clothing	06342c60-4396-4ef2-821c-0bbf88f22623	2024-04-27 10:00:00+00	Weather-appropriate outdoor apparel
7c8b1c35-b570-4184-be28-28b351393c81	Navigation Tools	sports-outdoors-outdoor-navigation	06342c60-4396-4ef2-821c-0bbf88f22623	2024-04-27 10:00:00+00	Maps and navigation devices
4583b753-f35b-44ef-9478-92e9aa73a7c3	Swimming Equipment	sports-outdoors-water-swimming	eec75fad-8537-4163-aef7-4eb2cd8e2c8e	2024-04-27 10:00:00+00	Swimming gear and accessories
4ea58997-38f6-4bbc-abb8-29a0ea26304e	Surfing Boards	sports-outdoors-water-surfing	eec75fad-8537-4163-aef7-4eb2cd8e2c8e	2024-04-27 10:00:00+00	Surfboards and accessories
aff454e8-4f39-4019-a1cb-a3ae03821e6e	Diving Gear	sports-outdoors-water-diving	eec75fad-8537-4163-aef7-4eb2cd8e2c8e	2024-04-27 10:00:00+00	Scuba and snorkeling gear
4fc81320-099e-4857-9bc1-d2e51b6db132	Kayaking Equipment	sports-outdoors-water-kayaking	eec75fad-8537-4163-aef7-4eb2cd8e2c8e	2024-04-27 10:00:00+00	Kayaks and paddles
2282743f-53ed-4efc-ade2-3c6c46dfc0bd	Water Sports Accessories	sports-outdoors-water-accessories	eec75fad-8537-4163-aef7-4eb2cd8e2c8e	2024-04-27 10:00:00+00	General water sports equipment
8ee35ab5-79e3-4e9c-8d65-901d530e10f3	Road Bikes	sports-outdoors-cycling-road	0d600000-62cb-444a-a221-7918a2c9fbbe	2024-04-27 10:00:00+00	Racing and road bicycles
004cb306-6682-4010-b88e-c410eb1c311d	Mountain Bikes	sports-outdoors-cycling-mountain	0d600000-62cb-444a-a221-7918a2c9fbbe	2024-04-27 10:00:00+00	Off-road bicycles
a6580058-7c37-4430-8bcb-7220b4942345	Electric Bikes	sports-outdoors-cycling-electric	0d600000-62cb-444a-a221-7918a2c9fbbe	2024-04-27 10:00:00+00	Power-assisted bicycles
d1c20f26-f5ee-497e-8ab2-4f385b948e4d	BMX Bikes	sports-outdoors-cycling-bmx	0d600000-62cb-444a-a221-7918a2c9fbbe	2024-04-27 10:00:00+00	Stunt and racing BMX
1f9d7500-9c41-4a5d-81c9-ba9aceeddc5a	Bike Accessories	sports-outdoors-cycling-accessories	0d600000-62cb-444a-a221-7918a2c9fbbe	2024-04-27 10:00:00+00	Cycling gear and accessories
5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	Books	books-hobbies-books	6b6c18aa-f209-48d7-b515-37cbc86a6b4c	2024-04-27 10:00:00+00	New and used books
1f844746-c989-4ef9-897b-6a1243cbe5c0	Musical Instruments	books-hobbies-musical	6b6c18aa-f209-48d7-b515-37cbc86a6b4c	2024-04-27 10:00:00+00	Instruments and equipment
ddd36ce7-d384-483d-b15a-b86bc764b24e	Art & Crafts	books-hobbies-art-crafts	6b6c18aa-f209-48d7-b515-37cbc86a6b4c	2024-04-27 10:00:00+00	Art and craft supplies
eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	Collectibles	books-hobbies-collectibles	6b6c18aa-f209-48d7-b515-37cbc86a6b4c	2024-04-27 10:00:00+00	Collectible items
27c006de-68ac-4be5-b909-90004e2765b8	Games & Puzzles	books-hobbies-games-puzzles	6b6c18aa-f209-48d7-b515-37cbc86a6b4c	2024-04-27 10:00:00+00	Board games and puzzles
c205edcf-3f80-4983-9a32-dc78c4b4810a	Fiction Books	books-hobbies-books-fiction	5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	2024-04-27 10:00:00+00	Novels and fiction literature
1a797e9b-5561-44d5-aee5-3de53862285b	Non-Fiction Books	books-hobbies-books-nonfiction	5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	2024-04-27 10:00:00+00	Educational and reference books
737dcfc6-39ed-4902-8e0e-8df5b0d28800	Textbooks	books-hobbies-books-textbooks	5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	2024-04-27 10:00:00+00	Academic and school books
fd86e479-783a-4de6-84b4-9934c10aec41	Comic Books	books-hobbies-books-comics	5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	2024-04-27 10:00:00+00	Comics and graphic novels
8cb34a0c-e61b-4671-889d-e7fcf6f4e0ab	Children's Books	books-hobbies-books-children	5a0bc5e9-0e30-4bff-9efa-875b50f1b6fe	2024-04-27 10:00:00+00	Books for kids
f846f4c6-2a1a-45cb-953a-559ab7ad9036	Guitars	books-hobbies-musical-guitars	1f844746-c989-4ef9-897b-6a1243cbe5c0	2024-04-27 10:00:00+00	Electric and acoustic guitars
251e9214-4185-452b-b6a4-eff9f90614e5	Pianos & Keyboards	books-hobbies-musical-pianos	1f844746-c989-4ef9-897b-6a1243cbe5c0	2024-04-27 10:00:00+00	Digital and acoustic pianos
2657649f-20b7-4e68-8b97-5b9afdb486fd	Drums & Percussion	books-hobbies-musical-drums	1f844746-c989-4ef9-897b-6a1243cbe5c0	2024-04-27 10:00:00+00	Drum sets and percussion instruments
36b53276-bec4-40b8-ac7c-fb894dc00aea	Wind Instruments	books-hobbies-musical-wind	1f844746-c989-4ef9-897b-6a1243cbe5c0	2024-04-27 10:00:00+00	Brass and woodwind instruments
61b45f75-2872-48d0-95a5-dda3a7a26872	Recording Equipment	books-hobbies-musical-recording	1f844746-c989-4ef9-897b-6a1243cbe5c0	2024-04-27 10:00:00+00	Music recording gear
fff8bf2d-de51-47c7-abe8-9d456a4ff050	Drawing Supplies	books-hobbies-art-crafts-drawing	ddd36ce7-d384-483d-b15a-b86bc764b24e	2024-04-27 10:00:00+00	Pencils and drawing tools
d17ad035-da02-4120-8687-e0be92efc156	Painting Supplies	books-hobbies-art-crafts-painting	ddd36ce7-d384-483d-b15a-b86bc764b24e	2024-04-27 10:00:00+00	Paint brushes and canvas
3a49769b-07cc-48a5-bcc2-6cc0736f97aa	Crafting Tools	books-hobbies-art-crafts-crafting	ddd36ce7-d384-483d-b15a-b86bc764b24e	2024-04-27 10:00:00+00	Scissors and cutters
11c244a1-06ed-464a-a2ca-714831c1ad24	Paper & Canvases	books-hobbies-art-crafts-paper	ddd36ce7-d384-483d-b15a-b86bc764b24e	2024-04-27 10:00:00+00	Art papers and canvases
538adb34-f90c-4f3e-96a9-79070a98eed7	Art Storage	books-hobbies-art-crafts-storage	ddd36ce7-d384-483d-b15a-b86bc764b24e	2024-04-27 10:00:00+00	Storage for art supplies
033ba66f-875d-472a-a109-f8295766fe3b	Trading Cards	books-hobbies-collectibles-trading	eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	2024-04-27 10:00:00+00	Collectible card games
7eec4e4b-3f8d-4e37-b120-55406010c787	Stamps	books-hobbies-collectibles-stamps	eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	2024-04-27 10:00:00+00	Stamp collecting items
4b971a84-23e9-4547-be8f-32f375108a1a	Coins	books-hobbies-collectibles-coins	eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	2024-04-27 10:00:00+00	Numismatic items
d3e3d5e2-cdce-4520-8183-ec5135eccef3	Action Figures	books-hobbies-collectibles-action	eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	2024-04-27 10:00:00+00	Collectible figures and toys
1fd19de5-5831-47fd-ad09-2a546f221031	Memorabilia	books-hobbies-collectibles-memorabilia	eb957f27-b97e-4b2b-9e24-ba4a1bf610ba	2024-04-27 10:00:00+00	Sports and entertainment memorabilia
15f0bfdd-df01-4e7b-81ef-03ffa272b2c0	Strategy Games	books-hobbies-games-puzzles-strategy	27c006de-68ac-4be5-b909-90004e2765b8	2024-04-27 10:00:00+00	Strategy and war games
f479d7ef-5907-4463-9ecc-c75c32b3cbf9	Family Games	books-hobbies-games-puzzles-family	27c006de-68ac-4be5-b909-90004e2765b8	2024-04-27 10:00:00+00	Games for all ages
189028f1-8f87-47d0-bd9a-592a1c612ecc	Card Games	books-hobbies-games-puzzles-card	27c006de-68ac-4be5-b909-90004e2765b8	2024-04-27 10:00:00+00	Traditional and modern card games
bf610633-fe7d-4557-839a-44f523915d3d	Puzzles	books-hobbies-games-puzzles-puzzles	27c006de-68ac-4be5-b909-90004e2765b8	2024-04-27 10:00:00+00	Jigsaw and 3D puzzles
64dfaf12-2274-4964-9ead-c5841ce52063	Role-Playing Games	books-hobbies-games-puzzles-rpg	27c006de-68ac-4be5-b909-90004e2765b8	2024-04-27 10:00:00+00	RPG games and accessories
\.


--
-- TOC entry 3898 (class 0 OID 29127)
-- Dependencies: 289
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, title, description, price, category_id, seller_id, condition, images, created_at, updated_at, location_id, address) FROM stdin;
90fc4c64-a3d6-4d97-9341-07de24439bb1	Professional Logo Design	I will create a modern and unique logo for your business. Package includes unlimited revisions source files and quick delivery.	299.99	03bf696c-0e2a-454d-b908-97a4bceadc92	ec75acc2-575b-45df-8de7-162abc33216d	New	{https://picsum.photos/800/600?random=1,https://picsum.photos/800/600?random=2}	2024-02-24 10:00:00+00	2024-02-24 10:00:00+00	\N	\N
90fc4c64-a3d6-4d97-9341-07de24439bb2	Complete Brand Identity Package	Full brand identity package including logo business cards letterhead and brand guidelines. Perfect for new businesses.	599.99	03bf696c-0e2a-454d-b908-97a4bceadc92	ec75acc2-575b-45df-8de7-162abc33216d	New	{https://picsum.photos/800/600?random=3,https://picsum.photos/800/600?random=4}	2024-02-24 10:00:00+00	2024-02-24 10:00:00+00	\N	\N
90fc4c64-a3d6-4d97-9341-07de24439bb3	Modern Website Design	Custom website design with modern and responsive layout. Includes all source files and implementation guide.	899.99	03bf696c-0e2a-454d-b908-97a4bceadc92	ec75acc2-575b-45df-8de7-162abc33216d	New	{https://picsum.photos/800/600?random=5,https://picsum.photos/800/600?random=6}	2024-02-24 10:00:00+00	2024-02-24 10:00:00+00	\N	\N
90fc4c64-a3d6-4d97-9341-07de24439bb4	Mobile App UI Design	Professional mobile app UI design with modern aesthetics and great user experience.	799.99	03bf696c-0e2a-454d-b908-97a4bceadc92	ec75acc2-575b-45df-8de7-162abc33216d	New	{https://picsum.photos/800/600?random=7,https://picsum.photos/800/600?random=8}	2024-02-24 10:00:00+00	2024-02-24 10:00:00+00	\N	\N
aa780df9-374b-4685-845a-0cf24e07c665	asdfasdf	asdfasdfasdf	2.00	d3e3d5e2-cdce-4520-8183-ec5135eccef3	1adbfc3b-6597-46ae-b020-35cd417418f3	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.008593032149959434.png}	2025-03-01 15:35:52.987274+00	2025-03-01 15:35:52.987274+00	743e4567-e89b-12d3-a456-426614174026	asdfasd
40b39a82-4ee8-4f90-8f73-6b46e535f00d	asdfasdfas	asdfasdfasdf	22.00	2af6afbc-853b-4487-996d-d7629ef381d6	1adbfc3b-6597-46ae-b020-35cd417418f3	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.48093992148110276.png}	2025-03-01 15:39:14.627929+00	2025-03-01 15:39:14.627929+00	643e4567-e89b-12d3-a456-426614174025	asdfasdf
b2451c1e-90e4-40d0-b2b1-99c0304550b0	professional manager 	Just get your professional manager with me	2000.00	2af6afbc-853b-4487-996d-d7629ef381d6	1adbfc3b-6597-46ae-b020-35cd417418f3	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.08753487022134832.jpg}	2025-03-01 17:35:22.231997+00	2025-03-01 17:35:22.231997+00	233e4567-e89b-12d3-a456-426614174011	presidentielle
24a112b4-bd98-4756-8b3a-6833094ed53f	assistant manager	someone to do what you need to be done 	3000.00	2af6afbc-853b-4487-996d-d7629ef381d6	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	presidentielle 
3956b7e6-d5bd-452f-8722-fae36a82b14d	lets do this 	asdfasdfasdf	1234.00	fb636425-e75b-4d0e-8b6b-7948542582af	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 20:22:35.987892+00	2025-03-01 20:22:35.987892+00	743e4567-e89b-12d3-a456-426614174026	asdfsdf
00000000-0000-4000-a000-000000000001	Mountain Bike #1	High-quality mountain bike suitable for off-road adventures. Listing number 1.	47.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St
00000000-0000-4000-a000-000000000002	Academic Tutoring Service #2	Expert tutoring in various academic subjects. Listing number 2.	84.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St
00000000-0000-4000-a000-000000000003	Insurance Service #3	Reliable insurance services to protect you. Listing number 3.	121.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave
00000000-0000-4000-a000-000000000004	Moving Service #4	Efficient and professional moving service. Listing number 4.	158.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd
00000000-0000-4000-a000-000000000005	Wedding Photography #5	Beautiful wedding photography to capture your special day. Listing number 5.	195.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr
00000000-0000-4000-a000-000000000007	Trading Card #7	Rare and collectible trading card. Listing number 7.	269.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd
00000000-0000-4000-a000-000000000008	Aquarium Decoration #8	Unique decoration for your aquarium. Listing number 8.	306.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way
00000000-0000-4000-a000-000000000009	Construction Vehicle #9	Heavy-duty construction vehicle for work. Listing number 9.	343.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir
00000000-0000-4000-a000-000000000010	Medical Technician #10	Skilled medical technician service. Listing number 10.	380.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct
00000000-0000-4000-a000-000000000011	Mountain Bike #11	High-quality mountain bike suitable for off-road adventures. Listing number 11.	417.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St
00000000-0000-4000-a000-000000000012	Academic Tutoring Service #12	Expert tutoring in various academic subjects. Listing number 12.	454.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St
00000000-0000-4000-a000-000000000013	Insurance Service #13	Reliable insurance services to protect you. Listing number 13.	491.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave
00000000-0000-4000-a000-000000000014	Moving Service #14	Efficient and professional moving service. Listing number 14.	528.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd
00000000-0000-4000-a000-000000000015	Wedding Photography #15	Beautiful wedding photography to capture your special day. Listing number 15.	565.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr
00000000-0000-4000-a000-000000000016	Accounting Service #16	Professional accounting services for your business. Listing number 16.	602.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln
00000000-0000-4000-a000-000000000017	Trading Card #17	Rare and collectible trading card. Listing number 17.	639.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd
00000000-0000-4000-a000-000000000018	Aquarium Decoration #18	Unique decoration for your aquarium. Listing number 18.	676.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way
00000000-0000-4000-a000-000000000019	Construction Vehicle #19	Heavy-duty construction vehicle for work. Listing number 19.	713.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir
00000000-0000-4000-a000-000000000020	Medical Technician #20	Skilled medical technician service. Listing number 20.	750.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9733439367141918.png}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct
00000000-0000-4000-a000-000000000021	Mountain Bike #21	High-quality mountain bike suitable for off-road adventures. Listing number 21.	787.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St
00000000-0000-4000-a000-000000000022	Academic Tutoring Service #22	Expert tutoring in various academic subjects. Listing number 22.	824.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St
00000000-0000-4000-a000-000000000023	Insurance Service #23	Reliable insurance services to protect you. Listing number 23.	861.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave
00000000-0000-4000-a000-000000000024	Moving Service #24	Efficient and professional moving service. Listing number 24.	898.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd
00000000-0000-4000-a000-000000000025	Wedding Photography #25	Beautiful wedding photography to capture your special day. Listing number 25.	935.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr
00000000-0000-4000-a000-000000000026	Accounting Service #26	Professional accounting services for your business. Listing number 26.	972.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln
00000000-0000-4000-a000-000000000027	Trading Card #27	Rare and collectible trading card. Listing number 27.	1009.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd
00000000-0000-4000-a000-000000000028	Aquarium Decoration #28	Unique decoration for your aquarium. Listing number 28.	1046.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way
00000000-0000-4000-a000-000000000029	Construction Vehicle #29	Heavy-duty construction vehicle for work. Listing number 29.	1083.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir
00000000-0000-4000-a000-000000000030	Medical Technician #30	Skilled medical technician service. Listing number 30.	1120.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct
00000000-0000-4000-a000-000000000031	Mountain Bike #31	High-quality mountain bike suitable for off-road adventures. Listing number 31.	1157.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St, Springfield
00000000-0000-4000-a000-000000000032	Academic Tutoring Service #32	Expert tutoring in various academic subjects. Listing number 32.	1194.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St, Metropolis
00000000-0000-4000-a000-000000000033	Insurance Service #33	Reliable insurance services to protect you. Listing number 33.	1231.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave, Gotham
00000000-0000-4000-a000-000000000034	Moving Service #34	Efficient and professional moving service. Listing number 34.	1268.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd, Smallville
00000000-0000-4000-a000-000000000035	Wedding Photography #35	Beautiful wedding photography to capture your special day. Listing number 35.	1305.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr, Star City
00000000-0000-4000-a000-000000000036	Accounting Service #36	Professional accounting services for your business. Listing number 36.	1342.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln, Central City
00000000-0000-4000-a000-000000000037	Trading Card #37	Rare and collectible trading card. Listing number 37.	1379.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd, Coast City
00000000-0000-4000-a000-000000000038	Aquarium Decoration #38	Unique decoration for your aquarium. Listing number 38.	1416.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way, Bludhaven
00000000-0000-4000-a000-000000000039	Construction Vehicle #39	Heavy-duty construction vehicle for work. Listing number 39.	1453.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir, Midway City
00000000-0000-4000-a000-000000000040	Medical Technician #40	Skilled medical technician service. Listing number 40.	1490.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct, Keystone City
00000000-0000-4000-a000-000000000041	Mountain Bike #41	High-quality mountain bike suitable for off-road adventures. Listing number 41.	1527.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St, Springfield
00000000-0000-4000-a000-000000000042	Academic Tutoring Service #42	Expert tutoring in various academic subjects. Listing number 42.	1564.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St, Metropolis
00000000-0000-4000-a000-000000000043	Insurance Service #43	Reliable insurance services to protect you. Listing number 43.	1601.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave, Gotham
00000000-0000-4000-a000-000000000044	Moving Service #44	Efficient and professional moving service. Listing number 44.	1638.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd, Smallville
00000000-0000-4000-a000-000000000045	Wedding Photography #45	Beautiful wedding photography to capture your special day. Listing number 45.	1675.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr, Star City
00000000-0000-4000-a000-000000000046	Accounting Service #46	Professional accounting services for your business. Listing number 46.	1712.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln, Central City
00000000-0000-4000-a000-000000000047	Trading Card #47	Rare and collectible trading card. Listing number 47.	1749.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd, Coast City
00000000-0000-4000-a000-000000000048	Aquarium Decoration #48	Unique decoration for your aquarium. Listing number 48.	1786.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way, Bludhaven
00000000-0000-4000-a000-000000000049	Construction Vehicle #49	Heavy-duty construction vehicle for work. Listing number 49.	1823.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir, Midway City
00000000-0000-4000-a000-000000000050	Medical Technician #50	Skilled medical technician service. Listing number 50.	1860.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct, Keystone City
00000000-0000-4000-a000-000000000051	Mountain Bike #51	High-quality mountain bike suitable for off-road adventures. Listing number 51.	1897.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St, Springfield
00000000-0000-4000-a000-000000000052	Academic Tutoring Service #52	Expert tutoring in various academic subjects. Listing number 52.	1934.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St, Metropolis
00000000-0000-4000-a000-000000000053	Insurance Service #53	Reliable insurance services to protect you. Listing number 53.	1971.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave, Gotham
00000000-0000-4000-a000-000000000054	Moving Service #54	Efficient and professional moving service. Listing number 54.	2008.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd, Smallville
00000000-0000-4000-a000-000000000055	Wedding Photography #55	Beautiful wedding photography to capture your special day. Listing number 55.	2045.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr, Star City
00000000-0000-4000-a000-000000000056	Accounting Service #56	Professional accounting services for your business. Listing number 56.	2082.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln, Central City
00000000-0000-4000-a000-000000000057	Trading Card #57	Rare and collectible trading card. Listing number 57.	2119.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd, Coast City
00000000-0000-4000-a000-000000000058	Aquarium Decoration #58	Unique decoration for your aquarium. Listing number 58.	2156.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way, Bludhaven
00000000-0000-4000-a000-000000000059	Construction Vehicle #59	Heavy-duty construction vehicle for work. Listing number 59.	2193.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir, Midway City
00000000-0000-4000-a000-000000000060	Medical Technician #60	Skilled medical technician service. Listing number 60.	2230.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct, Keystone City
00000000-0000-4000-a000-000000000061	Mountain Bike #61	High-quality mountain bike suitable for off-road adventures. Listing number 61.	2267.00	004cb306-6682-4010-b88e-c410eb1c311d	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	123 Main St, Springfield
00000000-0000-4000-a000-000000000062	Academic Tutoring Service #62	Expert tutoring in various academic subjects. Listing number 62.	2304.00	01aefa9c-f89d-4ffb-b016-f71294013b27	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	456 Elm St, Metropolis
00000000-0000-4000-a000-000000000063	Insurance Service #63	Reliable insurance services to protect you. Listing number 63.	2341.00	01c2446b-7fdc-44bf-be94-71c5a43fafe3	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	789 Oak Ave, Gotham
00000000-0000-4000-a000-000000000064	Moving Service #64	Efficient and professional moving service. Listing number 64.	2378.00	01d34b4b-ca6a-4243-a3dc-522581ff73cc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	101 Pine Rd, Smallville
00000000-0000-4000-a000-000000000065	Wedding Photography #65	Beautiful wedding photography to capture your special day. Listing number 65.	2415.00	02efb656-0275-4aca-9d59-db0dbfb2dddc	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	202 Maple Dr, Star City
00000000-0000-4000-a000-000000000066	Accounting Service #66	Professional accounting services for your business. Listing number 66.	2452.00	02f1d12c-1469-4cc2-b882-892b135bee0b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	303 Cedar Ln, Central City
00000000-0000-4000-a000-000000000067	Trading Card #67	Rare and collectible trading card. Listing number 67.	2489.00	033ba66f-875d-472a-a109-f8295766fe3b	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	404 Birch Blvd, Coast City
00000000-0000-4000-a000-000000000068	Aquarium Decoration #68	Unique decoration for your aquarium. Listing number 68.	2526.00	039dd3f5-62b6-456b-a4b4-95972c630668	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	505 Walnut Way, Bludhaven
00000000-0000-4000-a000-000000000069	Construction Vehicle #69	Heavy-duty construction vehicle for work. Listing number 69.	2563.00	03bf696c-0e2a-454d-b908-97a4bceadc92	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	606 Cherry Cir, Midway City
00000000-0000-4000-a000-000000000070	Medical Technician #70	Skilled medical technician service. Listing number 70.	2600.00	04b136da-40b4-4080-a026-ea70df9e407c	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2150185156870701.jpg}	2025-03-01 17:37:49.112416+00	2025-03-01 17:37:49.112416+00	233e4567-e89b-12d3-a456-426614174011	707 Aspen Ct, Keystone City
2e39f705-11b3-44c7-94f9-9962d0903ba2	Hyundai veloster 2015	ici je libère Hyundai veloster 2015 occasion Canada, 75mil au kilométrage, \nfull options climatisée,\n4cylindres essence. \nconfort paradisiaque. \nprix: 5millions chocho bsoin d'argent pr voyage.4cylindres essence petit moteur,avec turbo , consommation moto	5000000.00	9045bfbf-cd55-47fd-8d41-c7b23a138749	1adbfc3b-6597-46ae-b020-35cd417418f3	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.03446017559989967.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.1239206348267976.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.2108355921563676.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.20364989265068845.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.7130169530054498.jpg}	2025-03-04 10:41:17.026426+00	2025-03-04 10:41:17.026426+00	433e4567-e89b-12d3-a456-426614174013	Biyemassi
98f0d923-c8ba-4a42-bdad-59a98f596d61	Huawei p20 lite 128g	Eneo kodengui  	32000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.6882628791069882.jpg}	2025-03-05 09:01:36.223326+00	2025-03-05 09:01:36.223326+00	433e4567-e89b-12d3-a456-426614174013	Eneo kodengui  
432ae3d2-0e1e-4de8-a930-9e0ca3a098e5	Iphone 7+ 32 giga	Iphone 7+ 32g a vendre  	45000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.6591311401978239.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.3316955922184912.jpg}	2025-03-05 09:02:49.209766+00	2025-03-05 09:02:49.209766+00	433e4567-e89b-12d3-a456-426614174013	Biyemassi
ba806e9c-1bf2-4c5d-98a4-1cdd587d11cd	Huawei	Liste des téléphone disponible \nHuawei p10lite 64gb 25,000fcfa\nHuawei P20lite 128gb 35,000fcfa\nHuawei y9 2018 128gb 30,000fcfa\nHuawei P30lite 128gb 35,000fcfa\nHuawei mate10 64gb 40,000fcfa\nHuawei nova 3i 128gb 35,000fcfa\nHuawei nova 2plus 128gb 35,000fcfa\nHuawei p50 pro 256gb 230,000\nHuawei nova plus 64gb 25,000fcfa\nBoutique facture et garantie 	25000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.5123885271555924.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.6423560919665565.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.19737590377508019.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.9890332723867588.jpg}	2025-03-05 09:05:08.136677+00	2025-03-05 09:05:08.136677+00	433e4567-e89b-12d3-a456-426614174013	Biyemassi 
4544402a-1e56-47ef-b73e-79c99501c0db	Huawei nova plus +	Prix pas discutable \n64Go mémoire \n4 Go de Ram	23000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1adbfc3b-6597-46ae-b020-35cd417418f3	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.6790284376527029.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.6127160546591015.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1adbfc3b-6597-46ae-b020-35cd417418f3/0.009262228066529543.jpg}	2025-03-05 09:06:32.420752+00	2025-03-05 09:06:32.420752+00	433e4567-e89b-12d3-a456-426614174013	Biyem
58564086-ff08-400d-b11b-54fdd2320a71	Google pixels 4a	Google pixels 4a 128g propre \n53 mil 	53000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1255494e-3cea-44b9-ba32-bcf9a38a6262	Used	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4808101034446377.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3346621205099787.jpg}	2025-03-08 13:28:28.086634+00	2025-03-08 13:28:28.086634+00	433e4567-e89b-12d3-a456-426614174013	Biyemassi
45c195e5-18a9-4dd5-999f-685b4e335aa6	DELL 3189 TACTILE 	DELL 3189 TACTILE 128 go ssd sur 4 go de RAM QUATCORE🎁✅ \nhttps://web.facebook.com/share/1ACvP97iu6/	55000.00	ce1c0d19-f59a-4584-911d-d631dc907a2a	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7745609176122112.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6225651560922829.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3045253850809595.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6902045468529654.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.15227483014925136.jpg}	2025-03-08 13:31:07.397141+00	2025-03-08 13:31:07.397141+00	433e4567-e89b-12d3-a456-426614174013	Biyemassi
5b64234b-0c9f-4821-b20f-2b4f7bdaad41	Mocassin	Entre classique et Casual parfaite pour être chic \nhttps://web.facebook.com/share/1EFc2sxM4o/	17100.00	2b9f3d65-8968-4572-8793-c7348a516184	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8116372048634368.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8740786570122463.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4828751588235478.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.19701189836115152.jpg}	2025-03-08 13:34:08.803147+00	2025-03-08 13:34:08.803147+00	233e4567-e89b-12d3-a456-426614174011	Bastos
dc014323-ba46-4396-ae5a-52335874b002	iPhone 11 simple neuf 64 giga batterie 94% True tone	iPhone 11 simple neuf 64 giga batterie 94% True tone ☑️ 🆔 ☑️ jamais ouvert avec facture prix:135k Y\nhttps://web.facebook.com/share/16By5A9mZG/	135000.00	5b0502fe-3601-448d-9ed7-81853e873782	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.14217894412122556.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.36632875157598055.jpg}	2025-03-08 13:36:53.337406+00	2025-03-08 13:36:53.337406+00	733e4567-e89b-12d3-a456-426614174016	Ekounou
77a02b09-e010-490e-ad71-f14774270c57	Clavier MacBook (wireless apple)	Clavier MacBook sans fil prends les piles et se connecte via Bluetooth \nhttps://web.facebook.com/share/19X2Yo6Tjk/	20000.00	615160e5-ee2a-4373-bea0-afb33cc5b336	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2059080959665356.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.31140555757462307.jpg}	2025-03-08 13:38:21.9834+00	2025-03-08 13:38:21.9834+00	833e4567-e89b-12d3-a456-426614174017	Etoudi
17ecad3d-488d-4afc-98e1-7e74375bff56	Pantalon cargo	Vos cargo à 4000f 🥳 venez profiter oooo \nhttps://www.facebook.com/share/1SD4Det2yV/	4000.00	e5db44ff-5bd9-4fd1-99be-307d63b9f105	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6097384920779885.jpg}	2025-03-10 07:42:55.254287+00	2025-03-10 07:42:55.254287+00	733e4567-e89b-12d3-a456-426614174016	
1975fb61-4e21-4782-ab9d-2b635bf9dd1c	Ensemble lins chemise	Bonne qualité 👍 \nhttps://www.facebook.com/share/12ETkSFu4p6/	2500.00	62b92e01-e32f-489a-9be6-727998083e36	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.13624044084229192.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6593994926636537.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5242754277286383.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3076086492654482.jpg}	2025-03-10 08:08:01.48698+00	2025-03-10 08:08:01.48698+00	b33e4567-e89b-12d3-a456-42661417401a	
69f13b70-b8b0-40b6-8bb4-24c3200046a1	Pulls	Toute les tailles  \nhttps://www.facebook.com/share/15VcUANrYQ/	5500.00	d9509efe-e1eb-4800-a285-d474c8cfee5b	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5331491534407748.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4094434595066072.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7429184161640674.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3965731502886869.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2980018369335313.jpg}	2025-03-10 08:16:39.312562+00	2025-03-10 08:16:39.312562+00	633e4567-e89b-12d3-a456-426614174015	
4d945808-61c3-4baf-95fc-b56ee444b47b	Maison (cité constituer de quatre studios,un appartement et trois chambres )a vendre sur Yaoundé	Maison (cité constituer de quatre studios,un appartement et trois chambres )a vendre sur une Superficie de 400m2 située a etougebe derrière le centre des handicapés  non titré en bordure de route secondaire , a un taxi de la poste centrale \nVeuillez m'écrire en privé si vous êtes intéressé \nhttps://www.facebook.com/share/1BbyckNcGN/	18000000.00	8cc2178d-c515-4c3b-9277-4d897cf4b1ce	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.46735246975370104.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.23833349873527077.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4106494353753962.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8534336752958733.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.26203214391377916.jpg}	2025-03-11 07:33:04.254075+00	2025-03-11 07:33:04.254075+00	a33e4567-e89b-12d3-a456-426614174019	odza
1965a029-5738-4744-bba5-d025bf90ebaa	Gazon synthétique en millimètre	2m de large\nSolide\nVerr \nhttps://www.facebook.com/share/1Qttx5dzZK/	4000.00	e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5356327298796877.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2431245808980791.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5588668846538556.jpg}	2025-03-11 07:43:41.077504+00	2025-03-11 07:43:41.077504+00	b33e4567-e89b-12d3-a456-42661417401a	
274d855a-33e7-45b0-9e6a-7c3874556105	Petit pots de fleur décoratif	Petit pots de fleur décoratif\nhttps://www.facebook.com/share/1A9toz5PEs/	1500.00	e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.20631975214479548.jpg}	2025-03-11 07:44:42.970954+00	2025-03-11 07:44:42.970954+00	533e4567-e89b-12d3-a456-426614174014	
9eabce72-2f53-4ef9-9a61-0ed56a5c3c85	Parassol en acier à double couche, 1m20 de largeur	Disponible....Le paiement s'effectue à la livraison\n Contactez-moi par appel téléphonique ou WhatsApp au : 695672605-674650634	13000.00	130aa7ca-7d6e-4e18-b677-302b6df88b54	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7965057418462638.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2765067489813844.jpg}	2025-03-11 07:46:29.341881+00	2025-03-11 07:46:29.341881+00	933e4567-e89b-12d3-a456-426614174018	
e218a183-9cea-4a1e-95da-c4774483f445	Plants de cacao	Plants de cacao pour une production à partir de 3 ans seulement \nhttps://www.facebook.com/share/1ANaRzPEUy/	200.00	e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.34990976226436543.jpg}	2025-03-11 07:47:29.486598+00	2025-03-11 07:47:29.486598+00	833e4567-e89b-12d3-a456-426614174017	
31bc858b-d4ff-41f2-9af3-79969cc21dd6	Pots de fleurs (mini)	Pots de fleurs (mini)\nhttps://www.facebook.com/share/19CR18ZtsV/	1350.00	e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6545468237216316.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.36368401492987834.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9566247530440639.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3114901661224132.jpg}	2025-03-11 07:49:05.326376+00	2025-03-11 07:49:05.326376+00	733e4567-e89b-12d3-a456-426614174016	
5d3b5e75-ed70-4a8c-9380-53d240e9bf7b	Tuyau d'arrosage 15 mètres	tuyau d'arrosage \n15 mètres \nhttps://www.facebook.com/share/1Gz8LydPjr/	12000.00	77819dbb-2727-4c37-ad31-932de43ab296	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9883141845256835.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.39797840610533464.jpg}	2025-03-11 07:51:01.059127+00	2025-03-11 07:51:01.059127+00	433e4567-e89b-12d3-a456-426614174013	
39152d6f-288c-4e82-a97c-2f4d40f7220e	Vibreur à béton thermique	Vibreur à béton thermique \nPrix 165.000fcfa\nWhatsApp Appel ☎️ [hidden information]\nYaounde et Douala \nLivraison à domicile\nhttps://www.facebook.com/share/1BVa6waFP9/	165000.00	77819dbb-2727-4c37-ad31-932de43ab296	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2778103202529034.jpg}	2025-03-11 07:52:09.770231+00	2025-03-11 07:52:09.770231+00	333e4567-e89b-12d3-a456-426614174012	
e7edf994-36a9-40ca-8705-1ea182da0d2b	Plus de 500mil Plan de cacaoyer	Plus de 500mil Plan de cacaoyer disponible Yaoundé-Nyom T\nhttps://www.facebook.com/share/1GdahKGiCD/	200.00	e58d567c-d08e-4ebe-90e6-f2b3dfa2b019	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9907942858332799.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4134744198000444.jpg}	2025-03-11 07:54:24.467931+00	2025-03-11 07:54:24.467931+00	a33e4567-e89b-12d3-a456-426614174019	
b67f5664-e132-45c8-9607-40ce1bf32e0d	pot apple deco	pot apple deco\nhttps://www.facebook.com/share/1Kt7pShmR3/	1500.00	a19b8021-7226-40bb-a6d2-ea07f320a97f	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.29008482315010653.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.14322364665319598.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.13573220946976727.jpg}	2025-03-11 07:56:01.707969+00	2025-03-11 07:56:01.707969+00	633e4567-e89b-12d3-a456-426614174015	
0b277465-b014-4756-9d86-f129c33532e3	Mini Cooper sport	Mini Cooper sport \nMoteur essence ⛽️ \nFaible consommation \nBoîte manuelle \n7 Vitesse \nClimatisé glacial 🥶 \nOccasion d’Europe \nVisible sur Yaoundé \nhttps://www.facebook.com/share/16Dsp8gfnF/	5000000.00	66644b4b-2189-40ce-8e38-d7bba97326e5	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.14763063153546918.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.716468078607088.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8549629787448696.jpg}	2025-03-12 08:19:56.246273+00	2025-03-12 08:19:56.246273+00	b33e4567-e89b-12d3-a456-42661417401a	
dd369c7f-9f29-44d7-8c29-df8ff797c3be	Vente de véhicule	-Lexus RX 300\n-Boîte de vitesse \n-automatique \n-Moteur essence \n-Volant direct \n-Peinture d'origine\nBlanc Nacré \n-Climatisation claciale \n-Papier à jour (assurance et visite technique un an, carte grise 9 ans)\nCommission du démarcheur 100.000fca\n-Prix cadeau 2 500 000fca\nhttps://www.facebook.com/share/18tUw97QrW/	2500000.00	ed7bf95c-62f5-4950-ab4b-f67924ac4e73	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5676633105158415.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.24870591804152564.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8912797322626527.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.36641747052678775.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.07224281672412869.jpg}	2025-03-12 08:33:13.506301+00	2025-03-12 08:33:13.506301+00	433e4567-e89b-12d3-a456-426614174013	
294a6241-90e9-4324-9f36-70adf35f0f57	Kia selto 2021	Kia selto 2021 \nOccasion Europe \n2 jours au pays \nAutomatique \nEssence \nFull full option \nSiège en cuire \nPeinture d’origine \nClimatisation d’origine et glacial 🥶 \nPapier douane à jour \nPrix : 26 millions\nhttps://www.facebook.com/share/169JyPkyuL/	26000000.00	66644b4b-2189-40ce-8e38-d7bba97326e5	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.1127490193724805.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8146152338759343.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.012829042562121584.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7478484421459022.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6171311297333459.jpg}	2025-03-12 08:35:01.396122+00	2025-03-12 08:35:01.396122+00	c23e4567-e89b-12d3-a456-42661417400b	
746fd9a7-049b-4f14-972f-b715115bdd9d	Veste deux pièces	Veste deux pièces\nhttps://www.facebook.com/share/1YqJTvsMWF/	35000.00	d9dcdfa5-3b7f-4b42-9171-2d7b9a123742	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9528318799583617.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6869321182856085.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.30607319736188865.jpg}	2025-03-13 07:27:37.814534+00	2025-03-13 07:27:37.814534+00	233e4567-e89b-12d3-a456-426614174011	
924cfa36-be83-4171-9dc4-eb0a60e695cf	Venza	🔥🔥🔥🔥🔥Venza 2010 \nMoteur V6 \nLecteur Android HD \nCaméra de recul \nGente chromé \nRétroviseur rabattable \nHabitacle très propre \nPeinture rafraîchi \nIl a cassé le prix il veut \n4 millions l acheteur gère la com \nhttps://www.facebook.com/share/16FdT2UjSg/	4000000.00	66644b4b-2189-40ce-8e38-d7bba97326e5	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.46067718759935383.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5197576792490688.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5262756898780394.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.21781005918218188.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8032885179207965.jpg}	2025-03-12 08:36:40.82608+00	2025-03-12 08:36:40.82608+00	933e4567-e89b-12d3-a456-426614174018	
61aa2239-34e6-41e2-b3d6-9545b407d0ab	 Executive Deals ✅ Extremely Clean Range Rover STARTECH Year: 2017	Executive Deals ✅\nExtremely Clean Range Rover STARTECH Year: 2017 Mileage: 34k km:Occasion Europe standard \nRandy to fly to It's destination \n\n Price: 52M\n\nNous apportons nos voitures du Nigéria au Cameroun uniquement sur commande, durée 1 semaine\nVous pouvez nous rencontrer à NLONGKAK Yauonde en face de Nike et passer votre commande notre priorité est de donner la meilleure satisfaction à nos clients\nVeuillez lire très bien mon message avant de me contacter pour n'importe quelle voiture\nVeuillez uniquement pour les acheteurs sérieux si vous n'achetez aucune voiture S'il vous plaît, ne me contactez pas.Contactez le [hidden information] appel direct ou WhatsApp\n\nWe bring our cars from Nigeria to Cameroon only on Command,duration 1 week\nYou can meet us at NLONGKAK Yauonde opossite Nike and place your command our priority is to give the best satisfaction to our customers \nPlease read my post very well before contacting me for any car \nPlease only for serious buyers if you're not buying any car Please Please don't contact me\nhttps://www.facebook.com/share/1BZ25vRRk8/	52000000.00	66644b4b-2189-40ce-8e38-d7bba97326e5	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6661411900685237.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3612246789659932.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8990039903807883.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.03416498884925634.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8072114140945124.jpg}	2025-03-12 08:46:09.150481+00	2025-03-12 08:46:09.150481+00	833e4567-e89b-12d3-a456-426614174017	
b6a6e1a6-8c94-4c0c-9021-0bcd38783336	T-shirt polo 	“L’élégance rencontre le confort ! ✨👕\n\nCe polo 100% coton est conçu pour vous offrir un maximum de confort tout en restant stylé. Son tissu respirant et anti-transpiration vous garde au frais toute la journée. Parfait pour un look classe et décontracté ! 💯🔥\n\nQui valide ? 👇😎 #StyleEtConfort #PoloPremium #100PourcentCoton”\nhttps://www.facebook.com/share/15KboXPqBp/\n	8000.00	62b92e01-e32f-489a-9be6-727998083e36	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.07117715295504179.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.36843502496924496.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9868552315961576.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6760927512795103.jpg}	2025-03-13 07:19:38.868499+00	2025-03-13 07:19:38.868499+00	433e4567-e89b-12d3-a456-426614174013	
6572ff4d-ce20-4c27-92e4-acc3e89c7a1f	 Godasses PHANTOM GX	\nGodasses PHANTOM GX\nhttps://www.facebook.com/share/1DPynGgfd2/	33000.00	2b9f3d65-8968-4572-8793-c7348a516184	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4740228843572385.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.21489475821505044.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6265636599793638.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6824620039273124.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7773706660708048.jpg}	2025-03-13 07:21:13.797406+00	2025-03-13 07:21:13.797406+00	233e4567-e89b-12d3-a456-426614174011	
2177e251-3316-48c9-a390-d8f79a802318	Basket homme	Chaussures Minimalistes – Simplicité et Style\n40-44\nAdoptez un look épuré avec ces chaussures minimalistes no name. Disponibles en blanc et noir, elles allient confort et polyvalence pour s’adapter à toutes vos tenues. Offrez-vous une élégance discrète pour chaque occasion.\n\nPoints forts :\n\n • Design minimaliste\n • Disponible en blanc et noir\n • Légèreté et confort\nVentes en gros et en détail \nhttps://www.facebook.com/share/15rkNfmo1A/	10900.00	2b9f3d65-8968-4572-8793-c7348a516184	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9105492237392954.jpg}	2025-03-13 07:22:24.343486+00	2025-03-13 07:22:24.343486+00	433e4567-e89b-12d3-a456-426614174013	
db8b31e0-45c8-4aea-981c-1b1ca230a7f7	Ensemble lins chemise	Ensemble lins chemise\nhttps://www.facebook.com/share/1BAJAXkWH6/	25000.00	62b92e01-e32f-489a-9be6-727998083e36	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7515764154947708.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6039065960340309.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6495729669487964.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5126955209196611.jpg}	2025-03-13 07:23:46.746233+00	2025-03-13 07:23:46.746233+00	733e4567-e89b-12d3-a456-426614174016	
82359bea-4ff3-41ca-b54d-efafad7f8acd	Sandales modernes	Sandales modernes\nhttps://www.facebook.com/share/1GxvXKEW3Q/	15000.00	2b9f3d65-8968-4572-8793-c7348a516184	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6651467752189377.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9013991131306462.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.22867553963308795.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3452616353371405.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8011445626590745.jpg}	2025-03-13 07:25:19.802901+00	2025-03-13 07:25:19.802901+00	a33e4567-e89b-12d3-a456-426614174019	
1c375a0a-886d-4e03-9276-3b01e617cd54	Derby	Derby shoes\nhttps://www.facebook.com/share/15tJyGvqzr/	20000.00	2b9f3d65-8968-4572-8793-c7348a516184	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.12297994366788445.jpg}	2025-03-13 07:26:22.592847+00	2025-03-13 07:26:22.592847+00	933e4567-e89b-12d3-a456-426614174018	
818952e2-2e67-415e-874e-154c0a775991	Maison a vendre à nkoloufoulou	Maison avendre a nkoloufoulou 13million 3ch salon cuisine 2douche entre amity international school Au carrefour nkolebende  service 	13000000.00	f600b00c-cc5f-4b79-b408-9add2fe66740	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.34697698191823045.jpg}	2025-03-17 08:13:45.808305+00	2025-03-17 08:13:45.808305+00	a33e4567-e89b-12d3-a456-426614174019	
c4a18573-995d-4c85-9c73-3b0eaac4a7a7	Maison à vendre située à Yaoundé à l’entrée cimencam	Maison à vendre situé à Yaoundé l’entrée cimencam \n\n3 chambres \n2 douches\nSalon \nCuisine \n\nSuperficie total : 220m²\nÉtat du terrain   : titré \n\nPrix: 12millions \n\nNb: prévoir les frais de l’agence immobilière immobilière \nhttps://www.facebook.com/share/15Tg7CWeto/	12000000.00	10455463-f7d1-4a54-baa5-7b59fb07badf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5302398928909318.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.17813121665102827.jpg}	2025-03-17 08:17:27.215109+00	2025-03-17 08:17:27.215109+00	933e4567-e89b-12d3-a456-426614174018	
bee25196-0c97-4336-82a3-0c0acced4d14	 TSINGA VILLAGE MAISON AVENDRE TITRÉ LOTIS	TSINGA VILLAGE \nMAISON AVENDRE TITRÉ LOTIS \nSUPERFICIE 500m2\n3chambres 2douches \n24.000.000f 	24.00	10455463-f7d1-4a54-baa5-7b59fb07badf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6619119659672619.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.29016969289270467.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.46615881679054794.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6879758299356895.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6510348775834378.jpg}	2025-03-17 08:18:54.509242+00	2025-03-17 08:18:54.509242+00	733e4567-e89b-12d3-a456-426614174016	
87153caa-9b6c-4fcd-a4a9-fad0de8bf355	Maison inachevée à vendre 8millions Nkolbisson	maison inachevée à vendre 8 millions\nlieux : nkolbisson(à 150f de moto à partir du carrefour nkolbisson)\n\nsuperficie 200m2\n\nmaison de 04 chambres 02 douches \nhttps://www.facebook.com/share/1945CcAPhS/	8000000.00	10455463-f7d1-4a54-baa5-7b59fb07badf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6935574595007088.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6340088496957559.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.386068992826033.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.08004997153564686.jpg}	2025-03-17 08:20:34.109556+00	2025-03-17 08:20:34.109556+00	a33e4567-e89b-12d3-a456-426614174019	
bf98a7f8-709d-4dd7-b962-e7e41f95edcf	NKOABANG LADA MAISON INACHEVÉ À VENDRE 3CHAMBRES 2DOUCHES SUPERFICIE 702m2	NKOABANG LADA\nMAISON INACHEVÉ À VENDRE \n3CHAMBRES 2DOUCHES\nPARKING PUITS \nSUPERFICIE 702m2\nTITRÉ LOTI \n16millions\nhttps://www.facebook.com/share/1AL64tynrY/	16000000.00	10455463-f7d1-4a54-baa5-7b59fb07badf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8285370630628062.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.33310134203094144.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.18296059199907355.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.27036514815378454.jpg}	2025-03-17 08:22:09.229834+00	2025-03-17 08:22:09.229834+00	a33e4567-e89b-12d3-a456-426614174019	
fec1caf2-8488-44f3-9b7a-2645d2bfad16	MAISON à vendre nkoabang construit sur 270m2 titré 03 chambres, 02 salon 01 cuisine 02 Douche	Découvrez cette magnifique maison construite sur un terrain titré de 270 m². Située à proximité de Santa, il vous suffit de dire "chez le chef" pour accéder à cette propriété. \n\nCaractéristiques de la maison :\n\n• 3 chambres spacieuses\n\n• 2 salles de douche modernes\n\n• Une cuisine fonctionnelle\n\n• 2 salons accueillants\n\nLe prix d'entrée est de 150 FCFA et 100 FCFA pour les visiteurs.\n\nPour plus d'informations ou pour planifier une visite, veuillez contacter les numéros suivants : \nhttps://www.facebook.com/share/1BJVeQWatd/	13000000.00	10455463-f7d1-4a54-baa5-7b59fb07badf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.18090704348286324.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8963941996979112.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.20011949169311372.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.533612891499853.jpg}	2025-03-17 08:24:00.741888+00	2025-03-17 08:24:00.741888+00	a33e4567-e89b-12d3-a456-426614174019	
b9e2640c-8719-4bfe-8a77-d3f3ea884dba	Duplex à vendre à Nkoabang	Duplex à vendre.\nYaoundé _Nkoabang.\nSuperficie :420 m2\nSalon\nSalle à manger\nToilettes.\nCuisines.\nÀ l'étage 2 chambres + toilettes.\nÀ l'extérieur 2 chambres + toilettes et cuisines.\nLes toilettes possédant des blocs pour sauna et hammam.\nLa maison possède un forages et climatiseur tout est à vendre.\nLa maison est titrée.\nPrix 70 millions.\nhttps://www.facebook.com/share/1HJCMABuQF/	70000000.00	f600b00c-cc5f-4b79-b408-9add2fe66740	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9796531505035959.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6958023013730117.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2952173964475786.jpg}	2025-03-17 08:25:45.771526+00	2025-03-17 08:25:45.771526+00	533e4567-e89b-12d3-a456-426614174014	
a1edb4c0-a0fe-4069-bc16-e3830283c011	Chaussure homme ou femme	Chaussure pour Jeans ou même veste, très confortable \nhttps://www.facebook.com/share/1Bh8khbGtj/	9000.00	8055a395-e8ca-4d13-a64b-15c0bab45fa2	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.08451115763159422.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2350355285782959.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.685245338314231.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.09665507635757997.jpg}	2025-03-18 08:16:09.299207+00	2025-03-18 08:16:09.299207+00	233e4567-e89b-12d3-a456-426614174011	
d616480d-d55d-4793-8016-f835a402811a	GRAND TAPIS	GRAND TAPIS\nhttps://www.facebook.com/share/19BFWe44Cz/	25000.00	69182bab-4734-4c7b-932e-6aef6230df8e	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9518318806634398.jpg}	2025-03-28 07:13:43.531674+00	2025-03-28 07:13:43.531674+00	933e4567-e89b-12d3-a456-426614174018	
a5d41619-ab20-4f58-90fc-f8b6d6364874	Resin book/Cahier faite avec resin Parfait Cadeau pour vos proches	Resin book/Cahier faite avec resin Parfait Cadeau pour vos proches\nhttps://www.facebook.com/share/14o6tpRDYg/	10000.00	1fd19de5-5831-47fd-ad09-2a546f221031	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.05314728351557463.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6806020415943514.jpg}	2025-03-18 08:17:23.990483+00	2025-03-18 08:17:23.990483+00	433e4567-e89b-12d3-a456-426614174013	
6e0ffb18-b03c-462e-9849-374d8aac26f3	Decor books / faux livres decor	Decorate your space with these fake books \nhttps://www.facebook.com/share/15mM6HjSkA/	11500.00	11c244a1-06ed-464a-a2ca-714831c1ad24	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.022841531070758148.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5055378873542338.jpg}	2025-03-18 08:18:34.472581+00	2025-03-18 08:18:34.472581+00	433e4567-e89b-12d3-a456-426614174013	
57ec5f4c-940a-45a0-8e03-43f0f7b96f9f	Motivational/spiritual Books and others	ooks on Habit and productivity, psychology of persuasion, mindset, leadership and public speaking, Forex and financial markets, financial intelligence, Entrepreneurship, sales and marketing, Relationship and marriage, \nKids and Teenagers, children 1-100 and ABC, story Books, folk tales etc\nhttps://www.facebook.com/share/1YcyPzQWjF/	10000.00	c205edcf-3f80-4983-9a32-dc78c4b4810a	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.33622727665465924.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6949456215944321.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.04548691786565495.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8809920976820855.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.1426071890967353.jpg}	2025-03-18 08:20:12.900519+00	2025-03-18 08:20:12.900519+00	333e4567-e89b-12d3-a456-426614174012	
fd2f0d78-cec1-44b5-b38c-f5fa605653af	Children Books	Children Books\nhttps://www.facebook.com/share/1Ey86xy2Di/	1000.00	8cb34a0c-e61b-4671-889d-e7fcf6f4e0ab	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.18434678494019208.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8574065942343922.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5139570794370665.jpg}	2025-03-18 08:21:50.785865+00	2025-03-18 08:21:50.785865+00	233e4567-e89b-12d3-a456-426614174011	
0794ef39-095e-4280-862b-ec7229ae73c7	Cahier de texte/log book	Cahier de texte/log book\nTrès bonne qualité \nhttps://www.facebook.com/share/15ZK9qMGUV/	4000.00	fd86e479-783a-4de6-84b4-9934c10aec41	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6098801814031884.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9729646326296781.jpg}	2025-03-18 08:25:08.926982+00	2025-03-18 08:25:08.926982+00	833e4567-e89b-12d3-a456-426614174017	
a16427dc-4e9f-4752-9065-4b44ba3d0623	 Ensemble one all sport original	\nEnsemble one all sport original\nToutes les tailles sont disponibles \nhttps://www.facebook.com/share/1BKfngWJA7/	20000.00	7cf7f208-6b3d-473d-8729-586822f9a237	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6575476887521139.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.20294611282099662.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.491045939772784.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8244682090900641.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8100465992358132.jpg}	2025-03-18 08:26:59.865162+00	2025-03-18 08:26:59.865162+00	733e4567-e89b-12d3-a456-426614174016	
978917f1-7b22-43fd-b1b2-f1c7bab2359e	Tapis de sport, exercice de yoga à la maison	apis de sport 8mm, dimensions 163*61cm\nDisponible contactez moi par appel téléphonique ou WhatsApp au 695672605-674650634	7500.00	3859f331-6389-4862-bf37-3a80b2010e08	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.05981422355510646.jpg}	2025-03-18 08:27:52.076191+00	2025-03-18 08:27:52.076191+00	533e4567-e89b-12d3-a456-426614174014	
c6a0650e-4624-4495-913a-a222851983f1	Haltères de sport	Haltère en béton\nLa paire de\n8kg à 8000frs\n10kg à 10000frs et\n12kg à 12000frs\nYaoundé simbock... Dernière DOVv mendong\nLivraison aux frais du client\nhttps://www.facebook.com/share/1667G1xmf2/	12800.00	3859f331-6389-4862-bf37-3a80b2010e08	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9656927842425951.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.053940887430525386.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3078260068821774.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.10206965782643085.jpg}	2025-03-18 08:29:24.646949+00	2025-03-18 08:29:24.646949+00	633e4567-e89b-12d3-a456-426614174015	
19a4903b-49bf-4e34-aade-92f810322c4b	Godasses pour sport	Godasses pour sport\nGodasses de football à bas coût. \nhttps://www.facebook.com/share/1ABiwYDtte/	25000.00	1e619473-4bb9-4db5-9df7-3616f80b36e0	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.052355807994054926.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6897565907964129.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7346242675063988.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.28815928347374364.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3032875919900775.jpg}	2025-03-18 08:31:19.390362+00	2025-03-18 08:31:19.390362+00	933e4567-e89b-12d3-a456-426614174018	
8da85aa0-ec97-4575-8282-ca7c2fd01414	Maillot pour sport	Arrivage des maillots maillot de sport 💯/💯 coton  \nhttps://www.facebook.com/share/1ALN3djQE1/	4600.00	7cf7f208-6b3d-473d-8729-586822f9a237	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5119197999258689.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.24996089252162013.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.37865565536696355.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.1112971619862384.jpg}	2025-03-18 08:33:17.593105+00	2025-03-18 08:33:17.593105+00	233e4567-e89b-12d3-a456-426614174011	
54a300db-1629-4183-bc22-892257141dcc	Tenues de sports	Tenues de sports\nhttps://www.facebook.com/share/1FFFQuXqE1/	7000.00	345db22e-c530-45c6-b7e6-ee60ca4fed18	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3802348513950682.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.28475322844907924.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8995400443578845.jpg}	2025-03-18 08:34:40.307005+00	2025-03-18 08:34:40.307005+00	433e4567-e89b-12d3-a456-426614174013	
20de9136-aa99-48a8-95d0-38cd0d1b2236	 Kit de sport pour football et basketball	Facile à installer pour le plaisir de nos champions,  basketteurs ou footballeurs 👌🏽👌🏽👌🏽\n3ans et plus\nKit 2 en 1, basket 🏀 et football ⚽️  *1\n`*SPORT SET 2IN1.   16000 \nhttps://www.facebook.com/share/18NVGrkNwe/	16000.00	35de68ea-7db1-4fb3-bac4-991fccef83e8	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.19659025827102727.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9288504392947261.jpg}	2025-03-18 08:35:55.449074+00	2025-03-18 08:35:55.449074+00	633e4567-e89b-12d3-a456-426614174015	
8a75844f-02ee-4b8a-adcf-d84f303c5899	 Sports à domicile	Outils pour pratiquer le sport à domicile de  \nhttps://www.facebook.com/share/1Kskz2Agtr/	1000.00	345db22e-c530-45c6-b7e6-ee60ca4fed18	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.967082161471388.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7864718227895975.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9108713678620506.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7986723091693464.jpg}	2025-03-18 08:37:23.450809+00	2025-03-18 08:37:23.450809+00	433e4567-e89b-12d3-a456-426614174013	
6fca608e-97b5-4549-8d1d-85c0fce1b2d2	Sport equipment	Sport equipment\nhttps://www.facebook.com/share/1BHNqT3kRP/	5000.00	3859f331-6389-4862-bf37-3a80b2010e08	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5370703545167408.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7198711620910945.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2879132593529823.jpg}	2025-03-18 08:38:41.926343+00	2025-03-18 08:38:41.926343+00	733e4567-e89b-12d3-a456-426614174016	
d077adb6-ae70-4d6f-949f-8b1282dce4de	Hachoir à légume rechargeable	Je solde oooh je liquide oooh venez me tromper...😃🎉\n_________________\n\n*Hachoir électrique 4 en 1*\n- 1 brosse à vaisselle \n- 1 éplucheur de légumes \n- 1 lame à hacher\n- 1 lame à couper en lamelles\n- 1 cordon pour recharger \nLe tout dans un petit carton solide transportable partout \nBon gadget de dépannage pour la cuisine !\n\nPrix de solde : *5.000F*🎁\n\nLivraison au frais du client oooh !!\nhttps://www.facebook.com/share/1FWjx6BnsR/	5000.00	c7914ea3-8197-458e-86bf-180573e0d9b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3910911183864403.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.31092623204276504.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.35971694791838327.jpg}	2025-03-20 07:20:10.191058+00	2025-03-20 07:20:10.191058+00	633e4567-e89b-12d3-a456-426614174015	
35f2d623-4365-4efe-b79f-dd98994d0672	Conservateur	Conservateur d'aliments secs en verre disponible \nYde au 691018729\n6000 pour 800ml \nhttps://www.facebook.com/share/1QJ7G64uxM/	1000.00	c7914ea3-8197-458e-86bf-180573e0d9b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.951835498282438.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2688515090525321.jpg}	2025-03-20 07:21:14.923155+00	2025-03-20 07:21:14.923155+00	333e4567-e89b-12d3-a456-426614174012	
214cbe86-e27c-4b63-888b-d51c19024c95	Tv led lights	Tv led lights\nhttps://www.facebook.com/share/1Bta9gaRY5/	7500.00	fca6d7b6-a0c2-4c28-ad9e-71b7fea93ff4	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.576181667378378.jpg}	2025-03-20 07:22:11.766535+00	2025-03-20 07:22:11.766535+00	433e4567-e89b-12d3-a456-426614174013	
883698ce-d3fa-4291-bcc0-c5b5866ac558	2005 Yamaha Dragster	Year: 2005\n\nMake: Yamaha\n\nModel: Dragster\n\nMileage: 30k\n\nCapacity: 1100cc\n\nCondition: Foreign used\n\nThis bike comes with a free protective helmet and a motorcycle Handglove of your size\n\nThis bike is in a very good condition. It is very fuel efficient and good for travels\n\nPrice: 950.000frs\n\nWe bring our cars from Nigeria to Cameroon only on Command,duration 1 week\nYou can meet us at NLONGKAK Yauonde opossite Nike and place your command our priority is to give the best satisfaction to our customers \nPlease read my post very well before contacting me for any car \nPlease only for serious buyers if you're not buying any car Please Please don't contact me.contact [hidden information] direct call or WhatsApp \n\nWe bring our cars from Nigeria to Cameroon only on Command,duration 1 week\nYou can meet us at NLONGKAK Yauonde opossite Nike and place your command our priority is to give the best satisfaction to our customers \nPlease read my post very well before contacting me for any car \nPlease only for serious buyers if you're not buying any car Please Please don't contact me.contact https://www.facebook.com/share/15TBoBTHp1/\n	950000.00	c51779d7-47c7-4183-a89c-ea7012a9adda	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6736362553798534.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3975296440609657.jpg}	2025-03-20 07:23:41.47555+00	2025-03-20 07:23:41.47555+00	433e4567-e89b-12d3-a456-426614174013	
6fa45768-4369-4119-9a8a-9b6fc08c298e	Vente de véhicule	-Lexus RX 300\n-Boîte de vitesse \n-automatique \n-Moteur essence \n-Volant direct \n-Peinture d'origine\nBlanc Nacré \n-Climatisation claciale \n-Papier à jour (assurance et visite technique un an, carte grise 9 ans)\nCommission du démarcheur 100.000fca\n-Prix cadeau 2 500 000fca\nhttps://www.facebook.com/share/15uoMkqb66/	3000000.00	9045bfbf-cd55-47fd-8d41-c7b23a138749	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.05976102081324819.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.009982753557669755.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.12626530861723406.jpg}	2025-03-20 07:26:05.526948+00	2025-03-20 07:26:05.526948+00	333e4567-e89b-12d3-a456-426614174012	
f0fe9761-2a30-45bf-ac6e-601f783b92cf	tapis salon encore en état	tapis salon encore en état\nhttps://www.facebook.com/share/1DGfCGLUR2/	27000.00	69182bab-4734-4c7b-932e-6aef6230df8e	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9448818770476737.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7637995191632483.jpg}	2025-03-28 07:15:00.224948+00	2025-03-28 07:15:00.224948+00	a33e4567-e89b-12d3-a456-426614174019	
fb8917e2-a740-4c10-a805-9e6ba1c52e96	Salon d’occasion turque et local	Salons d’occasion turques en solde avec 1an de\nGarantie a partir 230000\nhttps://www.facebook.com/share/1F4VXYE3Nv/	230000.00	2c730916-b228-415e-b154-dc1572a1e080	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.11719885322322598.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8825044481664199.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9553307348314781.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.09140122035268772.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.13139423836742314.jpg}	2025-03-20 07:28:21.964073+00	2025-03-20 07:28:21.964073+00	533e4567-e89b-12d3-a456-426614174014	
403cf1ef-1387-4ac4-92ed-4feafbfc62b7	Pixel 7pro 512g	Pixel 7pro 512g\nhttps://www.facebook.com/share/15q2t7HnmM/	195000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.46169891998012536.jpg}	2025-03-20 07:29:16.639712+00	2025-03-20 07:29:16.639712+00	433e4567-e89b-12d3-a456-426614174013	
85e2fa85-9a69-4677-b55b-8e15bf003c26	FCFA195,000	Très bonne qualité !! \nhttps://www.facebook.com/share/1A3baB3Mgk/	35000.00	35de68ea-7db1-4fb3-bac4-991fccef83e8	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3875166422922882.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7037941967982788.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8710949458762698.jpg}	2025-03-20 07:31:39.100937+00	2025-03-20 07:31:39.100937+00	233e4567-e89b-12d3-a456-426614174011	
67388b50-497b-49cf-b88f-8fe8e1546fbe	Mini caméra de surveillance	Mini caméra de surveillance \n- 5mille\n- 8mille\nLivraison 🚚 possible sur Yaoundé \nhttps://www.facebook.com/share/18beupduNE/	5000.00	d88b79c8-27bf-4a22-8ee0-f83475537608	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5520567775100547.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3703831492507901.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6690304841741077.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6376219199440856.jpg}	2025-03-20 07:33:31.477314+00	2025-03-20 07:33:31.477314+00	333e4567-e89b-12d3-a456-426614174012	
f060e765-224f-496c-bf5e-a09797300a9b	FCFA2,800,000 / Month Rentals	[==VILLA DUPLEX À VENDRE==]\nSur un terrain titré, nous avons :\n\n=Au rez-de-chaussée=>\n- 01 appartement de 02 chambres, 02 douches.\n\n=À l'étage=>\n- 01 villa de 01 salon avec cuisine américaine ouverte sur le salon, 03 chambres, 04 douches, 01 parking de 02 voitures.\n\nLieu : Oyomabang\nSuperficie : 211 Mètres²\n\nPrix : 75.000.000 FCFA\nVille : Yaoundé\n\nPour plus d'informations :\nTéléphone :\n(+237)620.51.82.28 / [hidden information]\n\n#CHEZMCARPEDIEM 	7500000.00	49fb259e-edf2-43c6-b17f-f6aab9fc48ba	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3949871572608612.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8742046476933416.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2065600819028266.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.29624302731122.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9746941955276813.jpg}	2025-03-20 07:36:22.849779+00	2025-03-20 07:36:22.849779+00	b33e4567-e89b-12d3-a456-42661417401a	
d7affd8f-037b-4c36-b192-7684de63ca90	ODZA plaque LNB Maison avendre TITRÉ LOTIS	ODZA PLAQUE LNB \nMAISON AVENDRE TITRÉ LOTIS \nSUPERFICIE 394m2\n4chambres 2douches \nPrix 13millions \nhttps://www.facebook.com/marketplace/item/1129011212330018/	13000000.00	49fb259e-edf2-43c6-b17f-f6aab9fc48ba	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.07540138117975981.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9982714752091155.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.647378240467984.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8907419136733732.jpg}	2025-03-20 07:38:07.645468+00	2025-03-20 07:38:07.645468+00	b33e4567-e89b-12d3-a456-42661417401a	
20a01c01-5089-4955-9431-294a721e6ea0	Série de 6 bols cassables pour événements,maison	Série de 6 bols cassables pour événements,maison\nPaquet de 6 bols cassables  \nhttps://www.facebook.com/share/1UfTZ74ErY/	3500.00	c7914ea3-8197-458e-86bf-180573e0d9b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8447242497982488.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.31375317853654905.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.006988589491334407.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.050960226253122576.jpg}	2025-03-20 07:39:38.447078+00	2025-03-20 07:39:38.447078+00	933e4567-e89b-12d3-a456-426614174018	
c1e91b2b-0d31-4c83-b180-9f5fbfff0a57	Pixel 6A 128gb tout nickel	Comme sur la photo besoin de cash pas de truc \nhttps://www.facebook.com/share/18xgT686z2/	85000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8101229386621347.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.09149728203864216.jpg}	2025-03-20 07:41:36.040758+00	2025-03-20 07:41:36.040758+00	433e4567-e89b-12d3-a456-426614174013	
d275a93c-5ee4-49f8-b42a-6ab13eaea6d0	REDMI NOTE 10 PRO MAX	NB: PROBLÈME DE RÉSEAU INSTABLE MAIS ÇA LIT BIEN LES PUCES\n128/8\nEmpreinte sur le bouton d'allumage\nJe donnes au plus offrant troc possible \nhttps://www.facebook.com/share/1A4E3ZFrBE/\n	25000.00	a9b777a4-8caa-4448-ac25-65e49dd106fe	1255494e-3cea-44b9-ba32-bcf9a38a6262	Fair	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.41041930816069283.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6663442649457227.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.15964137546431045.jpg}	2025-03-20 07:43:47.491037+00	2025-03-20 07:43:47.491037+00	533e4567-e89b-12d3-a456-426614174014	
04179488-1299-4b04-8643-f75fef4a12f4	Triplex avec dépendance à vendre à Nkoabang	Triplex avec dépendance à vendre à Nkoabang composé de : \nEn bas 3 salons une salle à manger une cave à vins une douche une grande cuisine avec un magasin et une chambre avec douche un bureau.\nEn haut 4 chambres 3 douches un salon 2 balcons.\nSous-sol 3 studios modernes et une chambre moderne.\nDépendance une villa de 3 chambres salon, salle à manger, cuisine, 2 douches.\nSuperficie 1000 m2 Titré mutation totale ( le propriétaire a son titre foncier en main ).\nVille Yaoundé\nhttps://www.facebook.com/share/18qnDWN7dq/	14000000.00	49fb259e-edf2-43c6-b17f-f6aab9fc48ba	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4188600949530086.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5384513210382953.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.43496257704893604.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6288749307637347.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.013044333527431728.jpg}	2025-03-20 07:47:17.375303+00	2025-03-20 07:47:17.375303+00	733e4567-e89b-12d3-a456-426614174016	
72ff4c48-7359-4d59-b72c-897a618744c4	 Chairs and bed available	Chairs, bed available at all prices  \nhttps://www.facebook.com/share/15WgZCMLCV/	200000.00	963ebe51-3191-4929-9b75-eb21a3ca47c8	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6547001619784594.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.966559687506727.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2892913943600406.jpg}	2025-03-20 07:49:24.858019+00	2025-03-20 07:49:24.858019+00	433e4567-e89b-12d3-a456-426614174013	
992835a0-aef9-4b2e-839d-353086d73a4a	Dog seller	Home delivery\nhttps://www.facebook.com/share/15wxrV7EZB/	10000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4830054013714902.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7258216341256145.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.1335998626213344.jpg}	2025-03-24 08:28:30.555932+00	2025-03-24 08:28:30.555932+00	833e4567-e89b-12d3-a456-426614174017	
46941cf6-78c0-42ae-817a-0018bbd5af57	Dog pets	Dog pets\nhttps://www.facebook.com/share/1AanEYAHKu/	200000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5288889541295869.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6858357241224082.jpg}	2025-03-24 08:29:38.357083+00	2025-03-24 08:29:38.357083+00	b33e4567-e89b-12d3-a456-42661417401a	
56b0f078-1fad-4599-891f-de75a5925e30	Boerbul et dog de Bordeaux disponible	Boerboul et dog de Bordeaux disponible 100 k males Deja vacciner  \nhttps://www.facebook.com/marketplace/item/828840082767896/	100000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9755553981708676.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.38667311743888133.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.41576325203599795.jpg}	2025-03-24 08:31:13.631006+00	2025-03-24 08:31:13.631006+00	433e4567-e89b-12d3-a456-426614174013	
7789cda7-c425-4dc6-8e93-a23d8bce2451	Dogs	Dogs\nI will like people to know more about the product and use of it \nhttps://www.facebook.com/share/1A1SyycSCp/	200000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.010789279974046773.jpg}	2025-03-24 08:32:13.78379+00	2025-03-24 08:32:13.78379+00	933e4567-e89b-12d3-a456-426614174018	
ff208a4c-6098-4542-a322-a5a966955ff0	Puppies and dogs	Puppies and dogs\nhttps://www.facebook.com/share/1DEAYunVWm/	100000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9830091684310283.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5456767616932392.jpg}	2025-03-24 08:33:15.351881+00	2025-03-24 08:33:15.351881+00	643e4567-e89b-12d3-a456-426614174025	
7ca6e183-c43b-4b0c-86f6-6b4ae02b8b21	Chien	Animaux domestique \nhttps://www.facebook.com/share/18euPyDWPZ/	50000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7359875200755854.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8788707066076218.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9004245670913718.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.931676257863302.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3005762421288982.jpg}	2025-03-24 08:34:53.847373+00	2025-03-24 08:34:53.847373+00	433e4567-e89b-12d3-a456-426614174013	
5e5fa3f1-9517-4fd8-961a-b023472dec8c	Dog  food	Dog  food\nhttps://www.facebook.com/share/1A27RGmpRE/	35000.00	c08fd4d2-e9c5-4804-b91d-1cff440883eb	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9509262224300046.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.40839634419808446.jpg}	2025-03-24 08:36:11.689608+00	2025-03-24 08:36:11.689608+00	923e4567-e89b-12d3-a456-426614174008	
7d26e67f-0b9d-4862-9b73-f1b3122deafb	Boules de décoration	Boules lumineuse utilisée comme veilleuse pour le salon , chambres etc très solide \nhttps://www.facebook.com/share/1UUiuSrT1f/	1000.00	a19b8021-7226-40bb-a6d2-ea07f320a97f	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5997409360095427.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.964612440506494.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8900275885255757.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.049066913153430036.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5391021246715602.jpg}	2025-03-27 06:35:09.070127+00	2025-03-27 06:35:09.070127+00	733e4567-e89b-12d3-a456-426614174016	
cea60ac8-ea90-47b4-853b-ffbd544f37c5	Veste homme bleu nuit de haute couture de 46 à 56	Veste homme bleu nuit de haute couture de 46 à 56\nTrès belle veste bleu nuit de haute couture et très bonne matière taille de 46 à 56 \nhttps://www.facebook.com/share/14rg713Tqn/	35000.00	155b5e60-fb46-4367-a7e7-b194ce9857d0	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.11286499284184615.jpg}	2025-03-28 07:19:25.425446+00	2025-03-28 07:19:25.425446+00	433e4567-e89b-12d3-a456-426614174013	
1f8fd92b-f326-4e8f-8a54-338341fdf789	Scooter	Moto scooter\nhttps://www.facebook.com/share/16NeHYtbh4/	550000.00	ae1a4700-b188-4247-ab6c-2e9a9bb74b3b	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.22781726572298222.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.14299483075538943.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9096059752966199.jpg}	2025-03-27 06:37:32.274615+00	2025-03-27 06:37:32.274615+00	433e4567-e89b-12d3-a456-426614174013	
4eeb2da8-4f24-4b7b-82bb-cd4c1334043a	Machine LG inverter	Machine a laver 6kg \nFaible consommation -20%\nJamais utilisé \n200mil\nhttps://www.facebook.com/share/1AbQRSFKoP/	200000.00	6d769a3c-38df-4555-8487-ab25dd586f4b	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5916431374883644.jpg}	2025-03-27 06:39:03.110283+00	2025-03-27 06:39:03.110283+00	933e4567-e89b-12d3-a456-426614174018	
e0557b91-c46a-4374-bf34-a7f94217aa85	Gourde thermos intelligent	Gourdes thermos intelligent 450ml \n\nDisponible sur place ✨\n\n3000frs \nhttps://www.facebook.com/share/1BNkJVjRX1/	3000.00	c7914ea3-8197-458e-86bf-180573e0d9b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4436340243710766.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.20115603782030678.jpg}	2025-03-27 06:43:38.146702+00	2025-03-27 06:43:38.146702+00	633e4567-e89b-12d3-a456-426614174015	
395bfee3-a9aa-4d6a-a5c8-00d1b7e30f21	Boucle d’oreilles magnétique	1,500frs la paire\n\nAcier inoxydable venu d’Angleterre \nhttps://www.facebook.com/share/12GTM18pW2X/	1500.00	62b92e01-e32f-489a-9be6-727998083e36	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4538140551922005.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6876583059086163.jpg}	2025-03-27 06:46:10.482005+00	2025-03-27 06:46:10.482005+00	733e4567-e89b-12d3-a456-426614174016	
791c6b83-968f-4755-ad56-50d63c839594	Pvc pour sol 30/30	Pvc pour sol 30/30\nhttps://www.facebook.com/share/18vFYb6K6o/	700.00	839cba00-c9f8-4b82-9a21-c149b3059086	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.058533882189338415.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3535569777971459.jpg}	2025-03-27 06:47:11.357111+00	2025-03-27 06:47:11.357111+00	533e4567-e89b-12d3-a456-426614174014	
0701d8df-534f-4aaf-ac43-c51e8f22b214	Je vend mes canapés bien neuf en état 9:10	Je vend mes canapés  suis à Yaoundé odza je me déplace pas [hidden information]\nPrix 75000 avec factures  \nhttps://www.facebook.com/share/1UdNzERKLe/	75000.00	2c730916-b228-415e-b154-dc1572a1e080	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.831053197735709.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5376107728184956.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.41922023440760214.jpg}	2025-03-27 06:48:53.52378+00	2025-03-27 06:48:53.52378+00	b33e4567-e89b-12d3-a456-42661417401a	
7ebd538b-ad77-4cb6-beb1-c6f9d09a7e48	Canapé en cuire 4 places	Canapé en cuire de lux avec facture  \nhttps://www.facebook.com/share/1Bwyb285mb/	200000.00	2c730916-b228-415e-b154-dc1572a1e080	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5847869635671428.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5196318839799254.jpg}	2025-03-27 06:50:45.809604+00	2025-03-27 06:50:45.809604+00	933e4567-e89b-12d3-a456-426614174018	
46ac90e6-a242-40a8-ba58-803d80b16c1f	Recrutement spécial	CARREFOUR MARKET RECRUTE\nniveau CEPE BEPC BACC\nDouala, Yaoundé, bertoua, Bafoussam\ncliquez ici pour postuler\nhttps://wa.me/qr/TJUP27RIQQ4DH1	115000.00	48670832-96fe-4cf2-8772-30a01fe32e39	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8210776757917739.jpg}	2025-03-27 06:52:58.740093+00	2025-03-27 06:52:58.740093+00	923e4567-e89b-12d3-a456-426614174008	
7511db1e-6dba-4600-a3c9-4c701042bf8b	Recherche d'une dame de ménage	Une entreprise situé au carrefour golf recherche une ménagère\nEffectuer les tâches ménagères dans les bureaux et les toilettes\nUn bonus si sachant faire la cuisine\nhttps://www.facebook.com/share/1A5on5nfwT/	65000.00	4ad1dd51-2b45-4d1a-8849-b9cf063a75fc	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5202586437139716.jpg}	2025-03-27 06:54:06.157639+00	2025-03-27 06:54:06.157639+00	833e4567-e89b-12d3-a456-426614174017	
262222d6-1d43-4a6d-82fa-7b341763a4a2	Emploi stable secrétaire	Mon numéro \nWhatsApp et appel : +237 6 96 97 47 73\nNous sommes a Yaoundé et Douala 	80000.00	7b83bdce-3311-4cbf-8827-99e69bd7d918	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3725606242615498.jpg}	2025-03-27 06:55:12.752051+00	2025-03-27 06:55:12.752051+00	433e4567-e89b-12d3-a456-426614174013	
d7111335-e09d-40c4-b67d-4a0da9e2a7b1	Recrutement	Recrutement \nPlacement du personnel \nTon CV numérique \nhttps://www.facebook.com/share/1J3mDBEmKL/	100000.00	12f930ab-71bb-432d-9be3-6ccbc12a5246	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.003257495632391194.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3928088225555373.jpg}	2025-03-27 06:57:51.253335+00	2025-03-27 06:57:51.253335+00	533e4567-e89b-12d3-a456-426614174014	
657ee643-1be1-4987-a9fc-c89e2adc1f00	Inova Fridge for sale/ Réfrigérateur Inova à vendre	Inova Fridge for sale/ Réfrigérateur Inova à vendre\nUsed for a year, in great condition \nhttps://www.facebook.com/share/15LsiL43Ff/	160000.00	130aa7ca-7d6e-4e18-b677-302b6df88b54	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.08222449625554429.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.41129169251971653.jpg}	2025-03-28 07:10:22.935193+00	2025-03-28 07:10:22.935193+00	733e4567-e89b-12d3-a456-426614174016	
f0425dce-a3db-416a-8078-2714df55a639	Paires	Livraison uniquement à Yaoundé et au frais du client\nhttps://www.facebook.com/marketplace/item/653691067129272/	10000.00	d9dcdfa5-3b7f-4b42-9171-2d7b9a123742	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5713483011442997.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8554250160029231.jpg}	2025-03-28 07:11:29.352544+00	2025-03-28 07:11:29.352544+00	733e4567-e89b-12d3-a456-426614174016	
4b8c6b9d-fb1a-41c2-8b0b-8145160fdb76	Moto BLI à vendre	Moto BLI à vendre Yaoundé un mois d'utilisation personnelle \nhttps://www.facebook.com/share/1Yre5aPLKC/	500000.00	c51779d7-47c7-4183-a89c-ea7012a9adda	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6798242212791068.jpg}	2025-03-28 07:12:27.522299+00	2025-03-28 07:12:27.522299+00	433e4567-e89b-12d3-a456-426614174013	
5505bda7-7421-4da2-9a72-f1cb96768810	Chaussures	 Disponible à Yaoundé (ahala barrière )\n\n  Livraison aux frais du clients \nhttps://www.facebook.com/share/1D5FiS24qg/	20000.00	1e619473-4bb9-4db5-9df7-3616f80b36e0	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.2125573051283547.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5770555405022413.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6602928698328614.jpg}	2025-03-28 07:21:52.543828+00	2025-03-28 07:21:52.543828+00	b33e4567-e89b-12d3-a456-42661417401a	
5b2238b2-991c-4bb7-8ab9-e81208ee66fb	Papier peint mural de qualité supérieure	Il est blanc. Fait 10m de long et 50cm de large. Pour recouvrir tt surface, mm les murs humides \nhttps://www.facebook.com/share/15TiWbhF8c/	13000.00	50efc8ae-2b24-4f81-9b6f-ab2121c25ff1	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7081310227387334.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.48948018302050245.jpg}	2025-03-28 07:23:10.144776+00	2025-03-28 07:23:10.144776+00	833e4567-e89b-12d3-a456-426614174017	
5db198c2-4081-4088-85c8-654c13706f91	Borderless monitors	DELL U2414H- LED monitor - 24" - 1920 x 1080 Full HD (1080p) @ 60 Hz - IPS - 250 cd/m² - 1000:1 - 8 ms - HDMI, DisplayPort\nhttps://www.facebook.com/share/163AsJqHfj/	45000.00	f8701023-432f-49ac-bc3c-06b8e6d90f12	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3553647487420539.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.028529182531417563.jpg}	2025-03-28 07:24:27.760812+00	2025-03-28 07:24:27.760812+00	633e4567-e89b-12d3-a456-426614174015	
18b81b39-9ede-4408-97a2-d356f3c2f4b1	Box internet illimitée.orange	La box est gratuitement offerte aux clients qui souscrivent à 3 mois d'abonnement.\n\n14900×3=44700\n\n693329708	14900.00	6940f401-9a72-4cb8-85de-63721b350b15	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.19457607552440503.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.09545936386360787.jpg}	2025-03-28 07:27:27.74422+00	2025-03-28 07:27:27.74422+00	a33e4567-e89b-12d3-a456-426614174019	
f74204a2-e1ae-4f27-ab9c-6f63fd6b50e9	TAPIS 3D Disponible	Le tapis est rond et vu sa rondeur , son diamètre est de 1,8 mètre et nous sommes joignable \nhttps://www.facebook.com/share/1KM4edp2ix/	20000.00	69182bab-4734-4c7b-932e-6aef6230df8e	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5140617992246619.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.37628749773935466.jpg}	2025-04-03 09:03:16.349303+00	2025-04-03 09:03:16.349303+00	733e4567-e89b-12d3-a456-426614174016	
76bbfb62-aa8e-4057-a017-7600290098a2	Chaussure pointure 42 43	Chaussure pointure 42 43	5000.00	1e619473-4bb9-4db5-9df7-3616f80b36e0	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5340782904327621.jpg}	2025-04-03 09:04:24.784393+00	2025-04-03 09:04:24.784393+00	633e4567-e89b-12d3-a456-426614174015	
35674373-4984-44a7-8f74-53544737c5b2	Appareils photos 📷 professionnels	Appareils photos 📷 professionnels de marque NIKON : \n\nNIKON D5200\n\nNIKON D3200\n\nVisible à Yaoundé Bastos ancien CAMTEL	150000.00	6ec7f73a-5855-44c7-ae2f-654173f82630	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8503527871179575.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.002806463159051198.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.0553744841204058.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6713527018567549.jpg}	2025-04-03 09:06:22.221036+00	2025-04-03 09:06:22.221036+00	633e4567-e89b-12d3-a456-426614174015	
d8c87cf5-7fe1-4d71-8b3e-a605429306b3	 Tv 43 pouces	Tv d’origine 43 pouces nickel 75000fcfa Yaounde\nhttps://www.facebook.com/share/1YUpVeqQuC/	75000.00	eef68e23-d3f2-4cd8-92e0-630bce5a5042	1255494e-3cea-44b9-ba32-bcf9a38a6262	Fair	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.32956992913048433.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5982596160111036.jpg}	2025-04-03 09:09:47.914334+00	2025-04-03 09:09:47.914334+00	833e4567-e89b-12d3-a456-426614174017	
84548dfd-f043-496f-8cd7-760d61112c5c	Lexus RX 350 2007	Occasion, État satisfaisant, Prix ouvert à la négociation\nFairly used \nGood condition \nPrice negotiable\nhttps://www.facebook.com/share/18hBF4kVhJ/	1000000.00	930bba5b-5181-4add-9e3c-7285c372c4b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9394157971848587.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5541128568877791.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.11927454321837128.jpg}	2025-04-03 09:36:24.724575+00	2025-04-03 09:36:24.724575+00	633e4567-e89b-12d3-a456-426614174015	
e59b6d9a-6530-4120-972d-72e9e9b5785b	iPhone 7+ 128gb provenance des États Unis 🇺🇸 en solde🍎	iPhone 7+ 128gb provenance des États Unis 🇺🇸 en solde🍎\nhttps://www.facebook.com/share/1AQwctfRHL/	30000.00	5b0502fe-3601-448d-9ed7-81853e873782	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9013343406531971.jpg}	2025-04-03 09:37:53.161919+00	2025-04-03 09:37:53.161919+00	b33e4567-e89b-12d3-a456-42661417401a	
e2a03e53-fa98-4b94-9658-789423d6c436	Je Brade mon Véhicule Toyota Célica St-i acheté en Juillet 2019	Véhicule en très bon état. Il y'a juste la vitre de la portière côté chauffeur qui s'est brisée, suite à un projectile lancé par un enfant qui cueillait les Mangues. Cette vitre coûte 30.000 Fr à Mvog-Ada.\n\nJe suis à Yaoundé Simbok\nhttps://www.facebook.com/share/1AAmsJApcw/	800000.00	930bba5b-5181-4add-9e3c-7285c372c4b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	Used	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6559443920243289.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3777399220954334.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4945279032716188.jpg}	2025-04-03 09:40:25.339005+00	2025-04-03 09:40:25.339005+00	933e4567-e89b-12d3-a456-426614174018	
d5c74977-1fca-409f-8e5e-d609838b6070	Chaussures homme	Chaussures homme\nhttps://www.facebook.com/share/15QLQx2Cvs/	15000.00	8055a395-e8ca-4d13-a64b-15c0bab45fa2	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.06657636870267059.jpg}	2025-04-03 09:41:57.689063+00	2025-04-03 09:41:57.689063+00	933e4567-e89b-12d3-a456-426614174018	
a100c079-9cda-4275-93c4-cded4c486ae9	Pantalon monsieur anglais	Pantalon monsieur anglais\nhttps://www.facebook.com/share/15vYkQWdAv/	5000.00	19ac5843-499e-4e98-910a-198bde653d0a	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.27666177286527427.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.17077070308712394.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9290345314401312.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7068273362534971.jpg}	2025-04-03 09:43:53.834494+00	2025-04-03 09:43:53.834494+00	533e4567-e89b-12d3-a456-426614174014	
b130ab63-cbdb-4cd4-8020-7d26658b2da1	GRAND POTS +PALMIER ARTIFICIELLE	✅️ PRIX UNIQUE DE 55MIL \n✅️ HYPER SOLIDE,  INCASSABLE \n✅️POT+PLANTE 1M90 DE HAUT.\n✅️YAOUNDE//DOUALA \n✅️INTÉRIEUR ET EXTÉRIEUR \nhttps://www.facebook.com/share/1G5fB6hAZv/	55000.00	a19b8021-7226-40bb-a6d2-ea07f320a97f	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.050731698915995604.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.19879311831418067.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.31296866295169234.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.826953255239756.jpg}	2025-04-03 09:46:09.598552+00	2025-04-03 09:46:09.598552+00	433e4567-e89b-12d3-a456-426614174013	
72e9ef13-382f-4ec7-b09b-01f1ef326c8e	Game boy	Game comportant plus de 1000 jeux Disponible \nhttps://www.facebook.com/share/1CKQQ3dMYd/	45000.00	ae833af1-fa61-4244-83c1-d87a180922bf	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7260270390855379.jpg}	2025-04-03 09:48:09.928989+00	2025-04-03 09:48:09.928989+00	733e4567-e89b-12d3-a456-426614174016	
bf8c9e4a-ebe9-4168-b2aa-64e3a9328bc0	Machine à laver 8kg	Machine à laver 8kg\n8kg de marquer Siemens  \nhttps://www.facebook.com/share/18DtwYu2SP/	180000.00	130aa7ca-7d6e-4e18-b677-302b6df88b54	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8814500029136318.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8990140847740242.jpg}	2025-04-03 09:50:43.363471+00	2025-04-03 09:50:43.363471+00	633e4567-e89b-12d3-a456-426614174015	
f9b0b795-066b-4997-988d-722648d6e176	TV 45'' SMART ANDROID	Solde 45'' Smart Android 110mil non négociable facture et accessoires  téléviseur neuf vendu en boutique 654288900 	110000.00	eef68e23-d3f2-4cd8-92e0-630bce5a5042	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7337040586125518.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4745152166728175.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.6475044970564503.jpg}	2025-04-03 09:54:04.704424+00	2025-04-03 09:54:04.704424+00	433e4567-e89b-12d3-a456-426614174013	
cbf1a175-0f6e-48e2-bd0f-53e6b98bd604	MacBook Pro 2018	je vends mon MacBook Pro 2018, 16db de ram , 256gb , i7, je veux le cash , origine : USA, \nNB: non discutable!!!!!!\nhttps://www.facebook.com/share/1827jUiLZL/	200000.00	f5cc0abb-422d-4023-8bbd-f81c32904b15	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.49387522173853204.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5673787941115109.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.21059201411853157.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.926274572482511.jpg}	2025-04-03 09:56:37.471003+00	2025-04-03 09:56:37.471003+00	433e4567-e89b-12d3-a456-426614174013	
695014a9-bf20-47d1-9b7e-8da31984ad7d	Ps3 ultra slip	Ps3 ultra slim \nDéjà tuiner avec les jeux à l’intérieur \n(Blur, call of duty, pro , army of two, dragon ball Z etc…)\nVendu avec ces deux manettes et les câbles d’alimentation\nhttps://www.facebook.com/share/p/1B6GFCt4xt/	65000.00	1d69478f-094d-4b8b-a431-38285f77b448	1255494e-3cea-44b9-ba32-bcf9a38a6262	Used	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.43690815871128597.jpg}	2025-04-04 08:59:24.429195+00	2025-04-04 08:59:24.429195+00	733e4567-e89b-12d3-a456-426614174016	
6a2b8d36-2213-4f56-bbb1-815180126c3c	Ps vita slim	Je brade ma vita slim encore propre 32go tunée avec de grands jeux (god of War collection, killzone, fifa19, résident evil, soul sacrifice, wipeout…) [hidden information] chapelle Nsimeyon\nhttps://www.facebook.com/share/167shWaM7v/	55000.00	1d69478f-094d-4b8b-a431-38285f77b448	1255494e-3cea-44b9-ba32-bcf9a38a6262	Used	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3823752279224779.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.40727787021247175.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.23695829000146507.jpg}	2025-04-04 09:03:22.800598+00	2025-04-04 09:03:22.800598+00	633e4567-e89b-12d3-a456-426614174015	
21a34b7a-d3b7-495c-8bbe-6479615fdab5	iPhone XR	Fast deal\nMémoire 64gb \nFace ID oki \nTrue Tone oki \nPas de troc \niPhone XR \nBesoin d’argent un directement \nhttps://www.facebook.com/share/p/1DfBHsUK8Z/	90000.00	5b0502fe-3601-448d-9ed7-81853e873782	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.949167090509317.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.07275090962226849.jpg}	2025-04-04 09:04:35.66506+00	2025-04-04 09:04:35.66506+00	633e4567-e89b-12d3-a456-426614174015	
c6fc9bb4-95c2-4b7f-a851-5852de5bc94e	Climatiseur	Climatiseur à vendre \nhttps://www.facebook.com/share/p/16Lsigrbe5/	90000.00	753e253c-b3c7-463e-aaa7-d72cc61422bb	1255494e-3cea-44b9-ba32-bcf9a38a6262	Fair	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.27690060739739075.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.10764435676451178.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.02127210428871118.jpg}	2025-04-04 09:11:24.783915+00	2025-04-04 09:11:24.783915+00	733e4567-e89b-12d3-a456-426614174016	
7f837e92-889f-4437-a5a0-04b4c91fe1c9	Accroche bijoux	Accroche bijoux\nhttps://www.facebook.com/share/1RtVZLouV9/	1500.00	5af080a0-2370-4dba-a5a3-c45d72e26e1a	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.056686647468335405.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8125227521821532.jpg}	2025-04-04 09:12:36.229037+00	2025-04-04 09:12:36.229037+00	833e4567-e89b-12d3-a456-426614174017	
3ca14412-991b-45f9-abf4-3d68e243d301	Chaisse de Bureau	Chaisse de Bureau\nhttps://www.facebook.com/share/1FLcSx9gbq/	70000.00	cd7d7e2e-7c24-49f2-b534-e7d6166372bc	1255494e-3cea-44b9-ba32-bcf9a38a6262	Like New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.8767110402444913.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.5171651486701352.jpg}	2025-04-04 09:46:09.896998+00	2025-04-04 09:46:09.896998+00	733e4567-e89b-12d3-a456-426614174016	
886e2adc-f166-4a9b-ba60-50bed13c3eb0	Réfrigérateur et frigo Innova 120L	Réfrigérateur et frigo Innova 120L\nINNOVA-IN135-Réfrigérateur et frigo  120L- 2Battants \nhttps://www.facebook.com/marketplace/item/1336833364237155/	90000.00	c7914ea3-8197-458e-86bf-180573e0d9b7	1255494e-3cea-44b9-ba32-bcf9a38a6262	Good	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7744360726020323.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.26641011521640934.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.355838280830453.jpg}	2025-04-04 09:51:20.796629+00	2025-04-04 09:51:20.796629+00	533e4567-e89b-12d3-a456-426614174014	
f5e1456a-d5e2-4244-a0ea-ed6f4ff324c2	Vidéo projecteur en promo	Où sont les enseignants???\nUtilisateur de canal plus???\nProjecteur de vidéo et film\n\nVidéo projecteur en vente à partir de 45000F marque Epson Hitachi Sony Alcatel etc... pour présentation et soutenance\n☎️☎️☎️    Tel :   [hidden information]  //\n     [hidden information]   Appel & Whatsapp \n\nTouchez juste ici SVP pour nous contacter 👇\nwa.me/237652117117 \n\nArrivage des vidéos projecteurs\nPrend hdmi vga video usb\nSmart\n\n👉👉Très forte image\n☑️☑️Grand écran\n👉👉Bonne résolution\nImage limpide \nPresque neuf ✅️✅️\n\n🚴🚴🚴 Livré avec tous ses câbles\n\nTouchez juste ici SVP pour nous contacter 👇👇👇\nwa.me/237652117117\nJe vend à  bon prix \nViens chercher en face de camtel dakwa Douala ou au marché mvog beti Yaoundé \nBonjour.  Veuillez mentionner votre numéro svp pour que nous puissions vous joindre \nNotre contact :\nMtn   [hidden information]\nOrange [hidden information]\nTouchez ici👇👇👇pour nous contacter par whatsapp \nwa.me/237652117117	45000.00	6560083a-3c21-43b6-9848-45ef2c303baa	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.759366950474771.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.3226855181955759.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.27344260690419897.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.840880962016192.jpg}	2025-04-07 10:41:05.128119+00	2025-04-07 10:41:05.128119+00	733e4567-e89b-12d3-a456-426614174016	
aa7d18ec-1b20-40db-adf8-93c732aa247d	Projecteur EPSON	Projecteur EPSON \nTrès bonne résolution \nTout les port disponibles \n\n\nPrix cadeaux :80.000fcfa\nLieu:yaoundé-camairco (MFOUNDI MALL)\nhttps://www.facebook.com/share/12JmrWwqH5s/	80000.00	6560083a-3c21-43b6-9848-45ef2c303baa	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.9336290947425443.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.7856360605779038.jpg}	2025-04-07 10:42:36.548896+00	2025-04-07 10:42:36.548896+00	a33e4567-e89b-12d3-a456-426614174019	
8d71f38b-8ad5-414d-b77c-0c1642e715d0	Vidéo projecteur qui éclairent même en journée 	Vidéo Projecteur d’origine américaine qui produit des images très nette même avec la lumière du jour.\nQue ce soit pour la projection des matchs, des conférences, des soirées Ciné…\n\nNous avons le projecteur qu’il vous faut. \nPlusieurs marque disponibles ( Casio, Epson, NEC …) \n\nPossible de les connecter au décodeur, ordinateur…\n\nTel/Whatsapp: 693””17””11””67\nNous sommes à Yaoundé et à Douala 	65000.00	6560083a-3c21-43b6-9848-45ef2c303baa	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.08397891530073498.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.057555296857188964.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.4012710440400358.jpg,https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.47343731727101634.jpg}	2025-04-07 10:44:49.774353+00	2025-04-07 10:44:49.774353+00	733e4567-e89b-12d3-a456-426614174016	
2cf515ca-c22a-47a7-a9f2-908f1fc56498	Vidéoprojecteur SMART 🔥 Marque: XNANO X1 Définition: 1080p Intensité: 300 ANSI	Vidéoprojecteur SMART 🔥 Marque: XNANO X1 Définition: 1080p Intensité: 300 ANSI\nYaoundé marché central \n\nVidéo projecteur professionnel \nVidéoprojecteur SMART 🔥\n\nMarque: XNANO X1\n\nDéfinition: 1080p\n\nIntensité: 300 ANSI\n\nProcesseur: T972 Quad-core ARM Cortex-A55\n\nRAM 2Go/16Go ROM \n\nAndroid 9.0\n\nConnectique: WIFI, BLUETOOTH, HDMI, USB...\n\n _*Prix: 150.000F*\nhttps://www.facebook.com/share/16ADP7TeKt/	15000.00	2af6afbc-853b-4487-996d-d7629ef381d6	1255494e-3cea-44b9-ba32-bcf9a38a6262	New	{https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/listing_images/1255494e-3cea-44b9-ba32-bcf9a38a6262/0.19091071902411272.jpg}	2025-04-07 10:46:47.832206+00	2025-04-07 10:46:47.832206+00	633e4567-e89b-12d3-a456-426614174015	
\.


--
-- TOC entry 3900 (class 0 OID 36140)
-- Dependencies: 298
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, slug, parent_id, type, created_at) FROM stdin;
123e4567-e89b-12d3-a456-426614174000	Douala	douala	\N	town	2025-02-27 09:55:44.475205+00
223e4567-e89b-12d3-a456-426614174001	Yaoundé	yaounde	\N	town	2025-02-27 09:55:44.475205+00
323e4567-e89b-12d3-a456-426614174002	Bamenda	bamenda	\N	town	2025-02-27 09:55:44.475205+00
423e4567-e89b-12d3-a456-426614174003	Bafoussam	bafoussam	\N	town	2025-02-27 09:55:44.475205+00
523e4567-e89b-12d3-a456-426614174004	Maroua	maroua	\N	town	2025-02-27 09:55:44.475205+00
623e4567-e89b-12d3-a456-426614174005	Garoua	garoua	\N	town	2025-02-27 09:55:44.475205+00
723e4567-e89b-12d3-a456-426614174006	Buea	buea	\N	town	2025-02-27 09:55:44.475205+00
823e4567-e89b-12d3-a456-426614174007	Bonanjo	bonanjo	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
923e4567-e89b-12d3-a456-426614174008	Deido	deido	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
a23e4567-e89b-12d3-a456-426614174009	New Bell	new-bell	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
b23e4567-e89b-12d3-a456-42661417400a	Akwa	akwa	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
c23e4567-e89b-12d3-a456-42661417400b	Bonapriso	bonapriso	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
d23e4567-e89b-12d3-a456-42661417400c	Makepe	makepe	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
e23e4567-e89b-12d3-a456-42661417400d	Ndokoti	ndokoti	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
f23e4567-e89b-12d3-a456-42661417400e	Logbaba	logbaba	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
023e4567-e89b-12d3-a456-42661417400f	Youpwé	youpwe	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
133e4567-e89b-12d3-a456-426614174010	Kotto	kotto	123e4567-e89b-12d3-a456-426614174000	quarter	2025-02-27 09:55:44.475205+00
233e4567-e89b-12d3-a456-426614174011	Bastos	bastos	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
333e4567-e89b-12d3-a456-426614174012	Mvog-Mbi	mvog-mbi	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
433e4567-e89b-12d3-a456-426614174013	Biyem-Assi	biyem-assi	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
533e4567-e89b-12d3-a456-426614174014	Mvan	mvan	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
633e4567-e89b-12d3-a456-426614174015	Nsimeyong	nsimeyong	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
733e4567-e89b-12d3-a456-426614174016	Ekounou	ekounou	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
833e4567-e89b-12d3-a456-426614174017	Etoudi	etoudi	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
933e4567-e89b-12d3-a456-426614174018	Mendong	mendong	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
a33e4567-e89b-12d3-a456-426614174019	Odza	odza	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
b33e4567-e89b-12d3-a456-42661417401a	Ngoa-Ekelle	ngoa-ekelle	223e4567-e89b-12d3-a456-426614174001	quarter	2025-02-27 09:55:44.475205+00
c33e4567-e89b-12d3-a456-42661417401b	Up Station	up-station	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
d33e4567-e89b-12d3-a456-42661417401c	Nkwen	nkwen	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
e33e4567-e89b-12d3-a456-42661417401d	Mankon	mankon	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
f33e4567-e89b-12d3-a456-42661417401e	Old Town	old-town	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
043e4567-e89b-12d3-a456-42661417401f	Mile 4	mile-4	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
143e4567-e89b-12d3-a456-426614174020	Bambui	bambui	323e4567-e89b-12d3-a456-426614174002	quarter	2025-02-27 09:55:44.475205+00
243e4567-e89b-12d3-a456-426614174021	Tamdja	tamdja	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
343e4567-e89b-12d3-a456-426614174022	Tougang	tougang	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
443e4567-e89b-12d3-a456-426614174023	Kamkop	kamkop	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
543e4567-e89b-12d3-a456-426614174024	Djeleng	djeleng	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
643e4567-e89b-12d3-a456-426614174025	Banengo	banengo	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
743e4567-e89b-12d3-a456-426614174026	Baleng	baleng	423e4567-e89b-12d3-a456-426614174003	quarter	2025-02-27 09:55:44.475205+00
843e4567-e89b-12d3-a456-426614174027	Domayo	domayo	523e4567-e89b-12d3-a456-426614174004	quarter	2025-02-27 09:55:44.475205+00
943e4567-e89b-12d3-a456-426614174028	Pitoaré	pitoare	523e4567-e89b-12d3-a456-426614174004	quarter	2025-02-27 09:55:44.475205+00
a43e4567-e89b-12d3-a456-426614174029	Doualaré	doualare	523e4567-e89b-12d3-a456-426614174004	quarter	2025-02-27 09:55:44.475205+00
b43e4567-e89b-12d3-a456-42661417402a	Zokok	zokok	523e4567-e89b-12d3-a456-426614174004	quarter	2025-02-27 09:55:44.475205+00
c43e4567-e89b-12d3-a456-42661417402b	Palar	palar	623e4567-e89b-12d3-a456-426614174005	quarter	2025-02-27 09:55:44.475205+00
d43e4567-e89b-12d3-a456-42661417402c	Pitoa	pitoa	623e4567-e89b-12d3-a456-426614174005	quarter	2025-02-27 09:55:44.475205+00
e43e4567-e89b-12d3-a456-42661417402d	Djamboutou	djamboutou	623e4567-e89b-12d3-a456-426614174005	quarter	2025-02-27 09:55:44.475205+00
f43e4567-e89b-12d3-a456-42661417402e	Roumde Adjia	roumde-adjia	623e4567-e89b-12d3-a456-426614174005	quarter	2025-02-27 09:55:44.475205+00
053e4567-e89b-12d3-a456-42661417402f	Molyko	molyko	723e4567-e89b-12d3-a456-426614174006	quarter	2025-02-27 09:55:44.475205+00
153e4567-e89b-12d3-a456-426614174030	Checkpoint	checkpoint	723e4567-e89b-12d3-a456-426614174006	quarter	2025-02-27 09:55:44.475205+00
253e4567-e89b-12d3-a456-426614174031	Great Soppo	great-soppo	723e4567-e89b-12d3-a456-426614174006	quarter	2025-02-27 09:55:44.475205+00
353e4567-e89b-12d3-a456-426614174032	Bokwaongo	bokwaongo	723e4567-e89b-12d3-a456-426614174006	quarter	2025-02-27 09:55:44.475205+00
\.


--
-- TOC entry 3896 (class 0 OID 29095)
-- Dependencies: 287
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, full_name, avatar_url, bio, location, created_at, updated_at, phone_number) FROM stdin;
ec75acc2-575b-45df-8de7-162abc33216d	johndoe	John Doe	\N	Professional photographer with 10 years of experience	New York NY	2024-02-24 10:00:00+00	2024-02-24 10:00:00+00	\N
64a1046b-159a-4b7c-828b-4670addf0caa	jm	john mary	https://odsjblbrzgzfdsyjymib.supabase.co/storage/v1/object/public/profile_images/64a1046b-159a-4b7c-828b-4670addf0caa/1741008101431.png			2025-03-03 13:21:06.041+00	2025-03-03 13:21:41.431+00	\N
1adbfc3b-6597-46ae-b020-35cd417418f3	smith	Anonymous User	\N	\N	\N	2025-03-10 06:40:54.507+00	2025-03-10 06:40:54.507+00	\N
1255494e-3cea-44b9-ba32-bcf9a38a6262	astrideevans	Astride Evans	\N	\N	\N	2025-04-04 08:04:38.075+00	2025-04-04 08:04:38.075+00	\N
\.


--
-- TOC entry 3899 (class 0 OID 29147)
-- Dependencies: 290
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, listing_id, reviewer_id, rating, comment, helpful_count, created_at, parent_id, is_reply) FROM stdin;
de9df7a4-b454-4dd0-aed5-c37de1b734fc	aa780df9-374b-4685-845a-0cf24e07c665	1adbfc3b-6597-46ae-b020-35cd417418f3	0	lets do this	0	2025-03-01 18:39:50.731838+00	\N	f
4576ff4d-0261-4fe2-9cef-f25e36750446	90fc4c64-a3d6-4d97-9341-07de24439bb1	1adbfc3b-6597-46ae-b020-35cd417418f3	5	asdf	0	2025-03-03 07:59:28.310027+00	\N	f
\.


--
-- TOC entry 3692 (class 2606 OID 36137)
-- Name: categories categories_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_id_key UNIQUE (id);


--
-- TOC entry 3695 (class 2606 OID 29119)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3698 (class 2606 OID 29121)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 3703 (class 2606 OID 29136)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- TOC entry 3711 (class 2606 OID 36149)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 3713 (class 2606 OID 36151)
-- Name: locations locations_slug_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_slug_type_key UNIQUE (slug, type);


--
-- TOC entry 3688 (class 2606 OID 29103)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3690 (class 2606 OID 29105)
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- TOC entry 3707 (class 2606 OID 29157)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3693 (class 1259 OID 36186)
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- TOC entry 3696 (class 1259 OID 36187)
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- TOC entry 3699 (class 1259 OID 38557)
-- Name: idx_listings_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_listings_location_id ON public.listings USING btree (location_id);


--
-- TOC entry 3700 (class 1259 OID 29168)
-- Name: listings_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_category_id_idx ON public.listings USING btree (category_id);


--
-- TOC entry 3701 (class 1259 OID 38673)
-- Name: listings_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_location_id_idx ON public.listings USING btree (location_id);


--
-- TOC entry 3704 (class 1259 OID 29169)
-- Name: listings_seller_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_seller_id_idx ON public.listings USING btree (seller_id);


--
-- TOC entry 3709 (class 1259 OID 36162)
-- Name: locations_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX locations_parent_id_idx ON public.locations USING btree (parent_id);


--
-- TOC entry 3705 (class 1259 OID 29170)
-- Name: reviews_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_listing_id_idx ON public.reviews USING btree (listing_id);


--
-- TOC entry 3708 (class 1259 OID 29171)
-- Name: reviews_reviewer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_reviewer_id_idx ON public.reviews USING btree (reviewer_id);


--
-- TOC entry 3715 (class 2606 OID 29122)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3716 (class 2606 OID 38552)
-- Name: listings fk_listing_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT fk_listing_location FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- TOC entry 3717 (class 2606 OID 29137)
-- Name: listings listings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3718 (class 2606 OID 41115)
-- Name: listings listings_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- TOC entry 3719 (class 2606 OID 29142)
-- Name: listings listings_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id);


--
-- TOC entry 3723 (class 2606 OID 41110)
-- Name: locations locations_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- TOC entry 3714 (class 2606 OID 29106)
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3720 (class 2606 OID 29158)
-- Name: reviews reviews_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- TOC entry 3721 (class 2606 OID 38824)
-- Name: reviews reviews_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- TOC entry 3722 (class 2606 OID 29163)
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id);


--
-- TOC entry 3891 (class 3256 OID 38674)
-- Name: listings Authenticated users can create listings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (((auth.uid() = seller_id) AND ((location_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.locations
  WHERE (locations.id = listings.location_id))))));


--
-- TOC entry 3880 (class 3256 OID 29180)
-- Name: reviews Authenticated users can create reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK ((auth.uid() = reviewer_id));


--
-- TOC entry 3883 (class 3256 OID 36188)
-- Name: categories Categories are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);


--
-- TOC entry 3890 (class 3256 OID 38605)
-- Name: listings Enable delete for users based on seller_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on seller_id" ON public.listings FOR DELETE TO authenticated USING ((auth.uid() = seller_id));


--
-- TOC entry 3888 (class 3256 OID 38603)
-- Name: listings Enable insert for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users" ON public.listings FOR INSERT TO authenticated WITH CHECK ((auth.uid() = seller_id));


--
-- TOC entry 3887 (class 3256 OID 38602)
-- Name: listings Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.listings FOR SELECT USING (true);


--
-- TOC entry 3889 (class 3256 OID 38604)
-- Name: listings Enable update for users based on seller_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on seller_id" ON public.listings FOR UPDATE TO authenticated USING ((auth.uid() = seller_id)) WITH CHECK ((auth.uid() = seller_id));


--
-- TOC entry 3892 (class 3256 OID 38675)
-- Name: listings Listings are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (true);


--
-- TOC entry 3884 (class 3256 OID 38422)
-- Name: locations Locations are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Locations are viewable by everyone" ON public.locations FOR SELECT USING (true);


--
-- TOC entry 3885 (class 3256 OID 29172)
-- Name: profiles Public profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- TOC entry 3879 (class 3256 OID 29179)
-- Name: reviews Reviews are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);


--
-- TOC entry 3894 (class 3256 OID 38677)
-- Name: listings Users can delete own listings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own listings" ON public.listings FOR DELETE TO authenticated USING ((auth.uid() = seller_id));


--
-- TOC entry 3882 (class 3256 OID 29182)
-- Name: reviews Users can delete own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING ((auth.uid() = reviewer_id));


--
-- TOC entry 3878 (class 3256 OID 29173)
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- TOC entry 3893 (class 3256 OID 38676)
-- Name: listings Users can update own listings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own listings" ON public.listings FOR UPDATE TO authenticated USING ((auth.uid() = seller_id)) WITH CHECK ((auth.uid() = seller_id));


--
-- TOC entry 3886 (class 3256 OID 29174)
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- TOC entry 3881 (class 3256 OID 29181)
-- Name: reviews Users can update own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING ((auth.uid() = reviewer_id));


--
-- TOC entry 3874 (class 0 OID 29111)
-- Dependencies: 288
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3875 (class 0 OID 29127)
-- Dependencies: 289
-- Name: listings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3877 (class 0 OID 36140)
-- Dependencies: 298
-- Name: locations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3873 (class 0 OID 29095)
-- Dependencies: 287
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3876 (class 0 OID 29147)
-- Dependencies: 290
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 531
-- Name: FUNCTION get_listing_rating(listing_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_listing_rating(listing_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_listing_rating(listing_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_listing_rating(listing_id uuid) TO service_role;


--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO service_role;


--
-- TOC entry 3910 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE listings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.listings TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.listings TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.listings TO service_role;


--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.locations TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.locations TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.locations TO service_role;


--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO service_role;


--
-- TOC entry 3913 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.reviews TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.reviews TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.reviews TO service_role;


--
-- TOC entry 2472 (class 826 OID 16484)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2473 (class 826 OID 16485)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2471 (class 826 OID 16483)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2475 (class 826 OID 16487)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2470 (class 826 OID 16482)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2474 (class 826 OID 16486)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


-- Completed on 2025-04-07 11:58:13

--
-- PostgreSQL database dump complete
--

