//ex_chat01.js

var http=require('http')
, fs=require('fs')
, path=require('path')
, socketio=require('socket.io')
, static = require('serve-static')
, express = require('express');

var app = express();

app.get('/',function(req,res){
    fs.readFile('../public/chat01.html','utf8',function(err,data){
        if(err) throw err;
        res.send(data);
    });
})


//미들웨어
app.use('/',static(path.join(__dirname,'public')));


//웹서버 생성 후 가동
var server = http.createServer(app).listen(3333,function(){
    console.log('http://localhost:3333');
})

//소켓서버 생성
var io = socketio.listen(server);
//io.sockets객체에 connection 연결 이벤트를 붙인다.
io.sockets.on('connection',function(socket){
    console.log("connection 이벤트 핸들러 >>> 클라이언트가 접속");

    socket.on('hello',function(data){
        console.log("클라이언트가 보낸 데이터>>"+data);
        /*
        [1] public 통신 (나를 포함한 모든 접속자들에게 메시지를 보낸다.)
            io.sockets.emit('sendAll', data)
        [2] broadcast 통신 (나를 제외한 모든 접속자들에게 메시지를 보낸다.)
        [3] private 통신 (특정접속자에게만 메시지를 보낸다.)
        [4] 특정 방에 입장한 접속자들에게 메시지를 보내는 경우 
        */

        io.sockets.emit('sendAll',data);




    })
})