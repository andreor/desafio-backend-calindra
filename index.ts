import express from "express";
import { Distancias } from "./src/distancias";
const app = express();
const port = 8080; // default port to listen

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
 
let distancias = new Distancias(); 

app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.post( "/distancias", jsonParser,async ( req, res ) => {
    
    res.send( await distancias.verifyDistance(req.body) );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );