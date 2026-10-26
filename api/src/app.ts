import express from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "./routes/index.route.js";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const configuredOrigins = process.env.WEB_ORIGIN?.split(",").map((value) => value.trim()) ?? [];
        const allowedOrigins = new Set([
            ...configuredOrigins,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]);
        
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", (req, res) => {
    res.json({ status: "alive" })
})

app.use("/api/v1", indexRouter);

// handle all auth req
app.all("/api/*auth", (req, res, next) => {
    toNodeHandler(auth)(req as any, res as any).catch(next);
})

export default app;
