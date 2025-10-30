import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Lightbulb,
  TrendingUp,
  Clock,
  Users,
  MessageSquare
} from "lucide-react";
import { InnovationCard } from "./InnovationCard";
import { InnovationForm } from "./InnovationForm";
import { TestimonialForm } from "./TestimonialForm";
import { EmptyStateNoResults } from "../shared/EmptyState";
import { spacing } from "@/lib/spacing";

type FilterType = "all" | "recent" | "popular" | "my-innovations";
type SortType = "newest" | "oldest" | "most-liked" | "most-tried";

export function InnovationList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [showForm, setShowForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className={`min-h-screen ${spacing.sectionGap}`}>
      {/* Header */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="border-b border-border bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Community Innovations</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Discover creative AI use cases shared by Louisiana educators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowTestimonialForm(true)} 
                variant="outline" 
                className="flex items-center gap-2 h-11"
              >
                <MessageSquare className="h-4 w-4" />
                Submit Testimonial
              </Button>
              <Button 
                onClick={() => setShowForm(true)} 
                className="flex items-center gap-2 h-11"
              >
                <Plus className="h-4 w-4" />
                Share Innovation
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Innovation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <InnovationForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <TestimonialForm
              onSuccess={() => setShowTestimonialForm(false)}
              onCancel={() => setShowTestimonialForm(false)}
            />
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
        {/* Filters and Search */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className={spacing.card}>
              <div className={spacing.sectionGapSmall}>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search innovations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-primary/20 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Filter Tabs */}
                <ButtonGroup>
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
                </ButtonGroup>

                {/* Sort and Tag Filters */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortType)}
                      className="px-3 py-2 h-9 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
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
        </motion.div>

        {/* Results Count */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
        >
          <p className="text-sm text-muted-foreground font-medium">
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
        </motion.div>

        {/* Innovations List */}
        {filteredInnovations.length === 0 ? (
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20">
              <CardContent className={spacing.card}>
                <EmptyStateNoResults
                  title="No innovations found"
                  description={
                    searchQuery || selectedTag
                      ? "Try adjusting your search terms or filters"
                      : "Be the first to share an innovation with the community!"
                  }
                  action={
                    !searchQuery && !selectedTag ? (
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Share Your First Innovation
                      </Button>
                    ) : undefined
                  }
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerChildren}
            className={`grid grid-cols-1 lg:grid-cols-2 ${spacing.gridGap}`}
          >
            {filteredInnovations.map((innovation, index) => (
              <motion.div
                key={innovation._id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <InnovationCard
                  innovation={innovation}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
