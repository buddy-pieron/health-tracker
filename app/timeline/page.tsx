"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

function getMoodEmoji(mood: number): string {
  if (mood >= 9) return "😄";
  if (mood >= 7) return "🙂";
  if (mood >= 5) return "😐";
  if (mood >= 3) return "😟";
  return "😢";
}

export default function TimelinePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const myMember = useQuery(api.families.getMyMember);
  const entries = useQuery(
    api.healthEntries.getLast30Days,
    myMember ? { familyMemberId: myMember._id } : "skip"
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🏥 Health Tracker</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Today
          </Link>
          <UserButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold">Timeline</h2>
        {!entries || entries.length === 0 ? (
          <p className="text-muted-foreground">
            No entries yet. <Link href="/" className="text-blue-600 hover:underline">Log your first entry!</Link>
          </p>
        ) : (
          entries.map((entry) => (
            <Card key={entry._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {format(new Date(entry.date + "T12:00:00"), "EEEE, MMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {entry.mood != null && (
                    <div>
                      <span className="text-muted-foreground">Mood</span>
                      <p className="font-medium">
                        {entry.mood}/10 {getMoodEmoji(entry.mood)}
                      </p>
                    </div>
                  )}
                  {entry.energy != null && (
                    <div>
                      <span className="text-muted-foreground">Energy</span>
                      <p className="font-medium">{entry.energy}/10</p>
                    </div>
                  )}
                  {entry.inflammation != null && (
                    <div>
                      <span className="text-muted-foreground">Inflammation</span>
                      <p className="font-medium">{entry.inflammation}/10</p>
                    </div>
                  )}
                </div>
                {entry.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">{entry.notes}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
