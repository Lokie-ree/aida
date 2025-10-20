import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Clock, 
  Star,
  Copy,
  Check,
  Heart,
  Bookmark
} from "lucide-react";
import { FrameworkCard } from "./FrameworkCard";
import { FrameworkFilters } from "./FrameworkFilters";
import { FrameworkDetail } from "./FrameworkDetail";
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
  const [showFilters, setShowFilters] = useState(false);

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
    if (difficultyFilter !== "all" && framework.difficultyLevel !== difficultyFilter) return false;
    return true;
  });

  // Get unique categories and difficulties for filter options
  const categories = Array.from(new Set(frameworks?.map(f => f.category) || []));
  const difficulties = Array.from(new Set(frameworks?.map(f => f.difficultyLevel) || []));

  const handleFrameworkAction = (frameworkId: string, action: "view" | "copy" | "save" | "unsave" | "tried") => {
    const performAction = async () => {
      try {
        switch (action) {
          case "view":
            await recordUsage({ 
              frameworkId: frameworkId as Id<"frameworks">, 
              action: "viewed" 
            });
            break;
          case "copy":
            await recordUsage({ 
              frameworkId: frameworkId as Id<"frameworks">, 
              action: "copied_prompt" 
            });
            toast.success("Prompt copied to clipboard!");
            break;
          case "save":
            await saveFramework({ frameworkId: frameworkId as Id<"frameworks"> });
            toast.success("Framework saved!");
            break;
          case "unsave":
            await unsaveFramework({ frameworkId: frameworkId as Id<"frameworks"> });
            toast.success("Framework removed from saved!");
            break;
          case "tried":
            await recordUsage({ 
              frameworkId: frameworkId as Id<"frameworks">, 
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
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading frameworks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Framework Library</h1>
              <p className="text-muted-foreground mt-1">
                Browse AI guidance frameworks designed for Louisiana educators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredFrameworks.length} frameworks
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FrameworkFilters
                  moduleFilter={moduleFilter}
                  categoryFilter={categoryFilter}
                  difficultyFilter={difficultyFilter}
                  onModuleChange={setModuleFilter}
                  onCategoryChange={setCategoryFilter}
                  onDifficultyChange={setDifficultyFilter}
                  categories={categories}
                  difficulties={difficulties}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Module Tabs */}
            <div className="flex gap-2">
              <Button
                variant={moduleFilter === "all" ? "default" : "outline"}
                onClick={() => setModuleFilter("all")}
              >
                All Frameworks
              </Button>
              <Button
                variant={moduleFilter === "ai-basics-hub" ? "default" : "outline"}
                onClick={() => setModuleFilter("ai-basics-hub")}
              >
                AI Basics Hub
              </Button>
              <Button
                variant={moduleFilter === "instructional-expert-hub" ? "default" : "outline"}
                onClick={() => setModuleFilter("instructional-expert-hub")}
              >
                Instructional Expert Hub
              </Button>
            </div>

            {/* Results */}
            {filteredFrameworks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No frameworks found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery 
                      ? "Try adjusting your search terms or filters"
                      : "No frameworks match your current filters"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredFrameworks.map((framework) => (
                  <FrameworkCard
                    key={framework._id}
                    framework={framework}
                    variant={viewMode}
                    isSaved={isFrameworkSaved(framework._id)}
                    onView={() => handleViewFramework(framework.frameworkId)}
                    onSave={() => handleFrameworkAction(framework._id, "save")}
                    onUnsave={() => handleFrameworkAction(framework._id, "unsave")}
                    onCopy={() => handleFrameworkAction(framework._id, "copy")}
                    onTried={() => handleFrameworkAction(framework._id, "tried")}
                  />
                ))}
              </div>
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
