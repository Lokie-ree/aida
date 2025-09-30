import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface EmailIntegrationProps {
  currentSpaceId?: string | null;
}

export function EmailIntegration({ currentSpaceId }: EmailIntegrationProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendWelcomeEmail = useAction(api.email.sendWelcomeEmail);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentSpace = useQuery(
    api.spaces.getSpaceById,
    currentSpaceId ? { spaceId: currentSpaceId as any } : "skip"
  );

  const handleSendWelcomeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);

    try {
      await sendWelcomeEmail({
        userEmail: email.trim(),
        userName: loggedInUser?.name || "Educator",
        districtName: currentSpace?.name,
      });

      setEmailSent(true);
      toast.success("Welcome email sent successfully!");
    } catch (error) {
      console.error("Error sending welcome email:", error);
      toast.error("Failed to send welcome email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="h-full border-0 shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-aida-voice-speaking-500/20 rounded-full blur-xl"></div>
            <CheckCircle className="relative w-16 h-16 text-aida-voice-speaking-500 mb-4" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
          <p className="text-muted-foreground text-center text-sm">
            Check your inbox for your welcome email from A.I.D.A. with tips on
            getting started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 shadow-none bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Get Email Updates
        </CardTitle>
        <CardDescription className="text-xs mt-1">
          Receive welcome emails, voice session summaries, and helpful tips for
          using A.I.D.A.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSendWelcomeEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@school.edu"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Welcome Email
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            We'll send you a personalized welcome email with district-specific
            tips and getting started guide.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
