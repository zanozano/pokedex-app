const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const fetchPokemonInfoPromise = require('./fetchPokemons');

const env = process.env.NODE_ENV || 'development';
const port = env === 'production' ? process.env.PORT : 3000;

//!middleware
app.use(express.static('public'));
//!middleware

app.get('/', async (req, res) => {
    try {
        const html = await fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
        res.status(200).send(html);
    } catch (err) {
        console.error('Error reading index.html:', err);
        res.status(500).send('Error loading index.html');
    }
});

app.get('/pokemon', async (req, res) => {
    try {
        const pokemonList = await fetchPokemonInfoPromise;
        res.json(pokemonList);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Pokémon information' });
    }
});

fetchPokemonInfoPromise.then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch((error) => {
    console.error('Error in main process:', error);
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});
