import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BetaSignupModal({ isOpen, onClose }: BetaSignupModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    name?: string;
    school?: string;
    subject?: string;
  }>({});

  const signupForBeta = useMutation(api.betaSignup.signupForBeta);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Validate all required fields
    const errors: {email?: string; name?: string; school?: string; subject?: string} = {};
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!school.trim()) {
      errors.school = "School is required";
    }
    
    if (!subject.trim()) {
      errors.subject = "Subject is required";
    }
    
    // If there are any validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await signupForBeta({ 
        email: email.trim(),
        name: name.trim(),
        school: school.trim(),
        subject: subject.trim(),
      });
      
      if (result.success) {
        setIsSubmitted(true);
        // Clear all form fields
        setEmail("");
        setName("");
        setSchool("");
        setSubject("");
        setError(null);
        setValidationErrors({});
        // Reset success state and close modal after 4 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 4000);
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form state when closing
      setTimeout(() => {
        setEmail("");
        setName("");
        setSchool("");
        setSubject("");
        setError(null);
        setValidationErrors({});
        setIsSubmitted(false);
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#0ea5e9] to-[#1e40af]">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Pelican AI
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-foreground">
              Join the Beta Program
            </CardTitle>
            <CardDescription>
              Be among the first Louisiana educators to co-create AI guidance frameworks
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form className="space-y-4" onSubmit={handleBetaSignup} aria-live="polite">
                {/* Name Field */}
                <div>
                  <label htmlFor="modal-name" className="block text-sm font-medium mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="modal-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationErrors.name) {
                        setValidationErrors(prev => ({ ...prev, name: undefined }));
                      }
                    }}
                    className={`w-full text-base py-4 h-[45px] ${validationErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                    aria-invalid={!!validationErrors.name}
                    aria-describedby={validationErrors.name ? 'modal-name-error' : undefined}
                  />
                  {validationErrors.name && (
                    <p id="modal-name-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`w-full text-base py-4 h-[45px] ${validationErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? 'modal-email-error' : undefined}
                  />
                  {validationErrors.email && (
                    <p id="modal-email-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* School Field */}
                <div>
                  <label htmlFor="modal-school" className="block text-sm font-medium mb-2">
                    School <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="modal-school"
                    type="text"
                    placeholder="Enter your school name"
                    value={school}
                    onChange={(e) => {
                      setSchool(e.target.value);
                      if (validationErrors.school) {
                        setValidationErrors(prev => ({ ...prev, school: undefined }));
                      }
                    }}
                    className={`w-full text-base py-4 h-[45px] ${validationErrors.school ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                    aria-invalid={!!validationErrors.school}
                    aria-describedby={validationErrors.school ? 'modal-school-error' : undefined}
                  />
                  {validationErrors.school && (
                    <p id="modal-school-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.school}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="modal-subject" className="block text-sm font-medium mb-2">
                    Subject Area <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="modal-subject"
                    type="text"
                    placeholder="e.g., Mathematics, English, Science"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (validationErrors.subject) {
                        setValidationErrors(prev => ({ ...prev, subject: undefined }));
                      }
                    }}
                    className={`w-full text-base py-4 h-[45px] ${validationErrors.subject ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                    aria-invalid={!!validationErrors.subject}
                    aria-describedby={validationErrors.subject ? 'modal-subject-error' : undefined}
                  />
                  {validationErrors.subject && (
                    <p id="modal-subject-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.subject}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 px-6 py-4 text-base h-[45px]"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Joining Beta Program...
                    </>
                  ) : (
                    "Join Beta Program"
                  )}
                </Button>
                
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground text-center">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <div className="text-center py-8 bg-primary/10 rounded-lg">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Thanks for Signing Up!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your email for next steps. We'll notify you once your beta access is approved.
                </p>
                <p className="text-xs text-muted-foreground">
                  Be sure to check your spam folder if you don't see it within a few minutes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

