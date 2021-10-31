import axios from 'axios';

// sla de referentie naar het formulier op en plaats er een submit-event listener op
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', searchCountry);

// sla de referentie op naar het error-element en het zoek-resultaat-element
const countryInfoBox = document.getElementById('search-result');
const errorMessageBox = document.getElementById('error-message');

function searchCountry(e) {
  // zorg ervoor dat de pagina niet ververst
  e.preventDefault();
  // sla de referentie naar het invoerveld op
  const queryfield = document.getElementById('query-field');
  // roep de fetchCountryDetails functie aan en geef de zoekterm mee
  fetchCountryDetails(queryfield.value);
  // maak het invoerveld weer leeg!
  queryfield.value = '';
}

async function fetchCountryDetails(name) {
  // zorg ervoor dat er iedere keer als er een nieuwe zoekopdracht gedaan wordt, het (mogelijke) oude resultaat
  // en (mogelijke) oude error-message worden verwijderd
  const previousSearchResult = document.getElementById('search-result-identifier');
  const previousErrorMessage = document.getElementById('error-message-identifier');

  if (previousErrorMessage) {
    errorMessageBox.removeChild(previousErrorMessage);
  }

  if(previousSearchResult) {
    countryInfoBox.removeChild(previousSearchResult);
  }

  try {
    // probeer de gegevens over dit land op te halen
    const result = await axios.get(`https://restcountries.com/v2/name/${name}`);
    const country = result.data[0];
    console.log(country);

    // maak een country-container en geef hem de id country (zo kunnen we 'm tijdens de volgende zoekopdracht ook weer verwijderen)
    const countryContainer = document.createElement('article');
    countryContainer.setAttribute('class', 'search-result-box');
    countryContainer.setAttribute('id', 'search-result-identifier');

    // maak de <span> tag om de titel en vlag in te stoppen
    const flagTitleContainer = document.createElement('span');
    flagTitleContainer.setAttribute('class', 'flag-title-container');

    // maak de <img> tag om de vlag in weer te geven
    const flag = document.createElement('img');
    // stop de image url in het src attribuut van img
    flag.setAttribute('src', country.flag);
    flag.setAttribute('class', 'flag');
    flagTitleContainer.appendChild(flag);

    // // maak <h1> element voor de titel
    const countryName = document.createElement('h2');
    countryName.textContent = country.name;
    flagTitleContainer.appendChild(countryName);

    countryContainer.appendChild(flagTitleContainer);

    // maak een <p> voor de informatie
    const population = document.createElement('p');
    population.textContent = `${country.name} is situated in ${country.subregion}. It has a population of ${country.population} people.`;
    countryContainer.appendChild(population);

    // // maak een <p> voor nog meer informatie
    const capital = document.createElement('p');
    capital.textContent = `The capital is ${country.capital} and you can pay with ${createCurrencyDescription(country.currencies)}`;
    countryContainer.appendChild(capital);

    // voeg de country <div> toe aan de countryContainer
    countryInfoBox.appendChild(countryContainer);
  } catch (e) {
    console.error(e);
    // is er iets misgegaan? Vul dan de error-message box met de volgende elementen:
    const errorMessage = document.createElement('p');
    errorMessage.setAttribute('class', 'error-message');
    errorMessage.setAttribute('id', 'error-message-identifier');
    errorMessage.textContent = `${name} bestaat niet. Probeer het nogmaals.`;

    errorMessageBox.appendChild(errorMessage);
  }
}

// deze functie kan iedere keer opnieuw aangeroepen worden om een valuta-string te genereren
function createCurrencyDescription(currencies) {
  let output = 'and you can pay with ';

  if (currencies.length === 2) {
    return output + `${currencies[0].name} and ${currencies[1].name}'s`;
  }

  return output + `${currencies[0].name}'s`;
}