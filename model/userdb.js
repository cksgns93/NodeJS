//oracledb모듈 설치
//npm i oracledb --s
//dao역할

var db=require('oracledb')
var dbconfig=require('./dbconfig.js') //db연동하는 문장
db.autoCommit=true;//자동 커밋

exports.userInsert=(user,req,res)=>{ //member.js의 joinEnd에서 넘겨받은 값으로 sql문 처리
    //console.dir(user);
    //db연결
    db.getConnection(dbconfig,function(err,con){ //비동기방식 : (function)값을 받을게 있으면 콜백함수에서 매개변수(con)       (db연결하는메소드)
        if(err) throw err;
        var sql="insert into node_member values(";
            sql+=" node_member_seq.nextval,:name,:userid,:pwd,:email,sysdate)"; //:mame = user가 가져온 key값
            con.execute(sql,user,function(err,result){ //sql문 실행시키는거
                if(err) throw err;
                con.close(function(err){
                    //실행 결과 받아와 처리하기
                    if(err) throw err;
                    console.log(JSON.stringify(result));
                    var n=parseInt(result.rowsAffected); //result의 rowsAffected(영향받은 레코드 수)
                    var data={};
                    if(n>0){
                        data.msg='회원가입 성공';
                        data.loc='/'
                    }else{
                        data.msg='회원가입 실패';
                        data.loc='javascript:history.back()';
                    }
                    res.render('message',data); //view로 보내는 문장
                    //views/message.ejs

                })//con.close();
            })//con.execute();
    })//db.getConnect()
}//userInsert()

exports.idcheck=function(data,req,res){
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="select num from node_member where userid=:userid";
        con.execute(sql,data,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                console.dir(result);
                var n=result.rows.length;
                var obj={};
                if(n>0){
                    obj.isUse=false;
                    obj.userid=data.userid;
                }else{
                    obj.isUse=true;
                    obj.userid=data.userid;
                }
                res.json(obj); //json으로 응답을 보낼때 사용하는 함수
            })
        })
    })
}

//회원수를 구하는 함수
exports.getTotalCount=function(callback){
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="select count(num) from node_member";
        con.execute(sql,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                console.dir(result);
                var obj={total:result.rows[0][0]}
                callback(obj);//결과값을 콜백함수에 넘긴다.
            })

        })
    })
}
//페이징 처리 포함한 목록 가져오기
exports.listUser=function(req,res){
    this.getTotalCount(function(cnt){
        var total=cnt.total; //총 회원수
        var display=5; //한 페이지 당 보여줄 개수
        var pageCount= Math.ceil(total/display);
        //현재 보여줄 페이지 파라미터 값 받기(cpage)
        var cpage=parseInt(req.query.cpage);
        if(!cpage||cpage<0){
            cpage=1;//1페이지 디폴트
        }
        if(cpage>pageCount){
            cpage=pageCount;
        }
        var end=cpage * display;
        var start=end - (display-1);
        var data=[start, end];
        db.getConnection(dbconfig,(err,con)=>{
            if(err) throw err;
            var sql="select * from("
                    +" select num,name,userid,pwd,email,to_char(indate,'yyyy-mm-dd') indate,"
                    +" row_number() over(order by num desc) rn "
                    +" from node_member) where rn between :1 and :2"; //배열 처리하는 방법 = (:1 = start)
            con.execute(sql,data,function(err,result){
                if(err) throw err;
                con.close(function(err){
                    if(err) throw err;
                    console.dir(result);
                    var obj={
                        total:total,
                        pageCount:pageCount,
                        cpage:cpage,
                        userData:result.rows
                    };
                    //console.dir(cnt)
                    //res.send('list 처리중...');
                    res.render('user/list',obj);

                })//close() end-------------
                })//execute() end------------
        });//getConnection() end-------------
    })
}

//DML (insert, update, delete)문장 => result의 rowsAffected(영향받은 레코드 수)
//DQL (select) 문장 => result의 rows (2차원 배열)
exports.listUser_old=function(req,res){
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="select num,name,userid,pwd,email,to_char(indate,'yyyy-mm-dd') indate from node_member order by num desc";
        con.execute(sql,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                //console.dir(result);
                var data={
                    userData:result.rows, //2차원 배열
                    total:result.rows.length //회원수
                }
                //res.send("<h1>회원 목록 가져오는 중....</h1>")
                res.render('user/list',data);
            })
        })
    })
}

exports.deleteUser=(data,req,res)=>{
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="delete from node_member where num=:num";
        con.execute(sql,data,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                console.dir(result)
                //res.send('삭제 처리중2...');
                //res.redirect('/users');
                var n=parseInt(result.rowsAffected);
                var obj={};
                if(n>0){
                    obj.msg='삭제성공';
                    obj.loc='/users';
                }else{
                    obj.msg='삭제 실패';
                    obj.loc='javascript:history.back';
                }
                res.render('message',obj);
            })
        })
    })
}

exports.selectUser=(data,req,res)=>{
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="select * from node_member where num=:num";
        con.execute(sql,data,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                console.dir(result)
                //res.send('회원정보 가져오는 중...');
                var data={
                    userData:result.rows
                };
                res.render('user/edit',data);
            })
        })
    })
}

//Update문 작성해서 실행시키고 실행결과 msg, loc 저장 후 message.ejs로 render
exports.editUser=function(data, req,res){
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="update node_member set name=:name, userid=:userid, pwd=:pwd, email=:email where num=:num";
        con.execute(sql,data,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                var obj={};
                if(parseInt(result.rowsAffected)>0){
                    obj.msg='수정 성공';
                    obj.loc='/users';
                }else{
                    obj.msg='수정 실패';
                    obj.loc='javascript:history.back';
                }
                res.render('message',obj);
            })
        })
    })
}

//로그인 처리
exports.loginCheck=(data,req,res)=>{
    db.getConnection(dbconfig,function(err,con){
        if(err) throw err;
        var sql="select * from node_member where userid=:userid and pwd=:pwd";
        con.execute(sql,data,function(err,result){
            if(err) throw err;
            con.close(function(err){
                if(err) throw err;
                //console.dir(result);
                var obj={};
                if(result.rows.length==0){
                    //아이디와 비번이 틀린 경우
                    obj.loginUser=null;
                    obj.isLogin=false;
                }else{
                    //회원이 맞다면 obj.loginUser에 회원 정보를 저장하자.
                    obj.isLogin=true;
                    var userData=result.rows;
                    var tmpUser={
                        num:userData[0][0],
                        name:userData[0][1],
                        userid:userData[0][2],
                        email:userData[0][4]
                    }
                    obj.loginUser=tmpUser;
                }
                //세션에 obj를 저장
                //콜백함수를 이용하여 저장이 완료된 이후 페이지 이동하도록 처리한다.
                req.session.loginData=obj;
                req.session.save(function(err){
                    if(err) throw err;
                    res.render('user/loginResult', req.session.loginData);
                    //res.redirect('/');
                })

            })//close() end---

        })//execute() end---------------
    })//getConnection() end--------------
}