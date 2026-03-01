export function getAuthErrorMessage(err: { message?: string }): string {
  const msg = err?.message ?? ""
  if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("rate_limit")) {
    return "Too many attempts. Please try again in a few minutes."
  }
  if (msg.toLowerCase().includes("invalid login")) {
    return "Invalid email or password."
  }
  return msg || "Something went wrong."
}
