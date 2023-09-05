async function getSearchedPokemon() {
    // prevents new loading pokemons on scroll
    isAlreadyLoading = true
    let results = [];
    // toLowerCase important because mobile phones start with uppercase letter and so function doesn't work
    let search_query = document.getElementById('searchQuery').value.toLowerCase();
    let newUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1000'
    let data = await fetchApiReturnAsJson(newUrl);

    // isNaN = is not a Number (proof if it is text)
    if (isNaN(search_query)) {
        // if it is a text, proof if the value more than 3 letters long
        if (search_query.length < 3) {
            return;
        }
        searchByName(data, results, search_query)
    } else {
        searchByNumber(data, results, search_query)
    }

    document.getElementById('content').innerHTML = /*html*/ `<div id="pokedex" class="dialog-bg d-none"></div>`
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let url = 'https://pokeapi.co/api/v2/pokemon/' + result
        let pokemon = await fetchApiReturnAsJson(url);
        renderSearchedPokemon(pokemon);
    }
}

function searchByNumber(data, results, search_query) {
    for (let i = 0; i < data.results.length; i++) {
        let urls = data.results[i].url
        // split url in segments at the slash (/)
        let segments = urls.split('/')
        // 6. segment is individual pokemon id: e.g 1: (/v2/pokemon/1)
        let pokemonID = segments[6]
        console.log(pokemonID)
        if (pokemonID === search_query) {
            results.push(pokemonID)
           break //stops loop 
        }
    }
}


function searchByName(data, results, search_query) {
    for (let i = 0; i < data.results.length; i++) {
        let names = data.results[i].name
        let inputMatches = names.match(search_query)
        console.log(inputMatches)
        if (inputMatches) {
            results.push(inputMatches['input'])
        }
    }
}


function renderSearchedPokemon(pokemon) {
    document.getElementById('content').innerHTML += createPreviewCardHTML(pokemon);
}


function fixNumber(nr) {
    let fix = nr.toFixed(2);
    return fix;
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (const element of includeElements) {
        const file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}