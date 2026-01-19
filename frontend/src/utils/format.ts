import { format } from "date-fns";

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, "dd/MM/yyyy HH:mm");
}

export function formatBytes(bytes: number) {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[exponent]}`;
}

export function assetUrl(path: string) {
  return path;
}
