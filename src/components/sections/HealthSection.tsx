import type { SleepRecord, NutritionContext, MealEntry } from "@/lib/types";
import { sleepHours, progressColor } from "@/lib/format";

export function HealthSection({
  sleep, nutrition, meals,
}: {
  sleep: SleepRecord | null;
  nutrition: NutritionContext | null;
  meals: MealEntry[];
}) {
  const totalCal = meals.reduce((sum, m) => sum + m.meal_entry_items.reduce((s, i) => s + (i.logged_calories ?? 0), 0), 0);
  const totalPro = meals.reduce((sum, m) => sum + m.meal_entry_items.reduce((s, i) => s + (i.logged_protein ?? 0), 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.meal_entry_items.reduce((s, i) => s + (i.logged_carbs ?? 0), 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + m.meal_entry_items.reduce((s, i) => s + (i.logged_fat ?? 0), 0), 0);

  const calPct = nutrition?.target_cal ? Math.round((totalCal / nutrition.target_cal) * 100) : 0;
  const proPct = nutrition?.target_protein ? Math.round((totalPro / nutrition.target_protein) * 100) : 0;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Health</h2>

      {/* Sleep */}
      {sleep && (
        <div className="mb-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-500">Sleep</span>
            <span className="text-xs text-neutral-500">{sleep.sleep_date}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-lg font-bold">{sleepHours(sleep.total_sleep_seconds)}</span>
            </div>
            {sleep.sleep_score != null && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm">Score: {sleep.sleep_score}</span>
                {sleep.sleep_score_qualifier && (
                  <span className="text-xs text-neutral-500">({sleep.sleep_score_qualifier})</span>
                )}
              </div>
            )}
            {sleep.resting_heart_rate != null && (
              <span className="text-sm text-neutral-400">RHR {sleep.resting_heart_rate}</span>
            )}
          </div>
        </div>
      )}

      {/* Nutrition */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500">Nutrition ({meals.length} meals)</span>
          {nutrition && (
            <span className="text-xs text-neutral-500">Target: {nutrition.target_cal} cal</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <MacroBar label="Cal" value={totalCal} target={nutrition?.target_cal ?? 0} unit="" />
          <MacroBar label="Pro" value={Math.round(totalPro)} target={nutrition?.target_protein ?? 0} unit="g" />
          <MacroBar label="Carb" value={Math.round(totalCarbs)} target={nutrition?.target_carbs ?? 0} unit="g" />
          <MacroBar label="Fat" value={Math.round(totalFat)} target={nutrition?.target_fat ?? 0} unit="g" />
        </div>

        {nutrition?.reasoning && nutrition.reasoning.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {nutrition.reasoning.map((r, i) => (
              <p key={i} className="text-[10px] text-neutral-500">{r}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MacroBar({ label, value, target, unit }: { label: string; value: number; target: number; unit: string }) {
  const pct = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;
  return (
    <div>
      <p className="text-[10px] text-neutral-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}{unit}</p>
      {target > 0 && (
        <>
          <div className="w-full h-1 bg-neutral-800 rounded-full mt-1">
            <div className={`h-1 rounded-full ${progressColor(pct)}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-neutral-500 mt-0.5">/ {target}{unit}</p>
        </>
      )}
    </div>
  );
}
