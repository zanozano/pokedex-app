const express = require('express');
const fs = require('fs/promises');
const { exec } = require('child_process');
const { pokemonList } = require('./public/scripts/fetchPokemon');

const PORT = 3000;
const app = express();

app.use(express.static('public'));

app.get('/pokemon', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(pokemonList);
});

app.get('/', async (req, res) => {
    try {
        const html = await fs.readFile('./public/index.html', 'utf8');
        res.status(200).send(html);
    } catch (err) {
        res.status(500).send('Error loading index.html');
    }
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

const server = app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    try {
        exec(`start http://localhost:${PORT}`);
    } catch (err) {
        console.error('Error opening browser:', err);
    }
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
