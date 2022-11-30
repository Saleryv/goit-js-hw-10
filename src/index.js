import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const clearMarkup = ref => (ref.innerHTML = '');

refs.inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const textInput = e.target.value.trim();

  if (!textInput) {
    clearMarkup(refs. countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notiflix.Notify.countryInfo(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs. countryList);
      clearMarkup(refs.countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryInfo(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        ` <img src="${flags.png}" alt="country-flag" width="40px"/>
    <h1 style="display: inline;">${name.official}</h1>
    <p><strong>Capital:</strong> ${capital}</p>
    <p><strong>Population:</strong> ${population}</p>
    <p><strong>Languages:</strong> ${Object.values(languages)}</p> `
    )
    .join('');
}

function countriesList(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li style="margin-bottom: 13px">
        <img src="${flags.png}" alt="country-flag" width="40px"/>
        <p style="display: inline;">${name.official}</p>
     </li> `
    )
    .join('');
}

function renderMarkup(data) {
  if (data.length === 1) {
    clearMarkup(refs.countryList);
    const markupInfo = countryInfo(data);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearMarkup(refs.countryInfo);
    const markupList = countriesList(data);
    refs. countryList.innerHTML = markupList;
  }
}