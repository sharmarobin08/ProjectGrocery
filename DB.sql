create database info;
create table users(ID int PRIMARY KEY AUTO_INCREMENT,fullname varchar(30) NOT NULL,email varchar(50),pass varchar(20) NOT NULL,username varchar(30));
create table list(ID int,item varchar(50) not null,quantity int not null default 1,foreign key (ID) references users(ID));

