import { useState } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  MessageSquare, 
} from "lucide-react";
import { toast } from "sonner";
import { testimonialFormSchema, type TestimonialFormData } from "@/lib/form-schemas";

interface TestimonialFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TestimonialForm({ onSuccess, onCancel }: TestimonialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTestimonial = useMutation(api.testimonials.submitTestimonial);

  const form = useForm<TestimonialFormData>({
    // @ts-ignore - @hookform/resolvers v5.2.2 expects Zod v3, but we're using Zod v4. This is a type-only mismatch; runtime works correctly.
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      quote: "",
      impact: "",
      timeSaved: undefined,
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);

    try {
      await submitTestimonial({
        quote: data.quote,
        impact: data.impact,
        timeSaved: data.timeSaved,
      });

      toast.success("Testimonial submitted successfully! It will be reviewed before being published.");
      
      // Reset form
      form.reset({
        quote: "",
        impact: "",
        timeSaved: undefined,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card data-testid="testimonial-form" className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-lg">
      <CardHeader className="pr-10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="h-5 w-5 text-primary" />
          Share Your Success Story
        </CardTitle>
        <CardDescription className="text-base">
          Help other Louisiana educators see the real impact of Pelican AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form data-testid="testimonial-form-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Quote */}
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Testimonial *</FormLabel>
                  <FormControl>
                    <Textarea
                      data-testid="testimonial-form-quote"
                      placeholder="Tell us how Pelican AI has helped you save time and improve your teaching..."
                      rows={4}
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value?.length || 0}/500 characters
                  </p>
                </FormItem>
              )}
            />

            {/* Impact */}
            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact *</FormLabel>
                  <FormControl>
                    <Textarea
                      data-testid="testimonial-form-impact"
                      placeholder="Describe the specific impact (e.g., 'More time for student conferences', 'Better differentiated instruction')..."
                      rows={2}
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value?.length || 0}/200 characters
                  </p>
                </FormItem>
              )}
            />

            {/* Time Saved */}
            <FormField
              control={form.control}
              name="timeSaved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Saved per Week (Optional)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated hours saved per week using Pelican AI
                  </p>
                </FormItem>
              )}
            />

            {/* Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Submission Guidelines</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be specific about how Pelican AI has helped your teaching</li>
                <li>• Mention time savings or specific benefits you've experienced</li>
                <li>• Keep it authentic and relevant to Louisiana educators</li>
                <li>• All testimonials are reviewed before being published</li>
                <li>• Your quote may be featured in marketing materials</li>
              </ul>
            </div>

            {/* Actions */}
            <ButtonGroup spacing="md" className="pt-4">
              <Button data-testid="testimonial-form-submit" type="submit" disabled={isSubmitting} aria-label="Submit testimonial">
                {isSubmitting ? "Submitting..." : "Submit Testimonial"}
              </Button>
              {onCancel && (
                <Button data-testid="testimonial-form-cancel" type="button" variant="outline" onClick={onCancel} aria-label="Cancel">
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

