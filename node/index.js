const express = require('express');
const app = express();
 const port = 8080;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);
function runQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

async function initialize() {
  const sqlCreate = `CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY (id));`;
  const sqlInsert = `INSERT INTO people (name) VALUES ('Jonathan');`;

  try {
    await runQuery(sqlCreate);
    await runQuery(sqlInsert);
    console.log('Tabela criada e registro inserido com sucesso!');
  } catch (err) {
    console.error('Ocorreu um erro:', err);
  }
}
async function startServer() {
  const sqlGet = `SELECT name FROM people;`;

  try {
    const result = await runQuery(sqlGet);
    const htmlTable = result.map(result => `<tr><td>${result.name}</td></tr>`).join('');
    console.log(result);

    app.get('/', (req, res) => {
      res.send(`
      <table>
          <thead>
              <tr>
                  <th>Full Cycle Rocks!!</th>
              </tr>
          </thead>
          <tbody>${htmlTable}</tbody>
      </table>`);
    });

     app.listen(port, () => {
        console.log('Rodando na porta ' + port);
     });

    connection.end();
  } catch (err) {
    console.error('Ocorreu um erro:', err);
  }
}
initialize()
  .then(startServer)
  .catch((err) => console.error('Erro na inicialização:', err));