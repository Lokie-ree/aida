import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md"
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)"
        }}
      >
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0"
            onClick={handleClose}
            disabled={submitting}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`
                }}
              >
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: designTokens.colors.primary.blue }}
              >
                A.I.D.A.
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle 
              className="text-lg"
              style={{ color: designTokens.colors.primary.blue }}
            >
              Welcome to A.I.D.A.
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to experience the voice of your school district.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                const formData = new FormData(e.target as HTMLFormElement);
                formData.set("flow", flow);
                void signIn("password", formData).catch((error) => {
                  let toastTitle = "";
                  if (error.message.includes("Invalid password")) {
                    toastTitle = "Invalid password. Please try again.";
                  } else {
                    toastTitle =
                      flow === "signIn"
                        ? "Could not sign in, did you mean to sign up?"
                        : "Could not sign up, did you mean to sign in?";
                  }
                  toast.error(toastTitle);
                  setSubmitting(false);
                });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  disabled={submitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-white"
                disabled={submitting}
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`
                }}
              >
                {submitting ? "Please wait..." : flow === "signIn" ? "Sign in" : "Sign up"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <span>
                  {flow === "signIn"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  disabled={submitting}
                >
                  {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
                </Button>
              </div>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => void signIn("anonymous")}
              disabled={submitting}
            >
              Try Demo Anonymously
            </Button>

            <div 
              className="text-center text-xs p-3 rounded-lg"
              style={{
                backgroundColor: `${designTokens.colors.primary.blue}05`,
                border: `1px solid ${designTokens.colors.primary.blue}20`
              }}
            >
              <p style={{ color: designTokens.colors.neutral[600] }}>
                <strong>Quick Access:</strong> Sign in anonymously to try A.I.D.A. immediately, or create an account to save your conversations.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
