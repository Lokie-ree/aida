import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BetaOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function BetaOnboarding({ isOpen, onClose, onComplete }: BetaOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    school: "",
    subject: "",
    gradeLevel: "",
  });

  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateProfile = useMutation(api.userProfiles.updateUserProfile);

  // Pre-populate profile data from user profile
  React.useEffect(() => {
    if (userProfile) {
      setProfileData({
        school: userProfile.school || "",
        subject: userProfile.subject || "",
        gradeLevel: userProfile.gradeLevel || "",
      });
    }
  }, [userProfile]);

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Pelican AI!",
      description: "Let's get you set up for success",
      icon: User,
    },
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Tell us about your teaching role",
      icon: User,
    },
    {
      id: "get-started",
      title: "Start Your First Conversation",
      description: "The Prompt Coach is ready to help",
      icon: MessageSquare,
    },
  ];

  // Validate profile step before proceeding - school, subject, and gradeLevel are all required
  const canProceedFromProfile = 
    profileData.school?.trim() !== "" && 
    profileData.subject?.trim() !== "" && 
    profileData.gradeLevel?.trim() !== "";

  const handleNext = async () => {
    // Step 1: Save profile data before advancing
    if (currentStep === 1) {
      // Validate required fields
      if (!canProceedFromProfile) {
        toast.error("Please fill in Subject/Area and Grade Level to continue.");
        return;
      }

      // Save profile data (including school)
      try {
        await updateProfile({
          school: profileData.school?.trim() || undefined,
          subject: profileData.subject?.trim() || undefined,
          gradeLevel: profileData.gradeLevel?.trim() || undefined,
        });
        toast.success("Profile updated!");
        // Advance to next step after successful save
        setCurrentStep(currentStep + 1);
        return;
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
        return;
      }
    }

    // Step 2: Final step - mark onboarding complete
    if (currentStep === 2) {
      // Ensure all profile data is saved and mark onboarding complete
      try {
        await updateProfile({
          school: profileData.school?.trim() || undefined,
          subject: profileData.subject?.trim() || undefined,
          gradeLevel: profileData.gradeLevel?.trim() || undefined,
          onboardingComplete: true,
        });
        toast.success("Onboarding complete! Welcome to Pelican AI!");
      } catch (error) {
        console.error("Error marking onboarding complete:", error);
        toast.error("Failed to mark onboarding complete. Please try again.");
        return;
      }
      // Close modal and redirect to coach
      onComplete();
      // Redirect to coach if currently on /onboarding route
      if (window.location.pathname === "/onboarding") {
        window.location.href = "/coach";
      }
      return;
    }

    // Step 0: Welcome - just advance to next step
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 2) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Prevent closing the modal during onboarding (steps 0, 1, 2)
        // Only allow closing when onboarding is explicitly completed in handleNext
        if (!open) {
          // User is trying to close - prevent it during onboarding
          // The modal will only close when onComplete is called from handleNext
          return;
        }
      }}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent closing by clicking outside during onboarding
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing by pressing escape during onboarding
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {currentStepData.title}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Welcome! You're one of 5 educators building this together</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    You're one of 5 Louisiana educators starting this with me. Platform-agnostic AI guidance 
                    that works with ANY tool you already use—ChatGPT, Claude, Gemini, or whatever your district provides.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Conversational Coach</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Start a conversation about what you're teaching. Get Louisiana-aligned prompts you can copy and paste into any AI tool.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Louisiana-Specific</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Every prompt is aligned with Louisiana Student Standards, the Louisiana Educator Rubric, and LEADS evaluations.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Teacher-to-Teacher</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Built by a Louisiana educator who understands your context. No corporate EdTech speak—just real guidance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-muted-foreground">
                    Help us personalize your coaching experience. We'll use this to align prompts with your grade level and subject.
                  </p>
                </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="school">
                      School <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="school"
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData(prev => ({ ...prev, school: e.target.value }))}
                      placeholder="Enter your school name"
                      className={!profileData.school && currentStep === 1 ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject/Area <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={profileData.subject}
                      onChange={(e) => setProfileData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Mathematics, English, Science"
                      className={!profileData.subject && currentStep === 1 ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">
                      Grade Level <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={profileData.gradeLevel}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, gradeLevel: value }))}
                    >
                      <SelectTrigger 
                        id="gradeLevel"
                        className={!profileData.gradeLevel && currentStep === 1 ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-K">Pre-K</SelectItem>
                        <SelectItem value="K">Kindergarten</SelectItem>
                        <SelectItem value="1">1st Grade</SelectItem>
                        <SelectItem value="2">2nd Grade</SelectItem>
                        <SelectItem value="3">3rd Grade</SelectItem>
                        <SelectItem value="4">4th Grade</SelectItem>
                        <SelectItem value="5">5th Grade</SelectItem>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                        <SelectItem value="Multiple">Multiple Grades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {!canProceedFromProfile && (
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-destructive">*</span> School, Subject/Area, and Grade Level are required to continue
                  </p>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start Your First Conversation</h3>
                  <p className="text-muted-foreground">
                    The Prompt Coach is ready to help you generate Louisiana-aligned prompts for your lessons.
                  </p>
                </div>
                
                <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">How It Works</h4>
                          <p className="text-sm text-muted-foreground">
                            Start a conversation about what you're teaching
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pl-16">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Describe what you're teaching</p>
                            <p className="text-xs text-muted-foreground">
                              Tell the coach about your lesson, unit, or challenge
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Answer clarifying questions</p>
                            <p className="text-xs text-muted-foreground">
                              The coach asks questions like a colleague would—to understand your context
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Get your Louisiana-aligned prompt</p>
                            <p className="text-xs text-muted-foreground">
                              Copy and paste into ChatGPT, Claude, Gemini, or any AI tool you use
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Remember:</strong> The prompts work with ANY AI tool. 
                          No new tools to learn—just better prompts that improve your practice.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <ButtonGroup>
              {currentStep < steps.length - 1 && (
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && !canProceedFromProfile}
              >
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
