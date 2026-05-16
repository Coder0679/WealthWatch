import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import authRoutes from "./server/routes/auth.routes.js";
import dashboardRoutes from "./server/routes/dashboard.routes.js";
import transactionRoutes from "./server/routes/transaction.routes.js";
import assetRoutes from "./server/routes/asset.routes.js";
import liabilityRoutes from "./server/routes/liability.routes.js";
import aiRoutes from "./server/routes/ai.routes.js";
import goalRoutes from "./server/routes/goal.routes.js";
import chatRoutes from "./server/routes/chat.routes.js";
import reportRoutes from "./server/routes/report.routes.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "0.0.0.0";


  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/assets", assetRoutes);
  app.use("/api/liabilities", liabilityRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/goals", goalRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/reports", reportRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "WealthWatch Unified" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), HOST, () => {
    const localhostUrl = `http://localhost:${PORT}`;
    const lanUrl = HOST === "0.0.0.0" ? `http://<YOUR_LAN_IP>:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server running on ${localhostUrl}`);
    console.log(`Network URL: ${lanUrl}`);
  });

}

startServer();
