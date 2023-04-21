const cors = require('cors');
var cors_proxy = require('cors-anywhere');

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT;//|| 8000;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    
}).listen(8000, '0.0.0.0', function() {
    console.log('Running CORS Anywhere on ' + host + ':' + 8000);
});