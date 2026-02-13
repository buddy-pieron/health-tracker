"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QuickEntryForm } from "@/components/health/quick-entry-form";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

export default function TodayPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [memberId, setMemberId] = useState<Id<"familyMembers"> | null>(null);

  const getOrCreate = useMutation(api.families.getOrCreateFamily);
  const myMember = useQuery(api.families.getMyMember);

  useEffect(() => {
    if (isAuthenticated && !myMember) {
      getOrCreate().then((result) => {
        if (result.member) {
          setMemberId(result.member._id);
        }
      });
    } else if (myMember) {
      setMemberId(myMember._id);
    }
  }, [isAuthenticated, myMember, getOrCreate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🏥 Health Tracker</h1>
        <div className="flex items-center gap-4">
          <Link href="/timeline" className="text-sm text-blue-600 hover:underline">
            Timeline
          </Link>
          <UserButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto p-6">
        {memberId ? (
          <QuickEntryForm familyMemberId={memberId} />
        ) : (
          <p className="text-muted-foreground text-center">Setting up your account...</p>
        )}
      </main>
    </div>
  );
}
