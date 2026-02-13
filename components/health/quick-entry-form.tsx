"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export function QuickEntryForm({
  familyMemberId,
}: {
  familyMemberId: Id<"familyMembers">;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const existingEntry = useQuery(api.healthEntries.getByDate, {
    familyMemberId,
    date: today,
  });

  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [inflammation, setInflammation] = useState(1);
  const [notes, setNotes] = useState("");

  const saveEntry = useMutation(api.healthEntries.upsert);

  // Load existing entry data
  useEffect(() => {
    if (existingEntry) {
      setMood(existingEntry.mood ?? 5);
      setEnergy(existingEntry.energy ?? 5);
      setInflammation(existingEntry.inflammation ?? 1);
      setNotes(existingEntry.notes ?? "");
    }
  }, [existingEntry]);

  const handleSave = async () => {
    try {
      await saveEntry({
        familyMemberId,
        date: today,
        mood,
        energy,
        inflammation,
        notes: notes || undefined,
      });
      toast.success("Entry saved!");
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Mood: {mood}/10 {getMoodEmoji(mood)}
          </label>
          <Slider
            value={[mood]}
            onValueChange={([val]) => setMood(val)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Energy */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Energy: {energy}/10 {getEnergyEmoji(energy)}
          </label>
          <Slider
            value={[energy]}
            onValueChange={([val]) => setEnergy(val)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Inflammation */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Inflammation/Pain: {inflammation}/10
          </label>
          <Slider
            value={[inflammation]}
            onValueChange={([val]) => setInflammation(val)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes (optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? Any symptoms?"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Save Entry
        </Button>
      </CardContent>
    </Card>
  );
}

function getMoodEmoji(mood: number): string {
  if (mood >= 9) return "😄";
  if (mood >= 7) return "🙂";
  if (mood >= 5) return "😐";
  if (mood >= 3) return "😟";
  return "😢";
}

function getEnergyEmoji(energy: number): string {
  if (energy >= 8) return "⚡";
  if (energy >= 5) return "🔋";
  return "🪫";
}
