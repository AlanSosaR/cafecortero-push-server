import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// 🔥 FIREBASE ADMIN (PROD READY)
// ================================
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ================================
// 🚀 SEND PUSH
// ================================
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

    res.json({ ok: true });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: "Push failed" });
  }
});

// ================================
// ❤️ HEALTH CHECK
// ================================
app.get("/", (_, res) => {
  res.send("☕ Cafecortero Push Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
