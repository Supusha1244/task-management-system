import express from "express";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});