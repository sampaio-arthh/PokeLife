const mysql = require("mysql2");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("src"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokemon",
});

db.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao MySQL:", error);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

app.get("/pesquisarHome", (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa);
  db.query(
    "SELECT * FROM POKEMON where nome like ?",
    [`%${pesquisa}%`],
    (error, results) => {
      if (error) {
        console.log("ocorreu um erro ao realizar o filtro");
      } else {
        console.log(results);
        res.render("home", { pokemons: results });
      }
    }
  );
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM Pokemon", (error, results) => {
    res.render("home", { pokemons: results });
  });
});

app.get("/infoPokemon", (req, res) => {
  const id_pokemon = req.query.id_pokemon;
  db.query(
    "SELECT * FROM Pokemon WHERE id_pokemon = ?",
    [id_pokemon],
    (error, results) => {
      res.render("infoPokemon", { pokemon: results[0] });
    }
  );
});

app.get("/batalhas", (req, res) => {
 
  db.query(`SELECT 
            b.id_batalha,
            date_format(b.data, "%d/%m/%Y") as data,
            p1.nome as pokemon1, 
            t1.nome as treinador1, 
            t2.nome as treinador2,
            v.nome as vencedor,
            p2.nome as pokemon2
            FROM batalha b 
            INNER JOIN treinador t1 on b.id_treinador1 = t1.id_treinador
            INNER JOIN pokemon p1 on b.id_pokemon1 = p1.id_pokemon
            INNER JOIN treinador t2 on b.id_treinador2 = t2.id_treinador
            INNER JOIN pokemon p2 on b.id_pokemon2 = p2.id_pokemon
            INNER JOIN treinador v on b.id_treinador_vencedor = v.id_treinador
            ORDER BY id_batalha`,
      (error, results) => {
    res.render("batalhas", { batalhas: results });
  });
});

app.get("/infoBatalha", (req, res) => {
  const id_batalha = req.query.id_batalha;
  db.query(
    `SELECT 
      b.id_batalha,
      date_format(b.data, "%Y-%m-%d") as data,
      b.id_pokemon1,
      b.id_pokemon2, 
      b.id_treinador1, 
      b.id_treinador2, 
      b.id_treinador_vencedor 
    FROM batalha b 
    WHERE id_batalha = ?`,
    [id_batalha],
    (error, results) => {   
      if (error) {
        console.error("Erro ao carregar batalhas", error);
      }
      const batalha = results[0];
      
      db.query("SELECT id_treinador, nome FROM treinador ORDER BY nome", (error, treinadores) => {
        if (error) {
          console.error("Erro ao carregar treinadores", error);
        }
        db.query("SELECT id_pokemon, nome FROM pokemon ORDER BY nome", (error, pokemons) => {
          if (error) {
            console.error("Erro ao carregar pokemons", error);
          }
          res.render("infoBatalha", { treinadores, batalha, pokemons1: pokemons, pokemons2: pokemons });
        });
      });
    }
  );
});

app.get("/treinadorPokemon", (req, res) => {
  const id_treinador = req.query.id_treinador;
  db.query(
    `SELECT p.id_pokemon, 
     p.nome 
     FROM treinador_pokemon tp 
     INNER JOIN pokemon p on p.id_pokemon = tp.id_pokemon 
     WHERE id_treinador = ?`,
    [id_treinador],
    (error, results) => {
      res.send(results);
    }
  );
});

/*Aqui nós usamos o método POST, pois vamos modificar os dados*/
app.post("/editarBatalha", (req, res)=>{
  const id_batalha = req.body.id_batalha
  const data = req.body.inputData
  const treinador1 = req.body.inputTreinador1
  const treinador2 = req.body.inputTreinador2
  const pokemon1 = req.body.inputPokemon1
  const pokemon2 = req.body.inputPokemon2
  const vencedor = req.body.inputVencedor
  console.log(req.body)
  db.query(
    `UPDATE batalha
     SET id_treinador1 = ?, 
     id_treinador2 = ?,
     id_pokemon1 = ?, 
     id_pokemon2 = ?, 
     id_treinador_vencedor = ?, 
     data = ?
     WHERE id_batalha = ?`,
    [treinador1, treinador2, pokemon1, pokemon2, vencedor, data, id_batalha],
    (error, results) => {
      if (error) {
        console.error("Erro ao salvar", error);
        return
      }
      res.redirect(`/Batalhas`)
    }
  );
})

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
