export const audiences = ["Todos", "Hombre", "Mujer"] as const;
export type Audience = typeof audiences[number];

// Only explicit words in the original product name are evidence.
// Unspecified products remain in Todos; never infer from photos or style.
export function matchesAudience(name: string, audience: Audience): boolean {
  return audience === "Todos" || new RegExp(`\\b${audience}\\b`, "i").test(name);
}
