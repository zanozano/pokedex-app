// fetchPokemons.js

const axios = require('axios');

async function getAllPokemon(offset, limit) {
    try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        return data.results;
    } catch (error) {
        console.error('Error in getAllPokemon:', error.message);
        throw error;
    }
}

async function getPokemon(name) {
    try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return data;
    } catch (error) {
        console.error(`Error in getPokemon for ${name}:`, error.message);
        throw error;
    }
}

async function buildPokemonList() {
    try {
        const totalPokemons = 150; // Actualizar según la cantidad de Pokémon que desees
        const pokemonsPerRequest = 100;
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
                try {
                    const { name, sprites, types, weight, height, stats, id } = pokemon;
                    const sprite = sprites.other?.showdown?.front_default;

                    if (sprite) {
                        const typesList = types.map(type => type.type.name);
                        list.push({
                            name: formatPokemonName(name),
                            image: sprite,
                            types: typesList,
                            weight,
                            height,
                            stats,
                            number: id
                        });
                    } else {
                        console.log(`La imagen no está disponible para el Pokémon: ${name}`);
                    }
                } catch (error) {
                    console.error('Error processing Pokemon:', pokemon);
                    console.error('Original Error:', error);
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

// Exportando directamente la función de construcción de la lista
module.exports = buildPokemonList;
