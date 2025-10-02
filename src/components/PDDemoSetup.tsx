import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Scale, 
  Heart, 
  Megaphone, 
  BookOpen,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface PDDemoSetupProps {
  onSpaceCreated?: (spaceId: Id<"spaces">) => void;
  onComplete?: () => void;
}

interface DemoSpace {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: "pending" | "creating" | "loading-content" | "complete" | "error";
  spaceId?: Id<"spaces">;
}

export function PDDemoSetup({ onSpaceCreated, onComplete }: PDDemoSetupProps) {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [spaces, setSpaces] = useState<DemoSpace[]>([
    {
      type: "district",
      name: "District-wide Instructional Coach",
      description: "LDOE LEADS, NIET, Core Knowledge, instructional strategies",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "#3B82F6",
      status: "pending"
    },
    {
      type: "district",
      name: "District Policy Expert",
      description: "LDOE policies, SPED requirements, compliance, procedures",
      icon: <Scale className="w-5 h-5" />,
      color: "#8B5CF6",
      status: "pending"
    },
    {
      type: "department",
      name: "Counselor Tools & Resources",
      description: "ACT, WorkKeys, Ripple Effects, college/career planning",
      icon: <Heart className="w-5 h-5" />,
      color: "#EC4899",
      status: "pending"
    },
    {
      type: "district",
      name: "Stakeholder Communication",
      description: "Parent communication, announcements, events, athletics",
      icon: <Megaphone className="w-5 h-5" />,
      color: "#F59E0B",
      status: "pending"
    },
    {
      type: "district",
      name: "Personal Teaching Coach",
      description: "Personalized professional development and growth",
      icon: <BookOpen className="w-5 h-5" />,
      color: "#10B981",
      status: "pending"
    }
  ]);

  const createSpaceFromTemplate = useMutation(api.spaces.createSpaceFromTemplate);
  const addLouisianaContent = useAction(api.rag.addLouisianaDistrictContent);

  const handleSetupDemo = async () => {
    setIsSettingUp(true);
    setCurrentStep(0);

    try {
      for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        setCurrentStep(i + 1);

        // Update status to creating
        setSpaces(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "creating" as const } : s
        ));

        try {
          // Create the Space
          const result = await createSpaceFromTemplate({ 
            templateType: space.type as any,
            customName: space.name
          });

          // Update status to loading content
          setSpaces(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: "loading-content" as const, spaceId: result.spaceId } : s
          ));

          // Load Louisiana content into the Space
          await addLouisianaContent({ spaceId: result.spaceId });

          // Mark as complete
          setSpaces(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: "complete" as const } : s
          ));

          // Notify parent if first space
          if (i === 0 && onSpaceCreated) {
            onSpaceCreated(result.spaceId);
          }

          toast.success(`${space.name} ready!`, {
            description: "Space created with Louisiana district content"
          });

        } catch (error) {
          console.error(`Error setting up ${space.name}:`, error);
          setSpaces(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: "error" as const } : s
          ));
          toast.error(`Failed to set up ${space.name}`, {
            description: "Continuing with remaining spaces..."
          });
        }

        // Small delay between creations for UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success("PD Demo Setup Complete!", {
        description: "All 5 Spaces are ready with Louisiana content",
        duration: 5000
      });

      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error("Error during demo setup:", error);
      toast.error("Demo setup encountered errors. Check individual spaces.");
    } finally {
      setIsSettingUp(false);
    }
  };

  const totalSteps = spaces.length;
  const progress = (currentStep / totalSteps) * 100;
  const completedSpaces = spaces.filter(s => s.status === "complete").length;

  return (
    <Card className="border-2 shadow-xl bg-gradient-to-br from-background to-accent/10">
      <CardHeader className="border-b bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl">
              PD Day Demo Setup
            </CardTitle>
            <CardDescription className="text-base mt-1">
              One-click setup: 5 role-based Spaces with authentic Louisiana content
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Setup Button or Progress */}
        {!isSettingUp && completedSpaces === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This will create 5 demo Spaces with LDOE LEADS, NIET, CKH, SPED, and counselor resources
            </p>
            <Button
              onClick={handleSetupDemo}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg text-lg py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Set Up Demo in One Click
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            {isSettingUp && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    Setting up demo Spaces...
                  </span>
                  <span className="text-muted-foreground">
                    {currentStep} of {totalSteps}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            )}

            {/* Space Status List */}
            <div className="space-y-3">
              {spaces.map((space, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 ${
                    space.status === "complete"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                      : space.status === "error"
                      ? "bg-red-50 border-red-300"
                      : space.status === "creating" || space.status === "loading-content"
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-aida-primary-300 shadow-md"
                      : "bg-white border-aida-primary-200"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: space.color }}
                      >
                        {space.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {space.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {space.description}
                        </p>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-2">
                        {space.status === "pending" && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                        {space.status === "creating" && (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-aida-primary-500" />
                            <span className="text-xs font-medium text-aida-primary-700">
                              Creating...
                            </span>
                          </div>
                        )}
                        {space.status === "loading-content" && (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-aida-secondary-500" />
                            <span className="text-xs font-medium text-aida-secondary-700">
                              Loading content...
                            </span>
                          </div>
                        )}
                        {space.status === "complete" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-medium text-green-700">
                              Ready
                            </span>
                          </div>
                        )}
                        {space.status === "error" && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-xs font-medium text-red-700">
                              Error
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Completion Message */}
            {completedSpaces === totalSteps && !isSettingUp && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Demo Ready! 🎉
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      All 5 Spaces are loaded with Louisiana district content. Switch between Spaces to see role-specific knowledge.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

