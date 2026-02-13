import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Multi-user family setup
  families: defineTable({
    name: v.string(), // "Pieron Family"
    ownerId: v.string(), // Clerk user ID of primary account holder
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  familyMembers: defineTable({
    familyId: v.id("families"),
    userId: v.optional(v.string()), // Clerk user ID (for adults) or null (for kids)
    name: v.string(), // "Jack", "Roxy", "Aero"
    dateOfBirth: v.optional(v.string()), // ISO date for kids
    isChild: v.boolean(),
    avatarEmoji: v.optional(v.string()), // "👨", "👧", "👦"
    role: v.union(v.literal("parent"), v.literal("child")),
  })
    .index("by_family", ["familyId"])
    .index("by_user", ["userId"]),

  // Core health entries (one per day per user)
  healthEntries: defineTable({
    familyMemberId: v.id("familyMembers"),
    date: v.string(), // ISO date "2026-02-13"
    
    // Metrics (1-10 scales, nullable for partial entries)
    mood: v.optional(v.number()), // 1-10
    energy: v.optional(v.number()), // 1-10
    inflammation: v.optional(v.number()), // 1-10 (pain, swelling, etc.)
    
    // Bowel movements
    bowelMovements: v.optional(v.number()), // Count for the day
    bowelQuality: v.optional(v.union(
      v.literal("solid"),
      v.literal("loose"),
      v.literal("diarrhea"),
      v.literal("constipated")
    )),
    
    // Free-form notes
    notes: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    loggedBy: v.string(), // Clerk user ID of person who logged it (parent for kids)
  })
    .index("by_member_and_date", ["familyMemberId", "date"])
    .index("by_date", ["date"]),

  // Food entries (multiple per day)
  foodEntries: defineTable({
    healthEntryId: v.id("healthEntries"),
    familyMemberId: v.id("familyMembers"),
    date: v.string(), // ISO date
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
    description: v.string(), // "Scrambled eggs and toast"
    timestamp: v.number(), // Exact time logged
  })
    .index("by_health_entry", ["healthEntryId"])
    .index("by_member_and_date", ["familyMemberId", "date"]),

  // Vitamin/supplement entries
  vitaminEntries: defineTable({
    healthEntryId: v.id("healthEntries"),
    familyMemberId: v.id("familyMembers"),
    date: v.string(),
    vitaminName: v.string(), // "Vitamin D3", "Magnesium"
    dosage: v.optional(v.string()), // "1000 IU", "500mg"
    taken: v.boolean(), // true if taken, false if skipped
    timestamp: v.number(),
  })
    .index("by_health_entry", ["healthEntryId"])
    .index("by_member_and_date", ["familyMemberId", "date"]),

  // Medication entries
  medicationEntries: defineTable({
    healthEntryId: v.id("healthEntries"),
    familyMemberId: v.id("familyMembers"),
    date: v.string(),
    medicationName: v.string(),
    dosage: v.string(), // "10mg", "2 tablets"
    taken: v.boolean(),
    timestamp: v.number(),
    
    // For reminder scheduling
    scheduledTime: v.optional(v.string()), // "08:00", "20:00"
  })
    .index("by_health_entry", ["healthEntryId"])
    .index("by_member_and_date", ["familyMemberId", "date"])
    .index("by_scheduled_time", ["familyMemberId", "scheduledTime"]),

  // Medication schedules (recurring reminders)
  medicationSchedules: defineTable({
    familyMemberId: v.id("familyMembers"),
    medicationName: v.string(),
    dosage: v.string(),
    frequency: v.union(
      v.literal("daily"),
      v.literal("twice_daily"),
      v.literal("weekly"),
      v.literal("as_needed")
    ),
    times: v.array(v.string()), // ["08:00", "20:00"] for twice daily
    active: v.boolean(),
    startDate: v.string(), // ISO date
    endDate: v.optional(v.string()), // For courses with end dates
    reminderEnabled: v.boolean(),
  })
    .index("by_member", ["familyMemberId"])
    .index("by_active", ["active"]),

  // AI-generated insights (correlations)
  insights: defineTable({
    familyMemberId: v.id("familyMembers"),
    type: v.union(
      v.literal("correlation"), // "Low energy correlates with..."
      v.literal("pattern"), // "Mood dips every Monday"
      v.literal("alert") // "Medication skipped 3 days in a row"
    ),
    title: v.string(), // "Dairy may cause inflammation"
    description: v.string(), // Detailed explanation
    confidence: v.number(), // 0-1 (how strong the pattern)
    dataPoints: v.number(), // Number of entries analyzed
    dateRange: v.object({
      start: v.string(),
      end: v.string(),
    }),
    dismissed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_member", ["familyMemberId"])
    .index("by_dismissed", ["dismissed"]),
});
