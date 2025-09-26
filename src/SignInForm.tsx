"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to A.I.D.A.</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one to get started.
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {flow === "signIn" ? "Sign in" : "Sign up"}
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
        >
          Sign in anonymously
        </Button>
      </CardContent>
    </Card>
  );
}
