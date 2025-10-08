import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const performAuth = async () => {
      try {
        if (flow === "signIn") {
          await authClient.signIn.email({
            email,
            password,
          });
          toast.success("Welcome back!");
          onClose();
        } else {
          await authClient.signUp.email({
            email,
            password,
            name: name || email.split("@")[0],
          });
          toast.success("Account created successfully!");
          onClose();
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        
        let toastTitle = "";
        if (error.message?.includes("Invalid") || error.message?.includes("password")) {
          toastTitle = "Invalid email or password. Please try again.";
        } else if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
          toastTitle = "An account with this email already exists. Try signing in instead.";
          setFlow("signIn");
        } else {
          toastTitle = flow === "signIn"
            ? "Could not sign in. Please check your credentials."
            : "Could not create account. Please try again.";
        }
        toast.error(toastTitle);
      } finally {
        setSubmitting(false);
      }
    };

    void performAuth();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                EdCoachAI
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-foreground">
              {flow === "signIn" ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
            <CardDescription>
              {flow === "signIn" 
                ? "Sign in to access your AI coaching tools" 
                : "Join Louisiana educators using AI to save time"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {flow === "signUp" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    required
                    disabled={submitting}
                  />
                </div>
              )}
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
                  minLength={8}
                  disabled={submitting}
                />
                {flow === "signUp" && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>
                     <Button
                       type="submit"
                       className="w-full text-white bg-gradient-to-r from-primary to-secondary"
                       disabled={submitting}
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
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
