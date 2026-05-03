// Core graph data for the Delhi–Dehradun Expressway corridor.
// Coordinates are normalized SVG positions for a clean horizontal layout.

export interface CityNode {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface RoadEdge {
  id: string;
  source: string;
  target: string;
  distance: number; // km
  toll: number;     // INR
  fuel: number;     // liters estimate
}

export const CITIES: CityNode[] = [
  { id: "DEL", name: "Delhi",        x: 80,  y: 320 },
  { id: "MEE", name: "Meerut",       x: 260, y: 220 },
  { id: "MUZ", name: "Muzaffarnagar",x: 460, y: 180 },
  { id: "ROO", name: "Roorkee",      x: 660, y: 230 },
  { id: "DEH", name: "Dehradun",     x: 860, y: 140 },
];

// Realistic-ish weights for the 210 km expressway corridor + alternates.
export const ROADS: RoadEdge[] = [
  { id: "e1", source: "DEL", target: "MEE", distance: 70,  toll: 155, fuel: 5.4 },
  { id: "e2", source: "MEE", target: "MUZ", distance: 60,  toll: 120, fuel: 4.6 },
  { id: "e3", source: "MUZ", target: "ROO", distance: 45,  toll: 95,  fuel: 3.5 },
  { id: "e4", source: "ROO", target: "DEH", distance: 35,  toll: 80,  fuel: 2.8 },
  // Alternates
  { id: "e5", source: "DEL", target: "MUZ", distance: 145, toll: 240, fuel: 11.2 },
  { id: "e6", source: "MEE", target: "ROO", distance: 120, toll: 200, fuel: 9.0 },
  { id: "e7", source: "MUZ", target: "DEH", distance: 95,  toll: 180, fuel: 7.2 },
  { id: "e8", source: "DEL", target: "ROO", distance: 180, toll: 290, fuel: 13.8 },
];

export type WeightMetric = "distance" | "toll" | "fuel";
