import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Lightbulb, 
  X,
  Plus
} from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingStates";
import { toast } from "sonner";
import { innovationFormSchema, type InnovationFormData } from "@/lib/form-schemas";

interface InnovationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  relatedFrameworkId?: string;
}

export function InnovationForm({ onSuccess, onCancel, relatedFrameworkId }: InnovationFormProps) {
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frameworks = useQuery(api.frameworks.getAllFrameworks, { status: "published" });
  const shareInnovation = useMutation(api.innovations.shareInnovation);
  const recordWeeklyEngagement = useMutation(api.betaProgram.recordWeeklyEngagement);

  const form = useForm<InnovationFormData>({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      timeSaved: undefined,
      relatedFramework: relatedFrameworkId || "",
    },
  });

  const watchedTags = form.watch("tags");

  // Show loading state if frameworks are still loading
  if (frameworks === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Share Your Innovation
          </CardTitle>
          <CardDescription>
            Help other Louisiana educators by sharing your creative AI use cases and tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="flex items-center gap-3 text-muted-foreground">
              <LoadingSpinner size="md" />
              <span>Loading frameworks...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: InnovationFormData) => {
    setIsSubmitting(true);

    try {
      await shareInnovation({
        title: data.title,
        description: data.description,
        tags: data.tags,
        timeSaved: data.timeSaved,
        relatedFramework: data.relatedFramework && data.relatedFramework !== "none" ? data.relatedFramework as any : undefined,
      });

      // Record engagement
      await recordWeeklyEngagement();
      
      toast.success("Innovation shared successfully!");
      
      // Reset form
      form.reset({
        title: "",
        description: "",
        tags: [],
        timeSaved: undefined,
        relatedFramework: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error sharing innovation:", error);
      toast.error("Failed to share innovation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedTags = [
    "email", "newsletter", "lesson-planning", "assessment", "differentiation",
    "parent-communication", "professional-development", "time-saving", "ai-tips",
    "louisiana-standards", "classroom-management", "student-engagement"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Share Your Innovation
        </CardTitle>
        <CardDescription>
          Help other Louisiana educators by sharing your creative AI use cases and tips
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Innovation Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Using AI to Create Differentiated Reading Passages"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your innovation, how you used AI, and what made it effective..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Related Framework */}
            <FormField
              control={form.control}
              name="relatedFramework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Framework (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework this innovation relates to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No related framework</SelectItem>
                      {frameworks && frameworks.length > 0 ? frameworks.map((framework) => (
                        <SelectItem key={framework._id} value={framework._id}>
                          {framework.frameworkId}: {framework.title}
                        </SelectItem>
                      )) : (
                        <SelectItem value="none" disabled>No frameworks available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Current Tags */}
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Suggested tags:</label>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!watchedTags.includes(tag)) {
                          const currentTags = form.getValues("tags");
                          form.setValue("tags", [...currentTags, tag]);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                      disabled={watchedTags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Saved */}
            <FormField
              control={form.control}
              name="timeSaved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Saved (Optional)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Sharing Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about how you used AI and what made it effective</li>
              <li>• Include any ethical considerations or guardrails you used</li>
              <li>• Mention the AI platform you used (MagicSchool AI, Brisk, etc.)</li>
              <li>• Keep it relevant to Louisiana educators and standards</li>
              <li>• Don't share student names or sensitive information</li>
            </ul>
          </div>

            {/* Actions */}
            <ButtonGroup spacing="md" className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sharing..." : "Share Innovation"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </ButtonGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
