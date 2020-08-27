var http=require('http')
, fs=require('fs')
, path=require('path')
, socketio=require('socket.io')
, static = require('serve-static')
, express = require('express');

var app = express();
//미들웨어
app.use('/',static(path.join(__dirname,'../public')));


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
            console.log('socket.id== '+socket.id);
            console.dir(io.sockets.adapter.rooms);
            var isExist=io.sockets.adapter.rooms[data.roomName];
            if(isExist){
                //생성한 방이 이미 존재하는 경우
                sendResponse(socket,'room',300,data.roomName+"은 이미 존재하는 방입니다.");
            }else{
                //새로 만드는 방인 경우
                //socket.join('방이름') ==> 방생성
                socket.join(data.roomName);
                users.push({
                    roomName:data.roomName,
                    bangjang:data.nickName,
                    ulist:[] //방에 입장한 사람들 목록
                })
                //console.log('create users[0].ulist: '+users[0].ulist)
                sendResponse(socket,'room','100',
                '['+data.roomName+'] 방이 생성 됐어요 방장: ['+data.nickName+']');
            }
        }//create------
        else if(data.cmd=='enter'){
            console.dir(data);
            socket.join(data.roomName);
            //방금 입장한 사람의 방 이름과 기존에 입장한 사람의 방이름이 같으면 해당 방의 참여자로 join
            for(var i=0;i<users.length;i++){
                var u =users[i];
                console.log('u.roomName'+u.roomName);
                if(u.roomName==data.roomName){
                    u.ulist.push(data.nickName);
                    //u.ulist==>배열, 해당 방에 입장한 유저들의 닉네임을 보관하는 배열
                }
                console.dir(u.ulist);
            }
            //해당 방에 입장한 유저 목록을 가져와서 해당 방의 참여자들에게 전송하기
            var userList=getUserList(data.roomName);
            var str={
                cmd:'ulist',
                users:userList,
            };
            //roomName에 속한 사람들에게만 이벤트를 발생시킴
            io.sockets.in(data.roomName).emit('room',str);
            sendResponse(socket,'room',200,'#'+data.nickName+"님이 입장#");
        }//eneter-------
        else if(data.cmd=='exit'){
            console.log(123);
            //방 퇴장시--
            //users안에 ulist(방에 참여한 닉네임 보관)에서 퇴장하는 사람의 닉네임과
            //같은 사람이 있는지 검색해서 있다면 삭제 처리
            for(var i=0;i<users.length;i++){
                var u=users[i];
                if(u.roomName==data.roomName){
                    var uarr=u.ulist;
                    for(var j=0;j<uarr.length;j++){
                        if(uarr[j]==data.nickName){
                            //ulist에서 삭제 처리
                            u.ulist.splice(j,1);
                            break;
                        }
                    }
                }
                console.log('after exit ulist>>>');
                console.dir(u.ulist);
            }
            var userList =getUserList(data.roomName);
            var str={
                cmd:'ulist',
                roomName:data.roomName,
                users:userList
            };
            io.sockets.in(data.roomName).emit('room',str);
            //퇴장한 사람의 응답 보내기
            var msg = data.nickName+"님이"+data.roomName+"에서 나갔습니다.";
            sendResponse(socket,'room',500,msg);
            //소켓에서 퇴장 처리
            //1)방생성, 입장 ==>socket.join(방이름)
            //2)방에서 퇴장 ==> socket.leave(방이름)
            socket.leave(data.roomName);
        }//exit--
    })//.on('room') end -------------

    //클로부터 메시지가 올 경우
    socket.on('message',function(data){
        console.dir(data);
        if(data.receiver=='groupchat'){
            //수신자가 'groupchat'이라면 방 안에 있는 모든 클에게 메시지를 전송
            //          io.socket.in('방이름').emit('message',데이터)
            var str={
                sender:data.sender,
                type:data.type,
                msg:data.msg,
                time:getTime()
            }
            /////////////////////////////////
            io.sockets.in(data.roomName).emit('message',str);
            /////////////////////////////////
            sendResponse(socket,"message",400,'방['+data.roomName+']의 모든 클에게 메시지를 전송');
        }
    })


})//.on('connection') end-----------

var getTime = function(){
    //년-월-일 시-분-초
    var mdate=new Date();
    var str=mdate.getFullYear()+"-"+(mdate.getMonth()+1)+"-"+mdate.getDate();
    str+=" "+mdate.getHours()+":"+mdate.getMinutes()+":"+mdate.getSeconds();
    return str;
}

//클에게 응답을 전송하는 함수
var sendResponse = function(socket, command, code, msg){
    //클에게 보낼 응답 데이터 만들기
    var str={cmd:command,code:code,message:msg};
    socket.emit('response',str); //클에게 응답 데이터 전송
}//sendResponse()--------------

var getUserList = function(roomName){
    for(var i=0 ;i< users.length;i++){
        var u =users[i];
        if(u.roomName==roomName){
            return u.ulist;
        }
    }
}//getUserList()-------------