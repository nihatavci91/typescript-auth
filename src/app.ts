import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.json({
        message: "TypeScript Auth API çalışıyor."
    });
});

app.use("/api/auth", authRoutes);

export default app;