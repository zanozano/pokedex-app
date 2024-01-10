const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

const env = process.env.NODE_ENV || 'development';
const port = env === 'production' ? process.env.PORT : 3000;

app.use(cors());
app.use(express.static('public'));

const buildPokemonList = require('./fetchPokemons');

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
        const pokemonList = await buildPokemonList();
        res.json(pokemonList);
    } catch (error) {
        console.error('Error fetching Pokémon information:', error);
        res.status(500).json({ error: 'Error fetching Pokémon information' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
