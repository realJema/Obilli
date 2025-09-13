"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
  level?: number;
}

interface CategoryTreeProps {
  categories: CategoryNode[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  placeholder?: string;
  className?: string;
}

export function CategoryTree({
  categories,
  selectedId,
  onSelect,
  placeholder = "Select a category",
  className,
}: CategoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Flatten categories for search
  const flattenCategories = (nodes: CategoryNode[]): CategoryNode[] => {
    const flattened: CategoryNode[] = [];
    const traverse = (nodes: CategoryNode[], level = 0) => {
      nodes.forEach(node => {
        flattened.push({ ...node, level });
        if (node.children) {
          traverse(node.children, level + 1);
        }
      });
    };
    traverse(nodes);
    return flattened;
  };

  const allCategories = flattenCategories(categories);
  const filteredCategories = searchTerm
    ? allCategories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allCategories;

  const toggleExpanded = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (nodeId: number) => {
    onSelect(nodeId);
    // Close the tree after selection
    setExpandedNodes(new Set());
  };

  // const selectedCategory = allCategories.find(cat => cat.id === selectedId);

  // Get the full path of the selected category
  const getCategoryPath = (nodeId: number): string[] => {
    const findPath = (nodes: CategoryNode[], targetId: number, path: string[] = []): string[] | null => {
      for (const node of nodes) {
        const currentPath = [...path, node.name];
        if (node.id === targetId) {
          return currentPath;
        }
        if (node.children) {
          const found = findPath(node.children, targetId, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findPath(categories, nodeId) || [];
  };

  const selectedPath = selectedId ? getCategoryPath(selectedId) : [];

  // Check if a parent category has any selected children
  const hasSelectedChildren = (node: CategoryNode): boolean => {
    if (selectedId === node.id) return true;
    if (node.children) {
      return node.children.some(child => hasSelectedChildren(child));
    }
    return false;
  };

  const renderNode = (node: CategoryNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedId === node.id;
    const hasSelectedChild = hasSelectedChildren(node);

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground"
          )}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(node.id);
            } else {
              handleNodeClick(node.id);
            }
          }}
        >
          {hasChildren && (
            <div className="mr-2 p-1">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <span className="flex-1 text-sm font-medium">{node.name}</span>
          
          {(isSelected || hasSelectedChild) && (
            <Check className="h-4 w-4 ml-2 text-primary" />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!searchTerm) return null;

    return (
      <div className="border-t border-border">
        <div className="p-2 text-xs text-muted-foreground">
          Search results ({filteredCategories.length})
        </div>
        {filteredCategories.map(category => {
          // Find the original category node to check for selected children
          const findCategoryNode = (nodes: CategoryNode[], id: number): CategoryNode | null => {
            for (const node of nodes) {
              if (node.id === id) return node;
              if (node.children) {
                const found = findCategoryNode(node.children, id);
                if (found) return found;
              }
            }
            return null;
          };
          
          const categoryNode = findCategoryNode(categories, category.id);
          const hasSelectedChild = categoryNode ? hasSelectedChildren(categoryNode) : false;
          const isSelected = selectedId === category.id;

          return (
            <div
              key={category.id}
              className={cn(
                "flex items-center py-2 px-3 cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selectedId === category.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleNodeClick(category.id)}
            >
              <span className="flex-1 text-sm">
                {"  ".repeat(category.level || 0)}
                {category.level && category.level > 0 && "├─ "}
                {category.name}
              </span>
              {(isSelected || hasSelectedChild) && (
                <Check className="h-4 w-4 ml-2 text-primary" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("border border-border rounded-md bg-background", className)}>
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Select Category</h3>
          <div className="flex items-center space-x-1">
            {selectedId && (
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="p-1 hover:bg-accent rounded"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Selected Category Path */}
        {selectedPath.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Selected:</span>
            <div className="flex items-center space-x-1">
              {selectedPath.map((part, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
                  <span className={cn(
                    "px-2 py-1 rounded bg-accent/50",
                    index === selectedPath.length - 1 && "bg-primary/20 text-primary font-medium"
                  )}>
                    {part}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b border-border">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pr-8 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tree View */}
      <div className="max-h-80 overflow-y-auto">
        {searchTerm ? (
          renderSearchResults()
        ) : (
          <div className="p-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {placeholder}
              </div>
            ) : (
              <div>
                {categories.map(category => renderNode(category))}
                
                {/* Show selected category path when tree is collapsed */}
                {selectedPath.length > 0 && expandedNodes.size === 0 && (
                  <div className="mt-4 p-3 bg-accent/30 rounded-md border border-accent">
                    <div className="text-xs text-muted-foreground mb-1">Selected Category:</div>
                    <div className="flex items-center space-x-1 text-sm">
                      {selectedPath.map((part, index) => (
                        <div key={index} className="flex items-center">
                          {index > 0 && <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground" />}
                          <span className={cn(
                            "px-2 py-1 rounded",
                            index === selectedPath.length - 1 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "bg-accent text-accent-foreground"
                          )}>
                            {part}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
