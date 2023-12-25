const axios = require('axios');

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

        const list = [];

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
                list.push({
                    name,
                    image: sprite,
                    types: typesList,
                });
            });
        }

        return list;
    } catch (err) {
        console.error('Error building Pokemon list:', err.message);
        console.error('Original Error:', err);
        throw err;
    }
}

module.exports = new Promise(async (resolve, reject) => {
    try {
        const result = await buildPokemonList();
        resolve(result);
    } catch (error) {
        reject(error);
    }
});
