import { Request, Response } from "express";
import prisma from "../prisma";

// Create Task
export const createTask = async (req: Request, res: Response) => {

try {


const { title } = req.body;

const user = (req as any).user;

if (!user) {
  return res.status(401).json({ message: "User not authenticated" });
}

const task = await prisma.task.create({
  data: {
    title,
    userId: user.userId
  }
});

res.json(task);

} catch (error) {
console.log("Create task error:", error);
res.status(500).json({ message: "Error creating task" });
}
};

// Get Tasks
export const getTasks = async (req: Request, res: Response) => {

try {

const user = (req as any).user;

if (!user) {
  return res.status(401).json({ message: "User not authenticated" });
}

const tasks = await prisma.task.findMany({
  where: { userId: user.userId }
});

res.json(tasks);

} catch (error) {
console.log("Fetch tasks error:", error);
res.status(500).json({ message: "Error fetching tasks" });
}
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {

try {

const { id } = req.params;
const { title, completed } = req.body;

const task = await prisma.task.update({
  where: { id: Number(id) },
  data: { title, completed }
});

res.json(task);

} catch (error) {
console.log("Update task error:", error);
res.status(500).json({ message: "Error updating task" });
}
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {

try {

const { id } = req.params;

await prisma.task.delete({
  where: { id: Number(id) }
});

res.json({ message: "Task deleted successfully" });

} catch (error) {
console.log("Delete task error:", error);
res.status(500).json({ message: "Error deleting task" });
}
};
