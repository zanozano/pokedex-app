document.addEventListener('DOMContentLoaded', () => {
  let div = document.getElementById('pokemon');
  let spinner = document.getElementById('spinner');
  let InputFilter = document.getElementById('filter');
  let paginationContainer = document.getElementById('pagination');
  let currentPage = 1;
  let pokemonsPerPage = 100;
  let filteredPokemons = [];

  let pokemonCollection = [];

  function renderPokemon() {
    const pokemonTeamContainer = document.getElementById('pokemon-team');
    pokemonTeamContainer.innerHTML = '';

    pokemonCollection.forEach((pokemon) => {
      const pokemonCard = document.createElement('div');
      pokemonCard.id = `pokemon-${pokemon.id}`;
      pokemonCard.classList.add('pokemon-card');
      pokemonCard.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name} image">
            <p>${pokemon.name}</p>
            <button class="remove-pokemon-btn btn btn-danger" data-pokemon-id="${pokemon.id}">Remove</button>
        `;
      pokemonTeamContainer.appendChild(pokemonCard);

      const removeButton = pokemonCard.querySelector('.remove-pokemon-btn');
      removeButton.addEventListener('click', () => removePokemonFromCollection(pokemon.id));
    });
  }

  function removePokemonFromCollection(pokemonId) {
    pokemonCollection = pokemonCollection.filter(p => p.id !== pokemonId);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Your Pokémon has been deleted from your team`,
      showConfirmButton: false,
      timer: 1500
    });
    renderPokemonList(pokemonCollection);
  }


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
        <img class="section__img--bg" src="../images/pokeball.png" alt="background pokeball" >
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

    const maxVisiblePages = 4;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    const createPageLink = (pageNumber) => {
      const pageLink = document.createElement('li');
      pageLink.classList.add('page-item');
      if (pageNumber === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.innerHTML = `<a class="page-link" href="#">${pageNumber}</a>`;
      pageLink.addEventListener('click', () => {
        currentPage = pageNumber;
        showPokemonList(filteredPokemons, currentPage);
        generatePagination(totalPages, currentPage);
      });
      return pageLink;
    };

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

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createPageLink(i));
      }
    } else {
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }

      if (startPage > 1) {
        paginationContainer.appendChild(createPageLink(1));
        if (startPage > 2) {
          const ellipsis = document.createElement('li');
          ellipsis.classList.add('page-item');
          ellipsis.innerHTML = `<span class="page-link">...</span>`;
          paginationContainer.appendChild(ellipsis);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageLink(i));
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('li');
          ellipsis.classList.add('page-item');
          ellipsis.innerHTML = `<span class="page-link">...</span>`;
          paginationContainer.appendChild(ellipsis);
        }
        paginationContainer.appendChild(createPageLink(totalPages));
      }
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


  fetch('/pokemon')
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


  function addPokemonToCollection(pokemon) {
    if (typeof pokemon !== 'undefined' && pokemon !== null) {
      if (pokemonCollection.length < 6) {
        const uniqueId = generateUniqueId();
        pokemonCollection.push({
          id: uniqueId,
          ...pokemon,
        });
        renderPokemon(pokemonCollection);
        $('#modalSelected').modal('hide');
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Your ${pokemon.name} has been added to your team`,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: `You have reached the maximum number of Pokémon in your team`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      console.error('Error: Pokemon object is not defined or null.');
    }
  }

  function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }



  function renderPokemonList(pokemonCollection) {
    const pokemonTeamContainer = document.getElementById('pokemon-team');
    pokemonTeamContainer.innerHTML = '';
    pokemonCollection.forEach(pokemon => renderPokemon(pokemon));
  }

  function displaySelectedPokemonInfo(pokemon) {

    function decimetersToCentimeters(decimeters) {
      const centimeters = decimeters * 10;
      return parseFloat(centimeters.toFixed(2));
    }

    function hectogramsToKilograms(hectograms) {
      const kilograms = hectograms * 0.1;
      return parseFloat(kilograms.toFixed(2));
    }

    function formatPokemonName(name) {
      const replacedName = name.replace(/[-,]/g, ' ');
      const words = replacedName.split(' ');
      const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return formattedName;
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
    <h4 class="modal-body__title">#${pokemon.number} ${capitalizeFirstLetter(pokemon.name)}</h4>
    <img class="modal-body__img" src="${pokemon.image}" alt="${pokemon.name} image">
    <div class="modal-body__info">
      <h5>${decimetersToCentimeters(pokemon.height)} cm</h5>
      /
      <h5>${hectogramsToKilograms(pokemon.weight)} Kg</h5>
    </div>
    <div class="section__type-container">${createTypeChips(pokemon.types)}</div>
      <table class="table table-bordered m-0">
        <thead class="thead-dark">
          <tr>
            <th colspan="2" class="table-active text-center">Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formatPokemonName(pokemon.stats[0].stat.name)}</td>
            <td>${pokemon.stats[0].base_stat}</td>
          </tr>
          <tr>
            <td>${formatPokemonName(pokemon.stats[1].stat.name)}</td>
            <td>${pokemon.stats[1].base_stat}</td>
          </tr>
          <tr>
            <td>${formatPokemonName(pokemon.stats[2].stat.name)}</td>
            <td>${pokemon.stats[2].base_stat}</td>
          </tr>
          <tr>
            <td>${formatPokemonName(pokemon.stats[3].stat.name)}</td>
            <td>${pokemon.stats[3].base_stat}</td>
          </tr>
          <tr>
            <td>${formatPokemonName(pokemon.stats[4].stat.name)}</td>
            <td>${pokemon.stats[4].base_stat}</td>
          </tr>
          <tr>
            <td>${formatPokemonName(pokemon.stats[5].stat.name)}</td>
            <td>${pokemon.stats[5].base_stat}</td>
          </tr>
        </tbody>
      </table>
      <div class="add-button">
        <img class="add-button__img-catch-button" src="../images/pokeball.png" alt="background pokeball catch" >
        <button id="addPokemonButton" class="btn btn-primary add-button__p">Add Pokemon</button>
      </div>
  `;

    const addPokemonButton = document.getElementById('addPokemonButton');
    addPokemonButton.addEventListener('click', () => addPokemonToCollection(pokemon));
  }


});
