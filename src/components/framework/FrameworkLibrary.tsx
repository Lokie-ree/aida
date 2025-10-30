import { useState } from "react";
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
} from "lucide-react";
import { FrameworkCard } from "./FrameworkCard";
import { FrameworkFilters } from "./FrameworkFilters";
import { FrameworkDetail } from "./FrameworkDetail";
import { LoadingSpinner } from "../shared/LoadingStates";
import { EmptyStateNoResults } from "../shared/EmptyState";
import { spacing } from "@/lib/spacing";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Framework Library</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Browse AI guidance frameworks designed for Louisiana educators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {filteredFrameworks.length} framework{filteredFrameworks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
        <div className={`flex flex-col lg:flex-row ${spacing.gridGap}`}>
          {/* Filters Sidebar */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="lg:w-64"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className={spacing.cardHeader}>
                <CardTitle className="flex items-center gap-2 text-lg font-heading">
                  <Filter className="h-5 w-5 text-primary" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className={`${spacing.cardContent} space-y-4`}>
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

          {/* Main Content */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className={`flex-1 ${spacing.sectionGap}`}
          >
            {/* Search and View Controls */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-primary/20 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <ButtonGroup>
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
                </ButtonGroup>
              </div>
            </motion.div>

            {/* Module Tabs */}
            <motion.div variants={fadeInUp}>
              <ButtonGroup>
                <Button
                  variant={moduleFilter === "all" ? "default" : "outline"}
                  onClick={() => setModuleFilter("all")}
                  size="sm"
                >
                  All Frameworks
                </Button>
                <Button
                  variant={moduleFilter === "ai-basics-hub" ? "default" : "outline"}
                  onClick={() => setModuleFilter("ai-basics-hub")}
                  size="sm"
                >
                  AI Basics Hub
                </Button>
                <Button
                  variant={moduleFilter === "instructional-expert-hub" ? "default" : "outline"}
                  onClick={() => setModuleFilter("instructional-expert-hub")}
                  size="sm"
                >
                  Instructional Expert Hub
                </Button>
              </ButtonGroup>
            </motion.div>

            {/* Results */}
            {filteredFrameworks.length === 0 ? (
              <motion.div variants={fadeInUp}>
                <Card className="border-primary/20">
                  <CardContent className={spacing.card}>
                    <EmptyStateNoResults
                      title="No frameworks found"
                      description={
                        searchQuery 
                          ? "Try adjusting your search terms or filters"
                          : "No frameworks match your current filters"
                      }
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                variants={staggerChildren}
                className={
                  viewMode === "grid" 
                    ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.gridGap}`
                    : `space-y-4`
                }
              >
                {filteredFrameworks.map((framework, index) => (
                  <motion.div
                    key={framework._id}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FrameworkCard
                      framework={framework as any}
                      variant={viewMode}
                      isSaved={isFrameworkSaved(framework._id)}
                      onView={() => handleViewFramework(framework.frameworkId)}
                      onSave={() => handleFrameworkAction(framework.frameworkId, "save")}
                      onUnsave={() => handleFrameworkAction(framework.frameworkId, "unsave")}
                      onCopy={() => handleFrameworkAction(framework.frameworkId, "copy")}
                      onTried={() => handleFrameworkAction(framework.frameworkId, "tried")}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
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
