import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Lightbulb,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { InnovationCard } from "./InnovationCard";
import { InnovationForm } from "./InnovationForm";
import { cn } from "@/lib/utils";

type FilterType = "all" | "recent" | "popular" | "my-innovations";
type SortType = "newest" | "oldest" | "most-liked" | "most-tried";

export function InnovationList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [showForm, setShowForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Queries
  const innovations = useQuery(api.innovations.getRecentInnovations, { limit: 50 });
  const userInnovations = useQuery(api.innovations.getUserInnovations, { limit: 50 });

  // Filter and sort innovations
  const filteredInnovations = React.useMemo(() => {
    if (!innovations) return [];

    let filtered = [...innovations];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((innovation: any) =>
        innovation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        innovation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        innovation.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filter
    switch (filter) {
      case "recent": {
        // Show only last 7 days
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(innovation => innovation.createdAt > weekAgo);
        break;
      }
      case "popular": {
        // Show only innovations with 5+ likes or 3+ tries
        filtered = filtered.filter(innovation => 
          innovation.likes >= 5 || innovation.triesCount >= 3
        );
        break;
      }
      case "my-innovations": {
        if (userInnovations) {
          const userInnovationIds = new Set(userInnovations.map((i: any) => i._id));
          filtered = filtered.filter((innovation: any) => userInnovationIds.has(innovation._id));
        } else {
          filtered = [];
        }
        break;
      }
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter((innovation: any) => 
        innovation.tags.includes(selectedTag)
      );
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "most-tried":
        filtered.sort((a, b) => b.triesCount - a.triesCount);
        break;
    }

    return filtered;
  }, [innovations, userInnovations, searchQuery, filter, sort, selectedTag]);

  // Get all unique tags for filtering
  const allTags = React.useMemo(() => {
    if (!innovations) return [];
    const tagSet = new Set<string>();
    innovations.forEach((innovation: any) => {
      innovation.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [innovations]);

  const handleFormSuccess = () => {
    setShowForm(false);
    // The list will automatically refresh due to Convex reactivity
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Innovations</h1>
          <p className="text-muted-foreground mt-1">
            Discover creative AI use cases shared by Louisiana educators
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Share Innovation
        </Button>
      </div>

      {/* Innovation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <InnovationForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search innovations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", icon: Lightbulb },
                { id: "recent", label: "Recent", icon: Clock },
                { id: "popular", label: "Popular", icon: TrendingUp },
                { id: "my-innovations", label: "My Innovations", icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={filter === id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(id as FilterType)}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Sort and Tag Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="most-tried">Most Tried</option>
                </select>
              </div>

              {allTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Filter by tag:</span>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant={selectedTag === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(null)}
                    >
                      All
                    </Button>
                    {allTags.slice(0, 8).map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                    {allTags.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{allTags.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredInnovations.length} innovation{filteredInnovations.length !== 1 ? 's' : ''} found
        </p>
        {(searchQuery || selectedTag) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(null);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Innovations List */}
      {filteredInnovations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No innovations found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || selectedTag
                ? "Try adjusting your search terms or filters"
                : "Be the first to share an innovation with the community!"
              }
            </p>
            {!searchQuery && !selectedTag && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Share Your First Innovation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInnovations.map((innovation) => (
            <InnovationCard
              key={innovation._id}
              innovation={innovation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
