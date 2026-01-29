type CsvExportOptions = {
  filename: string;
  headers: string[];
  rows: Array<Array<string | number | null | undefined>>;
};

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv({ filename, headers, rows }: CsvExportOptions) {
  const csvLines = [headers, ...rows].map((row) =>
    row.map((cell) => csvEscape(String(cell ?? ""))).join(",")
  );
  const blob = new Blob([csvLines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
