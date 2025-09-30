import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, Shield, Users } from "lucide-react";
import { VoiceInterface } from "./VoiceInterface";
import { designTokens } from "@/lib/design-tokens";

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
    <div className="space-y-6 h-full flex flex-col">
      {/* District Context Header */}
      <Card 
        className="border-2"
        style={{
          borderColor: `${designTokens.colors.primary.blue}20`
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback 
                className="font-bold text-white"
                style={{
                  backgroundColor: designTokens.colors.primary.blue,
                  fontSize: designTokens.typography.fontSize.lg[0]
                }}
              >
                {getDistrictInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 
                className="font-bold truncate"
                style={{ 
                  fontSize: designTokens.typography.fontSize.xl[0],
                  color: designTokens.colors.primary.blue
                }}
              >
                {getDistrictName()}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: designTokens.colors.primary.green }}
                ></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: designTokens.colors.neutral[600] }}
                >
                  Knowledge Base: Active
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* The Voice Orb (The Main Event) */}
      <Card 
        className="border-2 flex-1 flex flex-col"
        style={{
          borderColor: `${designTokens.colors.secondary.purple}20`
        }}
      >
        <CardHeader className="text-center pb-2">
          <CardTitle 
            className="text-xl font-bold"
            style={{ color: designTokens.colors.primary.blue }}
          >
            The Voice of Your District
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <VoiceInterface
            currentSpaceId={currentSpaceId}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Source Documents List */}
      <Card 
        className="border-2 flex-1 min-h-0"
        style={{
          borderColor: `${designTokens.colors.primary.green}20`
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle 
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: designTokens.colors.primary.green }}
          >
            <BookOpen className="w-5 h-5" />
            Official Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50"
                  style={{
                    borderColor: designTokens.colors.neutral[200]
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${designTokens.colors.primary.blue}10`
                    }}
                  >
                    <FileText 
                      className="w-4 h-4" 
                      style={{ color: designTokens.colors.primary.blue }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="font-medium truncate text-sm"
                      style={{ color: designTokens.colors.neutral[800] }}
                    >
                      {doc.fileName}
                    </p>
                    <p 
                      className="text-xs truncate"
                      style={{ color: designTokens.colors.neutral[500] }}
                    >
                      {doc.contentType} • {(doc.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${designTokens.colors.primary.green}10`,
                      color: designTokens.colors.primary.green,
                      border: `1px solid ${designTokens.colors.primary.green}20`
                    }}
                  >
                    Indexed
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                  style={{
                    backgroundColor: `${designTokens.colors.neutral[200]}50`
                  }}
                >
                  <FileText 
                    className="w-6 h-6" 
                    style={{ color: designTokens.colors.neutral[400] }}
                  />
                </div>
                <p 
                  className="text-sm font-medium mb-1"
                  style={{ color: designTokens.colors.neutral[600] }}
                >
                  No documents uploaded
                </p>
                <p 
                  className="text-xs"
                  style={{ color: designTokens.colors.neutral[500] }}
                >
                  Upload district documents to build your knowledge base
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <Card 
        className="border-2"
        style={{
          borderColor: `${designTokens.colors.secondary.purple}20`
        }}
      >
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <Shield 
                className="w-4 h-4" 
                style={{ color: designTokens.colors.primary.green }}
              />
              <span 
                className="text-xs font-medium"
                style={{ color: designTokens.colors.neutral[600] }}
              >
                FERPA
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <FileText 
                className="w-4 h-4" 
                style={{ color: designTokens.colors.primary.blue }}
              />
              <span 
                className="text-xs font-medium"
                style={{ color: designTokens.colors.neutral[600] }}
              >
                Sources
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users 
                className="w-4 h-4" 
                style={{ color: designTokens.colors.secondary.purple }}
              />
              <span 
                className="text-xs font-medium"
                style={{ color: designTokens.colors.neutral[600] }}
              >
                &lt;2s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
