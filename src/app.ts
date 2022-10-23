
import * as bodyParser from "body-parser";
import express from "express";
import apiRouter from "./router/api_router";
// import { TaskController } from "./controller/task.controller";

class App {

    public app: express.Application;
    // public taskController: TaskController;


    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        // this.taskController = new TaskController();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.app.use('/api', apiRouter);

        this.app.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        // handle undefined routes
        this.app.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().app;