const axios = require('axios');

let pokemonList = [];

async function getAllPokemon() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=200');
    return data.results;
}

async function getPokemon(name) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return data;
}

async function buildPokemonList() {
    try {
        const results = await getAllPokemon();
        const promises = results.map(async (pokemon) => {
            const { name } = pokemon;
            return await getPokemon(name);
        });
        const data = await Promise.all(promises);

        data.forEach((pokemon) => {
            const { name, sprites } = pokemon;
            const sprite = sprites.front_default;
            pokemonList.push({
                name,
                image: sprite,
            });
        });
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Original Error:', err);
        throw err;
    }
}

(async () => {
    try {
        await buildPokemonList();
    } catch (error) {
        console.error('Error en el proceso principal:', error);
    }
})();


module.exports = {
    pokemonList,
};
