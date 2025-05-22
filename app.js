const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.query('SELECT * FROM videojuegos', (err, resultados) => {
    if (err) throw err;
    res.render('index', { videojuegos: resultados });
  });
});

app.post('/agregar', (req, res) => {
  const { titulo, plataforma, genero, lanzamiento } = req.body;
  db.query('INSERT INTO videojuegos SET ?', {
    titulo, plataforma, genero, lanzamiento
  }, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM videojuegos WHERE id = ?', [id], (err, resultados) => {
    if (err) throw err;
    res.render('editar', { videojuego: resultados[0] });
  });
});

app.post('/actualizar/:id', (req, res) => {
  const id = req.params.id;
  const { titulo, plataforma, genero, lanzamiento } = req.body;
  db.query('UPDATE videojuegos SET ? WHERE id = ?', [{
    titulo, plataforma, genero, lanzamiento
  }, id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM videojuegos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

