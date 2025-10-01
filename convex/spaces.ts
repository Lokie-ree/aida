import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createSpace = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create the space
    const spaceId = await ctx.db.insert("spaces", {
      name: args.name.trim(),
      ownerId: userId,
      description: args.description?.trim(),
    });

    // Add the creator as an accepted member
    await ctx.db.insert("spaceMembers", {
      spaceId,
      userId,
      invitationStatus: "accepted",
      invitedBy: userId,
      invitedEmail: "", // Owner doesn't need email tracking
    });

    return spaceId;
  },
});

// Create space from template with one-click setup
export const createSpaceFromTemplate = mutation({
  args: {
    templateType: v.union(
      v.literal("district"),
      v.literal("school"),
      v.literal("sports"),
      v.literal("club"),
      v.literal("department")
    ),
    customName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Get template configuration
    const template = getSpaceTemplate(args.templateType);
    const spaceName = args.customName || template.defaultName;

    // Create the space
    const spaceId = await ctx.db.insert("spaces", {
      name: spaceName,
      ownerId: userId,
      description: template.description,
    });

    // Add the creator as an accepted member
    await ctx.db.insert("spaceMembers", {
      spaceId,
      userId,
      invitationStatus: "accepted",
      invitedBy: userId,
      invitedEmail: "",
    });

    return { spaceId, template };
  },
});

// Get available space templates
export const getSpaceTemplates = query({
  args: {},
  handler: async (ctx) => {
    return [
      {
        type: "district",
        name: "District Office",
        description: "Complete district management with policies, procedures, and community engagement",
        icon: "🏛️",
        features: ["Policy Management", "Community Portal", "Staff Directory", "News & Updates"],
        color: "#3B82F6"
      },
      {
        type: "school",
        name: "School Campus",
        description: "Individual school with academic programs, events, and parent communication",
        icon: "🏫",
        features: ["Academic Calendar", "Parent Portal", "Student Resources", "Event Management"],
        color: "#10B981"
      },
      {
        type: "sports",
        name: "Athletics Program",
        description: "Sports teams, schedules, rosters, and athletic department management",
        icon: "⚽",
        features: ["Team Rosters", "Game Schedules", "Athletic Policies", "Parent Communication"],
        color: "#F59E0B"
      },
      {
        type: "club",
        name: "Student Organization",
        description: "Clubs, activities, and student-led organizations",
        icon: "🎭",
        features: ["Activity Calendar", "Member Management", "Event Planning", "Resource Sharing"],
        color: "#8B5CF6"
      },
      {
        type: "department",
        name: "Academic Department",
        description: "Subject-specific department with curriculum and resources",
        icon: "📚",
        features: ["Curriculum Resources", "Professional Development", "Assessment Tools", "Collaboration"],
        color: "#EF4444"
      }
    ];
  },
});

// Helper function to get space template configuration
function getSpaceTemplate(templateType: string) {
  const templates = {
    district: {
      defaultName: "District Office",
      description: "Complete district management with policies, procedures, and community engagement",
      icon: "🏛️",
      features: ["Policy Management", "Community Portal", "Staff Directory", "News & Updates"],
      color: "#3B82F6"
    },
    school: {
      defaultName: "School Campus",
      description: "Individual school with academic programs, events, and parent communication",
      icon: "🏫",
      features: ["Academic Calendar", "Parent Portal", "Student Resources", "Event Management"],
      color: "#10B981"
    },
    sports: {
      defaultName: "Athletics Program",
      description: "Sports teams, schedules, rosters, and athletic department management",
      icon: "⚽",
      features: ["Team Rosters", "Game Schedules", "Athletic Policies", "Parent Communication"],
      color: "#F59E0B"
    },
    club: {
      defaultName: "Student Organization",
      description: "Clubs, activities, and student-led organizations",
      icon: "🎭",
      features: ["Activity Calendar", "Member Management", "Event Planning", "Resource Sharing"],
      color: "#8B5CF6"
    },
    department: {
      defaultName: "Academic Department",
      description: "Subject-specific department with curriculum and resources",
      icon: "📚",
      features: ["Curriculum Resources", "Professional Development", "Assessment Tools", "Collaboration"],
      color: "#EF4444"
    }
  };

  return templates[templateType as keyof typeof templates] || templates.district;
}

export const getUserSpaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all spaces where user is a member (accepted invitations)
    const memberships = await ctx.db
      .query("spaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
      .collect();

    const spaces = [];
    for (const membership of memberships) {
      const space = await ctx.db.get(membership.spaceId);
      if (space) {
        const owner = await ctx.db.get(space.ownerId);
        spaces.push({
          ...space,
          ownerName: owner?.name || "Unknown",
          isOwner: space.ownerId === userId,
        });
      }
    }

    return spaces.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getSpaceById = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Check if user is a member of this space
    const membership = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
      .first();

    if (!membership) {
      return null;
    }

    const space = await ctx.db.get(args.spaceId);
    if (!space) {
      return null;
    }

    const owner = await ctx.db.get(space.ownerId);
    return {
      ...space,
      ownerName: owner?.name || "Unknown",
      isOwner: space.ownerId === userId,
    };
  },
});

export const inviteUserToSpace = mutation({
  args: {
    spaceId: v.id("spaces"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const space = await ctx.db.get(args.spaceId);
    if (!space) {
      throw new Error("Space not found");
    }

    // Check if user is the owner or a member of the space
    const membership = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
      .first();

    if (!membership) {
      throw new Error("You don't have permission to invite users to this space");
    }

    // Find user by email
    const invitedUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();

    if (!invitedUser) {
      throw new Error("User with this email not found");
    }

    // Check if user is already a member or has a pending invitation
    const existingMembership = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("userId"), invitedUser._id))
      .first();

    if (existingMembership) {
      if (existingMembership.invitationStatus === "accepted") {
        throw new Error("User is already a member of this space");
      } else {
        throw new Error("User already has a pending invitation to this space");
      }
    }

    // Create the invitation
    await ctx.db.insert("spaceMembers", {
      spaceId: args.spaceId,
      userId: invitedUser._id,
      invitationStatus: "pending",
      invitedBy: userId,
      invitedEmail: args.email.toLowerCase().trim(),
    });

    return { success: true };
  },
});

export const getPendingInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const pendingInvitations = await ctx.db
      .query("spaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("invitationStatus"), "pending"))
      .collect();

    const invitations = [];
    for (const invitation of pendingInvitations) {
      const space = await ctx.db.get(invitation.spaceId);
      const inviter = await ctx.db.get(invitation.invitedBy);
      if (space && inviter) {
        invitations.push({
          ...invitation,
          spaceName: space.name,
          inviterName: inviter.name || "Unknown",
        });
      }
    }

    return invitations;
  },
});

export const acceptInvitation = mutation({
  args: { invitationId: v.id("spaceMembers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation || invitation.userId !== userId) {
      throw new Error("Invitation not found or access denied");
    }

    if (invitation.invitationStatus !== "pending") {
      throw new Error("Invitation is no longer pending");
    }

    await ctx.db.patch(args.invitationId, {
      invitationStatus: "accepted",
    });

    return { success: true };
  },
});

export const declineInvitation = mutation({
  args: { invitationId: v.id("spaceMembers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation || invitation.userId !== userId) {
      throw new Error("Invitation not found or access denied");
    }

    if (invitation.invitationStatus !== "pending") {
      throw new Error("Invitation is no longer pending");
    }

    await ctx.db.delete(args.invitationId);
    return { success: true };
  },
});

export const getSpaceMembers = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Check if user is a member of this space
    const userMembership = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
      .first();

    if (!userMembership) {
      return [];
    }

    const memberships = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .collect();

    const members = [];
    for (const membership of memberships) {
      const user = await ctx.db.get(membership.userId);
      if (user) {
        members.push({
          ...membership,
          userName: user.name || "Unknown",
          userEmail: user.email || "",
        });
      }
    }

    return members;
  },
});

export const leaveSpace = mutation({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const space = await ctx.db.get(args.spaceId);
    if (!space) {
      throw new Error("Space not found");
    }

    // Owners cannot leave their own space
    if (space.ownerId === userId) {
      throw new Error("Space owners cannot leave their own space. Delete the space instead.");
    }

    const membership = await ctx.db
      .query("spaceMembers")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!membership) {
      throw new Error("You are not a member of this space");
    }

    await ctx.db.delete(membership._id);
    return { success: true };
  },
});
