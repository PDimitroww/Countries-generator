'use strict';

const btn = document.querySelector('.btn-country');
const btnClear = document.querySelector('.btn-clear');
const countriesContainer = document.querySelector('.countries');
const search = document.querySelector('#searchForm');
const nav = document.querySelector('.header');
const footer = document.querySelector('footer');

// Rendering country data

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

////////////////////////////////////////////////////////////////

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const html = `
//   <article class="country">
//    <img class="country__img" src="${data.flag}" />
//    <div class="country__data">
//      <h3 class="country__name">${data.name}</h3>
//      <h4 class="country__region">${data.region}</h4>
//      <p class="country__row"><span>👫</span>${(
//        +data.population / 1000000
//      ).toFixed(1)}</p>
//      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//    </div>
// </article>
// `;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// AJAX calls

// getCountryData('China');
// getCountryData('Taiwan');
// getCountryData('Mexico');

//////////////////////////////////////////////////////////////////

//Adding functionality to the search input

search.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchTerm = search.elements.query.value;
  const res = await axios.get(
    `https://restcountries.com/v2/name/${searchTerm}`
  );

  const html1 = `
  <article class="country">
   <img class="country__img" src="${res.data[0].flag}" />
   <div class="country__data">
     <h3 class="country__name">${res.data[0].name}</h3>
     <h4 class="country__region">${res.data[0].region}</h4>
     <p class="country__row"><span>👫</span>${(
       +res.data[0].population / 1000000
     ).toFixed(1)}</p>
     <p class="country__row"><span>🗣️</span>${res.data[0].languages[0].name}</p>
     <p class="country__row"><span>💰</span>${
       res.data[0].currencies[0].name
     }</p>
   </div>
</article>
`;

  countriesContainer.insertAdjacentHTML('beforeend', html1);
  countriesContainer.style.opacity = 1;

  search.elements.query.value = '';
});

//Making the nav sticky

function fixedNav() {
  if (window.pageYOffset >= 150) {
    nav.classList.add('fixed');
  } else {
    nav.classList.remove('fixed');
  }
}

window.addEventListener('scroll', fixedNav);

//////////////////////////////////////////////////////////////////
// const getCountryAndNeighbour = function (country) {
//   //Ajax call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     // console.log(data);

//     //render country 1
//     renderCountry(data);

//     //Get neighbour country 2
//     const [neighbour] = data.borders;

//     if (!neighbour) return;

//     //AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText);
//       // console.log(data2);

//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// AJAX calls

// getCountryAndNeighbour('portugal');
// getCountryAndNeighbour('Bulgaria');

//Getting current location

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

//API call to get your position
const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then(data => {
      // console.log(data);
      // console.log(`You are in ${data.city},${data.countryName}`);

      return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => {
      console.error(`${err.message} ***`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

//Buttons eventhandlers

//Btn to Show you current position
btn.addEventListener('click', whereAmI);

//Btn to remove the result 1 by 1
btnClear.addEventListener('click', function () {
  const div = document.querySelectorAll('.country');
  const lastEl = div[div.length - 1];
  lastEl.remove();
});
