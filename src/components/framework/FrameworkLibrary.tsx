import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";
import { FrameworkCard } from "./FrameworkCard";
import { FrameworkFilters } from "./FrameworkFilters";
import { FrameworkDetail } from "./FrameworkDetail";
import { LoadingSpinner } from "../shared/LoadingStates";
import { EmptyStateNoResults } from "../shared/EmptyState";
import { toast } from "sonner";
import { spacing } from "@/lib/spacing";

type ViewMode = "grid" | "list";
type ModuleFilter = "all" | "ai-basics-hub" | "instructional-expert-hub";

export function FrameworkLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  // Queries
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {
    module: moduleFilter === "all" ? undefined : moduleFilter as "ai-basics-hub" | "instructional-expert-hub",
    status: "published"
  });
  
  const searchResults = useQuery(
    api.frameworks.searchFrameworks,
    searchQuery ? { query: searchQuery } : "skip"
  );

  const savedFrameworks = useQuery(api.frameworks.getUserSavedFrameworks);
  const userProfile = useQuery(api.userProfiles.getUserProfile);

  // Mutations (disabled when not authenticated)
  const recordUsage = useMutation(api.frameworks.recordFrameworkUsage);
  const saveFramework = useMutation(api.frameworks.saveFramework);
  const unsaveFramework = useMutation(api.frameworks.unsaveFramework);

  // Use search results if searching, otherwise use filtered frameworks
  const displayFrameworks = searchQuery ? searchResults || [] : frameworks || [];

  // Apply additional filters
  const filteredFrameworks = displayFrameworks.filter((framework) => {
    if (categoryFilter !== "all" && framework.category !== categoryFilter) return false;
    if (difficultyFilter !== "all" && (framework as any).difficultyLevel !== difficultyFilter) return false;
    return true;
  });

  // Get unique categories and difficulties for filter options
  const categories = Array.from(new Set(frameworks?.map(f => f.category) || []));
  const difficulties = Array.from(new Set(frameworks?.map(f => f.difficultyLevel) || []));

  const handleFrameworkAction = (frameworkId: string, action: "view" | "copy" | "save" | "unsave" | "tried") => {
    const performAction = async () => {
      try {
        // Find the framework by frameworkId (the string ID like "AIB-001")
        const framework = frameworks?.find(f => f.frameworkId === frameworkId);
        if (!framework) {
          console.error("Framework not found:", frameworkId);
          toast.error("Framework not found. Please try again.");
          return;
        }

        switch (action) {
          case "view":
            await recordUsage({ 
              frameworkId: framework._id, 
              action: "viewed" 
            });
            break;
          case "copy":
            await recordUsage({ 
              frameworkId: framework._id, 
              action: "copied_prompt" 
            });
            toast.success("Prompt copied to clipboard!");
            break;
          case "save":
            await saveFramework({ frameworkId: framework._id });
            toast.success("Framework saved!");
            break;
          case "unsave":
            await unsaveFramework({ frameworkId: framework._id });
            toast.success("Framework removed from saved!");
            break;
          case "tried":
            await recordUsage({ 
              frameworkId: framework._id, 
              action: "marked_tried" 
            });
            toast.success("Marked as tried!");
            break;
        }
      } catch (error) {
        console.error("Error performing action:", error);
        toast.error("Failed to perform action. Please try again.");
      }
    };

    void performAction();
  };

  const handleViewFramework = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    handleFrameworkAction(frameworkId, "view");
  };

  const isFrameworkSaved = (frameworkId: string) => {
    return savedFrameworks?.includes(frameworkId as any) || false;
  };

  // Track recently viewed frameworks in localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("pelican_recently_viewed_frameworks");
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {
        setRecentlyViewed([]);
      }
    }
  }, []);

  const handleViewFrameworkWithTracking = (frameworkId: string) => {
    // Add to recently viewed
    const updated = [frameworkId, ...recentlyViewed.filter(id => id !== frameworkId)].slice(0, 5);
    setRecentlyViewed(updated);
    localStorage.setItem("pelican_recently_viewed_frameworks", JSON.stringify(updated));
    handleViewFramework(frameworkId);
  };

  // Get personalized recommendations based on user profile
  const recommendedFrameworks = useMemo(() => {
    if (!userProfile?.subject || !frameworks) return [];
    
    // Filter frameworks that match user's subject (via tags or category)
    return frameworks
      .filter(framework => {
        const subjectLower = userProfile.subject?.toLowerCase() || "";
        const categoryLower = framework.category?.toLowerCase() || "";
        const tagsLower = framework.tags?.map(t => t.toLowerCase()).join(" ") || "";
        const challengeLower = framework.challenge?.toLowerCase() || "";
        
        // Check if subject appears in category, tags, or challenge
        return categoryLower.includes(subjectLower) || 
               tagsLower.includes(subjectLower) ||
               challengeLower.includes(subjectLower);
      })
      .slice(0, 3); // Limit to top 3 recommendations
  }, [userProfile, frameworks]);

  // Get recently viewed frameworks
  const recentlyViewedFrameworks = useMemo(() => {
    if (!frameworks || recentlyViewed.length === 0) return [];
    return recentlyViewed
      .map(id => frameworks.find(f => f.frameworkId === id))
      .filter((f): f is NonNullable<typeof f> => f !== undefined)
      .slice(0, 3);
  }, [frameworks, recentlyViewed]);

  // Get suggested next steps based on recently viewed
  const suggestedNextSteps = useMemo(() => {
    if (!frameworks || recentlyViewedFrameworks.length === 0) return [];
    
    // Get categories and difficulty levels from recently viewed
    const viewedCategories = new Set(recentlyViewedFrameworks.map(f => f.category));
    const viewedDifficulties = new Set(recentlyViewedFrameworks.map(f => f.difficultyLevel));
    const viewedIds = new Set(recentlyViewedFrameworks.map(f => f.frameworkId));
    
    // Suggest frameworks in similar categories or next difficulty level
    return frameworks
      .filter(f => !viewedIds.has(f.frameworkId))
      .filter(f => {
        // Match same category or next difficulty level
        return viewedCategories.has(f.category) || 
               (viewedDifficulties.has("beginner") && f.difficultyLevel === "intermediate") ||
               (viewedDifficulties.has("intermediate") && f.difficultyLevel === "advanced");
      })
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 2);
  }, [frameworks, recentlyViewedFrameworks]);

  if (frameworks === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner size="md" />
          <span>Loading frameworks...</span>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">Framework Library</h1>
              <p className="text-muted-foreground mt-2 text-base">
                Browse AI guidance frameworks designed for Louisiana educators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredFrameworks.length} framework{filteredFrameworks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Personalized Recommendations Banner */}
        {userProfile?.subject && recommendedFrameworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground font-heading">
                      Personalized for {userProfile.subject} Teachers
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      These frameworks are popular with educators teaching {userProfile.subject}
                      {userProfile.gradeLevel && ` at ${userProfile.gradeLevel} level`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recommendedFrameworks.map((fw) => (
                        <Button
                          key={fw._id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFramework(fw.frameworkId)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {fw.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewedFrameworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  Recently Viewed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentlyViewedFrameworks.map((fw) => (
                    <Button
                      key={fw._id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFrameworkWithTracking(fw.frameworkId)}
                      className="flex items-center gap-1"
                    >
                      {fw.title}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suggested Next Steps */}
        {suggestedNextSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suggested Next Steps
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Continue your learning journey with these recommended frameworks
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {suggestedNextSteps.map((fw) => (
                    <Button
                      key={fw._id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFrameworkWithTracking(fw.frameworkId)}
                      className="flex items-center gap-1"
                    >
                      {fw.title}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Personalized Recommendations Banner */}
        {userProfile?.subject && recommendedFrameworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Personalized for {userProfile.subject} Teachers
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      These frameworks are used by educators teaching {userProfile.subject}
                      {userProfile.gradeLevel && ` at ${userProfile.gradeLevel} level`}
                    </p>
                    {recommendedFrameworks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {recommendedFrameworks.map((fw) => (
                          <Button
                            key={fw._id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFramework(fw.frameworkId)}
                            className="flex items-center gap-1"
                          >
                            {fw.title}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className={`flex flex-col lg:flex-row ${spacing.gridGap}`}>
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className={spacing.cardContent}>
                  <FrameworkFilters
                    moduleFilter={moduleFilter}
                    categoryFilter={categoryFilter}
                    difficultyFilter={difficultyFilter}
                    onModuleChange={(value) => setModuleFilter(value as ModuleFilter)}
                    onCategoryChange={setCategoryFilter}
                    onDifficultyChange={setDifficultyFilter}
                    categories={categories}
                    difficulties={difficulties}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search and View Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-11"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-11"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Module Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ButtonGroup>
                <Button
                  variant={moduleFilter === "all" ? "default" : "outline"}
                  onClick={() => setModuleFilter("all")}
                  className="h-11"
                >
                  All Frameworks
                </Button>
                <Button
                  variant={moduleFilter === "ai-basics-hub" ? "default" : "outline"}
                  onClick={() => setModuleFilter("ai-basics-hub")}
                  className="h-11"
                >
                  AI Basics Hub
                </Button>
                <Button
                  variant={moduleFilter === "instructional-expert-hub" ? "default" : "outline"}
                  onClick={() => setModuleFilter("instructional-expert-hub")}
                  className="h-11"
                >
                  Instructional Expert Hub
                </Button>
              </ButtonGroup>
            </motion.div>

            {/* Results */}
            {filteredFrameworks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      No frameworks match "{searchQuery}"
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try searching for: "lesson planning", "assessment", "parent communication"
                    </p>
                    <Button onClick={() => setSearchQuery("")} variant="outline">
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to explore frameworks?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start with these popular frameworks for Louisiana educators:
                    </p>
                    {frameworks && frameworks.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {frameworks
                          .filter(fw => fw.usageCount > 0 || fw.averageRating)
                          .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
                          .slice(0, 3)
                          .map((fw) => (
                            <Button
                              key={fw._id}
                              variant="outline"
                              onClick={() => handleViewFrameworkWithTracking(fw.frameworkId)}
                            >
                              {fw.title}
                            </Button>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={
                  viewMode === "grid" 
                    ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.gridGap}`
                    : "space-y-4"
                }
              >
                {filteredFrameworks.map((framework, index) => (
                  <motion.div
                    key={framework._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <FrameworkCard
                      framework={framework as any}
                      variant={viewMode}
                      userSubject={userProfile?.subject}
                      subjectUsageCount={undefined} // TODO: Add backend query for usage by subject
                      isSaved={isFrameworkSaved(framework._id)}
                      onView={() => handleViewFrameworkWithTracking(framework.frameworkId)}
                      onSave={() => handleFrameworkAction(framework.frameworkId, "save")}
                      onUnsave={() => handleFrameworkAction(framework.frameworkId, "unsave")}
                      onCopy={() => handleFrameworkAction(framework.frameworkId, "copy")}
                      onTried={() => handleFrameworkAction(framework.frameworkId, "tried")}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Framework Detail Modal */}
      {selectedFramework && (
        <FrameworkDetail
          frameworkId={selectedFramework}
          onClose={() => setSelectedFramework(null)}
          onAction={handleFrameworkAction}
          isSaved={isFrameworkSaved(selectedFramework)}
        />
      )}
    </div>
  );
}
