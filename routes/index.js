exports.index=function(req,res){
    var data={title:'MyNodeWeb'}
    //res.send("<h1> Index Page</h1>");
    res.render('main',data,function(err,html){
        //main.ejs를 렌더링 함. 동적인 html생성
        if(err) throw err;
        //console.log(html);
        res.send(html);
    })
}