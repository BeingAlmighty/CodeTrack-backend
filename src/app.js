import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import leetcodeRoutes from "../routes/leetcode.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/leetcode", leetcodeRoutes);

export default app;
