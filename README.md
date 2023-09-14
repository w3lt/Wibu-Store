# Wibu-Store
This store sells wibu game (for everyone ofc) :>

create table Users (
    uid varchar(255),
    email varchar(255),
    username varchar(255) not null,
    password varchar(255) not null,
    gender int,
    dob varchar(255),
    created_at varchar(255) not null,
    primary key (uid),
    unique (username),
    unique (email)
)

insert into Users values ('12345', 'a@gmail.com', 'qwe', '123456', '-1', null, '13/09/2023');