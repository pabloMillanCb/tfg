var express = require('express');
var bodyParser = require('body-parser')
const auth = require('./verifytoken');

// To access package body content
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();
const PORT = process.env.PORT || 5000

const cors = require('cors')
app.use(cors())
app.use(auth.decodeToken)

app.get('/', (req, res) => {
res.send('This is my demo project')
})

app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`); 
});

const { get_escenas, post_escena, update_escena, delete_escena } = require('./handlers/escenas')
app.get('/get/escenas', get_escenas);
app.get('/get/escenas/:idusr', get_escenas);
app.post('/post/escenas', jsonParser, post_escena);
app.put('/update/escenas/:id', jsonParser, update_escena)
app.delete('/delete/escenas/:id', delete_escena)

const { get_usuario, post_usuario, update_usuario, delete_usuario } = require('./handlers/usuarios')
app.get('/get/usuarios/:idusr', get_usuario);
app.post('/post/usuarios', jsonParser, post_usuario)
app.put('/update/usuarios/:idusr', jsonParser, update_usuario)
app.delete('/delete/usuarios/:idusr', delete_usuario)