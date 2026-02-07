type Props = {
  category?: string | null;
};

export default function CategoryBadge({ category }: Props) {
  const label = category || "Other";
  return (
    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}
