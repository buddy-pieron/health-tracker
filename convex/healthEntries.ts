import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsert = mutation({
  args: {
    familyMemberId: v.id("familyMembers"),
    date: v.string(),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
    inflammation: v.optional(v.number()),
    bowelMovements: v.optional(v.number()),
    bowelQuality: v.optional(
      v.union(
        v.literal("solid"),
        v.literal("loose"),
        v.literal("diarrhea"),
        v.literal("constipated")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if entry exists for this date
    const existing = await ctx.db
      .query("healthEntries")
      .withIndex("by_member_and_date", (q) =>
        q.eq("familyMemberId", args.familyMemberId).eq("date", args.date)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        mood: args.mood,
        energy: args.energy,
        inflammation: args.inflammation,
        bowelMovements: args.bowelMovements,
        bowelQuality: args.bowelQuality,
        notes: args.notes,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new entry
      return await ctx.db.insert("healthEntries", {
        familyMemberId: args.familyMemberId,
        date: args.date,
        mood: args.mood,
        energy: args.energy,
        inflammation: args.inflammation,
        bowelMovements: args.bowelMovements,
        bowelQuality: args.bowelQuality,
        notes: args.notes,
        createdAt: now,
        updatedAt: now,
        loggedBy: identity.subject,
      });
    }
  },
});

export const getByDate = query({
  args: {
    familyMemberId: v.id("familyMembers"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("healthEntries")
      .withIndex("by_member_and_date", (q) =>
        q.eq("familyMemberId", args.familyMemberId).eq("date", args.date)
      )
      .unique();
  },
});

export const getLast30Days = query({
  args: { familyMemberId: v.id("familyMembers") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("healthEntries")
      .withIndex("by_member_and_date", (q) =>
        q.eq("familyMemberId", args.familyMemberId)
      )
      .order("desc")
      .take(30);

    return entries;
  },
});
