"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HierarchicalItem {
  id: number;
  name: string;
  level: number;
  children?: HierarchicalItem[];
  parent?: HierarchicalItem;
}

interface HierarchicalDropdownProps {
  items: HierarchicalItem[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function HierarchicalDropdown({
  items,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: HierarchicalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Flatten items for search and display
  const flattenItems = (items: HierarchicalItem[], level = 0): HierarchicalItem[] => {
    const flattened: HierarchicalItem[] = [];
    items.forEach(item => {
      flattened.push({ ...item, level });
      if (item.children && item.children.length > 0) {
        flattened.push(...flattenItems(item.children, level + 1));
      }
    });
    return flattened;
  };

  const flattenedItems = flattenItems(items);

  // Filter items based on search term
  const filteredItems = searchTerm
    ? flattenedItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flattenedItems;

  // Find selected item
  const selectedItem = flattenedItems.find(item => item.id === value);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleItemClick = (item: HierarchicalItem) => {
    onChange(item.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getIndentationStyle = (level: number) => {
    return {
      paddingLeft: `${level * 20 + 12}px`,
    };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 text-left border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground",
          "flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="truncate">
          {selectedItem ? (
            <span className="flex items-center">
              <span className="text-muted-foreground mr-2">
                {"  ".repeat(selectedItem.level)}
                {selectedItem.level > 0 && "├─ "}
              </span>
              {selectedItem.name}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          {/* Items List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No categories found
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                    "flex items-center justify-between",
                    value === item.id && "bg-accent text-accent-foreground"
                  )}
                  style={getIndentationStyle(item.level)}
                >
                  <span className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      {item.level > 0 && "├─ "}
                    </span>
                    {item.name}
                  </span>
                  {value === item.id && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

