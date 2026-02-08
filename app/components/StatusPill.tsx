type Props = {
  status: string;
};

const statusStyles: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700",
  claimed: "bg-amber-100 text-amber-700",
  in_progress: "bg-sky-100 text-sky-700",
  completed: "bg-slate-200 text-slate-700",
};

export default function StatusPill({ status }: Props) {
  const cls = statusStyles[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
