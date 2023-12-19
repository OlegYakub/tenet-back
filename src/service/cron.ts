import cron from 'node-cron';
import UserController from "../controllers/userController";

export const initCronJobs = () => {
  const testCronJob = cron.schedule('52-54 * * * *', async () => {
    const user = await UserController.getUserByEmail('test@test1.com');
    console.log('user', user);
  });

  testCronJob.start();


}