import type { Intervention, Recommendation, SkillProposal } from "@/lib/types";

export function IntelligenceSection({
  interventions, recommendations, proposals,
}: {
  interventions: Intervention[];
  recommendations: Recommendation[];
  proposals: SkillProposal[];
}) {
  if (interventions.length === 0 && recommendations.length === 0 && proposals.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Intelligence</h2>

      {interventions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-neutral-500 mb-1.5">Active Interventions</p>
          {interventions.map((i) => (
            <div key={i.id} className="mb-1.5">
              <p className="text-sm">{i.description}</p>
              <p className="text-[10px] text-neutral-500">
                {i.target_domain}/{i.target_metric}
                {i.effect_size != null && <> &middot; effect: {i.effect_size.toFixed(2)}</>}
              </p>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-neutral-500 mb-1.5">Recommendations</p>
          {recommendations.map((r, i) => (
            <div key={i} className="mb-1.5">
              <p className="text-sm">{r.action}</p>
              <p className="text-[10px] text-neutral-500">
                {r.domain}/{r.metric} &middot; confidence: {Math.round(r.confidence * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {proposals.length > 0 && (
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">Skill Proposals</p>
          {proposals.map((p) => (
            <div key={p.id} className="mb-1.5 flex items-start justify-between">
              <div>
                <p className="text-sm">{p.name}</p>
                <p className="text-[10px] text-neutral-500">{p.proposal_type} &middot; seen {p.occurrence_count}x</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
