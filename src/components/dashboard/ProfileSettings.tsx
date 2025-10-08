import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, School, BookOpen, GraduationCap, MapPin, Shield } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    school: "",
    subject: "",
    gradeLevel: "",
    district: "",
    role: "teacher" as "teacher" | "admin" | "coach",
  });

  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateProfile = useMutation(api.userProfiles.updateUserProfile);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        school: userProfile.school || "",
        subject: userProfile.subject || "",
        gradeLevel: userProfile.gradeLevel || "",
        district: userProfile.district || "",
        role: userProfile.role || "teacher",
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        school: formData.school || undefined,
        subject: formData.subject || undefined,
        gradeLevel: formData.gradeLevel || undefined,
        district: formData.district || undefined,
        role: formData.role,
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile
    if (userProfile) {
      setFormData({
        school: userProfile.school || "",
        subject: userProfile.subject || "",
        gradeLevel: userProfile.gradeLevel || "",
        district: userProfile.district || "",
        role: userProfile.role || "teacher",
      });
    }
    setIsEditing(false);
  };

  if (userProfile === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your professional information and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Professional Information
              </CardTitle>
              <CardDescription>
                Tell us about your teaching role and school
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  {isEditing ? (
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => handleInputChange("school", e.target.value)}
                      placeholder="Enter your school name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.school || "Not specified"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  {isEditing ? (
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Enter your district"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.district || "Not specified"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Teaching Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject/Area</Label>
                  {isEditing ? (
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="e.g., Mathematics, English, Science"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.subject || "Not specified"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  {isEditing ? (
                    <Select
                      value={formData.gradeLevel}
                      onValueChange={(value) => handleInputChange("gradeLevel", value)}
                    >
                      <SelectTrigger>
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
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.gradeLevel || "Not specified"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                {isEditing ? (
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value as "teacher" | "admin" | "coach")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="coach">Instructional Coach</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{formData.role}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-sm">{loggedInUser?.email || "Not available"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="text-sm">{loggedInUser?.name || "Not available"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                <p className="text-sm">
                  {loggedInUser ? new Date(loggedInUser._creationTime).toLocaleDateString() : "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Beta Program Status */}
          <Card>
            <CardHeader>
              <CardTitle>Beta Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Active Beta Tester</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You're part of our beta program. Thank you for helping us improve Pelican AI!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
