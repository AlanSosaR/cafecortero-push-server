import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
});

// Endpoint para enviar push
app.post("/send-push", async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    await admin.messaging().send({
      token,
      notification: { title, body },
      data: data || {},
    });

    return res.json({ ok: true });

  } catch (err) {
    console.error("Push error:", err);
    return res.status(500).json({ error: "Push failed" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("☕ Cafecortero Push Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
