const Queue = require('bull');

const videoQueue = new Queue('video transcoding', 'redis://127.0.0.1:6379');

videoQueue.process(function (job, done) {

    // job.data contains the custom data passed when the job was created
    // job.id contains id of this job.

    // transcode video asynchronously and report progress
    job.progress(42);

    // call done when finished
    done();

    // or give an error if error
    done(new Error('error transcoding'));

    // or pass it a result
    done(null, { framerate: 29.5 /* etc... */ });

    // If the job throws an unhandled exception it is also handled correctly
    throw new Error('some unexpected error');
});

videoQueue.add({ video: 'http://example.com/video1.mov' });
