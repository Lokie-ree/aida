import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Queries
  const innovations = useQuery(api.innovations.getRecentInnovations, { limit: 50 });
  const userInnovations = useQuery(api.innovations.getUserInnovations, { limit: 50 });
  const userProfile = useQuery(api.userProfiles.getUserProfile);

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

    // Apply subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((innovation: any) => 
        innovation.subject.toLowerCase() === selectedSubject.toLowerCase()
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
  }, [innovations, userInnovations, searchQuery, filter, sort, selectedTag, selectedSubject]);

  // Get all unique tags for filtering
  const allTags = React.useMemo(() => {
    if (!innovations) return [];
    const tagSet = new Set<string>();
    innovations.forEach((innovation: any) => {
      innovation.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [innovations]);

  // Get all unique subjects for filtering
  const uniqueSubjects = React.useMemo(() => {
    if (!innovations) return [];
    const subjectSet = new Set<string>();
    innovations.forEach((innovation: any) => {
      if (innovation.subject) {
        subjectSet.add(innovation.subject);
      }
    });
    return Array.from(subjectSet).sort();
  }, [innovations]);

  const handleFormSuccess = () => {
    setShowForm(false);
    // The list will automatically refresh due to Convex reactivity
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">Community Innovations</h1>
              <p className="text-muted-foreground mt-2 text-base">
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

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
          <CardContent className={spacing.card}>
            <div className="space-y-4">
            {/* Subject Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-primary/20">
              <Button
                variant={selectedSubject === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject("all")}
              >
                All Subjects
              </Button>
              {userProfile?.subject && (
                <Button
                  variant={selectedSubject === userProfile.subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(userProfile.subject!)}
                  className="bg-primary/10 hover:bg-primary/20"
                >
                  {userProfile.subject} (My Subject)
                </Button>
              )}
              {uniqueSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>

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
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          {filteredInnovations.length} innovation{filteredInnovations.length !== 1 ? 's' : ''} found
        </p>
        {(searchQuery || selectedTag || selectedSubject !== "all") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(null);
              setSelectedSubject("all");
            }}
            className="h-9"
          >
            Clear Filters
          </Button>
        )}
      </motion.div>

      {/* Success Stories Section */}
      {innovations && innovations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          {(() => {
            // Get success stories: innovations with highest triesCount or likes
            const successStories = [...(innovations || [])]
              .filter((inv: any) => inv.triesCount >= 3 || inv.likes >= 5)
              .sort((a: any, b: any) => (b.triesCount + b.likes) - (a.triesCount + a.likes))
              .slice(0, 3);
            
            if (successStories.length === 0) return null;
            
            return (
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                      Success Stories: High-Impact Innovations
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    These innovations have helped multiple Louisiana educators save time and improve teaching
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {successStories.map((story: any) => (
                      <Card key={story._id} className="hover:shadow-lg transition-shadow bg-background">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 line-clamp-1 text-sm">{story.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {story.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{story.triesCount} tried</span>
                            </div>
                            {story.timeSaved && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>~{story.timeSaved} min saved</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </motion.div>
      )}

      {/* Innovations List */}
      {filteredInnovations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <Lightbulb className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
            {searchQuery || selectedTag || selectedSubject !== "all" ? (
              <>
                <h3 className="text-xl font-semibold mb-2">No innovations found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or be the first to share something in this category!
                </p>
                <Button 
                  onClick={() => { 
                    setSearchQuery(""); 
                    setSelectedTag(null); 
                    setSelectedSubject("all");
                    setShowForm(true); 
                  }}
                >
                  Share an Innovation
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">
                  Help Build the Louisiana Educator Community
                </h3>
                <p className="text-muted-foreground mb-2">
                  Share how you're using AI in your classroom and help fellow educators discover new possibilities.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Your innovation could help hundreds of Louisiana educators save time and improve their teaching.
                </p>
                <Button onClick={() => setShowForm(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Share Your First Innovation
                </Button>
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`grid grid-cols-1 lg:grid-cols-2 ${spacing.gridGap}`}
        >
          {filteredInnovations.map((innovation, index) => (
            <motion.div
              key={innovation._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
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
