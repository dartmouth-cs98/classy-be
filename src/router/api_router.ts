import express, { Router } from "express";
import * as TaskController from "../controller/task.controller";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to our classy api!');
});

router.route('/tasks')
    .get(TaskController.getTasks)
    .post(TaskController.createTask)
    .put(TaskController.updateTask)
    .delete(TaskController.deleteTask)

export default router;
