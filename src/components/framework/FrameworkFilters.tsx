import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Target } from "lucide-react";

interface FrameworkFiltersProps {
  moduleFilter: string;
  categoryFilter: string;
  difficultyFilter: string;
  lerDomainFilter: string;
  louisianaStandardsFilter: string;
  onModuleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onLerDomainChange: (value: string) => void;
  onLouisianaStandardsChange: (value: string) => void;
  categories: string[];
  difficulties: string[];
  lerDomains: string[];
  hasLouisianaStandards: boolean;
}

export function FrameworkFilters({
  moduleFilter,
  categoryFilter,
  difficultyFilter,
  lerDomainFilter,
  louisianaStandardsFilter,
  onModuleChange,
  onCategoryChange,
  onDifficultyChange,
  onLerDomainChange,
  onLouisianaStandardsChange,
  categories,
  difficulties,
  lerDomains,
  hasLouisianaStandards
}: FrameworkFiltersProps) {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Target className="h-3 w-3" />;
      case "intermediate":
        return <GraduationCap className="h-3 w-3" />;
      case "advanced":
        return <BookOpen className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Module Filter */}
      <div className="space-y-2">
        <Label>Module</Label>
        <Select value={moduleFilter} onValueChange={onModuleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="ai-basics-hub">AI Basics Hub</SelectItem>
            <SelectItem value="instructional-expert-hub">Instructional Expert Hub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty Filter */}
      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                <div className="flex items-center gap-2">
                  {getDifficultyIcon(difficulty)}
                  <span className="capitalize">{difficulty}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LER Domain Filter */}
      {lerDomains.length > 0 && (
        <div className="space-y-2">
          <Label>LER Domain</Label>
          <Select value={lerDomainFilter} onValueChange={onLerDomainChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select LER domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {lerDomains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3 w-3" />
                    <span>{domain}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Louisiana Standards Filter */}
      <div className="space-y-2">
        <Label>Louisiana Standards</Label>
        <Select value={louisianaStandardsFilter} onValueChange={onLouisianaStandardsChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by standards alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="aligned">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3" />
                <span>Louisiana Standards Aligned</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {(moduleFilter !== "all" || categoryFilter !== "all" || difficultyFilter !== "all" || lerDomainFilter !== "all" || louisianaStandardsFilter !== "all") && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {moduleFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {moduleFilter === "ai-basics-hub" ? "AI Basics Hub" : "Instructional Expert Hub"}
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="outline">
                {categoryFilter.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            )}
            {difficultyFilter !== "all" && (
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${getDifficultyColor(difficultyFilter)}`}
              >
                {getDifficultyIcon(difficultyFilter)}
                <span className="capitalize">{difficultyFilter}</span>
              </Badge>
            )}
            {lerDomainFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                <GraduationCap className="h-3 w-3" />
                {lerDomainFilter}
              </Badge>
            )}
            {louisianaStandardsFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                <Target className="h-3 w-3" />
                LA Standards Aligned
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {(moduleFilter !== "all" || categoryFilter !== "all" || difficultyFilter !== "all" || lerDomainFilter !== "all" || louisianaStandardsFilter !== "all") && (
        <div className="pt-2">
          <button
            onClick={() => {
              onModuleChange("all");
              onCategoryChange("all");
              onDifficultyChange("all");
              onLerDomainChange("all");
              onLouisianaStandardsChange("all");
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
