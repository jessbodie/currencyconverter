// Inputs: Two currency codes and an amount to convert from
// Returns, example: 20 USD is worth 26 CAD. You can spend these in the following countries: Canada, etc.
// Endpoint with API key: http://data.fixer.io/api/latest?access_key=a7e96e888358e5236c7e7a3081c1d049
// For countries, use endpoint: https://restcountries.eu/rest/v2/currency/usd

const axios = require('axios');

const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get('http://data.fixer.io/api/latest?access_key=a7e96e888358e5236c7e7a3081c1d049');
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];

        if (isNaN(rate)) {
            throw new Error();
        }

        return rate;
    } catch (err) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`)
    }
};

const getCountries = async (currencyCode) => {
    try {
        const countries = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        const countryNames = countries.data.map( (countries) => countries.name);
        return countryNames;
    } catch(err) {
        throw new Error (`Unable to get the list of countries for ${currencyCode}.`);
    }
};


const convert = async (from, to, amt) => {
    const rate = await getExchangeRate(from, to);
    const convertedAmt = (amt * rate).toFixed(2);
    const countryList = await getCountries(to);
    return `${amt}${from} is worth ${convertedAmt}${to}. You can spend these in the following countries: ${countryList.join(', ')}`;
};


convert('USD', 'CAD', 500).then((msg) => {
    console.log(msg);
}).catch((err) => {
    console.log(err.message);
});


// Promise version, for reference
// const getExchangeRate = (from, to) => {
//     return axios.get('http://data.fixer.io/api/latest?access_key=a7e96e888358e5236c7e7a3081c1d049').then((response) => {
//         const euro = 1 / response.data.rates[from];
//         const rate = euro * response.data.rates[to];
//         return rate;
//     });
// };
