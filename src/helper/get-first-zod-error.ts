import { ZodFieldErrors } from "@/types/zod";

export function getFirstZodError(
  error: unknown
): string | null {
  if (
    error &&
    typeof error === "object" &&
    !Array.isArray(error)
  ) {
    const values = Object.values(error as ZodFieldErrors);
    return values[0]?.[0] ?? null;
  }
  return null;
}
