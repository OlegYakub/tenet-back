import Queue from 'bull';

const REDIS_URL = 'redis://127.0.0.1:6379';
const uploadImageNotificationQueue = new Queue('ImageNotifications', REDIS_URL);

export {
  uploadImageNotificationQueue,
}