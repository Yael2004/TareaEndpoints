const express = require('express');
const app = express();
const crypto = require('crypto');

app.use(express.json());

app.get('/info', (req, res) => {
    const info = {mensaje: "Información de la aplicación"};
    const accept = req.accepts(['json', 'xml', 'html']);

    if (accept === 'json') {
        res.json(info);
    } else if (accept === 'xml') {
        res.type('application/xml');
        res.send(`<mensaje>${info.mensaje}</mensaje>`);
    } else if (accept === 'html') {
        res.send(`<h1>${info.mensaje}</h1>`);
    } else {
        res.status(406).send("Not Acceptable");
    }
})

app.get('/preferencia', (req, res) => {
    const preferencia = {mensaje: "Preferencias de la aplicación"};
    const accept = req.accepts(['json', 'xml', 'html']);

    if (accept === 'json') {
        res.json(preferencia);
    } else if (accept === 'xml') {
        res.type('application/xml');
        res.send(`<mensaje>${preferencia.mensaje}</mensaje>`)
    } else if (accept === 'html') {
        res.send(`<h1>${preferencia.mensaje}</h1>`)
    } else {
        res.status(406).send("Not Acceptable");
    }
});

app.get('/cache', (req, res) => {
    res.set({
        'Cache-Control': 'public, max-age=30',
        'Expires': new Date(Date.now()+60000).toUTCString(),
        'Pragma': 'no-cache'
    })
    res.json({mensaje: "Esta respuesta se puede cachear por 30 segundos"});
})

app.get('/etag', (req, res) => {
    const content = {mensaje: "Contenido Etag Modificado"}
    const jsonString = JSON.stringify(content);
    const etag = crypto.createHash('md5').update(jsonString).digest('hex');

    if (req.headers['if-none-match'] == etag) {
        return res.status(304).end();
    }

    res.set('Etag', etag);
    res.json(content);
});

app.listen(3000, () => {
    console.log("Servidor escuchando en puerto 3000");
})