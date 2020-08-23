var http=require('http')
, express=require('express')
, session=require('express-session');
//npm i express-session --s

var app=express();

//session() 함수를 use하겠다고 해야 세션이 시작된다.
//session함수에는 옵션이 들어간다
app.use(session({
    secret:'asdf123',
    resave: false,
    //세션 데이터가 변경이 있기 전까지 세션저장소의 값을 저장하지 않음
    saveUninitialized:true
    //true를 주면 세션이 필요하기전까지는 세션을 구동하지 않는다는 의미
}))

app.get('/',(req,res)=>{
    //세션에 num값을 저장해보자.
    if(req.session.num==undefined){
        //세션에 저장된 num이 없다면 1값을 할당해 저장
        req.session.num=1; //세션을 쓰는 방법
    }else{
        //세션에 저장된 num이 있다면 1씩 증가
        req.session.num+=1;
    }
    res.send("<h1>Hello Session: "+req.session.num+"</h1>");
})

http.createServer(app).listen(3333,function(){
    console.log('http://localhost:3333');
})