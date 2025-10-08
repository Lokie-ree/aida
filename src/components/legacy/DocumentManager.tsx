import { useState, useRef } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, Loader2, BookOpen } from "lucide-react";

interface DocumentManagerProps {
  currentSpaceId: Id<"spaces"> | null;
  className?: string;
}

export function DocumentManager({
  currentSpaceId,
  className,
}: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documents = useQuery(api.documents.getUserDocuments, {
    spaceId: currentSpaceId ?? undefined,
  });
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const processDocument = useAction(api.documents.processUploadedDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const currentSpace = useQuery(
    api.spaces.getSpaceById,
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (text files only for now)
    if (
      !file.type.startsWith("text/") &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".md")
    ) {
      toast.error("Please upload text files only (.txt, .md)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      // Step 3: Process the document with space association
      await processDocument({
        storageId,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        spaceId: currentSpaceId ?? undefined,
      });

      const spaceContext = currentSpace ? ` to ${currentSpace.name}` : "";
      toast.success(
        `Document uploaded and processed successfully${spaceContext}!`
      );

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await deleteDocument({ documentId: documentId as any });
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getHeaderTitle = () => {
    if (currentSpace) {
      return `${currentSpace.name} - District Knowledge Hub`;
    }
    return "District Knowledge Hub";
  };

  const getUploadDescription = () => {
    if (currentSpace) {
      return `Upload official district documents to share with ${currentSpace.name} members`;
    }
    return "Upload district policies, student handbooks, board documents, or curriculum guides (max 5MB)";
  };

  const getEmptyStateMessage = () => {
    if (currentSpace) {
      return `No content added to ${currentSpace.name} yet`;
    }
    return "No content added yet";
  };

  return (
    <Card className={`flex flex-col h-full ${className || ""} overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">
          {getHeaderTitle()}
        </CardTitle>
        <CardDescription className="text-sm mt-2">
          Upload and manage official district documents for the entire community
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="space-y-3 bg-gradient-to-br from-accent/5 to-primary/5 p-4 rounded-lg border border-accent/20">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4 text-accent" />
            Upload Documents
          </h3>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-md"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getUploadDescription()}
          </p>
        </div>

      </CardContent>

      {/* Content List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {!documents || documents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center p-8 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-dashed border-muted-foreground/30 max-w-md">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto mb-2 opacity-60 text-muted-foreground">
                    <BookOpen className="w-full h-full" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{getEmptyStateMessage()}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Upload official district documents to create a trusted knowledge base for your entire school community
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    <span>District policies & procedures</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    <span>Student handbooks & guidelines</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    <span>Curriculum standards & resources</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                Uploaded Documents
              </h4>
              {documents.map((doc) => (
                <Card key={doc._id} className="p-3 hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/20 border-accent/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 bg-accent/10 rounded">
                          <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                        </div>
                        <h3 className="text-sm font-medium truncate">
                          {doc.fileName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-7">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {formatFileSize(doc.fileSize)}
                        </Badge>
                        <span className="text-xs">
                          {new Date(doc._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
