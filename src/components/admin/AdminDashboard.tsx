import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Users, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp,
  AlertCircle,
  Mail,
  UserPlus
} from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingStates";
import { AdminContentModeration } from "./AdminContentModeration";

export function AdminDashboard() {
  const [selectedSignup, setSelectedSignup] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  const stats = useQuery(api.admin.getAdminStats, {});
  const betaUsers = useQuery(api.admin.getAllBetaUsersAdmin, {});
  const testimonials = useQuery(api.admin.getAllTestimonialsAdmin, {});
  const innovations = useQuery(api.admin.getAllInnovationsAdmin, {});
  const pendingSignups = useQuery(api.betaSignup.getPendingSignups, {});
  
  const approveBetaSignup = useMutation(api.betaSignup.approveBetaSignup);
  const updateBetaUserStatus = useMutation(api.admin.updateBetaUserStatus);

  const handleApprove = async (signupId: string) => {
    try {
      await approveBetaSignup({ 
        signupId: signupId as any, 
        notes: notes || undefined
      });
      toast.success("Beta signup approved! User will receive a magic link to access the platform.");
      setSelectedSignup(null);
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
          <LoadingSpinner size="md" />
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
        {/* Tabs for different admin functions */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger data-testid="admin-tab-overview" value="overview">Overview</TabsTrigger>
            <TabsTrigger data-testid="admin-tab-beta-signups" value="beta-signups">
              Beta Signups
              {pendingSignups && pendingSignups.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingSignups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-content-moderation" value="content-moderation">
              Content Moderation
              {stats.pendingTestimonials > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingTestimonials}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-beta-users" value="beta-users">Beta Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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

          </TabsContent>

          <TabsContent value="beta-signups">
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
                  Approve this beta signup. The user will receive a magic link to access the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this approval"
                  />
                </div>
                <ButtonGroup className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSignup(null);
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
                    Approve & Send Magic Link
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </div>
        )}
          </TabsContent>

          <TabsContent value="content-moderation">
            <AdminContentModeration testimonials={testimonials} innovations={innovations} />
          </TabsContent>

          <TabsContent value="beta-users">
            {/* Beta Users Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  All Beta Users
                </CardTitle>
                <CardDescription>
                  Manage beta program participants and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {betaUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{user.userName || "Unknown"}</span>
                          <Badge 
                            variant={user.status === "active" ? "default" : user.status === "completed" ? "secondary" : "outline"}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.userEmail} • {user.userSchool}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.frameworksTried} frameworks tried • {user.totalTimeSaved} min saved
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={user.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as "invited" | "active" | "completed";
                            updateBetaUserStatus({
                              betaUserId: user._id,
                              status: newStatus
                            }).then(() => {
                              toast.success(`User status updated to ${newStatus}`);
                            }).catch((error) => {
                              console.error("Error updating user status:", error);
                              toast.error("Failed to update user status");
                            });
                          }}
                          className="px-3 py-1 border rounded-md text-sm"
                        >
                          <option value="invited">Invited</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
