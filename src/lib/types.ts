export interface SnapshotData {
  timestamp: string;
  estDate: string;
  deadlines: Deadline[];
  openLoops: OpenLoop[];
  goals: Goal[];
  journal: JournalEntry[];
  sessions: SessionEntry[];
  habits: Habit[];
  preferences: UserPreferences | null;
  sleep: SleepRecord | null;
  activities: Activity[];
  calendar: CalendarEvent[];
  workoutPlans: WorkoutPlan[];
  meals: MealEntry[];
  nutritionContext: NutritionContext | null;
  reminders: Reminder[];
  commitments: Commitment[];
  interventions: Intervention[];
  recommendations: Recommendation[];
  skillProposals: SkillProposal[];
}

export interface Deadline {
  id: string;
  title: string;
  type: string;
  due_date: string;
  priority: string;
  status: string;
  para_item_id: string | null;
  project_title: string | null;
}

export interface OpenLoop {
  id: string;
  title: string;
  status: string;
  priority: string;
  waiting_on: string | null;
  next_step: string | null;
  created_at: string;
  project_name: string | null;
  project_type: string | null;
}

export interface Goal {
  id: string;
  name: string;
  target_value: number | null;
  current_value: number | null;
  status: string;
  category: string | null;
  progress_history: Record<string, unknown>[] | null;
}

export interface JournalEntry {
  entry_date: string;
  category: string | null;
  content: string;
  tags: string[] | null;
  mood: string | null;
  energy: string | null;
}

export interface SessionEntry {
  entry_date: string;
  content: string;
  metadata: Record<string, unknown> | null;
}

export interface Habit {
  id: string;
  name: string;
  frequency: string;
  current_streak: number;
  best_streak: number;
  is_active: boolean;
}

export interface UserPreferences {
  wake_time: string | null;
  sleep_time: string | null;
  calorie_goal: number | null;
  protein_goal: number | null;
  coach_personal_context: string | null;
}

export interface SleepRecord {
  sleep_date: string;
  total_sleep_seconds: number | null;
  sleep_score: number | null;
  sleep_score_qualifier: string | null;
  sleep_start_time: string | null;
  sleep_end_time: string | null;
  resting_heart_rate: number | null;
}

export interface Activity {
  id: string;
  activity_date: string;
  start_time: string | null;
  activity_type: string | null;
  activity_name: string | null;
  category: string | null;
  duration_seconds: number | null;
  active_calories: number | null;
  total_calories: number | null;
  avg_heart_rate: number | null;
}

export interface CalendarEvent {
  id: string;
  event_date: string;
  start_time: string;
  end_time: string;
  title: string;
  event_type: string;
  block_type: string | null;
  description: string | null;
}

export interface WorkoutPlan {
  id: string;
  planned_date: string | null;
  status: string | null;
  workout_templates: {
    name: string;
    workout_type: string | null;
  } | null;
}

export interface MealEntry {
  id: string;
  entry_date: string;
  meal_label: string | null;
  entry_time: string | null;
  meal_entry_items: MealEntryItem[];
}

export interface MealEntryItem {
  logged_calories: number | null;
  logged_protein: number | null;
  logged_carbs: number | null;
  logged_fat: number | null;
}

export interface NutritionContext {
  day_type: string;
  target_cal: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  reasoning: string[];
  sleep_score: number | null;
  weekly_avg_cal: number | null;
  days_to_competition: number | null;
  competition_name: string | null;
  later_training: boolean;
  today_active_cal: number | null;
  training_readiness: number | null;
  hrv_today: number | null;
}

export interface Reminder {
  id: string;
  content: string;
  remind_at: string;
  recurrence: string | null;
  status: string;
}

export interface Commitment {
  id: string;
  content: string;
  due_at: string | null;
  status: string;
  created_at: string;
}

export interface Intervention {
  id: string;
  intervention_date: string;
  intervention_type: string | null;
  description: string;
  target_metric: string | null;
  target_domain: string | null;
  baseline_value: number | null;
  outcome_value: number | null;
  effect_size: number | null;
  status: string;
}

export interface Recommendation {
  metric: string;
  domain: string;
  action: string;
  confidence: number;
  source: string;
}

export interface SkillProposal {
  id: string;
  proposal_type: string;
  name: string;
  description: string | null;
  occurrence_count: number;
  status: string;
}

export interface InboxItem {
  id: string;
  raw_text: string | null;
  tags: string[];
  source: string;
  captured_at: string;
  processed: boolean;
  metadata: Record<string, unknown>;
}

export type CaptureTag = "meal" | "idea" | "health" | "workout" | "weight";
