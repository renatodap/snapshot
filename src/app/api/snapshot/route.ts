import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = createServerClient();
  const uid = process.env.SNAPSHOT_USER_ID!;
  const estDate = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const estNow = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  const todayStart = `${estDate}T00:00:00`;
  const todayEnd = `${estDate}T23:59:59`;

  const results = await Promise.allSettled([
    // Q1: upcoming_deadlines (view, no user_id filter)
    sb.from("upcoming_deadlines").select("*").order("due_date", { ascending: true }).limit(20),
    // Q2: active_open_loops (view, no user_id filter)
    sb.from("active_open_loops").select("*").order("created_at", { ascending: false }).limit(30),
    // Q3: goals
    sb.from("goals").select("id,name,target_value,current_value,status,category,progress_history")
      .eq("user_id", uid).eq("status", "in_progress"),
    // Q4: journal entries
    sb.from("entries").select("entry_date,category,content,tags,mood,energy")
      .eq("user_id", uid).eq("type", "journal").order("entry_date", { ascending: false }).limit(5),
    // Q5: session entries
    sb.from("entries").select("entry_date,content,metadata")
      .eq("user_id", uid).eq("type", "session").order("entry_date", { ascending: false }).limit(2),
    // Q6: habits
    sb.from("habits").select("id,name,frequency,current_streak,best_streak,is_active")
      .eq("user_id", uid).eq("is_active", true),
    // Q8: user_preferences
    sb.from("user_preferences").select("wake_time,sleep_time,calorie_goal,protein_goal,coach_personal_context")
      .eq("user_id", uid).single(),
    // Q9: sleep_records (latest) — use limit(1) without .single() to avoid 406 on 0 rows
    sb.from("sleep_records").select("sleep_date,total_sleep_seconds,sleep_score,sleep_score_qualifier,sleep_start_time,sleep_end_time,resting_heart_rate")
      .eq("user_id", uid).order("sleep_date", { ascending: false }).limit(1),
    // Q10: activities today
    sb.from("activities").select("id,activity_date,start_time,activity_type,activity_name,category,duration_seconds,active_calories,total_calories,avg_heart_rate")
      .eq("user_id", uid).eq("activity_date", estDate),
    // Q11: calendar_events today
    sb.from("calendar_events").select("id,event_date,start_time,end_time,title,event_type,block_type,description")
      .eq("user_id", uid).gte("start_time", todayStart).lte("start_time", todayEnd)
      .order("start_time", { ascending: true }),
    // Q12: workout_plans
    sb.from("workout_plans").select("id,plan_date,status,workout_templates(name,category)")
      .eq("user_id", uid).eq("plan_date", estDate),
    // Q13: meal_entries today
    sb.from("meal_entries").select("id,entry_date,meal_label,entry_time,meal_entry_items(logged_calories,logged_protein,logged_carbs,logged_fat)")
      .eq("user_id", uid).eq("entry_date", estDate),
    // Q15: nutrition context RPC
    sb.rpc("get_daily_nutrition_context", { p_user_id: uid, p_date: estDate }),
    // Q16: reminders
    sb.from("dappa_reminders").select("id,title,reminder_text,remind_at,status")
      .eq("user_id", uid).eq("status", "pending"),
    // Q17: commitments
    sb.from("dappa_commitments").select("id,commitment_text,context,status,created_at")
      .eq("user_id", uid).eq("status", "active"),
    // Q18: interventions
    sb.from("interventions").select("id,intervention_date,intervention_type,description,target_metric,target_domain,baseline_value,outcome_value,effect_size,status")
      .eq("user_id", uid).eq("status", "active"),
    // Q19: recommendations RPC
    sb.rpc("get_recommendation", { p_user_id: uid, p_domain: "health", p_metric: "sleep_score" }),
    // Q20: skill_proposals
    sb.from("skill_proposals").select("id,proposal_type,title,description,occurrence_count,status")
      .eq("user_id", uid).gte("occurrence_count", 3).eq("status", "proposed"),
  ]);

  const labels = [
    "deadlines", "openLoops", "goals", "journal", "sessions", "habits",
    "preferences", "sleep", "activities", "calendar", "workoutPlans", "meals",
    "nutritionContext", "reminders", "commitments", "interventions",
    "recommendations", "skillProposals",
  ];

  const errors: Record<string, string> = {};

  const extract = (r: PromiseSettledResult<{ data: unknown; error: unknown }>, label: string, fallback: unknown = []) => {
    if (r.status === "fulfilled") {
      if (r.value.error) {
        errors[label] = JSON.stringify(r.value.error);
        return fallback;
      }
      return r.value.data ?? fallback;
    }
    errors[label] = r.status === "rejected" ? String(r.reason) : "unknown";
    return fallback;
  };

  const data = {
    timestamp: estNow,
    estDate,
    deadlines: extract(results[0], labels[0]),
    openLoops: extract(results[1], labels[1]),
    goals: extract(results[2], labels[2]),
    journal: extract(results[3], labels[3]),
    sessions: extract(results[4], labels[4]),
    habits: extract(results[5], labels[5]),
    preferences: extract(results[6], labels[6], null),
    sleep: (() => {
      const rows = extract(results[7], labels[7]);
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    })(),
    activities: extract(results[8], labels[8]),
    calendar: extract(results[9], labels[9]),
    workoutPlans: extract(results[10], labels[10]),
    meals: extract(results[11], labels[11]),
    nutritionContext: extract(results[12], labels[12], null),
    reminders: extract(results[13], labels[13]),
    commitments: extract(results[14], labels[14]),
    interventions: extract(results[15], labels[15]),
    recommendations: extract(results[16], labels[16]),
    skillProposals: extract(results[17], labels[17]),
    _errors: Object.keys(errors).length > 0 ? errors : undefined,
  };

  return NextResponse.json(data);
}
