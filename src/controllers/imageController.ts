import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import { uploadImageNotificationQueue } from "../service/queue";
import { User } from "../models/user.model";
import { Image } from "../models/image.model";

class ImageController {
  static async upload(req: Request, res: Response) {
    const user = req.user as User

    await uploadImageNotificationQueue.add({email: user.email}); // queue functionality
    const image = await Image.create({path: req.file.path}); // for local file storage
    // const image = await Image.create({path: req.body.uploadedFilePath}); // for S3
    res.send({path: req.file.path});
  }

  static async notifyUsers() {
    try {
      const count = await uploadImageNotificationQueue.count();

      if (count > 0) {
        const jobs = await uploadImageNotificationQueue.getJobs(['waiting']);

        let emailsMap: {[key: string]: number} = {};

        jobs.forEach(job => {
          if (!emailsMap[job.data.email]) {
            emailsMap[job.data.email] = 1;
          } else {
            emailsMap[job.data.email] += 1
          }
        });

        const sendEmailsProcess = Object.entries(emailsMap).map(async ([email, count]) => {
          const msg = {
            to: email,
            from: 'bronj037@gmail.com',
            subject: 'Uploaded Photos',
            html: `You have uploaded ${count} photos`,
          };

          await sgMail.send(msg);
          console.log(`User ${email} received notification. ${count} images were uploaded!`);
          return true;
        });

        await Promise.all(sendEmailsProcess);
        await uploadImageNotificationQueue.empty();
      }
      return true;
    } catch (e) {
      return false;
    }

  }

  static async notifyUsersEndpoint(req: Request, res: Response) {
    const isSuccess = await ImageController.notifyUsers();
    if (isSuccess) {
      res.send({status: 'ok'})
    } else {
      res.send({status: 'failed'})
    }
  }
}

export default ImageController;
