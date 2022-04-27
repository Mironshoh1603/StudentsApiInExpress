var os = require("os");

try {
 
    console.log(os.userInfo());
} catch (err) {
   
    console.log(": error occurred" + err);
}

console.log("Free memory: " + os.freemem());

console.log("Total memory: " + os.totalmem());

console.log("List of network Interfaces: " + os.networkInterfaces());

console.log("OS default directory for temp files : " + os.tmpdir());
