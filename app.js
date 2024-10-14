//require package mysql2
const mysql = require("mysql2");
const express = require("express");
const ejs = require("ejs");

const app = express();
const port = 3000;
app.set("view engine", "ejs"); //avisando que usa o ejs

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
        console.log("Erro ao conectar com o MySQL!", error);
    }
    else{
        console.log("Conectado ao MySQL!");
    }
})

app.get("/", (req, res)=>{
    //query through db w/ SQL
    db.query("SELECT nome, nvl FROM Pokemon", (error, results) => {
    if(error){
        console.log("Ocorreu um eroo ao buscar todos os pokemons", error);
    }
    else{
        
        res.render("home", {pokemons : results});

        /* sem ejs:
        res.send(results); //out to page
        console.log(results); //out to console */
    }
})
});

app.get("pokemons", (req, res)=>{
    res.sendFile(__dirname + "pokemons.ejs")
})

app.get("/pesquisarHome", (req, res) =>{
    const pesquisa = req.query.pesquisa;
    db.query("SELECT nome, nvl FROM pokemon WHERE nome LIKE ?", [`%${pesquisa}%`], (error, results) => { // ? (subs)-> ${pesquisa} com a devida formatação e expressão
        if(error){
            console.log("Houve um erro ao realizar a pesquisa");
        }
        else{
            res.render("home", { pokemons : results }) //results são os resultados da pesquisa que usa o LIKE
        }
    })
});

app.use(express.static(__dirname + '/styles'));

app.listen(port, ()=>{
    console.log("Servidor iniciado");
});

//usar img no projeto: caminho como atributo do banco
//representações visuais