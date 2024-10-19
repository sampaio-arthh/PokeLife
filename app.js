//Definição bibliotecas
const mysql = require("mysql2");
const express = require("express");
const ejs = require("ejs");

const app = express();
const port = 3000;
app.set("view engine", "ejs"); //Definindo ejs como método de exibição

//inst conex + spec
const db = mysql.createConnection({
    host: "localhost",
    database: "pokemon",
    user: "root",
    password: ""
});
//conex proc --> err + stdConex
db.connect((error)=>{
    if(error){
        console.log("Erro ao conectar com o MySQL! \n", error);
    }
    else{
        console.log("Conectado ao MySQL!");
    }
})

/* app.get("/pokemons", (req, res)=>{
    //query through db w/ SQL
    db.query("SELECT nome, nvl FROM Pokemon", (error, results) => {
    if(error){
        console.log("Ocorreu um erro ao buscar todos os pokemons", error);
    }
    else{

        res.render("/views/pokemons.ejs", {pokemons : results});

        //sem ejs:
        //res.send(results); //out to page
        //console.log(results); //out to console
    }
})
}); */

app.get("/", (req, res)=>{
    res.render(__dirname + "/views/home.ejs")
})
app.get("/pokemons", (req, res) => {
    db.query("SELECT p.nome, nvl, link, t.nome as Tnome FROM Pokemon p INNER JOIN treinador_pokemon tp ON tp.id_pokemon = p.id_pokemon INNER JOIN treinador t ON t.id_treinador = tp.id_treinador", (error, results) => {
        if (error) {
            console.log("Ocorreu um erro ao buscar todos os pokemons \n", error);
        } else {
            res.render("pokemons", { pokemons: results }); // Passando os dados para a view
        }
    });
});

app.get("/pesquisarPoke", (req, res) =>{
    const pesquisa = req.query.pesquisa;
    db.query("SELECT p.nome, nvl, link, t.nome as Tnome FROM Pokemon p INNER JOIN treinador_pokemon tp ON tp.id_pokemon = p.id_pokemon INNER JOIN treinador t ON t.id_treinador = tp.id_treinador WHERE p.nome LIKE ?", [`%${pesquisa}%`], (error, results) => {
        if(error){
            console.log("Houve um erro ao realizar a pesquisa \n", error);
        }
        else{
            res.render("pokemons", { pokemons : results })
        }
    })
});

app.get("/trainers", (req, res)=>{
    db.query("SELECT t.id_treinador, t.nome, t.idade, t.cidade, COUNT(b.id_treinador_vencedor) AS vitorias FROM treinador t LEFT JOIN batalha b ON t.id_treinador = b.id_treinador_vencedor GROUP BY t.id_treinador, t.nome, t.idade, t.cidade;", (error, results) => {
        if(error){
            console.log("Houve um erro na busca dos treinadores \n", error);
        }
        else{
            res.render("trainers", { treinadores : results })
        }
    })
})

app.get("/pesquisarTrainer", (req, res) =>{
    const pesquisa = req.query.pesquisa;
    db.query("SELECT t.id_treinador, t.nome, t.idade, t.cidade, COUNT(b.id_treinador_vencedor) AS vitorias FROM treinador t LEFT JOIN batalha b ON t.id_treinador = b.id_treinador_vencedor WHERE t.nome LIKE ? OR t.cidade = ? OR CAST(idade AS CHAR) = ? GROUP BY t.id_treinador, t.nome, t.idade, t.cidade", [`%${pesquisa}%`, pesquisa, pesquisa], (error, results) => {
        if(error){
            console.log("Houve um erro ao realizar a pesquisa\n", error);
        }
        else{
            res.render("trainers", { treinadores : results }) //results são os resultados da pesquisa que usa o LIKE
        }
    })
});

app.get("/battles", (req, res)=>{
    res.render(__dirname + "/views/battles.ejs")
})

app.use(express.static(__dirname + '/styles'));

app.listen(port, ()=>{
    console.log("Servidor iniciado");
});