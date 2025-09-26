import { useState } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Trash2, Loader2 } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

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
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Learn from Website
          </CardTitle>
          <CardDescription className="text-xs">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleScrapeWebsite} className="space-y-3">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isScraping}
              required
            />
            
            <Button
              type="submit"
              disabled={isScraping || !url.trim()}
              className="w-full"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Scrape Website
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Scraped Websites List */}
      {scrapedWebsites && scrapedWebsites.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Scraped Websites</h4>
          {scrapedWebsites.map((website) => (
            <Card key={website._id} className="p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <h5 className="text-sm font-medium text-foreground truncate">
                      {website.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="truncate">{getDomainFromUrl(website.url)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {website.chunks.length} sections
                    </Badge>
                    <span>{new Date(website._creationTime).toLocaleDateString()}</span>
                  </div>
                  {website.metadata.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {website.metadata.description}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteWebsite(website._id)}
                  className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  title="Delete scraped website"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
