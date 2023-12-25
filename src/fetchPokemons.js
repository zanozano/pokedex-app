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

            function formatPokemonName(name) {
                const replacedName = name.replace(/[-,]/g, ' ');
                const words = replacedName.split(' ');
                const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                return formattedName;
            }

            data.forEach((pokemon) => {
                const { name, sprites, types } = pokemon;
                const sprite = sprites.other.showdown.front_default;

                if (sprite) {
                    const typesList = types.map(type => type.type.name);
                    list.push({
                        name: formatPokemonName(name),
                        image: sprite,
                        types: typesList,
                    });
                } else {
                    console.log(`La imagen no está disponible para el Pokémon: ${name}`);
                }
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
