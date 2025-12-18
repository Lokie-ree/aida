import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Library, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptLibrary } from "@/components/coach/PromptLibrary";
import { Metadata } from "@/components/shared/Metadata";
import { spacing } from "@/lib/spacing";

export function PromptsPage() {
  const navigate = useNavigate();
  const prompts = useQuery(api.promptCoach.getSavedPrompts);
  const promptCount = prompts?.length ?? 0;

  return (
    <div className="h-full flex flex-col">
      <Metadata
        title="My Prompts - Pelican AI"
        description="View and manage your saved Louisiana-aligned prompts."
        url="/prompts"
        noindex={true}
      />

      <div className={`${spacing.chartContainer} w-full flex-1 min-h-0 flex flex-col ${spacing.container} py-4 md:py-6`}>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">My Prompts</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {promptCount > 0
                  ? `${promptCount} saved prompt${promptCount === 1 ? "" : "s"}`
                  : "Your Louisiana-aligned prompts"}
              </p>
            </div>
          </div>
          {promptCount > 0 && (
            <Button
              onClick={() => navigate("/coach")}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Prompt</span>
            </Button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <PromptLibrary
            onSelectPrompt={(prompt) => {
              if (!prompt) {
                navigate("/coach");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
