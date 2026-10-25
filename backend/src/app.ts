import express from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "./routes/index.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
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

app.use("/api/v1", indexRouter)

export default app;