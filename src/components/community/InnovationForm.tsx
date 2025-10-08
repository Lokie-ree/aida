import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Lightbulb, 
  Tag, 
  Clock, 
  BookOpen,
  X,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface InnovationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  relatedFrameworkId?: string;
}

export function InnovationForm({ onSuccess, onCancel, relatedFrameworkId }: InnovationFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    timeSaved: undefined as number | undefined,
    relatedFramework: relatedFrameworkId || "",
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frameworks = useQuery(api.frameworks.getAllFrameworks, { status: "published" });
  const shareInnovation = useMutation(api.innovations.shareInnovation);
  const recordWeeklyEngagement = useMutation(api.betaProgram.recordWeeklyEngagement);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    shareInnovation({
      title: formData.title,
      description: formData.description,
      tags: formData.tags,
      timeSaved: formData.timeSaved,
      relatedFramework: formData.relatedFramework ? formData.relatedFramework as any : undefined,
    })
      .then(() => {
        // Record engagement
        return recordWeeklyEngagement();
      })
      .then(() => {
        toast.success("Innovation shared successfully!");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          tags: [],
          timeSaved: undefined,
          relatedFramework: "",
        });

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Error sharing innovation:", error);
        toast.error("Failed to share innovation. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Innovation Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Using AI to Create Differentiated Reading Passages"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your innovation, how you used AI, and what made it effective..."
              rows={4}
              required
            />
          </div>

          {/* Related Framework */}
          <div className="space-y-2">
            <Label htmlFor="relatedFramework">Related Framework (Optional)</Label>
            <Select
              value={formData.relatedFramework}
              onValueChange={(value) => handleInputChange("relatedFramework", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a framework this innovation relates to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No related framework</SelectItem>
                {frameworks?.map((framework) => (
                  <SelectItem key={framework._id} value={framework._id}>
                    {framework.frameworkId}: {framework.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
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
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
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
              <Label className="text-sm text-muted-foreground">Suggested tags:</Label>
              <div className="flex flex-wrap gap-1">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag)) {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag]
                        }));
                      }
                    }}
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    disabled={formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Saved */}
          <div className="space-y-2">
            <Label htmlFor="timeSaved">Time Saved (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="timeSaved"
                type="number"
                value={formData.timeSaved || ""}
                onChange={(e) => handleInputChange("timeSaved", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="30"
                min="0"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>

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
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share Innovation"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
