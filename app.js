//Definição bibliotecas a serem usadas
const mysql = require("mysql2");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser"); //Importa módulo bodyParser que trabalha com as requisições HTTP e o envio de dados via POST
const { error } = require("console");

const app = express();
const port = 3000;
app.set("view engine", "ejs"); //Definindo ejs como método de exibição

app.use(bodyParser.urlencoded({ extend: true })); //Configurando as intervenções do bodyParser
app.set("view engine", "ejs");
app.use(express.static("src"));

//Instanciando a conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    database: "pokemon",
    user: "root",
    password: ""
});

//Processo de conexão e retorno de erros se necessário
db.connect((error)=>{
    if(error){ //
        console.log("Erro ao conectar com o MySQL! \n", error); //Erro de conexão no console
    }
    else{
        console.log("Conectado ao MySQL!"); //Sucesso
    }
})

app.use(express.static(__dirname + '/styles')); //Autorizando acesso integral à pasta styles

//res.send(results); //Envia para a página
//Se houver uma página renderizada, e usar o res.send(results) você envia o arquivo como um download

//console.log(results); //Envia para o console

app.get("/", (req, res)=>{ //Rota da home
    res.render(__dirname + "/views/home.ejs") //Entre na pasta e renderize esse arquivo
})

app.get("/pokemons", (req, res) => { //Ao receber a rota /pokemons:
    //Realize essa busca Nome, id, nível e link do pokemon com o nome do seu treinador
    db.query("SELECT p.nome, p.id_pokemon, nvl, link, t.nome as Tnome FROM Pokemon p INNER JOIN treinador_pokemon tp ON tp.id_pokemon = p.id_pokemon INNER JOIN treinador t ON t.id_treinador = tp.id_treinador ORDER BY id_pokemon", (error, results) => {
        if (error) { //Se algo der errado
            console.log("Ocorreu um erro ao buscar todos os pokemons \n", error); //Avise no console
            res.redirect("/"); //Volte para a home
            window.alert("Algo deu errado"); //Avise na tela para o usuário
        } else { //Se ocorreu naturalmente
            res.render("pokemons", { pokemons: results }); // Passando os dados para a view no dicionário pokemons
            //Estrutura dict pokemons => {p.nome : valor(p.nome), p.id_pokemon : valor(p.id_pokemon), nvl : valor(nvl), link : valor(link), t.id_treinador : valor(t.id_treinador)}
        }
    });
});

app.get("/pesquisarPoke", (req, res) =>{ //Rota de pesquisa
    const pesquisa = req.query.pesquisa; //'pesquisa' recebe o valor do <input name='pesquisa'>
    db.query("SELECT p.nome, nvl, link, t.nome as Tnome FROM Pokemon p INNER JOIN treinador_pokemon tp ON tp.id_pokemon = p.id_pokemon INNER JOIN treinador t ON t.id_treinador = tp.id_treinador WHERE p.nome LIKE ?", [`%${pesquisa}%`], (error, results) => {
    //Busca por pokémon com nome semelhante ao texto digitado
    //[`%${pesquisa}%`] --> '%': qualquer sequência de caracteres (na frente e atrás) | '${}' --> representa que está falando de uma variável dentro do ` `
        if(error){
            console.log("Houve um erro ao realizar a pesquisa \n", error); //
            res.redirect("/trainers")
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
    db.query("SELECT b.id_batalha, t1.nome AS treinador1, p1.nome AS pokemon1, t2.nome AS treinador2, p2.nome AS pokemon2, tv.nome AS treinador_vencedor, p1.link AS link1, p2.link AS link2 FROM batalha b JOIN treinador t1 ON b.id_treinador1 = t1.id_treinador JOIN pokemon p1 ON b.id_pokemon1 = p1.id_pokemon JOIN treinador t2 ON b.id_treinador2 = t2.id_treinador JOIN pokemon p2 ON b.id_pokemon2 = p2.id_pokemon JOIN treinador tv ON b.id_treinador_vencedor = tv.id_treinador;", (error, results) =>{
        if(error){
            console.log("Houve um erro na busca das batalhas \n", error);
        }
        else{
            res.render("battles", {batalhas : results});
        }
    })
});

app.get("/pesquisarBattles", (req, res) => {
    const pesquisa = req.query.pesquisa;

    db.query(`
    SELECT b.id_batalha, t1.nome AS treinador1, p1.nome AS pokemon1, t2.nome AS treinador2, p2.nome AS pokemon2, tv.nome AS treinador_vencedor, p1.link AS link1, p2.link AS link2 FROM batalha b JOIN treinador t1 ON b.id_treinador1 = t1.id_treinador JOIN pokemon p1 ON b.id_pokemon1 = p1.id_pokemon JOIN treinador t2 ON b.id_treinador2 = t2.id_treinador JOIN pokemon p2 ON b.id_pokemon2 = p2.id_pokemon JOIN treinador tv ON b.id_treinador_vencedor = tv.id_treinador WHERE tv.nome LIKE ? OR p1.nome LIKE ? OR p2.nome LIKE ?`, [`%${pesquisa}%`, `%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log("Houve um erro ao realizar a pesquisa\n", error);
            return res.status(500).send("Erro na consulta");
        } else {
            res.render("battles", { batalhas: results });
        }
    });
});

app.get("/infoPokemon", (req, res)=>{
    const id_pokemon = req.query.id_pokemon;
    db.query("SELECT * FROM Pokemon WHERE id_pokemon = ?", [id_pokemon], (error, results) => {
        res.render("infoPokemon", { pokemon: results[0]});
    });
});

app.get("/infoTrainers", (req, res)=>{
    const id_treinador = req.query.id_treinador;
    db.query("SELECT * FROM treinador WHERE id_treinador = ?", [id_treinador], (error, results) => {
      res.render("infoTrainers", { treinadores : results[0] });
    });
});

app.get("/infoBattles", (req, res) => {
    const id_batalha = req.query.id_batalha;

    db.query("SELECT b.id_batalha,b.id_treinador1,b.id_pokemon1,b.id_treinador2,b.id_pokemon2,b.id_treinador_vencedor, DATE_FORMAT(b.data, '%Y-%m-%d') AS data FROM batalha b WHERE id_batalha = ?", [id_batalha], (error, resultsBatalha) => {
        if (error) {
            return res.status(500).send('Erro ao consultar a batalha');
        }
        db.query("SELECT t.id_treinador, t.nome FROM treinador t;", (error, resultsTreinadores) => {
            if (error) {
                return res.status(500).send('Erro ao consultar os treinadores');
            }
            db.query("SELECT p.id_pokemon, p.nome FROM pokemon p;", (error, resultsPokemon) => {
                if (error) {
                    return res.status(500).send('Erro ao consultar os pokémons');
                }
                res.render("infoBattles", { 
                    batalha: resultsBatalha[0], 
                    treinadores: resultsTreinadores, 
                    pokemons: resultsPokemon,
            });
        });
    });
});
});



app.listen(port, ()=>{
    console.log("Servidor iniciado");
});

app.post('/editarPokemon', (req, res) => {
    //os req.body.xyz tem como xyz o nome do input
    const id_pokemon = req.body.id_pokemon;
    const nome = req.body.inputNome;
    const tipo = req.body.inputTipo;
    const nvl = req.body.inputNvl;
    const link = req.body.imagem_url;
    db.query("UPDATE pokemon SET nome = ?, tipo = ?, nvl = ?, link = ? WHERE id_pokemon = ?", [nome, tipo, nvl, link, id_pokemon], (err, results) => {
        if (err) {
            console.log('Erro ao atualizar o pokemon:', err);
            return res.send('Erro ao atualizar o pokemon');
        }
        else{
            res.redirect("/pokemons");
        }
    });
});

app.post('/editarTrainer', (req, res) => {
    const id_treinador = req.body.id_treinador;
    const nome = req.body.inputNome;
    const idade = req.body.inputIdade;
    const cidade = req.body.inputCidade;
    db.query("UPDATE treinador SET nome = ?, idade = ?, cidade = ? WHERE id_treinador = ?", [nome, idade, cidade, id_treinador], (err, results) => {
        if (err) {
            console.log('Erro ao atualizar o cadastro do treinador:', err);
            return res.send('Erro ao atualizar o cadastro do treinador');
        }
        else{
            res.redirect("/trainers");
        }
    });
});

app.post('/editarBattle', (req, res) => {
    const id_batalha = req.body.id_batalha;
    const id_treinador1 = req.body.selId_treinador1;
    const id_treinador2 = req.body.selId_treinador2;
    const id_pokemon1 = req.body.selId_pokemon1;
    const id_pokemon2 = req.body.selId_pokemon2;
    const id_treinador_vencedor = req.body.selId_treinador_vencedor;
    const data = req.body.inputData;
    db.query("UPDATE batalha SET id_treinador1 = ?, id_pokemon1 = ?, id_treinador2 = ?, id_pokemon2 = ?, id_treinador_vencedor = ?, data = ?  WHERE id_batalha = ?", [id_treinador1, id_pokemon1, id_treinador2, id_pokemon2, id_treinador_vencedor, data, id_batalha], (err, results) => {
        if (err) {
            console.log('Erro ao atualizar a batalha:', err);
            return res.send('Erro ao atualizar o registro da batalha');
        }
        else{
            console.log(data);
            res.redirect("/battles");
        }
    });
});

app.get("/newPokemon", (req, res) => {
    db.query("SELECT id_treinador, nome FROM treinador", (err, resultsTreinadores) =>{
        res.render("newPokemon", {treinadores : resultsTreinadores});
    })
})
app.get("/newTrainer", (req, res) => {
    res.render("newTrainer");
})
app.post("/addPokemon", (req, res) => {
    const nome = req.body.inputNome;
    const tipo = req.body.inputTipo;
    const id_treinador = req.body.selId_treinador;
    const nvl = req.body.inputNvl;
    const link = req.body.inputUrl;

    // Primeira consulta: Inserção do Pokémon
    db.query("INSERT INTO pokemon (nome, tipo, nvl, link) values (?,?,?,?)", [nome, tipo, nvl, link], (err, results) => {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        // Segunda consulta: Obter o id_pokemon do último Pokémon inserido
        db.query("SELECT id_pokemon FROM pokemon WHERE id_pokemon = (SELECT max(id_pokemon) FROM pokemon);", (err, results) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            }

            // O id_pokemon está em results[0].id_pokemon
            const id_pokemon = results[0].id_pokemon;

            // Terceira consulta: Inserir na tabela treinador_pokemon
            db.query("INSERT INTO treinador_pokemon (id_treinador, id_pokemon) values (?, ?)", [id_treinador, id_pokemon], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                }

                // Enviar a resposta para o cliente depois de todas as consultas serem concluídas
                res.redirect("pokemons");
            });
        });
    });
});

app.post("/addTrainer", (req, res) =>{
    const nome = req.body.inputNome;
    const idade = req.body.inputIdade;
    const cidade = req.body.inputCidade;
    db.query("INSERT INTO treinador (nome, idade, cidade) values (?,?,?)", [nome, idade, cidade], (err, results) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        res.redirect("/trainers")
    })
})

app.post("/delPokemon", (req, res) => {
    const id_pokemon = req.body.id_pokemon;
    db.query("DELETE FROM batalha WHERE id_pokemon1 = ? OR id_pokemon2 = ?", [id_pokemon, id_pokemon], (err, results) =>{
        if(err){
            console.log(err);
            res.redirect("/");
        }
        db.query("DELETE FROM treinador_pokemon WHERE id_pokemon = ?", [id_pokemon], (err, results) =>{
            if(err){
                console.log(err);
                res.redirect("/");
            }
            db.query("DELETE FROM pokemon WHERE id_pokemon = ?", [id_pokemon], (err, results) =>{
                if(err){
                    console.log(err);
                    res.redirect("/")
                }
                res.redirect("/pokemons")
            })
        })
    })
})

app.post("/delTrainer", (req, res) => {
    const id_treinador = req.body.id_treinador; //Recebendo o id_treinador pelo input type="hidden" da página

    // Primeiro tem que excluir as batalhas que o treinador participa
    db.query("DELETE FROM batalha WHERE id_treinador1 = ? OR id_treinador2 = ?", [id_treinador, id_treinador], (err, resultsDelBat) => {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        // Depois buscar os Pokémons do treinador
        db.query("SELECT id_pokemon FROM treinador_pokemon WHERE id_treinador = ?", [id_treinador], (err, resultsSelTP) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            }

            //A relação treinador_pokemon tem que cair antes do pokémon, pois tem como chaves primárias id_treinador e id_pokemon
            db.query("DELETE FROM treinador_pokemon WHERE id_treinador = ?", [id_treinador], (err, resultsDelTP) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                }
            })

            // Definindo index da primeira exclusão
            let index = 0;

            // Função para excluir os Pokémons de forma sequencial (Função de seta (vale lembrar que por não ser hoisted, ela tem que ser definida 1o))
            const deletePokemon = () => { //Definindo função deletePokemon()
                if (index < resultsSelTP.length) { //Se o index for menor que o tamanho da lista(ou seja, até o valor de {(resultsSelTP.length-1)})
                    const id_pokemon = resultsSelTP[index].id_pokemon; // id_pokemon recebe o id_pokemon do resultado (index+1) do SELECT
                    
                    // Exclui o pokémon do id_pokemon sendo usado
                    db.query("DELETE FROM pokemon WHERE id_pokemon = ?", [id_pokemon], (err, resultsDelTP) => {
                        if (err) {
                            console.log(err);
                            return res.redirect("/");
                        }

                        // Usando recursão para percorrer todos os pokémon
                        index++;
                        deletePokemon(); //Chamando novamente a função
                    });
                } else { //Se o index já for maior que o tamanho da lista

                    // Depois de excluir todos os pokémons, exclui o relacionamento e o treinador
                    

                        db.query("DELETE FROM treinador WHERE id_treinador = ?", [id_treinador], (err, resultsDelTrainer) => {
                            if (err) {
                                console.log(err);
                                return res.redirect("/");
                            }

                            // Se tudo deu certo, redireciona para a lista de treinadores
                            res.redirect("/trainers");
                        });
                }
            };

            // Inicia a exclusão do primeiro Pokémon
            deletePokemon();
        });
    });
});