import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ChevronDown, ChevronUp, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface InlineProfilePromptProps {
  onComplete?: () => void;
}

export function InlineProfilePrompt({ onComplete }: InlineProfilePromptProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [profileData, setProfileData] = useState({
    school: "",
    subject: "",
    gradeLevel: "",
  });
  const [isSaving, setIsSaving] = useState(false);

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

  // Don't show if profile is complete or dismissed
  if (!userProfile || (userProfile.gradeLevel && userProfile.subject) || isDismissed) {
    return null;
  }

  const canSave = profileData.subject.trim() !== "" && profileData.gradeLevel.trim() !== "";

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Please fill in Subject/Area and Grade Level to continue.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        school: profileData.school || undefined,
        subject: profileData.subject || undefined,
        gradeLevel: profileData.gradeLevel || undefined,
      });
      toast.success("Profile updated!");
      setIsDismissed(true);
      onComplete?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="mb-4"
      >
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Complete Your Profile</CardTitle>
                  <CardDescription className="text-xs">
                    Help us personalize your coaching experience
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your profile information helps us align prompts with your grade level and subject, 
                    and reference relevant Louisiana Student Standards automatically.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inline-school">School (optional)</Label>
                      <Input
                        id="inline-school"
                        type="text"
                        value={profileData.school}
                        onChange={(e) => setProfileData(prev => ({ ...prev, school: e.target.value }))}
                        placeholder="Enter your school name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inline-subject">
                        Subject/Area <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="inline-subject"
                        type="text"
                        value={profileData.subject}
                        onChange={(e) => setProfileData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Mathematics, English, Science"
                        className={!profileData.subject ? "border-destructive" : ""}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="inline-gradeLevel">
                        Grade Level <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={profileData.gradeLevel}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, gradeLevel: value }))}
                      >
                        <SelectTrigger 
                          id="inline-gradeLevel"
                          className={!profileData.gradeLevel ? "border-destructive" : ""}
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

                  {!canSave && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive">*</span> Subject/Area and Grade Level are required
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDismissed(true)}
                      disabled={isSaving}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!canSave || isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

