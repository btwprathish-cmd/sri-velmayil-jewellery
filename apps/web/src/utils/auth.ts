export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.ok) return { success: true };
  const data = await res.json().catch(() => ({}));
  const apiError = typeof data.error === "string" ? data.error : "";
  if (res.status === 503) {
    return { success: false, error: "Admin login is not configured on the server." };
  } else if (res.status === 429) {
    return { success: false, error: apiError || "Too many login attempts. Please wait and try again." };
  }
  return { success: false, error: apiError || "Invalid username or password" };
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<{ authenticated: boolean; username: string | null }> {
  const res = await fetch("/api/auth/session");
  if (!res.ok) return { authenticated: false, username: null };
  return res.json();
}
