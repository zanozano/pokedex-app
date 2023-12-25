document.addEventListener('DOMContentLoaded', () => {
  let div = document.getElementById('pokemon');
  let spinner = document.getElementById('spinner');
  let InputFilter = document.getElementById('filter');
  let paginationContainer = document.getElementById('pagination');
  let currentPage = 1;
  let pokemonsPerPage = 100;
  let filteredPokemons = [];

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function pokemonFilter(pokemons, filtro) {
    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  function createTypeChips(types) {
    if (Array.isArray(types)) {
      return types.map(type => `<div class="chip ${type.toLowerCase()}">${capitalizeFirstLetter(type)}</div>`).join('');
    }

    if (typeof types === 'string') {
      const typeArray = types.split(', ');
      return typeArray.map(type => `<div class="chip ${type.toLowerCase()}">${capitalizeFirstLetter(type)}</div>`).join('');
    }
    return '';
  }


  function showPokemonList(pokemons, page) {
    spinner.style.display = 'none';
    div.innerHTML = '';

    const startIndex = (page - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const pokemonsToShow = pokemons.slice(startIndex, endIndex);

    function handleClick(pokemon) {
      console.log(pokemon)
      displaySelectedPokemonInfo(pokemon);
    }

    pokemonsToShow.forEach((pokemon, index) => {
      const pokemonCard = document.createElement('div');
      pokemonCard.classList.add('section__card');
      pokemonCard.dataset.toggle = 'modal';
      pokemonCard.dataset.target = '#modalSelected';
      pokemonCard.addEventListener('click', () => handleClick(pokemon));

      pokemonCard.innerHTML = `
        <div class="section__block">
          <img class="section__img" src="${pokemon.image}" >
          <p class="section__p">${capitalizeFirstLetter(pokemon.name)}</p>
          <div class="section__type-container">
            ${createTypeChips(pokemon.types)}
          </div>
        </div>
      `;

      div.appendChild(pokemonCard);
    });

    generatePagination(Math.ceil(pokemons.length / pokemonsPerPage), currentPage);
  }

  function generatePagination(totalPages, currentPage) {
    paginationContainer.innerHTML = '';

    const previousPageLink = document.createElement('li');
    previousPageLink.classList.add('page-item');
    previousPageLink.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    `;
    previousPageLink.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        showPokemonList(filteredPokemons, currentPage);
        generatePagination(totalPages, currentPage);
      }
    });

    paginationContainer.appendChild(previousPageLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('li');
      pageLink.classList.add('page-item');
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageLink.addEventListener('click', () => {
        currentPage = i;
        showPokemonList(filteredPokemons, currentPage);
        generatePagination(totalPages, currentPage);
      });
      paginationContainer.appendChild(pageLink);
    }

    const nextPageLink = document.createElement('li');
    nextPageLink.classList.add('page-item');
    nextPageLink.innerHTML = `
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    `;
    nextPageLink.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        showPokemonList(filteredPokemons, currentPage);
        generatePagination(totalPages, currentPage);
      }
    });

    paginationContainer.appendChild(nextPageLink);
  }

  fetch('http://localhost:3000/pokemon')
    .then((res) => res.json())
    .then((pokemons) => {
      filteredPokemons = pokemons;
      showPokemonList(pokemons, currentPage);

      InputFilter.addEventListener('input', () => {
        const filter = InputFilter.value;
        const filteredPokemons = pokemonFilter(pokemons, filter);
        showPokemonList(filteredPokemons, 1);
        currentPage = 1;
      });
    });

  function displaySelectedPokemonInfo(pokemon) {

    function decimetersToCentimeters(decimeters) {
      const centimeters = decimeters * 10;
      return parseFloat(centimeters.toFixed(2));
    }

    function hectogramsToKilograms(hectograms) {
      const kilograms = hectograms * 0.1;
      return parseFloat(kilograms.toFixed(2));
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
    <h4 class="modal-body__title">#${pokemon.number} ${capitalizeFirstLetter(pokemon.name)}</h4>
    <img class="modal-body__img" src="${pokemon.image}" alt="${pokemon.name} image">
    <div class="modal-body__info">
      <h5>${decimetersToCentimeters(pokemon.height)} cm</h5>
      <h5>${hectogramsToKilograms(pokemon.weight)} Kg</h5>
    </div>
    <div class="section__type-container">${createTypeChips(pokemon.types)}</div>
  `;
  }

});
