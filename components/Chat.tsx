"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { LogoMark, MountainScene } from "./Mountain";

type Msg = { id: string; role: "user" | "coach"; text: string };
type Failure = { text: string; retry: string };

const SESSION_KEY = "coachly.session.v1";

const ERRORS: Record<string, string> = {
  coach_offline: "The coach is offline. Activate the n8n workflow, then try again.",
  coach_auth_failed: "The coach rejected the request. Check that N8N_AUTH_TOKEN matches the n8n credential.",
  coach_unreachable: "Can't reach the coach. Check your connection and try again.",
  server_not_configured: "N8N_WEBHOOK_URL is not set. Add it to .env.local and restart the dev server.",
};

function newSessionId() {
  const id = crypto.randomUUID();
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    /* session lasts for this visit only */
  }
  return id;
}

function getSessionId() {
  try {
    return localStorage.getItem(SESSION_KEY) || newSessionId();
  } catch {
    return crypto.randomUUID();
  }
}

export default function Chat({ onCoachReply }: { onCoachReply: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const sessionRef = useRef<string>("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    sessionRef.current = getSessionId();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, failure]);

  const ask = useCallback(
    async (text: string) => {
      setFailure(null);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, sessionId: sessionRef.current || getSessionId() }),
        });
        const json = await res.json().catch(() => null);
        if (res.ok && json?.ok) {
          setMessages((m) => [...m, { id: crypto.randomUUID(), role: "coach", text: json.data.reply }]);
          onCoachReply();
        } else {
          setFailure({
            text: ERRORS[json?.error] ?? "The coach couldn't answer. Try again.",
            retry: text,
          });
        }
      } catch {
        setFailure({ text: ERRORS.coach_unreachable, retry: text });
      } finally {
        setLoading(false);
      }
    },
    [onCoachReply],
  );

  const send = () => {
    const text = draft.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setDraft("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    void ask(text);
  };

  const newChat = () => {
    sessionRef.current = newSessionId();
    setMessages([]);
    setFailure(null);
    setDraft("");
    inputRef.current?.focus();
  };

  const empty = messages.length === 0 && !loading && !failure;

  return (
    <section
      className="relative isolate flex h-full min-h-0 flex-col overflow-hidden max-[900px]:h-dvh"
      aria-label="Chat with your coach"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%]"
        style={{
          opacity: 0.14,
          maskImage: "linear-gradient(to top, black 25%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 25%, transparent)",
        }}
      >
        <MountainScene className="size-full" />
      </div>

      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <LogoMark className="h-11 w-auto" />
          <span className="font-display text-2xl font-semibold tracking-tight">Coachly</span>
        </div>
        <button
          onClick={newChat}
          disabled={empty}
          className="glass !rounded-full px-4 py-1.5 text-sm text-dust transition-colors hover:text-chalk disabled:pointer-events-none disabled:opacity-40"
        >
          New chat
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-8">
        <div className="mx-auto flex max-w-[44rem] flex-col gap-8 pb-6">
          {empty && (
            <div className="pt-[14vh]">
              <h1 className="font-display text-4xl font-semibold tracking-tight">What are we training today?</h1>
              <p className="mt-3 max-w-[42ch] text-dust">
                Ask about lifting, yoga, mobility or food. Each answer moves you toward your next rank.
              </p>
            </div>
          )}

          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl border border-cobalt/25 bg-cobalt/10 px-4 py-2.5 leading-relaxed shadow-[0_0_24px_-12px_rgba(56,176,255,0.8)]">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <LogoMark className="mt-0.5 h-7 w-auto shrink-0" />
                <div className="prose-coach">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ),
          )}

          {loading && (
            <div role="status" aria-label="Coach is typing" className="flex gap-1.5 py-2 text-dust">
              <span className="dot size-1.5 rounded-full bg-current" />
              <span className="dot size-1.5 rounded-full bg-current" />
              <span className="dot size-1.5 rounded-full bg-current" />
            </div>
          )}

          {failure && (
            <div role="alert" className="glass flex items-start justify-between gap-4 !rounded-xl px-4 py-3 text-sm">
              <p className="text-chalk">{failure.text}</p>
              <button
                onClick={() => void ask(failure.retry)}
                className="shrink-0 rounded-md px-2.5 py-1 text-cobalt transition-colors hover:bg-cobalt/10"
              >
                Retry
              </button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="px-8 pt-2 pb-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="glass mx-auto flex max-w-[44rem] items-end gap-3 px-4 py-3 transition-shadow focus-within:shadow-[0_0_0_1px_rgba(56,176,255,0.55),0_0_30px_-8px_rgba(56,176,255,0.7)]"
        >
          <textarea
            ref={inputRef}
            value={draft}
            rows={1}
            placeholder="Message your coach"
            aria-label="Message your coach"
            onChange={(e) => setDraft(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="max-h-[180px] flex-1 resize-none bg-transparent leading-relaxed outline-none placeholder:text-dust"
          />
          <button
            type="submit"
            disabled={!draft.trim() || loading}
            className="rounded-lg bg-gradient-to-b from-[#6fd6ff] to-cobalt-deep px-4 py-1.5 text-sm font-medium text-[#04101f] shadow-[0_0_18px_rgba(56,176,255,0.55)] transition-opacity disabled:opacity-30 disabled:shadow-none"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
