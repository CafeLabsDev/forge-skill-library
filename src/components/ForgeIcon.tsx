type ForgeIconProps = {
  className?: string;
};

// Forge mark: amber hexagon (brand color, matches --orchestrator exactly —
// hsl(38 85% 58%) = #EFAC39) ringed by 6 hexagon petals in currentColor, so
// they inherit --text instead of the source file's static dark fill, which
// would nearly vanish against this site's dark-only background.
//
// Structure carries semantic classnames (not just for style, but as the
// hero's animation hooks — see .hero-icon rules in globals.css): the 3 small
// amber accents live in their own <g class="forge-icon-accents"> because the
// hero spins that group in 60° steps around the icon's center. The ring of
// petals is 6-fold symmetric, so each step lands an accent exactly on the
// next petal — the "which slots are lit" swap the hero's loop relies on.
// None of this groups/classnames changes rendering where no such animation
// targets them (mini-nav, the portfolio card).
export function ForgeIcon({ className }: ForgeIconProps) {
  return (
    <svg viewBox="0 0 1265 1394" className={className} role="img" aria-label="Forge">
      <path
        className="forge-icon-hex"
        fill="hsl(var(--orchestrator))"
        d="M660.036 253.414L1044.3 475.151V918.626L660.036 1140.36L275.774 918.626L275.774 475.151L660.036 253.414Z"
      />
      <g className="forge-icon-accents">
        <path
          className="forge-icon-accent-top"
          fill="hsl(var(--orchestrator))"
          d="M961.782 110.633L1016.85 142.309V205.663L961.782 237.34L906.71 205.663V142.309L961.782 110.633Z"
        />
        <path
          className="forge-icon-accent-bottom"
          fill="hsl(var(--orchestrator))"
          d="M962.012 1156.31L1017.08 1187.99V1251.34L962.012 1283.02L906.94 1251.34V1187.99L962.012 1156.31Z"
        />
        <path
          className="forge-icon-accent-left"
          fill="hsl(var(--orchestrator))"
          d="M55.072 633.536L110.144 665.212V728.566L55.072 760.243L1.63513e-06 728.566L0 665.212L55.072 633.536Z"
        />
      </g>
      <path className="forge-icon-petal-1" fill="currentColor" d="M861.69 1277.63L660.036 1393.78L458.382 1277.63L458.381 1093.27L660.036 1209.64L861.69 1093.27V1277.63Z" />
      <path className="forge-icon-petal-2" fill="currentColor" d="M215.774 953.276L416.803 1069.28L256.726 1161.48L55.072 1045.33L55.072 813.037L215.774 720.476V953.276Z" />
      <path className="forge-icon-petal-3" fill="currentColor" d="M1265 813.037V1045.33L1063.35 1161.48L903.267 1069.28L1104.3 953.276V720.476L1265 813.037Z" />
      <path className="forge-icon-petal-4" fill="currentColor" d="M416.803 324.497L215.774 440.501V673.301L55.072 580.74L55.072 348.444L256.726 232.296L416.803 324.497Z" />
      <path className="forge-icon-petal-5" fill="currentColor" d="M1265 348.444V580.74L1104.3 673.301V440.501L903.267 324.496L1063.35 232.296L1265 348.444Z" />
      <path className="forge-icon-petal-6" fill="currentColor" d="M861.69 116.148V300.504L660.036 184.141L458.381 300.504L458.382 116.148L660.036 0L861.69 116.148Z" />
    </svg>
  );
}
