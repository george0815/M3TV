//Requires
var defaultBrowser = require("x-default-browser");
const express = require("express");
const open = require('open');
const cors = require('cors');
var cors_proxy = require('cors-anywhere');


// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8000;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});



const app = express();

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


app.listen(5000, () => {
    console.log("Application started and Listening on port 5000");
  });
  



// opens the url in the default browser 


defaultBrowser(function (err, res) {
  // in case of error, `err` will be a string with error message; otherwise it's `null`.

  console.log(res.commonName);

  switch(res.commonName) {
    case 'chrome':
      open('http://127.0.0.1:5000', {app: {name: 'chrome', arguments: ['--kiosk','--disable-web-security', '--start-fullscreen','--user-data-dir']}});

      break;
    case 'firefox':
      open('http://127.0.0.1:5000', {app: {name: 'firefox', arguments: ['-kiosk']}});
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
