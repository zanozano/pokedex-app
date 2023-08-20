document.addEventListener('DOMContentLoaded', () => {
  let div = document.getElementById('pokemon');
  let spinner = document.getElementById('spinner');


  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fetch('http://localhost:3000/pokemones')
    .then((res) => res.json())
    .then((pokemones) => {
      spinner.style.display = 'none';
      pokemones.forEach((pokemon) => {
        div.innerHTML += `
      <div class="section__card">
        <div class="section__block">
          <img class="section__img" src="${pokemon.image}" >
          <p class="section__p">${capitalizeFirstLetter(pokemon.name)}</p>
        </div>
      </div>
    `;
      });
    });
});
