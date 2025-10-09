import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export function AdminDashboard() {
  const stats = useQuery(api.admin.getAdminStats, {});
  const betaUsers = useQuery(api.admin.getAllBetaUsersAdmin, {});
  const testimonials = useQuery(api.admin.getAllTestimonialsAdmin, {});
  const innovations = useQuery(api.admin.getAllInnovationsAdmin, {});

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
