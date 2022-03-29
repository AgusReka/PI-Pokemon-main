CREATE DATABASE pokedex;

CREATE TABLE Pokemon(
    id serial PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE,
    vida INTEGER,
    daño INTEGER,
    fuerza INTEGER,
    rapized INTEGER,
    altura INTEGER,
    peso INTEGER
);



CREATE TABLE Tipos(
    id serial PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);
