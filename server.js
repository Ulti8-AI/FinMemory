const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "FinMemory", version: "2.0.0" });
});

app.get("/api/config", (_req, res) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    return res.status(503).json({
      ok: false,
      error: "Supabase environment variables are not configured."
    });
  }
  res.json({
    ok: true,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FinMemory server running on port ${PORT}`);
});