/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */

const barnowl = require('barnowl');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const HTTP_PORT = 3000;


var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var middleware = new barnowl();

// Express web server initialisation
app.use(express.static('web'));
server.listen(HTTP_PORT, function () {
  console.log('Browse to localhost:' + HTTP_PORT + ' for the web demo');
});

middleware.bind( { protocol: 'serial', path: 'auto' } );

// Handle a BLE decoding
middleware.on('visibilityEvent', function(tiraid) {
  var isNorble = (tiraid.identifier.hasOwnProperty('advData') &&
                  tiraid.identifier.advData
                    .hasOwnProperty('manufacturerSpecificData') &&
                  tiraid.identifier.advData.manufacturerSpecificData
                    .hasOwnProperty('norble'));

  if(isNorble) {
    var norble = tiraid.identifier.advData.manufacturerSpecificData.norble;
    io.emit('norble', { norble: norble });
  }
});

