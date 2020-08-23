function add(a, b, func){
    var result=a+b;
    return result;
}
function sum(a,b,func){
    var result=a+b;
    func(a,b,result); //callback함수
}

var r=add(10,20);
console.log(r);

//sum() 호출하기
sum(3,5,function(x,y,res){
    console.log(x+"+"+y+"="+res);
})

sum(3,5,function(x,y,res){
    console.log(x+y+"의 3배는 ="+(res*3));
})