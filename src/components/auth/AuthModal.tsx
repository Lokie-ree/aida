import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authFormSchema, type AuthFormData } from "@/lib/form-schemas";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signIn" | "signUp";
}

export function AuthModal({ isOpen, onClose, initialMode = "signIn" }: AuthModalProps) {
  const [flow, setFlow] = useState<"signIn" | "signUp">(initialMode);
  const createUserProfile = useMutation(api.betaSignup.createUserProfileAfterSignup);
  
  // Update flow when initialMode prop changes
  useEffect(() => {
    setFlow(initialMode);
  }, [initialMode]);

  const form = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setSubmitting(true);

    try {
      if (flow === "signIn") {
        console.log("Attempting sign-in for:", data.email);
        const result = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        
        console.log("Sign-in result:", result);
        
        // Check if sign-in was successful - Better Auth returns data with user property
        if (result && 'data' in result && result.data && (result.data as any).user) {
          console.log("Sign-in successful for user:", (result.data as any).user.id);
          toast.success("Welcome back to Pelican AI!");
          onClose();
        } else if (result && 'error' in result) {
          // Better Auth returned an error object
          console.log("Sign-in error:", (result as any).error);
          throw new Error((result as any).error?.message || "Invalid email or password");
        } else {
          // No user returned, likely authentication failed
          console.log("Sign-in failed - no user returned");
          throw new Error("Invalid email or password");
        }
      } else {
        // Sign up flow - use client-side authentication
        console.log("Attempting sign-up for:", data.email);
        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name || data.email.split("@")[0],
        });
        
        console.log("Sign-up result:", result);
        
        // Check if sign-up was successful
        if (result && 'data' in result && result.data && (result.data as any).user) {
          console.log("Sign-up successful for user:", (result.data as any).user.id);
          
          // Create user profile and beta program record
          try {
            const profileResult = await createUserProfile({
              userId: (result.data as any).user.id,
              email: data.email,
              name: data.name || data.email.split("@")[0],
              school: undefined,
              subject: undefined,
            });
            
            if (profileResult.success) {
              console.log("User profile created successfully");
              toast.success("Welcome to Pelican AI! Your account has been created.");
            } else {
              console.warn("Profile creation failed:", profileResult.message);
              toast.success("Account created! Profile setup will complete shortly.");
            }
          } catch (profileError) {
            console.error("Error creating user profile:", profileError);
            toast.success("Account created! Profile setup will complete shortly.");
          }
          
          onClose();
        } else if (result && 'error' in result) {
          // Better Auth returned an error object
          console.log("Sign-up error:", (result as any).error);
          throw new Error((result as any).error?.message || "Failed to create account");
        } else {
          // No user returned, likely sign-up failed
          console.log("Sign-up failed - no user returned");
          throw new Error("Failed to create account");
        }
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
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-foreground">
              {flow === "signIn" ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
            <CardDescription>
              {flow === "signIn" 
                ? "Sign in to access your AI guidance frameworks" 
                : "Create your account to start using AI frameworks"}
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
                      {flow === "signUp" && (
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
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
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
