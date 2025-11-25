/**
 * ✅ ACTIVE - Used in production
 * Scheduled cron jobs for weekly emails and engagement tracking
 */
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled cron jobs for the platform.
 * 
 * Uses Convex's built-in cron functionality for:
 * - Weekly Spark email generation (Monday 6am CT)
 * - Weekly engagement tracking
 * - Standards sync/updates (if needed)
 */

const crons = cronJobs();

// Weekly Spark email generation - Monday 6am CT (11am UTC)
// This will generate and send personalized Weekly Spark emails to all active beta users
// TODO: Uncomment when email.generateWeeklySpark is implemented
// crons.weekly(
//   "generateWeeklySpark",
//   {
//     dayOfWeek: "monday",
//     hourUTC: 11, // 6am CT = 11am UTC (CT is UTC-5, but we account for DST)
//     minuteUTC: 0,
//   },
//   internal.email.generateWeeklySpark,
//   {}
// );

// Weekly engagement tracking - Monday 7am CT (12pm UTC)
// Tracks user engagement metrics and updates beta program records
// TODO: Uncomment when dashboardAnalytics.updateWeeklyEngagement is implemented
// crons.weekly(
//   "trackWeeklyEngagement",
//   {
//     dayOfWeek: "monday",
//     hourUTC: 12, // 7am CT = 12pm UTC
//     minuteUTC: 0,
//   },
//   internal.dashboardAnalytics.updateWeeklyEngagement,
//   {}
// );

// Daily cleanup job - 2am CT (7am UTC)
// Cleans up old rate limit records, expired cache entries, etc.
// TODO: Uncomment when devHelpers.cleanupOldData is implemented
// crons.daily(
//   "dailyCleanup",
//   {
//     hourUTC: 7, // 2am CT = 7am UTC
//     minuteUTC: 0,
//   },
//   internal.devHelpers.cleanupOldData,
//   {}
// );

export default crons;

