import { connect, disconnect } from "../db.config";
import { TaskModel } from '../model/task.model';

export const getTasks = async () => {
    const tasks = await TaskModel.find({});
    console.log('tasks:::', tasks);
    return tasks;
}

export const createTask = async (req: any, res: any, task: any) => {
    let data = {};
    try {
        data = await TaskModel.create(task);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const updateTask = async (req: any, res: any, task: any) => {
    let data = {};
    try {
        data = await TaskModel.updateOne(task);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const deleteTask = async (req: any, res: any) => {
    let data: any = {};
    try {
        data = await TaskModel.deleteOne({ _id: req.params.id });
    } catch (err) {
        console.log('Error::' + err);
    }
    return { status: `${data.deletedCount > 0 ? true : false}` };
}


// import { TaskService } from '../service/task.service';

// export class TaskController {

//     private taskService: TaskService;

//     constructor() {
//         this.taskService = new TaskService();
//     }

//     async getTasks() {
//         console.log('Controller: getTasks', null)
//         return await this.taskService.getTasks();
//     }

//     async createTask(task: any) {
//         console.log('Controller: createTask', task);
//         return await this.taskService.createTask(task);
//     }

//     async updateTask(task: any) {
//         console.log('Controller: updateTask', task);
//         return await this.taskService.updateTask(task);
//     }

//     async deleteTask(taskId: number) {
//         console.log('Controller: deleteTask', taskId);
//         return await this.taskService.deleteTask(taskId);
//     }
// }