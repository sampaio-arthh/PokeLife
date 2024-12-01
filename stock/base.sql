CREATE DATABASE pokemon;
USE pokemon;
CREATE TABLE pokemon (
    id_pokemon INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
   	nvl INT NOT NULL,
    link varchar(300) NOT NULL
);
CREATE TABLE treinador (
    id_treinador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    idade INT NOT NULL,
    cidade VARCHAR(50) NOT NULL
);
CREATE TABLE treinador_pokemon (
    id_pokemon INT NOT NULL,
    id_treinador INT NOT NULL,
    CONSTRAINT Pk_treinador_pokemon PRIMARY KEY (id_pokemon, id_treinador),
    FOREIGN KEY (id_treinador) REFERENCES Treinador(id_treinador),
    FOREIGN KEY (id_pokemon) REFERENCES Pokemon(id_pokemon)
);
CREATE TABLE batalha (
    id_batalha INT AUTO_INCREMENT PRIMARY KEY,
    id_treinador1 INT NOT NULL,
    FOREIGN KEY (id_treinador1) REFERENCES Treinador(id_treinador),
    id_pokemon1 INT NOT NULL,
    FOREIGN KEY (id_pokemon1) REFERENCES Pokemon(id_pokemon),
    id_treinador2 INT NOT NULL,
    FOREIGN KEY (id_treinador2) REFERENCES Treinador(id_treinador),
    id_pokemon2 INT NOT NULL,
    FOREIGN KEY (id_pokemon2) REFERENCES Pokemon(id_pokemon),
    id_treinador_vencedor INT NOT NULL,
    data DATE NOT NULL
);

INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (1, "Pikachu", "elétrico", 10, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (2, "Charmander", "fogo", 8, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png");
INSERT INTO Treinador (id_treinador, nome, idade, cidade) VALUES (1, "Ash", 10, "Kanto");

INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (1,1);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (1,2);

INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (3, "Bulbasaur", "grama/veneno", 10, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png");
INSERT INTO Treinador (id_treinador, nome, idade, cidade) VALUES (2, "Misty", 12, "Cerulean");

INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (2,3);

INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (4, "Squirtle", "água", 9, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png");
INSERT INTO Treinador (id_treinador, nome, idade, cidade) VALUES (3, "Brock", 15, "Pewter");

INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (3,4);

INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (5, "Arceus", "normal", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/493.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (6, "Rayquaza", "dragão/voador", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/384.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (7, "Darkrai", "sombrio", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/491.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (8, "Charizard", "fogo/voador", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/006.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (9, "Golurk", "fantasma/terra", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/623.png");
INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (10, "Mewtwo", "psíquico", 100, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/150.png");
INSERT INTO Treinador (id_treinador, nome, idade, cidade) VALUES (4, "Arthur", 17, "Pallet");

INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,5);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,6);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,7);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,8);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,9);
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (4,10);

INSERT INTO Pokemon (id_pokemon, nome, tipo, nvl, link) VALUES (11, "Jigglypuff", "fada", 7, "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/039.png");
INSERT INTO Treinador (id_treinador, nome, idade, cidade) VALUES (5, "Gary", 11, "Pallet");
INSERT INTO Treinador_pokemon (id_treinador, id_pokemon) VALUES (5,11);

INSERT INTO Batalha (id_batalha, id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, data) VALUES (1,1,1,2,3,1,"2024-09-01");
INSERT INTO Batalha (id_batalha, id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, data) VALUES (2,3,4,1,2,3,"2024-09-02");
INSERT INTO Batalha (id_batalha, id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, data) VALUES (3,5,11,2,3,2,"2024-09-03");

INSERT INTO Batalha (id_batalha, id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, data) VALUES (4,1,1,4,6,4,"2024-09-11");