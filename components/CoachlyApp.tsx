"use client";

import Chat from "./Chat";
import ProgressPanel from "./ProgressPanel";
import { useProgress } from "@/lib/progress";

export default function CoachlyApp() {
  const { count, leveledTo, increment } = useProgress();

  return (
    <main className="grid h-dvh grid-cols-[minmax(0,1fr)_340px] max-[900px]:h-auto max-[900px]:grid-cols-1">
      <Chat onCoachReply={increment} />
      <ProgressPanel count={count} leveledTo={leveledTo} />
    </main>
  );
}
