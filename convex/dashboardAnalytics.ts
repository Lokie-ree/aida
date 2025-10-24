import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";
import { api } from "./_generated/api";

/**
 * Dashboard Analytics Queries
 * 
 * Provides real-time analytics data for the dashboard charts.
 * These queries aggregate data from timeTracking, frameworkUsage, and betaProgram tables.
 */

// Query: Get weekly time savings data for charts
export const getWeeklyTimeSavings = query({
  args: {},
  returns: v.array(v.object({
    day: v.string(),
    minutes: v.number(),
    hours: v.number(),
  })),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;

    // Get time tracking entries from the last 7 days
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const timeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), oneWeekAgo))
      .collect();

    // Group by day of week
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weeklyData = dayNames.map(day => ({
      day,
      minutes: 0,
      hours: 0,
    }));

    // Aggregate time saved by day
    timeEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dayIndex = date.getDay();
      weeklyData[dayIndex].minutes += entry.timeSaved;
      weeklyData[dayIndex].hours = Math.round((weeklyData[dayIndex].minutes / 60) * 100) / 100;
    });

    return weeklyData;
  },
});

// Query: Get monthly time savings data for charts
export const getMonthlyTimeSavings = query({
  args: {},
  returns: v.array(v.object({
    week: v.string(),
    minutes: v.number(),
    hours: v.number(),
  })),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;

    // Get time tracking entries from the last 4 weeks
    const fourWeeksAgo = Date.now() - (28 * 24 * 60 * 60 * 1000);
    const timeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), fourWeeksAgo))
      .collect();

    // Group by week
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = fourWeeksAgo + (i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000);
      
      const weekEntries = timeEntries.filter(entry => 
        entry.timestamp >= weekStart && entry.timestamp < weekEnd
      );
      
      const totalMinutes = weekEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
      
      weeklyData.push({
        week: `Week ${i + 1}`,
        minutes: totalMinutes,
        hours: Math.round((totalMinutes / 60) * 100) / 100,
      });
    }

    return weeklyData;
  },
});

// Query: Get framework usage data for charts
export const getFrameworkUsageData = query({
  args: {},
  returns: v.object({
    frameworkUsage: v.array(v.object({
      name: v.string(),
      count: v.number(),
      category: v.string(),
    })),
    categoryBreakdown: v.array(v.object({
      category: v.string(),
      count: v.number(),
      percentage: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        frameworkUsage: [],
        categoryBreakdown: [],
      };
    }
    const userId = user._id;

    // Get user's framework usage
    const usageEntries = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get framework details for each usage
    const frameworkStats = new Map();
    const categoryStats = new Map();

    for (const usage of usageEntries) {
      const framework = await ctx.db.get(usage.frameworkId);
      if (framework) {
        const key = framework._id;
        if (!frameworkStats.has(key)) {
          frameworkStats.set(key, {
            name: framework.title,
            count: 0,
            category: framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert",
          });
        }
        frameworkStats.get(key).count += 1;

        // Track category usage
        const category = framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert";
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { category, count: 0, percentage: 0 });
        }
        categoryStats.get(category).count += 1;
      }
    }

    // Convert to arrays and sort
    const frameworkUsage = Array.from(frameworkStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 frameworks

    // Calculate percentages for category breakdown
    const totalUsage = Array.from(categoryStats.values()).reduce((sum, cat) => sum + cat.count, 0);
    const categoryBreakdown = Array.from(categoryStats.values()).map(cat => ({
      ...cat,
      percentage: totalUsage > 0 ? Math.round((cat.count / totalUsage) * 100) : 0,
    }));

    return {
      frameworkUsage,
      categoryBreakdown,
    };
  },
});

// Query: Get progress tracking data for charts
export const getProgressTrackingData = query({
  args: {},
  returns: v.object({
    weeklyGoals: v.array(v.object({
      week: v.string(),
      goal: v.number(),
      achieved: v.number(),
      frameworksTried: v.number(),
    })),
    learningStreak: v.array(v.object({
      day: v.string(),
      streak: v.number(),
      frameworksCompleted: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        weeklyGoals: [],
        learningStreak: [],
      };
    }
    const userId = user._id;

    // Get user's beta program stats
    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // Get time tracking data for the last 4 weeks
    const fourWeeksAgo = Date.now() - (28 * 24 * 60 * 60 * 1000);
    const timeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), fourWeeksAgo))
      .collect();

    // Get framework usage for the last 4 weeks
    const frameworkUsage = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), fourWeeksAgo))
      .collect();

    // Generate weekly goals data (assuming 180 minutes per week goal)
    const weeklyGoals = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = fourWeeksAgo + (i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000);
      
      const weekTimeEntries = timeEntries.filter(entry => 
        entry.timestamp >= weekStart && entry.timestamp < weekEnd
      );
      
      const weekFrameworkUsage = frameworkUsage.filter(usage => 
        usage.timestamp >= weekStart && usage.timestamp < weekEnd
      );
      
      const achieved = weekTimeEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
      const frameworksTried = new Set(weekFrameworkUsage.map(u => u.frameworkId)).size;
      
      weeklyGoals.push({
        week: `Week ${i + 1}`,
        goal: 180, // 3 hours per week goal
        achieved,
        frameworksTried,
      });
    }

    // Generate learning streak data for the last 7 days
    const learningStreak = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
      const dayStart = Date.now() - ((6 - i) * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);
      
      const dayTimeEntries = timeEntries.filter(entry => 
        entry.timestamp >= dayStart && entry.timestamp < dayEnd
      );
      
      const dayFrameworkUsage = frameworkUsage.filter(usage => 
        usage.timestamp >= dayStart && usage.timestamp < dayEnd
      );
      
      const frameworksCompleted = dayFrameworkUsage.filter(u => u.action === "marked_tried").length;
      const streak = dayTimeEntries.length > 0 ? (6 - i + 1) : 0; // Simple streak calculation
      
      learningStreak.push({
        day: dayNames[i],
        streak,
        frameworksCompleted,
      });
    }

    return {
      weeklyGoals,
      learningStreak,
    };
  },
});

// Query: Get comprehensive dashboard analytics
export const getDashboardAnalytics = query({
  args: {},
  returns: v.object({
    weeklyTimeData: v.array(v.object({
      day: v.string(),
      minutes: v.number(),
      hours: v.number(),
    })),
    monthlyTimeData: v.array(v.object({
      week: v.string(),
      minutes: v.number(),
      hours: v.number(),
    })),
    frameworkUsageData: v.array(v.object({
      name: v.string(),
      count: v.number(),
      category: v.string(),
    })),
    categoryBreakdownData: v.array(v.object({
      category: v.string(),
      count: v.number(),
      percentage: v.number(),
    })),
    weeklyGoalsData: v.array(v.object({
      week: v.string(),
      goal: v.number(),
      achieved: v.number(),
      frameworksTried: v.number(),
    })),
    learningStreakData: v.array(v.object({
      day: v.string(),
      streak: v.number(),
      frameworksCompleted: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        weeklyTimeData: [],
        monthlyTimeData: [],
        frameworkUsageData: [],
        categoryBreakdownData: [],
        weeklyGoalsData: [],
        learningStreakData: [],
      };
    }

    // Get all analytics data directly instead of using runQuery to avoid circular reference
    const userId = user._id;

    // Get time tracking entries for the last 7 days
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const timeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), oneWeekAgo))
      .collect();

    // Get time tracking entries for the last 4 weeks
    const fourWeeksAgo = Date.now() - (28 * 24 * 60 * 60 * 1000);
    const monthlyTimeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), fourWeeksAgo))
      .collect();

    // Get framework usage
    const usageEntries = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Generate weekly time data
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weeklyTimeData = dayNames.map(day => ({
      day,
      minutes: 0,
      hours: 0,
    }));

    timeEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dayIndex = date.getDay();
      weeklyTimeData[dayIndex].minutes += entry.timeSaved;
      weeklyTimeData[dayIndex].hours = Math.round((weeklyTimeData[dayIndex].minutes / 60) * 100) / 100;
    });

    // Generate monthly time data
    const monthlyTimeData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = fourWeeksAgo + (i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000);
      
      const weekEntries = monthlyTimeEntries.filter(entry => 
        entry.timestamp >= weekStart && entry.timestamp < weekEnd
      );
      
      const totalMinutes = weekEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
      
      monthlyTimeData.push({
        week: `Week ${i + 1}`,
        minutes: totalMinutes,
        hours: Math.round((totalMinutes / 60) * 100) / 100,
      });
    }

    // Generate framework usage data
    const frameworkStats = new Map();
    const categoryStats = new Map();

    for (const usage of usageEntries) {
      const framework = await ctx.db.get(usage.frameworkId);
      if (framework) {
        const key = framework._id;
        if (!frameworkStats.has(key)) {
          frameworkStats.set(key, {
            name: framework.title,
            count: 0,
            category: framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert",
          });
        }
        frameworkStats.get(key).count += 1;

        const category = framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert";
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { category, count: 0, percentage: 0 });
        }
        categoryStats.get(category).count += 1;
      }
    }

    const frameworkUsageData = Array.from(frameworkStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalUsage = Array.from(categoryStats.values()).reduce((sum, cat) => sum + cat.count, 0);
    const categoryBreakdownData = Array.from(categoryStats.values()).map(cat => ({
      ...cat,
      percentage: totalUsage > 0 ? Math.round((cat.count / totalUsage) * 100) : 0,
    }));

    // Generate progress tracking data
    const weeklyGoalsData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = fourWeeksAgo + (i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000);
      
      const weekTimeEntries = monthlyTimeEntries.filter(entry => 
        entry.timestamp >= weekStart && entry.timestamp < weekEnd
      );
      
      const weekFrameworkUsage = usageEntries.filter(usage => 
        usage.timestamp >= weekStart && usage.timestamp < weekEnd
      );
      
      const achieved = weekTimeEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
      const frameworksTried = new Set(weekFrameworkUsage.map(u => u.frameworkId)).size;
      
      weeklyGoalsData.push({
        week: `Week ${i + 1}`,
        goal: 180,
        achieved,
        frameworksTried,
      });
    }

    // Generate learning streak data
    const learningStreakData = [];
    const dayNamesShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
      const dayStart = Date.now() - ((6 - i) * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);
      
      const dayTimeEntries = timeEntries.filter(entry => 
        entry.timestamp >= dayStart && entry.timestamp < dayEnd
      );
      
      const dayFrameworkUsage = usageEntries.filter(usage => 
        usage.timestamp >= dayStart && usage.timestamp < dayEnd
      );
      
      const frameworksCompleted = dayFrameworkUsage.filter(u => u.action === "marked_tried").length;
      const streak = dayTimeEntries.length > 0 ? (6 - i + 1) : 0;
      
      learningStreakData.push({
        day: dayNamesShort[i],
        streak,
        frameworksCompleted,
      });
    }

    return {
      weeklyTimeData,
      monthlyTimeData,
      frameworkUsageData,
      categoryBreakdownData,
      weeklyGoalsData,
      learningStreakData,
    };
  },
});
