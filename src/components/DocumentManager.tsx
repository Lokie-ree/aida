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
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

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
      return `${currentSpace.name} - Knowledge Base`;
    }
    return "Personal Knowledge Base";
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
    <Card className={`flex flex-col h-full ${className || ""}`}>
      <CardHeader>
        <CardTitle>{getHeaderTitle()}</CardTitle>
        <CardDescription>
          Upload and manage documents for your knowledge base
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Upload Documents</h3>
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
              className="w-full"
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
          <p className="text-xs text-muted-foreground">
            {getUploadDescription()}
          </p>
        </div>

      </CardContent>

      {/* Content List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {!documents || documents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-sm">{getEmptyStateMessage()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload district documents to build your knowledge base
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Uploaded Documents</h4>
              {documents.map((doc) => (
                <Card key={doc._id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <h3 className="text-sm font-medium truncate">
                          {doc.fileName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(doc.fileSize)}
                        </Badge>
                        <span>
                          {new Date(doc._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
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
