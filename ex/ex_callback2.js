function add(a,b, callback){
    var result=a+b;
    callback(result);
    var history=function(){ //add함수안에 history함수를 만들면 a,b의 지역변수를 사용할 수 있다.
        console.log(a+"+"+b+"="+result);
    }
    return history;
}

//add()함수를 호출해보기
var bbb=add(10,20,function(c){
    console.log("c="+c);
});
bbb(); //history함수 가져오기