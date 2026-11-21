type ChatBody = { message?: unknown; sessionId?: unknown };

const fail = (error: string, status: number) =>
  Response.json({ ok: false, data: null, error }, { status });

export async function POST(request: Request) {
  const url = process.env.N8N_WEBHOOK_URL;
  const token = process.env.N8N_AUTH_TOKEN;
  if (!url) return fail("server_not_configured", 500);

  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_json", 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  if (!message || !sessionId) {
    return fail("message and sessionId are required", 400);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Coachly-Token": token } : {}),
      },
      body: JSON.stringify({ message, sessionId }),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok && typeof json.data?.reply === "string") {
      return Response.json({ ok: true, data: { reply: json.data.reply }, error: null });
    }
    if (res.status === 403) return fail("coach_auth_failed", 502);
    if (res.status === 404) return fail("coach_offline", 502);
    return fail(json?.error ?? "coach_unavailable", 502);
  } catch {
    return fail("coach_unreachable", 502);
  }
}
