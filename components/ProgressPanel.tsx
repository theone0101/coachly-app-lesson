import Dumbbell from "./Dumbbell";
import { LEVELS, levelFor } from "@/lib/progress";

type Props = {
  count: number;
  leveledTo: number | null;
};

const SEGMENTS = 14;

export default function ProgressPanel({ count, leveledTo }: Props) {
  const { index, current, next, progress, toNext } = levelFor(count);
  const justLeveled = leveledTo === index && index > 0 && count === current.at;
  const lit = Math.floor(progress * SEGMENTS);

  return (
    <aside
      aria-label="Your progress"
      className="flex min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-5 max-[900px]:pt-0"
    >
      <section className="glass p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-dust">Your rank</p>
            <h2 className="font-display mt-1 truncate text-4xl font-semibold tracking-tight">{current.name}</h2>
          </div>
          <Dumbbell
            key={justLeveled ? `pop-${index}` : "still"}
            level={index}
            className={`icon-glow -mt-1 w-28 shrink-0 ${justLeveled ? "rank-pop" : ""}`}
          />
        </div>

        <p role="status" className="mt-2 min-h-5 text-sm text-cobalt">
          {justLeveled ? `Level up. You are now ${current.name}.` : ""}
        </p>

        <div
          className="mt-4 flex gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Progress to next rank"
        >
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`seg ${i < lit || !next ? "seg-on" : ""}`} />
          ))}
        </div>

        <div className="mt-3 flex items-baseline justify-between text-sm">
          <span className="text-dust">
            {next ? `${toNext} more ${toNext === 1 ? "message" : "messages"} to ${next.name}` : "Top rank reached"}
          </span>
          <span className="tabular-nums">{count} total</span>
        </div>
      </section>

      <section className="glass p-3">
        <h3 className="px-3 pt-2 pb-1 text-sm text-dust">Ranks</h3>
        <ol className="flex flex-col">
          {LEVELS.map((l, i) => {
            const reached = i <= index;
            const here = i === index;
            return (
              <li
                key={l.name}
                aria-current={here ? "step" : undefined}
                className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-white/5 ${
                  here ? "bg-cobalt/10 ring-1 ring-cobalt/30" : ""
                }`}
              >
                <Dumbbell level={i} lit={reached} className={`w-12 shrink-0 ${here ? "icon-glow" : ""}`} />
                <span className={`min-w-0 flex-1 truncate ${reached ? "text-chalk" : "text-dust/70"}`}>{l.name}</span>
                <span className="shrink-0 text-sm tabular-nums text-dust">{l.at === 0 ? "Start" : `${l.at} messages`}</span>
              </li>
            );
          })}
        </ol>
      </section>
    </aside>
  );
}
