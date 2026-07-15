// Shared SVG "figure grammar" ported from the validated mockup
// (/tmp/forge-skill-library-mockup.html): every agent figure is nodes
// (traits/joints) + edges (relationships) on the same dark canvas, one
// accent hue per agent, colored via `currentColor` so the figure inherits
// whatever `color` the surrounding element sets (card / modal both set
// `color: var(--card-accent)`).
//
// All coordinates below are ported 1:1 from the mockup's JS builder
// functions (orchestratorFace / orchestratorBody / seedGraph) — this is
// deliberately not "re-art directed", just re-expressed as JSX.

import type { JSX } from "react";

let keyCounter = 0;
function nextKey() {
  keyCounter += 1;
  return keyCounter;
}

function Edge({
  x1,
  y1,
  x2,
  y2,
  ghost,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ghost?: boolean;
}) {
  return (
    <line
      className={`fig-edge${ghost ? " ghost" : ""}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
  );
}

function Node({
  cx,
  cy,
  r,
  variant,
}: {
  cx: number;
  cy: number;
  r: number;
  variant?: "crest" | "head" | "eye" | "jaw" | "neck" | "joint" | "pulse-node" | "ghost";
}) {
  return <circle className={`fig-node${variant ? ` ${variant}` : ""}`} cx={cx} cy={cy} r={r} />;
}

/** Small "face" graph used on the badge card (10-12 nodes). Only the
 * orchestrator has one this round. */
export function OrchestratorFace() {
  return (
    <svg
      viewBox="48 18 44 92"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <Edge x1={70} y1={32} x2={58} y2={40} />
      <Edge x1={70} y1={32} x2={82} y2={40} />
      <Edge x1={70} y1={58} x2={58} y2={74} />
      <Edge x1={70} y1={58} x2={70} y2={80} />
      <Edge x1={70} y1={58} x2={82} y2={74} />
      <Edge x1={70} y1={58} x2={70} y2={96} />
      <Node cx={58} cy={40} r={3} variant="crest" />
      <Node cx={70} cy={32} r={3.5} variant="crest" />
      <Node cx={82} cy={40} r={3} variant="crest" />
      <Edge x1={58} y1={40} x2={70} y2={58} />
      <Edge x1={82} y1={40} x2={70} y2={58} />
      <Node cx={70} cy={58} r={7} variant="head" />
      <Node cx={64} cy={56} r={2} variant="eye" />
      <Node cx={76} cy={56} r={2} variant="eye" />
      <Node cx={58} cy={74} r={3} variant="jaw" />
      <Node cx={70} cy={80} r={3} variant="jaw" />
      <Node cx={82} cy={74} r={3} variant="jaw" />
      <Node cx={70} cy={96} r={3} variant="neck" />
    </svg>
  );
}

/** Full-body graph (32 nodes / 30 edges) used in the modal. Each of the 4
 * arms is one <g> holding BOTH its nodes and its connecting edges, pivoting
 * with `transform-box: view-box` on its own shoulder coordinate — see the
 * `.arm-*` rules in globals.css for why (never `fill-box`, or the limb
 * visually detaches from the torso on every rotate() frame). */
export function OrchestratorBody() {
  return (
    <svg
      viewBox="0 -20 212 312"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className="figure-group">
        {/* torso + head */}
        <Edge x1={100} y1={10} x2={84} y2={18} />
        <Edge x1={100} y1={10} x2={116} y2={18} />
        <Edge x1={84} y1={18} x2={100} y2={38} />
        <Edge x1={116} y1={18} x2={100} y2={38} />
        <Edge x1={100} y1={38} x2={100} y2={58} />
        <Edge x1={100} y1={58} x2={100} y2={82} />
        <Edge x1={100} y1={82} x2={66} y2={72} />
        <Edge x1={100} y1={82} x2={134} y2={72} />
        <Edge x1={100} y1={82} x2={100} y2={112} />
        <Edge x1={100} y1={112} x2={62} y2={108} />
        <Edge x1={100} y1={112} x2={138} y2={108} />
        <Edge x1={100} y1={112} x2={100} y2={150} />
        <Edge x1={100} y1={150} x2={86} y2={152} />
        <Edge x1={86} y1={152} x2={80} y2={215} />
        <Edge x1={80} y1={215} x2={75} y2={278} />
        <Edge x1={100} y1={150} x2={114} y2={152} />
        <Edge x1={114} y1={152} x2={120} y2={215} />
        <Edge x1={120} y1={215} x2={125} y2={278} />

        <Node cx={84} cy={18} r={3} variant="crest" />
        <Node cx={100} cy={10} r={3.5} variant="crest" />
        <Node cx={116} cy={18} r={3} variant="crest" />
        <Node cx={100} cy={38} r={6} variant="head" />
        <Node cx={94} cy={36} r={2} variant="eye" />
        <Node cx={106} cy={36} r={2} variant="eye" />
        <Node cx={100} cy={58} r={3.5} variant="pulse-node" />
        <Node cx={100} cy={82} r={4.5} variant="pulse-node" />
        <Node cx={66} cy={72} r={4.5} variant="joint" />
        <Node cx={134} cy={72} r={4.5} variant="joint" />
        <Node cx={100} cy={112} r={4.5} variant="pulse-node" />
        <Node cx={62} cy={108} r={4.5} variant="joint" />
        <Node cx={138} cy={108} r={4.5} variant="joint" />
        <Node cx={100} cy={150} r={4.5} variant="pulse-node" />
        <Node cx={86} cy={152} r={3.5} variant="joint" />
        <Node cx={114} cy={152} r={3.5} variant="joint" />
        <Node cx={80} cy={215} r={3.5} variant="joint" />
        <Node cx={120} cy={215} r={3.5} variant="joint" />
        <Node cx={75} cy={278} r={4} variant="joint" />
        <Node cx={125} cy={278} r={4} variant="joint" />

        {/* Four arms, each reaching outward and away from the torso
            centerline and from each other, so none of the four ever
            cross — diagonal up-left, near-vertical up-right,
            near-vertical down-left, diagonal down-right. Each ends in
            its own short dashed "ghost" fingertip. */}
        <g className="arm-ul">
          <Edge x1={66} y1={72} x2={46} y2={48} />
          <Node cx={46} cy={48} r={3.5} />
          <Edge x1={46} y1={48} x2={28} y2={20} />
          <Node cx={28} cy={20} r={4} />
          <Edge x1={28} y1={20} x2={16} y2={2} ghost />
          <Node cx={16} cy={2} r={2.5} variant="ghost" />
        </g>
        <g className="arm-ur">
          <Edge x1={134} y1={72} x2={142} y2={40} />
          <Node cx={142} cy={40} r={3.5} />
          <Edge x1={142} y1={40} x2={150} y2={10} />
          <Node cx={150} cy={10} r={4} />
          <Edge x1={150} y1={10} x2={155} y2={-8} ghost />
          <Node cx={155} cy={-8} r={2.5} variant="ghost" />
        </g>
        <g className="arm-ll">
          <Edge x1={62} y1={108} x2={52} y2={140} />
          <Node cx={52} cy={140} r={3.5} />
          <Edge x1={52} y1={140} x2={46} y2={172} />
          <Node cx={46} cy={172} r={4} />
          <Edge x1={46} y1={172} x2={42} y2={190} ghost />
          <Node cx={42} cy={190} r={2.5} variant="ghost" />
        </g>
        <g className="arm-lr">
          <Edge x1={138} y1={108} x2={162} y2={128} />
          <Node cx={162} cy={128} r={3.5} />
          <Edge x1={162} y1={128} x2={182} y2={152} />
          <Node cx={182} cy={152} r={4} />
          <Edge x1={182} y1={152} x2={196} y2={170} ghost />
          <Node cx={196} cy={170} r={2.5} variant="ghost" />
        </g>
      </g>
    </svg>
  );
}

/** Small "face" graph used on the badge card (10 nodes / 6 edges). Ported
 * 1:1 from the validated design harness (/tmp/product-figure-test.html): a
 * head-and-shoulders bust with one asymmetric raised-brow node and a short
 * ghost reach toward a small halo'd/pulsing node — the same
 * skeptical-attention read as the full body, compressed to badge size. */
export function ProductFace() {
  return (
    <svg
      viewBox="46 32 68 62"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <Edge x1={76} y1={56} x2={86} y2={44} />
      <Edge x1={70} y1={58} x2={70} y2={80} />
      <Edge x1={70} y1={58} x2={58} y2={74} />
      <Edge x1={70} y1={58} x2={82} y2={74} />
      <Edge x1={82} y1={74} x2={94} y2={64} />
      <Edge x1={94} y1={64} x2={104} y2={50} ghost />

      <Node cx={70} cy={58} r={7} variant="head" />
      <Node cx={64} cy={56} r={2} variant="eye" />
      <Node cx={76} cy={56} r={2} variant="eye" />
      <Node cx={86} cy={44} r={2.5} variant="crest" />
      <Node cx={70} cy={80} r={3} variant="jaw" />
      <Node cx={58} cy={74} r={3} variant="jaw" />
      <Node cx={82} cy={74} r={3} variant="jaw" />
      <Node cx={94} cy={64} r={2} variant="joint" />
      <Node cx={104} cy={50} r={5} variant="ghost" />
      <Node cx={104} cy={50} r={2.5} variant="pulse-node" />
    </svg>
  );
}

/** Full-body graph (28 nodes / 24 edges) used in the modal. Deliberately TWO
 * arms, not four — the contrast with the Orchestrator's four-armed
 * conducting pose: this figure holds a position rather than gestures
 * broadly. Same limb convention as the Orchestrator (one <g> per arm holding
 * both its nodes and edges, pivoting with `transform-box: view-box` at its
 * true shoulder coordinate) but with two different arms instead of four
 * symmetric ones — see the `.arm-raise` / `.arm-lower` rules in globals.css.
 *
 * Raised arm (screen-right) reaches via a dashed/ghost edge toward an
 * isolated, two-layer-halo'd node: the riskiest assumption, pointed at, not
 * held. Lowered arm (screen-left) fans into four dim ghost nodes: discarded
 * assumptions. */
export function ProductBody() {
  return (
    <svg
      viewBox="0 -20 212 312"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className="figure-group">
        {/* torso + head */}
        <Edge x1={106} y1={36} x2={118} y2={20} />
        <Edge x1={94} y1={36} x2={90} y2={26} />
        <Edge x1={100} y1={38} x2={100} y2={58} />
        <Edge x1={100} y1={58} x2={100} y2={82} />
        <Edge x1={100} y1={82} x2={66} y2={72} />
        <Edge x1={100} y1={82} x2={134} y2={72} />
        <Edge x1={100} y1={82} x2={100} y2={112} />
        <Edge x1={100} y1={112} x2={100} y2={150} />
        <Edge x1={100} y1={150} x2={86} y2={152} />
        <Edge x1={100} y1={150} x2={114} y2={152} />
        <Edge x1={86} y1={152} x2={78} y2={196} />
        <Edge x1={78} y1={196} x2={72} y2={262} />
        <Edge x1={114} y1={152} x2={124} y2={206} />
        <Edge x1={124} y1={206} x2={130} y2={272} />
        <Edge x1={72} y1={262} x2={60} y2={266} ghost />

        <Node cx={118} cy={20} r={2.5} variant="crest" />
        <Node cx={90} cy={26} r={1.8} variant="crest" />
        <Node cx={100} cy={38} r={6.5} variant="head" />
        <Node cx={94} cy={36} r={2} variant="eye" />
        <Node cx={106} cy={36} r={2} variant="eye" />
        <Node cx={100} cy={58} r={3.5} variant="pulse-node" />
        <Node cx={100} cy={82} r={4.5} variant="pulse-node" />
        <Node cx={66} cy={72} r={4.5} variant="joint" />
        <Node cx={134} cy={72} r={4.5} variant="joint" />
        <Node cx={100} cy={112} r={4.5} variant="pulse-node" />
        <Node cx={100} cy={150} r={4.5} variant="pulse-node" />
        <Node cx={86} cy={152} r={3.5} variant="joint" />
        <Node cx={114} cy={152} r={3.5} variant="joint" />
        <Node cx={78} cy={196} r={3.5} variant="joint" />
        <Node cx={124} cy={206} r={3.5} variant="joint" />
        <Node cx={72} cy={262} r={4} variant="joint" />
        <Node cx={130} cy={272} r={4} variant="joint" />
        <Node cx={60} cy={266} r={1.5} variant="ghost" />

        {/* raised arm (screen-right): reaches toward an isolated, halo'd
            node via a dashed ghost edge — the riskiest assumption, pointed
            at, not held. */}
        <g className="arm-raise">
          <Edge x1={134} y1={72} x2={158} y2={48} />
          <Node cx={158} cy={48} r={3.5} />
          <Edge x1={158} y1={48} x2={176} y2={22} />
          <Node cx={176} cy={22} r={4} />
          <Edge x1={176} y1={22} x2={194} y2={-4} ghost />
          <Node cx={194} cy={-4} r={8} variant="ghost" />
          <Node cx={194} cy={-4} r={4.5} variant="pulse-node" />
        </g>

        {/* lowered arm (screen-left): fans into four dim ghost nodes —
            discarded assumptions. */}
        <g className="arm-lower">
          <Edge x1={66} y1={72} x2={46} y2={98} />
          <Node cx={46} cy={98} r={3.5} />
          <Edge x1={46} y1={98} x2={34} y2={128} />
          <Node cx={34} cy={128} r={4} />
          <Edge x1={34} y1={128} x2={20} y2={148} ghost />
          <Edge x1={34} y1={128} x2={26} y2={160} ghost />
          <Edge x1={34} y1={128} x2={40} y2={164} ghost />
          <Edge x1={34} y1={128} x2={46} y2={150} ghost />
          <Node cx={20} cy={148} r={2.5} variant="ghost" />
          <Node cx={26} cy={160} r={2} variant="ghost" />
          <Node cx={40} cy={164} r={2} variant="ghost" />
          <Node cx={46} cy={150} r={2} variant="ghost" />
        </g>
      </g>
    </svg>
  );
}

/** Small "face" graph used on the badge card. Ported from the validated v2
 * design harness (/tmp/design-face-v2-test.html) — a beret'd head-and-
 * shoulders bust, deliberately distinct from ProductFace's silhouette: only
 * ONE shoulder (screen-left) trails off into a dim ghost node, an unfinished
 * sketch line rather than a symmetric jaw fan. The other shoulder
 * (screen-right) becomes an arm — shoulder -> elbow -> wrist.
 *
 * The wrist used to turn a right-angle frame/viewfinder corner (the
 * `.arm-frame` motif echoed at badge scale). Swapped for a small spiral
 * curl echoing DesignBody's round-4 coil hand instead, once that became the
 * approved brush-hand direction — kept deliberately smaller/simpler than the
 * body's 17-segment coil (a single ~300° curl, 7 segments, no flow
 * animation) so the badge stays legible rather than confusing at its much
 * smaller render size; see the DesignBody comment for the coil's origin
 * story. Same halo'd/pulsing tip treatment as before. */
export function DesignFace() {
  return (
    <svg
      viewBox="44 28 72 70"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* beret */}
      <Edge x1={70} y1={51} x2={58} y2={44} />
      <Edge x1={70} y1={51} x2={78} y2={36} />
      {/* single left shoulder trailing off (sketch fading) */}
      <Edge x1={70} y1={58} x2={56} y2={76} />
      <Edge x1={56} y1={76} x2={50} y2={92} ghost />
      {/* right shoulder -> elbow -> wrist */}
      <Edge x1={70} y1={58} x2={88} y2={70} />
      <Edge x1={88} y1={70} x2={104} y2={66} />
      {/* small spiral curl off the wrist -- badge-scale echo of DesignBody's
          coil hand, ~300deg sweep over 7 short segments */}
      <Edge x1={104} y1={66} x2={106} y2={57} />
      <Edge x1={106} y1={57} x2={106.23} y2={54.33} />
      <Edge x1={106.23} y1={54.33} x2={103.62} y2={54.62} />
      <Edge x1={103.62} y1={54.62} x2={101.97} y2={57.35} />
      <Edge x1={101.97} y1={57.35} x2={103.29} y2={60.87} />
      <Edge x1={103.29} y1={60.87} x2={107.4} y2={62.22} />
      <Edge x1={107.4} y1={62.22} x2={111.51} y2={59.57} />

      <Node cx={70} cy={58} r={7} variant="head" />
      <Node cx={64} cy={56} r={2} variant="eye" />
      <Node cx={76} cy={56} r={2} variant="eye" />
      <Node cx={58} cy={44} r={3.2} variant="crest" />
      <Node cx={78} cy={36} r={2.2} variant="crest" />
      <Node cx={56} cy={76} r={3.2} variant="jaw" />
      <Node cx={50} cy={92} r={2} variant="ghost" />
      <Node cx={88} cy={70} r={3.2} variant="joint" />
      <Node cx={104} cy={66} r={2.5} variant="joint" />
      <Node cx={111.51} cy={59.57} r={4.5} variant="ghost" />
      <Node cx={111.51} cy={59.57} r={2.2} variant="pulse-node" />
    </svg>
  );
}

/** Full-body graph used in the modal. Deliberately TWO asymmetric arms,
 * ported from the validated design harness (/tmp/design-figure-test.html).
 * The brush hand went through four rounds before landing here — a wedge +
 * hatch head, a square block with ghost-dashed bristles, five jointed
 * fingers with glowing tips — all rejected. Round 4, "spiral / exhaled
 * branch" (/tmp/design-brush-compare/spiral.html), is what's below: the
 * user's own direction ("faça a mão ser um espiral, como se fosse um braço
 * exalando arte, tipo galhos de uma árvore em espiral").
 *
 * Same limb convention as the Orchestrator / Product (one <g> per arm
 * holding both its nodes and edges, pivoting with `transform-box: view-box`
 * at its true shoulder coordinate) — see the `.arm-brush` / `.arm-frame`
 * rules in globals.css.
 *
 * Brush arm (screen-right): shoulder->elbow->wrist unchanged, then the hand
 * itself is a single coiling line — an Archimedean spiral (constant winding
 * gap at every radius, chosen so the inner turns don't merge into a blob at
 * modal scale) approximated by 17 short `<line>` segments (BRUSH_COIL_SEGMENTS
 * below), with two short twig offshoots and a glowing tip. The whole-arm
 * rigid rotate() sway that drove every earlier round is retired for this
 * one — spinning the coil like that reads as a pinwheel, not something
 * growing — so `.arm-brush` now holds a tame ambient tremor (same register
 * as the sibling `.arm-frame`) while the coil's motion is a continuous
 * `stroke-dashoffset` flow along its own path (the same technique/cost
 * class as the old `.brush-ink` line, just extended across 17
 * phase-staggered segments so it reads as one continuous line of flowing
 * ink rather than 17 dashes blinking independently). Frame arm
 * (screen-left): hand branches into a right-angle L with two dashed ghost
 * edges hinting at a rectangle — an artist's viewfinder/framing gesture,
 * unchanged. */
// Archimedean spiral (r = r0 + b*t, b = 1.3 -> constant 8.17-unit winding
// gap at every radius) approximating the brush-hand coil, computed in
// /tmp/design-brush-compare/geom_spiral_final.py — not eyeballed. Row 0 is
// the stem (wrist -> spiral pole); rows 1-16 are the coil itself. The 5th
// tuple entry is each segment's negative animation-delay (seconds),
// pre-computed as that segment's cumulative distance from the wrist mod
// the dash-repeat length, so the flow phase-staggers into one continuous
// traveling mark instead of 17 dashes blinking in sync.
const BRUSH_COIL_SEGMENTS: Array<[number, number, number, number, number]> = [
  [168, 40, 179.29, 30.12, -0.0],
  [182.23, 28.86, 181.5, 26.86, -0.344],
  [181.5, 26.86, 179.42, 25.44, -0.676],
  [179.42, 25.44, 176.49, 25.48, -0.07],
  [176.49, 25.48, 173.77, 27.39, -0.527],
  [173.77, 27.39, 172.43, 30.88, -0.048],
  [172.43, 30.88, 173.34, 34.92, -0.632],
  [173.34, 34.92, 176.64, 38.07, -0.279],
  [176.64, 38.07, 181.52, 38.97, -0.991],
  [181.52, 38.97, 186.48, 36.87, -0.768],
  [186.48, 36.87, 189.71, 32.07, -0.608],
  [189.71, 32.07, 189.8, 25.86, -0.513],
  [189.8, 25.86, 186.27, 20.26, -0.482],
  [186.27, 20.26, 179.89, 17.31, -0.517],
  [179.89, 17.31, 172.52, 18.37, -0.615],
  [172.52, 18.37, 166.59, 23.53, -0.779],
  [166.59, 23.53, 164.31, 31.48, -0.007],
];

export function DesignBody() {
  return (
    <svg
      viewBox="0 -20 212 312"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className="figure-group">
        {/* torso + head */}
        <Edge x1={98} y1={34} x2={80} y2={20} />
        <Edge x1={98} y1={34} x2={118} y2={16} />
        <Edge x1={100} y1={38} x2={100} y2={58} />
        <Edge x1={100} y1={58} x2={100} y2={82} />
        <Edge x1={100} y1={82} x2={66} y2={72} />
        <Edge x1={100} y1={82} x2={134} y2={72} />
        <Edge x1={100} y1={82} x2={100} y2={112} />
        <Edge x1={100} y1={112} x2={100} y2={150} />
        <Edge x1={100} y1={150} x2={86} y2={152} />
        <Edge x1={100} y1={150} x2={114} y2={152} />
        <Edge x1={86} y1={152} x2={76} y2={198} />
        <Edge x1={76} y1={198} x2={70} y2={266} />
        <Edge x1={114} y1={152} x2={126} y2={192} />
        <Edge x1={126} y1={192} x2={138} y2={258} />

        <Node cx={80} cy={20} r={3.5} variant="crest" />
        <Node cx={118} cy={16} r={2.6} variant="crest" />
        <Node cx={100} cy={38} r={6.5} variant="head" />
        <Node cx={94} cy={36} r={2} variant="eye" />
        <Node cx={106} cy={36} r={2} variant="eye" />
        <Node cx={100} cy={58} r={3.5} variant="pulse-node" />
        <Node cx={100} cy={82} r={4.5} variant="pulse-node" />
        <Node cx={66} cy={72} r={4.5} variant="joint" />
        <Node cx={134} cy={72} r={4.5} variant="joint" />
        <Node cx={100} cy={112} r={4.5} variant="pulse-node" />
        <Node cx={100} cy={150} r={4.5} variant="pulse-node" />
        <Node cx={86} cy={152} r={3.5} variant="joint" />
        <Node cx={114} cy={152} r={3.5} variant="joint" />
        <Node cx={76} cy={198} r={3.5} variant="joint" />
        <Node cx={126} cy={192} r={3.5} variant="joint" />
        <Node cx={70} cy={266} r={4} variant="joint" />
        <Node cx={138} cy={258} r={4} variant="joint" />

        {/* brush arm (screen-right): a single coiling line growing out of
            the wrist -- read as a branch spiraling outward, ink/energy
            continuously exhaled along it. Base coil shape is plain static
            .fig-edge weight (always fully drawn, so the silhouette reads
            at every animation phase); .brush-coil-flow is a second, thinner
            dashed line riding the exact same coordinates, carrying the
            traveling "ink" highlight -- two layers because a single
            stroke-width-2.75/dasharray-"5 1.4" line was tried first and its
            round line-caps bulged enough to bridge every gap, making the
            flow invisible (verified by diffing two dashoffset phases:
            pixel-identical). The two twigs and coil tip are ghost-halo'd
            pulse nodes with staggered delays so a pulse visibly travels
            outward along them. */}
        <g className="arm-brush">
          <Edge x1={134} y1={72} x2={152} y2={54} />
          <Node cx={152} cy={54} r={3.5} />
          <Edge x1={152} y1={54} x2={168} y2={40} />
          <Node cx={168} cy={40} r={4.5} />

          <g className="brush-coil-group">
            {BRUSH_COIL_SEGMENTS.map(([x1, y1, x2, y2], i) => (
              <line key={`coil-base-${i}`} className="fig-edge" x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
            {BRUSH_COIL_SEGMENTS.map(([x1, y1, x2, y2, delay], i) => (
              <line
                key={`coil-flow-${i}`}
                className="brush-coil-flow"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ animationDelay: `${delay}s` }}
              />
            ))}

            {/* twig 1: branches off the coil's outer loop, angled into open
                space -- a first draft sprouting from an inner-loop point
                landed its tip 3.3 units from the wrist node and visually
                fused with it; this point clears the wrist by 21.3 units and
                the nearest coil point by 8.3. */}
            <line className="fig-edge" x1={186.48} y1={36.87} x2={189.19} y2={42.23} />
            <Node cx={189.19} cy={42.23} r={5} variant="ghost" />
            <circle className="fig-node pulse-node" cx={189.19} cy={42.23} r={2.4} style={{ animationDelay: "0.7s" }} />

            {/* twig 2: second branch, outer loop */}
            <line className="fig-edge" x1={186.27} y1={20.26} x2={187.73} y2={14.96} />
            <Node cx={187.73} cy={14.96} r={5} variant="ghost" />
            <circle className="fig-node pulse-node" cx={187.73} cy={14.96} r={2.4} style={{ animationDelay: "1.1s" }} />

            {/* coil tip: the actively-growing point, brightest pulse */}
            <Node cx={164.31} cy={31.48} r={5.5} variant="ghost" />
            <circle className="fig-node pulse-node" cx={164.31} cy={31.48} r={3} style={{ animationDelay: "1.6s" }} />
          </g>
        </g>

        {/* frame arm (screen-left): hand held in an L / viewfinder-corner
            gesture, ghost edges hinting at the rest of a composition
            rectangle not yet solid. */}
        <g className="arm-frame">
          <Edge x1={66} y1={72} x2={48} y2={88} />
          <Node cx={48} cy={88} r={3.5} />
          <Edge x1={48} y1={88} x2={54} y2={64} />
          <Node cx={54} cy={64} r={4} />
          <Edge x1={54} y1={64} x2={54} y2={46} />
          <Node cx={54} cy={46} r={2.2} />
          <Edge x1={54} y1={64} x2={78} y2={64} />
          <Node cx={78} cy={64} r={2.2} />
          <Edge x1={54} y1={46} x2={78} y2={46} ghost />
          <Edge x1={78} y1={64} x2={78} y2={46} ghost />
          <Node cx={78} cy={46} r={1.6} variant="ghost" />
        </g>
      </g>
    </svg>
  );
}

const READY_FACES: Record<string, () => JSX.Element> = {
  orchestrator: OrchestratorFace,
  product: ProductFace,
  design: DesignFace,
};

const READY_BODIES: Record<string, () => JSX.Element> = {
  orchestrator: OrchestratorBody,
  product: ProductBody,
  design: DesignBody,
};

/** Looks up the card/modal figure components for a given agent id. Callers
 * should only use the returned components when `agent.ready` is true —
 * unready/unavailable agents render `SeedGraph` instead (see AgentCard /
 * AgentModal). Kept here, next to the components themselves, so adding the
 * next ready agent's figures is a one-line addition to these two maps. */
export function getReadyFigures(id: string): {
  Face: (() => JSX.Element) | undefined;
  Body: (() => JSX.Element) | undefined;
} {
  return { Face: READY_FACES[id], Body: READY_BODIES[id] };
}

const SEED_POINTS: Array<[number, number]> = [
  [70, 30],
  [55, 50],
  [85, 50],
  [70, 65],
  [50, 85],
  [90, 85],
  [70, 100],
  [60, 120],
  [80, 120],
];

/** Generic small "seed" graph used for locked/coming-soon (and
 * unavailable) badges — deterministic per `seed` so server- and
 * client-rendered markup always match. */
export function SeedGraph({ seed }: { seed: number }) {
  const n = 6 + (seed % 3); // 6-8 nodes
  const elements: JSX.Element[] = [];
  for (let i = 1; i < n; i++) {
    const p = SEED_POINTS[i];
    const prev = SEED_POINTS[Math.max(0, i - 1 - (seed % 2))];
    elements.push(<Edge key={nextKey()} x1={prev[0]} y1={prev[1]} x2={p[0]} y2={p[1]} />);
  }
  for (let j = 0; j < n; j++) {
    elements.push(<Node key={nextKey()} cx={SEED_POINTS[j][0]} cy={SEED_POINTS[j][1]} r={j === 0 ? 5 : 3} />);
  }
  return (
    <svg viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {elements}
    </svg>
  );
}
