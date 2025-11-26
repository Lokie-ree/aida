import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send } from "lucide-react";

export interface ContentInputData {
  content: string;
  gradeLevel: string;
  subject: "ela" | "math" | "science" | "social_studies";
  standardCodes?: string[];
}

interface ContentInputFormProps {
  onSubmit: (data: ContentInputData) => void;
  isSubmitting?: boolean;
}

export function ContentInputForm({ onSubmit, isSubmitting = false }: ContentInputFormProps) {
  const [content, setContent] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState<"ela" | "math" | "science" | "social_studies">("ela");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !gradeLevel.trim()) {
      return;
    }
    onSubmit({
      content: content.trim(),
      gradeLevel,
      subject,
    });
  };

  const isValid = content.trim().length > 0 && gradeLevel.trim().length > 0;

  return (
    <Card data-testid="alignment-input-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Analyze Content Alignment
        </CardTitle>
        <CardDescription>
          Enter your AI-generated content to check alignment with Louisiana Student Standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="alignment-form">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Area</Label>
            <Select value={subject} onValueChange={(value) => setSubject(value as typeof subject)}>
              <SelectTrigger id="subject" data-testid="alignment-subject-select">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ela">English Language Arts</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social_studies">Social Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Input
              id="gradeLevel"
              type="text"
              placeholder="e.g., K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              required
              data-testid="alignment-grade-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content to Analyze</Label>
            <Textarea
              id="content"
              placeholder="Paste your quiz, lesson plan, assignment, or other educational content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
              className="resize-none"
              data-testid="alignment-content-textarea"
            />
            <p className="text-sm text-muted-foreground">
              This content will be analyzed against Louisiana Student Standards for alignment.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full"
            size="lg"
            data-testid="alignment-submit-button"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyze Alignment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

