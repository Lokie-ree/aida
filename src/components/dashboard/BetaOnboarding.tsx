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
  BookOpen, 
  Users, 
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Mail,
  Clock
} from "lucide-react";
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
  const frameworks = useQuery(api.frameworks.getAllFrameworks, { status: "published" });
  const updateProfile = useMutation(api.userProfiles.updateUserProfile);
  const updateOnboardingProgress = useMutation(api.betaProgram.updateOnboardingProgress);
  const recordWeeklyEngagement = useMutation(api.betaProgram.recordWeeklyEngagement);

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
      title: "Get Started",
      description: "Frameworks, community, and support",
      icon: BookOpen,
    },
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      // Save profile data
      try {
        await updateProfile({
          school: profileData.school || undefined,
          subject: profileData.subject || undefined,
          gradeLevel: profileData.gradeLevel || undefined,
        });
        toast.success("Profile updated!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
        return;
      }
    }

    if (currentStep === 2) {
      // Complete onboarding (final step)
      try {
        await updateOnboardingProgress({ step: 2 });
        await recordWeeklyEngagement();
        toast.success("Onboarding complete! Welcome to Pelican AI!");
        // Close modal and redirect to dashboard
        onComplete();
        // Redirect to dashboard if currently on /onboarding route
        if (window.location.pathname === "/onboarding") {
          window.location.href = "/dashboard";
        }
        return;
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Failed to complete onboarding. Please try again.");
        return;
      }
    }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    that works with ANY tool you already use. Let's get you set up in just a few steps.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">10 Frameworks</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Copy-paste ready prompts for common teaching tasks
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Community</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share innovations and learn from other educators
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Support</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Office hours and direct support from our team
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
                    Help us personalize your experience and connect you with relevant content
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School</label>
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData(prev => ({ ...prev, school: e.target.value }))}
                      placeholder="Enter your school name"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject/Area</label>
                    <input
                      type="text"
                      value={profileData.subject}
                      onChange={(e) => setProfileData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Mathematics, English, Science"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade Level</label>
                    <select
                      value={profileData.gradeLevel}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gradeLevel: e.target.value }))}
                      className="w-full p-3 border rounded-md"
                    >
                      <option value="">Select grade level</option>
                      <option value="Pre-K">Pre-K</option>
                      <option value="K">Kindergarten</option>
                      <option value="1">1st Grade</option>
                      <option value="2">2nd Grade</option>
                      <option value="3">3rd Grade</option>
                      <option value="4">4th Grade</option>
                      <option value="5">5th Grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                      <option value="Multiple">Multiple Grades</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Try Your First Framework</h3>
                  <p className="text-muted-foreground">
                    Choose a framework that matches your current needs
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks?.slice(0, 4).map((framework) => (
                    <Card key={framework._id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {framework.difficultyLevel}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{framework.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {framework.challenge}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{framework.timeEstimate} min</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="outline" className="mr-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse All Frameworks
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
                  <p className="text-muted-foreground">
                    You're one of 5 educators building this together. Let's stay in touch.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Personal check-ins about frameworks that work (or don't). Real conversations, not automation.
                      </p>
                      <Button className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Stay in Touch
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Community Space
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        With 5 users, we're keeping it simple. Share feedback directly via email or text.
                      </p>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Direct Contact
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Let's Talk</h3>
                  <p className="text-muted-foreground">
                    Want to talk through a framework or share feedback? Just reach out - text, call, or email works.
                  </p>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Grassroots Support</h4>
                        <p className="text-sm text-muted-foreground">
                          No formal office hours. Just real conversations when you need them.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Your Feedback Matters</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Which frameworks saved you time?</li>
                          <li>• What confused you?</li>
                          <li>• What should we build next?</li>
                        </ul>
                      </div>
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Your Session
                      </Button>
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
              <Button onClick={handleNext}>
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
