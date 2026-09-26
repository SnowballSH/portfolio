export const categories = {
  games: "Chess & Games",
  systems: "Systems & Infrastructure",
  tools: "ML & Tools",
  hackathons: "Hackathons",
  earlier: "Earlier Work",
} as const;

export type Category = keyof typeof categories;

export const categoryOrder = Object.keys(categories) as Category[];
