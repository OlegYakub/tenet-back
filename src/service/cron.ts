import cron from 'node-cron';
import UserController from "../controllers/userController";
import ImageController from "../controllers/imageController";

export const initCronJobs = () => {
  // const uploadImageNotificationJob = cron.schedule('26-27 * * * *', async () => {
  //   await ImageController.notifyUsers();
  // });
  // uploadImageNotificationJob.start();
}