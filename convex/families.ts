import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateFamily = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    // Check if family exists
    const existing = await ctx.db
      .query("families")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    if (existing) {
      const member = await ctx.db
        .query("familyMembers")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      return { family: existing, member };
    }

    // Create family + member
    const familyId = await ctx.db.insert("families", {
      name: `${identity.name ?? "My"} Family`,
      ownerId: userId,
      createdAt: Date.now(),
    });

    const memberId = await ctx.db.insert("familyMembers", {
      familyId,
      userId,
      name: identity.name ?? "Me",
      isChild: false,
      avatarEmoji: "👤",
      role: "parent",
    });

    const family = await ctx.db.get(familyId);
    const member = await ctx.db.get(memberId);
    return { family, member };
  },
});

export const getMyMember = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
  },
});
