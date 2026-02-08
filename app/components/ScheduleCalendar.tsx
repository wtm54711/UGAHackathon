"use client";

import { useEffect, useMemo, useState } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const TIMEZONE = "America/New_York";

function formatMonthTitle(year: number, month: number) {
  return new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

function getMonthBounds(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const last = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));
  return { first, last };
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }).map((_, idx) => {
    const dayNumber = idx - startOffset + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    return {
      key: `${year}-${month}-${idx}`,
      date: new Date(year, month, dayNumber),
      dayNumber,
      inMonth,
    };
  });
}

export default function ScheduleCalendar() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const today = new Date();
  const activeDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/calendar?year=${year}&month=${month + 1}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Failed to load calendar events.");
        }
        const data = (await res.json()) as { events: CalendarEvent[] };
        setEvents(data.events ?? []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
    return () => controller.abort();
  }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const date = new Date(event.start);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const current = map.get(key) ?? [];
      current.push(event);
      map.set(key, current);
    });
    return map;
  }, [events]);

  const activeDayEvents = useMemo(() => {
    if (!activeDay) return [];
    return eventsByDay.get(activeDay) ?? [];
  }, [activeDay, eventsByDay]);

  function openDayDetails(date: Date) {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if ((eventsByDay.get(key) ?? []).length === 0) return;
    setActiveDay(key);
  }

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-xl shadow-amber-100 backdrop-blur md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Shared calendar
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Schedule
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Showing events in your area.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthOffset((value) => value - 1)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            Prev
          </button>
          <span className="min-w-[160px] text-center text-sm font-semibold text-slate-800">
            {formatMonthTitle(year, month)}
          </span>
          <button
            type="button"
            onClick={() => setMonthOffset((value) => value + 1)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            Next
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-slate-600">Loading events...</p>
      )}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-7 gap-2 text-xs text-slate-500">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {monthGrid.map((cell) => {
          const dayEvents =
            eventsByDay.get(
              `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`
            ) ?? [];
          return (
            <div
              key={cell.key}
              className={`min-h-[110px] rounded-2xl border p-3 text-left text-sm transition ${
                cell.inMonth
                  ? "border-slate-200 bg-white/90 text-slate-900"
                  : "border-transparent bg-transparent text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{cell.inMonth ? cell.dayNumber : ""}</span>
                {cell.inMonth && dayEvents.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg bg-amber-50 px-2 py-1 text-amber-800"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <button
                    type="button"
                    onClick={() => openDayDetails(cell.date)}
                    className="text-[11px] font-semibold text-amber-700 underline"
                  >
                    +{dayEvents.length - 2} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
                  Requests and events
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {new Date(
                    activeDayEvents[0]?.start ?? Date.now()
                  ).toLocaleDateString()}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveDay(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {activeDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-amber-900">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    {new Date(event.start).toLocaleString()}
                  </p>
                </div>
              ))}
              {activeDayEvents.length === 0 && (
                <p className="text-sm text-slate-600">
                  No events for this day.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
