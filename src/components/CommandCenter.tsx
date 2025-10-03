import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen } from "lucide-react";
import { VoiceInterface } from "./VoiceInterface";

interface CommandCenterProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function CommandCenter({ currentSpaceId }: CommandCenterProps) {
  const currentSpace = useQuery(
    api.spaces.getSpaceById,
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const documents = useQuery(api.documents.getUserDocuments, {
    spaceId: currentSpaceId ?? undefined,
  });

  const getDistrictName = () => {
    if (currentSpace) {
      return currentSpace.name;
    }
    return "Plaquemine Parish Schools"; // Default demo district
  };

  const getDistrictInitials = () => {
    const name = getDistrictName();
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* The Voice of Your District */}
      <Card className="flex-1 flex flex-col shadow-md">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="font-bold text-primary-foreground bg-primary text-lg">
                {getDistrictInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">
                {getDistrictName()}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Knowledge Base: Active
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <VoiceInterface
            currentSpaceId={currentSpaceId}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Source Documents List */}
      <Card className="flex-1 min-h-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Official Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-accent/5"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {doc.fileName}
                    </p>
                    <p className="text-xs truncate text-muted-foreground">
                      {doc.contentType} • {(doc.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                    Indexed
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-muted">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">
                  No documents uploaded
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload district documents to build your knowledge base
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
