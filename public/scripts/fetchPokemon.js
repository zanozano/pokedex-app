const axios = require('axios');

let pokemonList = [];

async function getAllPokemon(offset, limit) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    return data.results;
}

async function getPokemon(name) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return data;
}

async function buildPokemonList() {
    try {
        const totalPokemons = 1300;
        const pokemonsPerRequest = 200;
        const requestsNeeded = Math.ceil(totalPokemons / pokemonsPerRequest);

        for (let i = 0; i < requestsNeeded; i++) {
            const offset = i * pokemonsPerRequest;
            const results = await getAllPokemon(offset, pokemonsPerRequest);

            const promises = results.map(async (pokemon) => {
                const { name } = pokemon;
                return await getPokemon(name);
            });

            const data = await Promise.all(promises);

            data.forEach((pokemon) => {
                const { name, sprites, types } = pokemon;
                const sprite = sprites.other['official-artwork'].front_default;
                const typesList = types.map(type => type.type.name);
                pokemonList.push({
                    name,
                    image: sprite,
                    types: typesList,
                });
            });

        }
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Original Error:', err);
        throw err;
    }
}

(async () => {
    try {
        await buildPokemonList();
        console.log('Pokemon list built successfully');
    } catch (error) {
        console.error('Error en el proceso principal:', error);
    }
})();

module.exports = {
    pokemonList,
};
