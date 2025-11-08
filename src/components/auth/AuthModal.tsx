import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authFormSchema, type AuthFormData } from "@/lib/form-schemas";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signIn" | "signUp";
}

export function AuthModal({ isOpen, onClose, initialMode = "signIn" }: AuthModalProps) {
  const [flow, setFlow] = useState<"signIn" | "signUp">(initialMode);
  const [emailValue, setEmailValue] = useState("");
  const signupForBeta = useMutation(api.betaSignup.signupForBeta);
  const navigate = useNavigate();
  
  // Query beta signup status when email is entered (for sign-up mode)
  const betaSignup = useQuery(
    api.betaSignup.getBetaSignupByEmail,
    flow === "signUp" && emailValue.trim() ? { email: emailValue.trim() } : "skip"
  );
  
  // Update flow when initialMode prop changes
  useEffect(() => {
    setFlow(initialMode);
  }, [initialMode]);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) {
      onClose();
      form.reset();
      setEmailValue("");
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setSubmitting(true);

    try {
      if (flow === "signIn") {
        // Sign-in mode: Send magic link
        console.log("Sending magic link for:", data.email);
        const result = await authClient.signIn.magicLink({
          email: data.email,
          callbackURL: "/dashboard",
        });
        
        console.log("Magic link result:", result);
        
        if (result && 'data' in result && result.data) {
          console.log("Magic link sent successfully");
          toast.success("Check your email for a magic link to sign in");
          onClose();
          form.reset();
          setEmailValue("");
        } else if (result && 'error' in result) {
          console.log("Magic link error:", (result as any).error);
          throw new Error((result as any).error?.message || "Failed to send magic link");
        } else {
          throw new Error("Failed to send magic link");
        }
      } else {
        // Sign-up mode: Check beta signup status and handle accordingly
        if (betaSignup) {
          // Email already exists in betaSignups
          if (betaSignup.status === "pending") {
            toast.info("Your application is pending approval. We'll notify you via email once approved.");
            onClose();
            form.reset();
            setEmailValue("");
            return;
          } else if (betaSignup.status === "approved") {
            toast.info("You've been approved! Check your email for a magic link to access the platform.");
            setFlow("signIn");
            return;
          } else if (betaSignup.status === "rejected") {
            toast.error("Your application was not approved. Please contact support if you believe this is an error.");
            return;
          }
        }
        
        // Email doesn't exist or status is unknown - create new beta signup        
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out. Please check your connection and try again.")), 15000);
          });
          
          const result = await Promise.race([
            signupForBeta({
              email: data.email,
              name: data.name || undefined,
              school: undefined,
              subject: undefined,
            }),
            timeoutPromise,
          ]) as any;
          
          if (result.success) {
            console.log("Beta signup created successfully");
            toast.success(result.message);
            onClose();
            form.reset();
            setEmailValue("");
          } else {
            throw new Error(result.message);
          }
        } catch (mutationError: any) {
          console.error("Signup mutation error:", mutationError);
          // Re-throw to be caught by outer catch block
          throw mutationError;
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let toastTitle = "";
      if (error.message?.includes("already exists") || error.message?.includes("already registered")) {
        toastTitle = error.message;
        if (flow === "signUp") {
          setFlow("signIn");
        }
      } else if (error.message?.includes("magic link")) {
        toastTitle = "Failed to send magic link. Please try again.";
      } else {
        toastTitle = flow === "signIn"
          ? "Could not send magic link. Please try again."
          : "Could not create signup. Please try again.";
      }
      toast.error(toastTitle);
    } finally {
      setSubmitting(false);
    }
  };

  // Watch email field to update emailValue for query
  const watchedEmail = form.watch("email");
  useEffect(() => {
    setEmailValue(watchedEmail || "");
  }, [watchedEmail]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
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
          <DialogDescription className="text-center">
            {flow === "signIn" 
              ? "Sign in with a magic link sent to your email" 
              : "Sign up for the beta program"}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-foreground">
              {flow === "signIn" ? "Welcome Back" : "Join the Beta Program"}
            </CardTitle>
            <CardDescription>
              {flow === "signIn" 
                ? "Enter your email and we'll send you a magic link to sign in" 
                : "Enter your details to apply for beta access"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {flow === "signUp" && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your name"
                            disabled={submitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          disabled={submitting}
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting 
                    ? "Please wait..." 
                    : flow === "signIn" 
                      ? "Send Magic Link" 
                      : "Sign Up for Beta"}
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
                    onClick={() => {
                      setFlow(flow === "signIn" ? "signUp" : "signIn");
                      form.reset();
                      setEmailValue("");
                    }}
                    disabled={submitting}
                  >
                    {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
