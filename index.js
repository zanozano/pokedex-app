const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');

//PROMESA
let pokemonesPromesas = [];
let pokemones = [];

//GET ALL POKEMONES
async function pokemonesGet() {
	const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=350');
	return data.results;
}

//GET ALL POKEMON'S NAME
async function getFullData(name) {
	const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
	return data;
}

//PROMESA RESULTS
pokemonesGet().then((results) => {
	results.forEach((p) => {
		let pokemonName = p.name;
		pokemonesPromesas.push(getFullData(pokemonName));
	});
	Promise.all(pokemonesPromesas).then((data) => {
		try {
			data.forEach((p, i) => {
				pokemonName = p.name;
				pokemonSprite = p.sprites.front_default;
				pokemones.push({
					name: pokemonName,
					image: pokemonSprite,
				});
			});
		} catch (err) {
			console.log(err);
		}
		//SERVER
		http.createServer((req, res) => {
			console.log('Server ON');
			//JSON POKEMONES
			if (req.url == '/pokemones') {
				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				});
				res.end(JSON.stringify(pokemones));
			}
			//INDEX
			if (req.url == '/') {
				res.writeHead(200, {
					'Content-Type': 'text/html',
				});
				fs.readFile('index.html', 'utf8', (err, html) => {
					res.end(html);
				});
				//AXIOS TEST EN NODE
				async function printPokemones() {
					const { data } = await axios.get('http://localhost:3000/pokemones');
					return data;
				}
				printPokemones().then((results) => {
					console.log(results);
				});
			}
		}).listen(3000, () => console.log('Servidor encendido'));
	});
});
