import { useState } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface WebScrapingManagerProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function WebScrapingManager({ currentSpaceId }: WebScrapingManagerProps) {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  
  const scrapedWebsites = useQuery(api.webscraping.getUserScrapedWebsites, { spaceId: currentSpaceId ?? undefined });
  const scrapeWebsite = useAction(api.scrapingActions.scrapeWebsite);
  const deleteWebsite = useMutation(api.webscraping.deleteScrapedWebsite);
  const currentSpace = useQuery(api.spaces.getSpaceById, 
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setIsScraping(true);

    try {
      const result = await scrapeWebsite({ 
        url: url.trim(),
        spaceId: currentSpaceId ?? undefined,
      });
      
      if (result.success) {
        const spaceContext = currentSpace ? ` to ${currentSpace.name}` : "";
        toast.success(`Successfully scraped "${result.title}" (${result.chunksCount} sections)${spaceContext}`);
        setUrl("");
      }
    } catch (error) {
      console.error("Scraping error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to scrape website");
    } finally {
      setIsScraping(false);
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!window.confirm("Are you sure you want to delete this scraped website?")) {
      return;
    }

    try {
      await deleteWebsite({ websiteId: websiteId as any });
      toast.success("Website deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete website");
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getDescription = () => {
    if (currentSpace) {
      return `Extract content from web pages to enhance ${currentSpace.name}'s knowledge base`;
    }
    return "Extract content from web pages to enhance A.I.D.A.'s knowledge base";
  };

  return (
    <div className="space-y-4">
      {/* Web Scraping Form */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
          Learn from Website
        </h3>
        
        <form onSubmit={handleScrapeWebsite} className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all"
            disabled={isScraping}
            required
          />
          
          <button
            type="submit"
            disabled={isScraping || !url.trim()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isScraping ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Scraping...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Scrape Website
              </>
            )}
          </button>
        </form>
        
        <p className="text-xs text-blue-700 mt-2">
          {getDescription()}
        </p>
      </div>

      {/* Scraped Websites List */}
      {scrapedWebsites && scrapedWebsites.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Scraped Websites</h4>
          {scrapedWebsites.map((website) => (
            <div
              key={website._id}
              className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {website.title}
                  </h5>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="truncate">{getDomainFromUrl(website.url)}</span>
                  <span>{website.chunks.length} sections</span>
                  <span>{new Date(website._creationTime).toLocaleDateString()}</span>
                </div>
                {website.metadata.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {website.metadata.description}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => handleDeleteWebsite(website._id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete scraped website"
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
  );
}
