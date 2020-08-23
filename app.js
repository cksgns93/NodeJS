var http=require('http'),
express=require('express'),
path=require('path'),
fs=require('fs'),
static=require('serve-static'),
bodyParser=require('body-parser');

//사용자 정의 모듈 불러오기/////////////////////////
//var routes =require('./routes/index.js'); 정석
var routes =require('./routes'); //생략해도됌
var user=require('./routes/user/member.js')
//////////////////////////////////////////////

//express-session모듈 불러오기
var session = require('express-session')
, fileStore = require('session-file-store')(session);

var app=express();
app.set('port',3333);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use('/',static(path.join(__dirname,'public')));
//post방식일 때 설정
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret:'nodememberasdf12',
    resave:false,
    saveUninitialized:true,
    store:new fileStore()
}))

//로그인 여부를 체크하는 미들웨어
app.use(function(req,res,next){
    console.log(`로그인체크 미들웨어: ${JSON.stringify(req.session.loginData)}`);
    res.locals.isLogin=(req.session.loginData===undefined)?false:req.session.loginData.isLogin;
    res.locals.userid=(req.session.loginData===undefined)?null:req.session.loginData.loginUser.userid
    next();
})

//라우팅 처리////////////////////////////////////
app.get('/', routes.index)
app.get('/join',user.join);
app.post('/join',user.joinEnd); // /join << 주소위치
//아이디 중복 체크
app.get('/idcheck',user.idcheck);
app.get('/users',user.list);
app.get('/users/delete/:num', user.delete);
app.get('/users/:num',user.edit);
app.post('/users/edit',user.editEnd);

app.get('/login',user.loginForm)
app.post('/login',user.loginEnd)
app.get('/logout', user.logOut);
////////////////////////////////////////////////

http.createServer(app).listen(app.get('port'),function(){
    console.log('http://localhost:'+app.get('port'));
})

//command.propertice?? 같은 느낌이다.