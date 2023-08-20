const http = require('http');
const fs = require('fs');
const axios = require('axios');
const { pokemonList } = require('./public/assets/js/fetchPokemon');

const PORT = 3000;

http.createServer((req, res) => {
	console.log(`Server ON ${PORT}`);

	if (req.url == '/pokemones') {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		});
		res.end(JSON.stringify(pokemonList));
	}
	if (req.url == '/') {
		res.writeHead(200, {
			'Content-Type': 'text/html',
		});
		fs.readFile('./public/index.html', 'utf8', (err, html) => {
			if (err) {
				res.end('Error loading index.html');
			} else {
				res.end(html);
				printPokemones().then((results) => {
					console.log('pokemon from server', results);
				});
			}
		});
	}
}).listen(3000, () => console.log(`Server listen on ${PORT}`));

async function printPokemones() {
	try {
		const { data } = await axios.get('http://localhost:3000/pokemones');
		return data;
	} catch (error) {
		console.error('Error en la llamada a /pokemones:', error.message);
		throw error;
	}
}
