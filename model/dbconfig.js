module.exports={
    connectString:'localhost:1521/XE',
    user:'myshop',
    password:'tiger'
}//db연결정보만 내보내는 파일

//생성할 것들
/*
create table node_member(
num number(8) primary key,
name varchar2(30) not null,
userid varchar2(20) unique not null,
pwd varchar2(20) not null,
email varchar2(200),
indate date default sysdate
);

create sequence node_member_seq nocache;
*/