var http=require('http')
, fs=require('fs')
, path=require('path')
, socketio=require('socket.io')
, static = require('serve-static')
, express = require('express');

var app = express();

app.get('/',function(req,res){
    fs.readFile('../public/chat03.html','utf8',function(err,data){
        if(err) throw err;
        res.send(data);
    });
})


//미들웨어
app.use('/',static(path.join(__dirname,'../public')));


//웹서버 생성 후 가동
var server = http.createServer(app).listen(3333,function(){
    console.log('http://localhost:3333');
})

//소켓서버 생성
var io = socketio.listen(server);
var uid=0;
//io.sockets객체에 connection 연결 이벤트를 붙인다.
io.sockets.on('connection',function(socket){
    console.log("connection 이벤트 핸들러 >>> 클라이언트가 접속");
    uid=socket.id;
    console.log('uid=='+uid);
    
    
    socket.on('hello',function(data){
        console.log("클라이언트가 보낸 데이터>>"+data);
        
        /*
        [1] public 통신 (나를 포함한 모든 접속자들에게 메시지를 보낸다.)
            io.sockets.emit('sendAll', data)
        [2] broadcast 통신 (나를 제외한 모든 접속자들에게 메시지를 보낸다.)
            socket.broadcast속성을 이용
            socket.broadcast.emit('sendBroad',data)
        [3] private 통신 (특정접속자에게만 메시지를 보낸다.)
            socket.id를 사용하여 특정인에게만 메시지를 보낸다.
            io.sockets.to(socket.id).emit('sendOne',data)
        [4] 특정 방에 입장한 접속자들에게 메시지를 보내는 경우 
            io.sockets.in('방이름') 함수를 이용해서 emit 한다.
        */
           
           //io.sockets.emit('sendAll',data);
           
           //socket.broadcast.emit('sendBroad',data);
           
           //io.sockets.to(uid).emit('sendOne',data)
    })
})