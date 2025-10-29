import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trash2, Star, AlertCircle, MessageSquare, Lightbulb } from "lucide-react";

interface Testimonial {
  _id: string;
  _creationTime: number;
  quote: string;
  userName: string;
  school: string;
  subject: string;
  status: "pending" | "approved" | "featured";
  featured: boolean;
  timeSaved?: number;
  impact: string;
}

interface Innovation {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  userName: string;
  school: string;
  subject: string;
  tags: string[];
  timeSaved?: number;
  likes: number;
  triesCount: number;
}

interface AdminContentModerationProps {
  testimonials: Testimonial[];
  innovations: Innovation[];
}

export function AdminContentModeration({ testimonials, innovations }: AdminContentModerationProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedInnovation, setSelectedInnovation] = useState<Innovation | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const approveTestimonial = useMutation(api.admin.approveTestimonialAdmin);
  const deleteTestimonial = useMutation(api.admin.deleteTestimonialAdmin);
  const deleteInnovation = useMutation(api.admin.deleteInnovationAdmin);

  const handleApproveTestimonial = async (testimonialId: string, featured = false) => {
    try {
      await approveTestimonial({
        testimonialId: testimonialId as any,
        status: featured ? "featured" : "approved"
      });
      toast.success(featured ? "Testimonial featured!" : "Testimonial approved!");
      setSelectedTestimonial(null);
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast.error("Failed to approve testimonial");
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string, reason?: string) => {
    if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteTestimonial({ testimonialId: testimonialId as any });
      toast.success("Testimonial deleted");
      setSelectedTestimonial(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleDeleteInnovation = async (innovationId: string) => {
    if (!confirm("Are you sure you want to delete this innovation? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteInnovation({ innovationId: innovationId as any });
      toast.success("Innovation deleted");
      setSelectedInnovation(null);
    } catch (error) {
      console.error("Error deleting innovation:", error);
      toast.error("Failed to delete innovation");
    }
  };

  const pendingTestimonials = testimonials.filter(t => t.status === "pending");
  const pendingInnovations = innovations.filter(i => 
    // Innovations are auto-approved when submitted, so we show most recent ones
    Date.now() - i._creationTime < 7 * 24 * 60 * 60 * 1000 // Last 7 days
  );

  return (
    <div className="space-y-6">
      {/* Pending Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Pending Testimonials
          </CardTitle>
          <CardDescription>
            Review and approve user testimonials for public display
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTestimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending testimonials</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTestimonials.map((testimonial) => (
                <div key={testimonial._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{testimonial.userName}</span>
                        <Badge variant="outline">{testimonial.school}</Badge>
                        <Badge variant="outline">{testimonial.subject}</Badge>
                      </div>
                      <p className="text-sm text-foreground italic mb-2">"{testimonial.quote}"</p>
                      {testimonial.impact && (
                        <p className="text-sm text-muted-foreground">{testimonial.impact}</p>
                      )}
                      {testimonial.timeSaved && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Time saved: {testimonial.timeSaved} minutes
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{testimonial.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApproveTestimonial(testimonial._id, false)}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleApproveTestimonial(testimonial._id, true)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Feature
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setRejectionReason("");
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Innovations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recent Innovations
          </CardTitle>
          <CardDescription>
            Monitor community innovations and remove inappropriate content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInnovations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent innovations to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInnovations.slice(0, 10).map((innovation) => (
                <div key={innovation._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{innovation.title}</span>
                        <Badge variant="outline">{innovation.school}</Badge>
                        <Badge variant="outline">{innovation.subject}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{innovation.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {innovation.likes} likes • {innovation.triesCount} tried
                        </span>
                        {innovation.timeSaved && (
                          <span className="text-xs text-muted-foreground">
                            • {innovation.timeSaved} min saved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedInnovation(innovation);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Delete Testimonial</CardTitle>
              <CardDescription>
                Are you sure you want to delete this testimonial?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-1">{selectedTestimonial.userName}</p>
                <p className="text-sm italic line-clamp-3">"{selectedTestimonial.quote}"</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason (Optional)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Why is this testimonial being removed?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTestimonial(null);
                    setRejectionReason("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTestimonial(selectedTestimonial._id, rejectionReason)}
                  className="flex-1"
                >
                  Delete Testimonial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Innovation Modal */}
      {selectedInnovation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Delete Innovation</CardTitle>
              <CardDescription>
                Are you sure you want to delete this innovation?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-1">{selectedInnovation.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {selectedInnovation.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  By {selectedInnovation.userName} • {selectedInnovation.school}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInnovation(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteInnovation(selectedInnovation._id)}
                  className="flex-1"
                >
                  Delete Innovation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

