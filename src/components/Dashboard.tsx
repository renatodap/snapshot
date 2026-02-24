"use client";

import { useSnapshot } from "@/hooks/useSnapshot";
import { StatusHeader } from "./sections/StatusHeader";
import { CalendarSection } from "./sections/CalendarSection";
import { HealthSection } from "./sections/HealthSection";
import { WorkoutSection } from "./sections/WorkoutSection";
import { DeadlinesSection } from "./sections/DeadlinesSection";
import { OpenLoopsSection } from "./sections/OpenLoopsSection";
import { CommitmentsSection } from "./sections/CommitmentsSection";
import { GoalsSection } from "./sections/GoalsSection";
import { HabitsSection } from "./sections/HabitsSection";
import { IntelligenceSection } from "./sections/IntelligenceSection";
import { JournalSection } from "./sections/JournalSection";

export function Dashboard() {
  const { data, loading, error, lastUpdated } = useSnapshot();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-500 text-sm">Loading snapshot...</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-400 text-sm">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <StatusHeader data={data} lastUpdated={lastUpdated} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Calendar, Health, Workouts */}
        <div className="space-y-4">
          <CalendarSection events={data.calendar} />
          <HealthSection sleep={data.sleep} nutrition={data.nutritionContext} meals={data.meals} />
          <WorkoutSection activities={data.activities} plans={data.workoutPlans} />
        </div>

        {/* Right column: Deadlines, Open Loops, Commitments, Goals, Habits, Intelligence, Journal */}
        <div className="space-y-4">
          <DeadlinesSection deadlines={data.deadlines} />
          <OpenLoopsSection loops={data.openLoops} />
          <CommitmentsSection commitments={data.commitments} reminders={data.reminders} />
          <GoalsSection goals={data.goals} />
          <HabitsSection habits={data.habits} />
          <IntelligenceSection
            interventions={data.interventions}
            recommendations={data.recommendations}
            proposals={data.skillProposals}
          />
          <JournalSection entries={data.journal} />
        </div>
      </div>
    </div>
  );
}
