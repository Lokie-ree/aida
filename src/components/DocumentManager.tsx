import { useState, useRef } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { WebScrapingManager } from "./WebScrapingManager";
import { Id } from "../../convex/_generated/dataModel";

interface DocumentManagerProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function DocumentManager({ currentSpaceId }: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const documents = useQuery(api.documents.getUserDocuments, { spaceId: currentSpaceId ?? undefined });
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const processDocument = useAction(api.documents.processUploadedDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const currentSpace = useQuery(api.spaces.getSpaceById, 
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (text files only for now)
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
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
      toast.success(`Document uploaded and processed successfully${spaceContext}!`);
      
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHeaderTitle = () => {
    if (currentSpace) {
      return `${currentSpace.name} - Knowledge Base`;
    }
    return "Personal Knowledge Base";
  };

  const getUploadDescription = () => {
    if (currentSpace) {
      return `Upload documents to share with ${currentSpace.name} team members`;
    }
    return "Upload curriculum guides, policy manuals, or other text documents (max 5MB)";
  };

  const getEmptyStateMessage = () => {
    if (currentSpace) {
      return `No content added to ${currentSpace.name} yet`;
    }
    return "No content added yet";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xs border">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{getHeaderTitle()}</h2>
        
        {/* File Upload Section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Documents</h3>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs hover:shadow"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {getUploadDescription()}
          </p>
        </div>

        {/* Web Scraping Section */}
        <WebScrapingManager currentSpaceId={currentSpaceId} />
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {(!documents || documents.length === 0) ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm">{getEmptyStateMessage()}</p>
              <p className="text-xs text-gray-400 mt-1">
                Upload documents or scrape websites to provide context for A.I.D.A.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.fileName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{new Date(doc._creationTime).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteDocument(doc._id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
