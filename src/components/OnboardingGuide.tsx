import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { X, Lightbulb } from "lucide-react";

interface OnboardingGuideProps {
  currentSpaceId?: Id<"spaces"> | null;
  onComplete?: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  order: number;
}

export function OnboardingGuide({
  currentSpaceId,
  onComplete,
}: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<any>(null);

  const loggedInUser = useQuery(api.auth.loggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      // Check if user is new (created within last 24 hours)
      const isNewUser =
        Date.now() - loggedInUser._creationTime < 24 * 60 * 60 * 1000;
      setIsVisible(isNewUser);
    }
  }, [loggedInUser]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to A.I.D.A.!",
      description:
        "A.I.D.A. is your AI-powered instructional design assistant. Let's get you started with a quick tour.",
      action: "Let's begin",
      completed: false,
      order: 1,
    },
    {
      id: "voice_intro",
      title: "Try Voice Commands",
      description:
        "Click the microphone button to start a voice conversation. Try asking: 'What are our district policies on student assessments?'",
      action: "Try voice chat",
      completed: false,
      order: 2,
    },
    {
      id: "feedback_intro",
      title: "Get AI Feedback",
      description:
        "Upload a lesson plan or teaching content to get instant AI feedback on engagement and rigor improvements.",
      action: "Try feedback",
      completed: false,
      order: 3,
    },
    {
      id: "documents_intro",
      title: "Upload District Documents",
      description:
        "Upload your district's policy documents, curriculum guides, and resources to make A.I.D.A. more helpful.",
      action: "Upload documents",
      completed: false,
      order: 4,
    },
    {
      id: "spaces_intro",
      title: "Create Team Spaces",
      description:
        "Create shared spaces with your colleagues to collaborate and share knowledge through A.I.D.A.",
      action: "Create space",
      completed: false,
      order: 5,
    },
    {
      id: "complete",
      title: "You're All Set!",
      description:
        "You've completed the onboarding! A.I.D.A. is ready to help you with district policies, lesson feedback, and more.",
      action: "Start using A.I.D.A.",
      completed: false,
      order: 6,
    },
  ];

  const handleStepComplete = (stepId: string) => {
    const updatedSteps = onboardingSteps.map((step) =>
      step.id === stepId ? { ...step, completed: true } : step
    );

    // Move to next step
    const currentIndex = updatedSteps.findIndex((step) => step.id === stepId);
    if (currentIndex < updatedSteps.length - 1) {
      setCurrentStep(currentIndex + 1);
    } else {
      // Onboarding complete
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible || !user) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>{currentStepData.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Step {currentStep + 1} of {onboardingSteps.length}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Progress
            value={((currentStep + 1) / onboardingSteps.length) * 100}
            className="w-full"
          />

          <p className="text-sm text-muted-foreground">
            {currentStepData.description}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => handleStepComplete(currentStepData.id)}
              className="flex-1"
            >
              {currentStepData.action}
            </Button>

            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
          </div>

          {/* Quick tips */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <h3 className="text-sm font-semibold">Quick Tips:</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use voice commands for hands-free operation</li>
                <li>• Upload district documents for better context</li>
                <li>• Create team spaces to collaborate with colleagues</li>
                <li>• Ask specific questions about policies and procedures</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
