import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  helper?: string;
};

export default function FormField({ label, children, helper }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
