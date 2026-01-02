import express from "express"; 
import { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; // Ensure this import is correct
import { serveStatic } from "./static";
import { createServer } from "http";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req: express.Request, _res: any, buf: Buffer) => {
      return req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})();