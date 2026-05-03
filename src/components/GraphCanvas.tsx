import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { CITIES, ROADS, WeightMetric } from "@/features/graph/data";
import { AlgoStep } from "@/features/algorithms/types";

interface Props {
  step: AlgoStep | null;
  metric?: WeightMetric;
  height?: number;
}

/**
 * Reusable D3 graph canvas. Renders the corridor and reactively highlights
 * nodes/edges based on the active step. Supports zoom, pan, and node drag.
 */
export function GraphCanvas({ step, metric = "distance", height = 460 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const positionsRef = useRef(
    Object.fromEntries(CITIES.map((c) => [c.id, { x: c.x, y: c.y }]))
  );

  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const width = 940;

    // Defs: glow filter + gradient
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom as any);

    const pos = positionsRef.current;

    // Edges
    const edgeG = g.append("g").attr("class", "edges");
    edgeG.selectAll("line")
      .data(ROADS)
      .enter()
      .append("line")
      .attr("data-id", (d) => d.id)
      .attr("x1", (d) => pos[d.source].x).attr("y1", (d) => pos[d.source].y)
      .attr("x2", (d) => pos[d.target].x).attr("y2", (d) => pos[d.target].y)
      .attr("stroke", "hsl(230 25% 30%)")
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round");

    // Edge labels
    edgeG.selectAll("text")
      .data(ROADS).enter().append("text")
      .attr("x", (d) => (pos[d.source].x + pos[d.target].x) / 2)
      .attr("y", (d) => (pos[d.source].y + pos[d.target].y) / 2 - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-family", "ui-monospace, monospace")
      .attr("fill", "hsl(220 15% 70%)")
      .text((d) => `${d[metric]}`);

    // Nodes
    const nodeG = g.append("g").attr("class", "nodes");
    const nodeSel = nodeG.selectAll("g")
      .data(CITIES).enter().append("g")
      .attr("data-id", (d) => d.id)
      .attr("transform", (d) => `translate(${pos[d.id].x},${pos[d.id].y})`)
      .style("cursor", "grab");

    nodeSel.append("circle")
      .attr("r", 22)
      .attr("fill", "hsl(230 30% 14%)")
      .attr("stroke", "hsl(190 95% 55%)")
      .attr("stroke-width", 2);

    nodeSel.append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("fill", "hsl(190 95% 70%)");

    nodeSel.append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 42)
      .attr("font-size", 11)
      .attr("fill", "hsl(210 40% 90%)");

    // Tooltip
    nodeSel.append("title").text((d) => `${d.name} (${d.id})`);

    // Drag
    const drag = d3.drag<SVGGElement, typeof CITIES[number]>()
      .on("drag", function (e, d) {
        pos[d.id] = { x: e.x, y: e.y };
        d3.select(this).attr("transform", `translate(${e.x},${e.y})`);
        edgeG.selectAll<SVGLineElement, typeof ROADS[number]>("line")
          .attr("x1", (r) => pos[r.source].x).attr("y1", (r) => pos[r.source].y)
          .attr("x2", (r) => pos[r.target].x).attr("y2", (r) => pos[r.target].y);
        edgeG.selectAll<SVGTextElement, typeof ROADS[number]>("text")
          .attr("x", (r) => (pos[r.source].x + pos[r.target].x) / 2)
          .attr("y", (r) => (pos[r.source].y + pos[r.target].y) / 2 - 8);
      });
    nodeSel.call(drag as any);

    svg.attr("viewBox", `0 0 ${width} ${height}`);
  }, [metric, height]);

  // React to step changes — color encoding only, no rebuild.
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    const active = new Set(step?.activeEdges ?? []);
    const accepted = new Set(step?.acceptedEdges ?? []);
    const rejected = new Set(step?.rejectedEdges ?? []);
    const activeN = new Set(step?.activeNodes ?? []);
    const visited = new Set(step?.visitedNodes ?? []);

    svg.selectAll<SVGLineElement, typeof ROADS[number]>("line[data-id]")
      .transition().duration(350)
      .attr("stroke", (d) =>
        accepted.has(d.id) ? "hsl(142 76% 50%)" :
        active.has(d.id)   ? "hsl(45 95% 60%)" :
        rejected.has(d.id) ? "hsl(0 70% 55%)" :
        "hsl(230 25% 30%)"
      )
      .attr("stroke-width", (d) =>
        accepted.has(d.id) ? 5 : active.has(d.id) ? 4 : 2.5
      )
      .attr("filter", (d) => (accepted.has(d.id) || active.has(d.id) ? "url(#glow)" : null));

    svg.selectAll<SVGGElement, typeof CITIES[number]>("g[data-id] circle")
      .transition().duration(300)
      .attr("fill", (d: any) =>
        activeN.has(d.id) ? "hsl(190 95% 55%)" :
        visited.has(d.id) ? "hsl(270 60% 35%)" :
        "hsl(230 30% 14%)"
      )
      .attr("stroke", (d: any) =>
        activeN.has(d.id) ? "hsl(190 100% 75%)" :
        visited.has(d.id) ? "hsl(270 80% 65%)" :
        "hsl(190 95% 55%)"
      )
      .attr("filter", (d: any) => (activeN.has(d.id) ? "url(#glow)" : null));
  }, [step]);

  return (
    <div className="glass rounded-2xl p-3 w-full overflow-hidden">
      <svg ref={ref} className="w-full h-auto" />
    </div>
  );
}
