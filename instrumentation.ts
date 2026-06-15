export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateProductionAuthConfig } = await import("@/utils/auth");
    try {
      validateProductionAuthConfig();
    } catch (error) {
      console.error("[auth] Production admin credentials are not configured:", error);
    }
  }
}
