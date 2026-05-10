export async function wakeupBackend() {
  const backendUrl = import.meta.env.VITE_API_BASE || "https://ai-wiki-quiz-c0xf.onrender.com";
  try {
    await fetch(`${backendUrl}/health`, { method: "GET", mode: "no-cors" });
    console.log("✅ Backend wake-up ping sent");
  } catch (err) {
    console.warn("⚠️ Backend wake-up failed:", err);
  }
}