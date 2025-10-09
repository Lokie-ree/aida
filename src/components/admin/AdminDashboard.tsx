import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp,
  AlertCircle,
  Mail,
  UserPlus
} from "lucide-react";

export function AdminDashboard() {
  const [selectedSignup, setSelectedSignup] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [notes, setNotes] = useState("");
  
  const stats = useQuery(api.admin.getAdminStats, {});
  const betaUsers = useQuery(api.admin.getAllBetaUsersAdmin, {});
  const testimonials = useQuery(api.admin.getAllTestimonialsAdmin, {});
  const innovations = useQuery(api.admin.getAllInnovationsAdmin, {});
  const pendingSignups = useQuery(api.betaSignup.getPendingSignups, {});
  
  const approveBetaSignup = useMutation(api.betaSignup.approveBetaSignup);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleApprove = async (signupId: string) => {
    if (!temporaryPassword) {
      toast.error("Please generate a temporary password");
      return;
    }
    
    try {
      await approveBetaSignup({ 
        signupId: signupId as any, 
        temporaryPassword,
        notes: notes || undefined
      });
      toast.success("Beta signup approved!");
      setSelectedSignup(null);
      setTemporaryPassword("");
      setNotes("");
    } catch (error) {
      console.error("Error approving signup:", error);
      toast.error("Failed to approve signup");
    }
  };

  if (stats === undefined || betaUsers === undefined || testimonials === undefined || innovations === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading admin data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage beta program, content moderation, and platform analytics
              </p>
            </div>
            <Badge variant="destructive" className="text-sm">
              Admin Only
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Beta Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBetaUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeBetaUsers} active, {stats.completedBetaUsers} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedTestimonials}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingTestimonials} pending, {stats.featuredTestimonials} featured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Innovations</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInnovations}</div>
              <p className="text-xs text-muted-foreground">
                Community contributions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTimeSaved}m</div>
              <p className="text-xs text-muted-foreground">
                Total across all users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Pending Moderation
              </CardTitle>
              <CardDescription>
                Content waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Testimonials</span>
                  <Badge variant="outline">{stats.pendingTestimonials}</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Review Testimonials
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Beta Management
              </CardTitle>
              <CardDescription>
                Manage beta users and invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="outline">{stats.activeBetaUsers}</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Platform Health
              </CardTitle>
              <CardDescription>
                Monitor engagement and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Engagement</span>
                  <Badge variant="outline">{stats.averageEngagement}</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Beta Signup Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              Beta Signup Management
            </CardTitle>
            <CardDescription>
              Review and approve pending beta signups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSignups && pendingSignups.length > 0 ? (
                <div className="space-y-3">
                  {pendingSignups.map((signup: any) => (
                    <div key={signup._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{signup.email}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {signup.name && <span>Name: {signup.name}</span>}
                          {signup.school && <span> • School: {signup.school}</span>}
                          {signup.subject && <span> • Subject: {signup.subject}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Signed up: {new Date(signup.signupDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSignup(signup._id)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending beta signups</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Approval Modal */}
        {selectedSignup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Approve Beta Signup</CardTitle>
                <CardDescription>
                  Generate credentials and approve this beta signup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="temp-password">Temporary Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="temp-password"
                      value={temporaryPassword}
                      onChange={(e) => setTemporaryPassword(e.target.value)}
                      placeholder="Generate secure password"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setTemporaryPassword(generateSecurePassword())}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this approval"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSignup(null);
                      setTemporaryPassword("");
                      setNotes("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedSignup)}
                    className="flex-1"
                  >
                    Approve & Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Beta Users</CardTitle>
              <CardDescription>
                Latest beta program participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {betaUsers.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.userName || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={user.status === "active" ? "default" : user.status === "completed" ? "secondary" : "outline"}
                      >
                        {user.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {user.frameworksTried} frameworks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Testimonials</CardTitle>
              <CardDescription>
                Latest user feedback submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testimonials.slice(0, 5).map((testimonial) => (
                  <div key={testimonial._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{testimonial.userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{testimonial.quote}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={testimonial.status === "approved" ? "default" : testimonial.status === "featured" ? "secondary" : "outline"}
                      >
                        {testimonial.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
