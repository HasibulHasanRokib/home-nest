import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export function formatDate(dateString: string | Date) {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function formatBDPhone(number: string) {
  if (!number) return "";

  const cleaned = number.replace(/\D/g, "");

  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `+880 ${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
  }

  return number;
}
