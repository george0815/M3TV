const express = require("express");
const app = express();
const cors = require('cors');



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
  