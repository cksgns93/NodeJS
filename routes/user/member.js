var userdb = require('../../model/userdb.js')

exports.join=function(req,res){
    //views/user/join.ejs
    var data={title:"Member Join"};
    res.render('user/join',data); 
    //res.send("<h1>회원가입</h1>");
}
exports.joinEnd=function(req,res){
    //post => req.body
    //get => req.query
    var name=req.body.name;
    var userid=req.body.userid;
    var pwd=req.body.pwd;
    var email=req.body.email;

    var user={ //사용자가 입력한 값 (key : value)
        name:name,
        userid:userid,
        pwd:pwd,
        email:email
       
        
    };
    userdb.userInsert(user,req,res);
    //res.send("<h2>회원 가입 처리 중...</h2>");
    //res.send("<h2>"+JSON.stringify(user)+"</h2>"); 
    // JSON.stringify = Object를 문자열화

}
exports.idcheck=function(req,res){
    var data={userid:req.query.userid};
    userdb.idcheck(data,req,res);
}

exports.list=function(req,res){
            userdb.listUser(req,res);
        }

exports.delete=(req,res)=>{
    //path로 들어오는 파라미터값 받기
    //get => req.query.num
    //post => req.body.num
    //path => req.params.num
    console.log("삭제할 회원번호: "+req.params.num);
    var data={num:req.params.num};
    userdb.deleteUser(data,req,res);
    //res.send('삭제 처리중...');
}

exports.edit=function(req,res){
    console.log("수정할 회원번호: "+req.params.num);
    var data={num:req.params.num};
    userdb.selectUser(data,req,res);
    //res.send('수정처리중');
}

exports.editEnd=function(req,res){
    //수정한 회원정보 추출하기
    var data={
        num: req.body.num,
        name:req.body.name,
        userid:req.body.userid,
        pwd:req.body.pwd,
        email:req.body.email
    }
    userdb.editUser(data,req,res);
}

exports.loginForm=function(req,res){
    res.render('user/login');
}

exports.loginEnd=function(req,res){
    //사용자가 입력한 값
    var uid=req.body.userid;
    var upw=req.body.pwd;
    var data={userid:uid,pwd:upw}
    //res.json(data);
    userdb.loginCheck(data,req,res);
}

exports.logOut=function(req,res){
    //session변수 모두 무효화 => destory()
    req.session.destroy(function(err){
        if(err) throw err;
        res.redirect('/');
    })
}