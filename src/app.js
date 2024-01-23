const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs/promises');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(compression());
app.use(cors());
app.use(express.static('public'));

const buildPokemonList = require('./fetchPokemons');

const pokemonDataFilePath = path.join(__dirname, 'pokemonData.json');

let pokemonList;

async function initializeServer() {
    try {
        const data = await fs.readFile(pokemonDataFilePath, 'utf8');
        pokemonList = JSON.parse(data);
    } catch (err) {
        console.log('Error loading Pokemon data from file.');
        await fetchAndSavePokemonData();
    }
}

async function savePokemonData(data) {
    try {
        await fs.writeFile(pokemonDataFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Pokemon data saved to file.');
    } catch (err) {
        console.error('Error saving Pokemon data to file:', err.message);
    }
}

async function fetchAndSavePokemonData() {
    try {
        const newData = await buildPokemonList();
        pokemonList = newData;
        await savePokemonData(newData);
    } catch (error) {
        console.error('Error fetching and saving Pokémon data:', error.message);
    }
}

initializeServer();

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
    res.json(pokemonList);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
