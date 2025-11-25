import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";

export interface Standard {
  code: string;
  description: string;
  gradeLevel: string;
  subject: string;
  strand?: string;
  cognitiveDepth?: string;
}

interface StandardsDisplayProps {
  standards: Standard[];
}

export function StandardsDisplay({ standards }: StandardsDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStandards = standards.filter((standard) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      standard.code.toLowerCase().includes(query) ||
      standard.description.toLowerCase().includes(query) ||
      (standard.strand && standard.strand.toLowerCase().includes(query))
    );
  });

  if (standards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-8">
            No standards available for this subject and grade level.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Relevant Louisiana Standards
        </CardTitle>
        <CardDescription>
          {standards.length} standard{standards.length !== 1 ? "s" : ""} found for this subject and grade level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search standards by code, description, or strand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredStandards.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No standards match your search query.
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredStandards.map((standard, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{standard.code}</span>
                      {standard.cognitiveDepth && (
                        <Badge variant="outline" className="text-xs">
                          {standard.cognitiveDepth}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                    {standard.strand && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {standard.strand}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

