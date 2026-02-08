import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const TIMEZONE = "America/New_York";

function getMonthRange(year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  return { start, end };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = Number(searchParams.get("year"));
  const monthParam = Number(searchParams.get("month"));

  if (!yearParam || !monthParam || monthParam < 1 || monthParam > 12) {
    return NextResponse.json(
      { error: "Missing or invalid year/month." },
      { status: 400 }
    );
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json(
      { error: "Calendar API not configured." },
      { status: 500 }
    );
  }

  const { start, end } = getMonthRange(yearParam, monthParam);
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events`
  );

  url.searchParams.set("key", apiKey);
  url.searchParams.set("timeMin", start.toISOString());
  url.searchParams.set("timeMax", end.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("timeZone", TIMEZONE);

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch calendar events." },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
    }>;
  };

  const calendarEvents =
    data.items?.map((item) => ({
      id: item.id,
      title: item.summary ?? "Untitled event",
      start: item.start?.dateTime ?? item.start?.date ?? "",
      end: item.end?.dateTime ?? item.end?.date ?? "",
    })) ?? [];

  let requestEvents: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
  }> = [];

  try {
    const supabase = createServerClient();
    const { data: requests, error } = await supabase
      .from("requests")
      .select("id,title,deadline_at,created_at,status")
      .or(
        `deadline_at.gte.${start.toISOString()},deadline_at.lte.${end.toISOString()},created_at.gte.${start.toISOString()},created_at.lte.${end.toISOString()}`
      )
      .neq("status", "completed");

    if (!error && requests) {
      requestEvents = requests.flatMap((req) => {
        const events: Array<{
          id: string;
          title: string;
          start: string;
          end: string;
        }> = [];

        if (req.created_at) {
          events.push({
            id: `request-posted-${req.id}`,
            title: `Request posted: ${req.title ?? "Untitled request"}`,
            start: req.created_at as string,
            end: req.created_at as string,
          });
        }

        if (req.deadline_at) {
          events.push({
            id: `request-deadline-${req.id}`,
            title: `Request due: ${req.title ?? "Untitled request"}`,
            start: req.deadline_at as string,
            end: req.deadline_at as string,
          });
        }

        return events;
      });
    }
  } catch {
    requestEvents = [];
  }

  return NextResponse.json({ events: [...calendarEvents, ...requestEvents] });
}
