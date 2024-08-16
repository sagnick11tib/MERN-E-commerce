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


//Steps for creating a cluster in Node.js
//1. Import cluster and os
//2. Get the number of CPU cores
//3. Check if the current process is the master process
//4. If it is the master process, log the process id and fork workers means create a child process for each CPU core. 
//   Each worker will have its own event loop and memory space and will run the same code. 
//   The master process will manage the workers and distribute the incoming connections to the workers.
//   The workers will share the same server port. 
//   The cluster module will automatically balance the load among the workers.
//   The workers will not share the same memory space and will not be able to share data between each other.
//5. If it is a worker process, start the server 
//6. Listen for the exit event on the cluster object
//7. Log the worker process id that died
//8. Restart the worker process
//   (is it use nodejs runtime to run the code in the worker process?)=> Yes, the worker process will run the same code as the master process.

// what is nodejs runtime? => Node.js is a runtime environment that executes JavaScript code outside of a browser.
// means it is a program that runs JavaScript code.
// what is the difference between the master process and worker process? => The master process will manage the workers and distribute the incoming connections to the workers.
// what is the cluster module? => The cluster module is a built-in module in Node.js that allows you to create child processes that share server ports.
// what is the event loop? => The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations.
// what is the memory space? => Memory space is the memory that is allocated to a process.
// what is the server port? => The server port is a number that identifies a specific process on a server.
// what is the load balancing? => Load balancing is a technique that distributes incoming network traffic across multiple servers.
// what is the exit event? => The exit event is emitted when a worker process exits.
// what is the process id? => The process id is a unique identifier for a process.
// what is the fork method? => The fork method is a method that creates a new worker process.
// what is the cluster object? => The cluster object is an object that represents the cluster of worker processes.
// what is the code parameter? => The code parameter is a number that represents the exit code of the worker process.

// Very Very Important Questions
//cloudflare workers DONT use the Node.js runtime . They have created their own runtime.
/* 
Cloudflare Workers use a custom runtime environment that is different from the Node.js runtime. This means that certain Node.js-specific modules and features are not available in Cloudflare Workers. Instead, Cloudflare Workers are designed to be lightweight and run on the V8 JavaScript engine, similar to how JavaScript runs in web browsers.
Key Differences:
1.No Node.js Modules: Modules like cluster, os, fs, etc., which are specific to Node.js, are not available in Cloudflare Workers.
2.Web Standards: Cloudflare Workers use web standard APIs like fetch, Request, Response, and URL.
3.Global Scope: The global scope in Cloudflare Workers is similar to the window object in browsers, not the global object in Node.js.

Summary:
Node.js Runtime: Uses Node.js-specific modules and features.
Cloudflare Workers Runtime: Uses web standard APIs and does not support Node.js-specific modules.
*/


startServer();