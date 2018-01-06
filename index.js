const WebSocket = require('ws');
var restify = require('restify');

//Creo servidores
const server = restify.createServer();
const wss = new WebSocket.Server({ port: 8081 });

//REST
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
function respond(req, res, next) {
  wss.broadcast('hello ' + req.params.name);
  res.send("ok");
  next();
}

//WEBSOCKET

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
        
      }
    });
  });
});