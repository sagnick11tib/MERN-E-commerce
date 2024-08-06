import cluster from 'cluster';
import os from 'os';
import startServer from '../src/index.js';


// const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);

//     // Fork workers.
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork(); // Create a worker for each CPU core
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died`);
//         cluster.fork(); // Restart the worker
//     });
// } else {
//     startServer();
// }

startServer();