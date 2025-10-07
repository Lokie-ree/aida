"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (flow === "signIn") {
        await authClient.signIn.email({
          email,
          password,
        });
        toast.success("Signed in successfully!");
      } else {
        await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0], // Use name or default to email prefix
        });
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let toastTitle = "";
      if (error.message?.includes("Invalid") || error.message?.includes("password")) {
        toastTitle = "Invalid email or password. Please try again.";
      } else if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        toastTitle = "An account with this email already exists. Try signing in instead.";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to EdCoachAI</CardTitle>
        <CardDescription>
          {flow === "signIn" 
            ? "Sign in to your account to continue" 
            : "Create your account to get started"}
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
            />
            {flow === "signUp" && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : (flow === "signIn" ? "Sign in" : "Sign up")}
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
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
