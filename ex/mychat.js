var http=require('http')
, fs=require('fs')
, path=require('path')
, socketio=require('socket.io')
, static = require('serve-static')
, express = require('express');

var app = express();
//미들웨어
app.use('/',static(path.join(__dirname,'public')));


app.get('/',function(req,res){
    fs.readFile('./public/mychat.html','utf8',function(err,data){
        if(err) throw err;
        res.send(data);
    });
})

//웹서버 생성 후 가동
var server = http.createServer(app).listen(3333,function(){
    console.log('http://localhost:3333');
})

var io = socketio.listen(server);
var users= [];

io.sockets.on('connection',function(socket){
    console.log("클이 접속함...");
    socket.on('room',function(data){
        //console.dir(data);
        if(data.cmd=='create'){//방만들기라면
            var isExist=false;
            if(isExist){
                //생성한 방이 이미 존재하는 경우
                
            }else{
                //새로 만드는 방인 경우
                //socket.join('방이름') ==> 방생성
                socket.join(data.roomName);
                users.push({
                    roomName:data.roomName,
                    bangjang:data.nickName,
                    ulist:[data.nickNamee] //방에 입장한 사람들 목록
                })
                //console.log('create users[0].ulist: '+users[0].ulist)
                sendResponse(socket,'room','100',
                '['+data.roomName+'] 방이 생성 됐어요 방장: ['+data.nickName+']');
            }
        }//create------
    })//.on('room') end -------------
})//.on('connection') end-----------


//클에게 응답을 전송하는 함수
var sendResponse = function(socket, command, code, msg){
    //클에게 보낼 응답 데이터 만들기
    var str={cmd:command,code:code,message:msg};
    socket.emit('response',str); //클에게 응답 데이터 전송
}