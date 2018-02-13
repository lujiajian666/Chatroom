var http = require('http');

var server = http.createServer(function (req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end("hello",'utf-8');
}).listen(3000,"127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');

var io = require('socket.io').listen(server);
var user={};
var username=[];

io.sockets.on('connection',function(socket){
    console.log('User connected');
    socket.on('addUser',function(data){
        if(data.username in user){
          ;
        }else{
          user[data.username]=socket;
          username.push(data.username);
        }
        socket.emit("getFriends",{username:username});
        socket.broadcast.emit("getFriends",{username:username});
    })
    socket.on('disconnect',function(){
        console.log('User disconnected');
    });
    socket.on('sendMessage',function(data){
        console.log(data)
        //user[data.to].emit("getMessage",{text:data.text,from:data.from});
        socket.broadcast.emit("getMessage",{text:data.text,from:data.from});
    })
});