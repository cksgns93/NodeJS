var http=require('http')
, express=require('express')
, session=require('express-session')
, fileStore=require('session-file-store')(session); //매개변수는 위에있는 session을 넣어줘야함
//npm i express-session --s
//npm i session-file-store --s
/*세션에 저장된 정보를 파일로 보관하려면 위 모듈을
설치하고 ex폴더 아래 session 디렉토리를 생성하지.
이 디렉토리에 자동으로 "세션아이디.json"파일이 만들어지고 세션에 저장된
값들이 저장된다.
그러려면 세션 함수에 store라는 속성 값으로
new FileStore()객체를 설정해야 한다.*/

var app=express();

//session() 함수를 use하겠다고 해야 세션이 시작된다.
//session함수에는 옵션이 들어간다
app.use(session({
    secret:'asdf123',
    resave: false,
    //세션 데이터가 변경이 있기 전까지 세션저장소의 값을 저장하지 않음
    saveUninitialized:true,
    //true를 주면 세션이 필요하기전까지는 세션을 구동하지 않는다는 의미
    store: new fileStore()
    //store 속성을 추가하면 세션에 저장된 값을 파일로 보관할 수 있다.
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
    //res.send("<h1>Hello Session: "+req.session.num+"</h1>");
    res.send(`<h1 style='color:red'>HI Session: ${req.session.num}</h1>`);
})

http.createServer(app).listen(3333,function(){
    console.log('http://localhost:3333');
})