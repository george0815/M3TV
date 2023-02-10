//Requires
var defaultBrowser = require("x-default-browser");
const express = require("express");
const open = require('open');
const cors = require('cors');
var cors_proxy = require('cors-anywhere');
var fs = require("fs");
var fileToRead = 'le.txt';

fs.readFile(fileToRead, 'utf8', (err, data) => {
  
    console.log('\x1b[36m%s\x1b[0m', data);

});

const ConsoleWindow = require("node-hide-console-window");
//ConsoleWindow.hideConsole();


// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8000;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    
}).listen(port, host, function() {
    //console.log('Running CORS Anywhere on ' + host + ':' + port);
});



const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);



app.options('*', cors()); 
app.use(cors());


app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
 
   next();



  });


// serve your css as static
app.use(express.static(__dirname));

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  //console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     //console.log('A user disconnected');
     http.close();
     cors_proxy.close();
  });
});

http.listen(5000, () => {
    //console.log("Application started and Listening on port 5000");
  });
  



// opens the url in the default browser 


defaultBrowser(function (err, res) {
  // in case of error, `err` will be a string with error message; otherwise it's `null`.

  //console.log(res.commonName);

  switch(res.commonName) {
    case 'chrome':
      open('http://127.0.0.1:5000', {app: {name: 'chrome', arguments: ['--disable-web-security', '--start-fullscreen','--user-data-dir']}});

      break;
    case 'firefox':
      open('http://127.0.0.1:5000', {app: {name: 'firefox', arguments: ['']}});
      break;
    case 'safari':
      open('http://127.0.0.1:5000', {app: {name: 'safari', arguments: ['']}});
    break;
    case 'edge':
      open('http://127.0.0.1:5000', {app: {name: 'microsoftedge', arguments: ['--disable-web-security', '--start-fullscreen','--user-data-dir']}});
    break;
    case 'chromium':
      open('http://127.0.0.1:5000', {app: {name: 'chromium', arguments: ['--disable-web-security', '--start-fullscreen','--user-data-dir']}});
    break;
    case 'opera':
      open('http://127.0.0.1:5000', {app: {name: 'opera', arguments: ['--disable-web-security', '--start-fullscreen','--user-data-dir']}});
    break;
    
    default:
      // code block
  }


  
});


