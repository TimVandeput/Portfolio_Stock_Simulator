import type { BaseComponentProps } from "@/types/components";

export interface TableColumn {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  alignment?: "left" | "center" | "right";
  width?: string;
}

export interface TableHeaderProps extends BaseComponentProps {
  columns: TableColumn[];
}

export default function TableHeader({
  columns,
  className = "",
}: TableHeaderProps) {
  return (
    <div
      className={`neu-card p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 hidden md:block ${className}`}
    >
      <div className="w-full">
        <div className="flex text-sm font-medium text-[var(--text-secondary)]">
          {columns.map((column, index) => (
            <div
              key={column.id}
              className={`px-4 py-0 ${column.width || "flex-1"} ${
                column.alignment === "center"
                  ? "text-center"
                  : column.alignment === "right"
                  ? "text-right"
                  : ""
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  column.alignment === "center"
                    ? "justify-center"
                    : column.alignment === "right"
                    ? "justify-end"
                    : ""
                }`}
              >
                <span className="whitespace-nowrap">{column.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
