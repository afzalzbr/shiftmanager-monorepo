// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStatusVariant(status) {
  switch (status) {
    case "In Progress":
      return "secondary";
    case "Completed":
      return "default";
    case "Scheduled":
      return "outline";
    default:
      return "outline";
  }
}
