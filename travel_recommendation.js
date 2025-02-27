document.getElementById('search-btn').addEventListener('click', function (event) {
    event.preventDefault();  
    searchResults();
});

document.getElementById('clear-btn').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';  
    document.getElementById('searchResults').innerHTML = ''; 
    document.getElementById('searchResults').style.display = 'none';  // Hide results on clear
});

function searchResults() {
    const searchBarInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchDiv = document.getElementById('searchResults');
    searchDiv.innerHTML = '';  
    searchDiv.style.display = 'none';  // Hide before displaying new results

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            if (searchBarInput === 'country') {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        results.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description
                        });
                    });
                });
            } else if (searchBarInput === 'temple') {
                results = [...data.temples];
            } else if (searchBarInput === 'beach') {
                results = [...data.beaches];
            }

            if (results.length > 0) {
                displayResults(results);
                searchDiv.style.display = 'block'; // Show results only when available
            } else {
                searchDiv.innerHTML = '<p>No results found. Try another keyword such as "country", "beach" or "temple".</p>';
                searchDiv.style.display = 'block'; 
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            searchDiv.innerHTML = '<p>Failed to fetch data. Please try again later.</p>';
            searchDiv.style.display = 'block'; 
        });
}

function displayResults(results) {
    const searchDiv = document.getElementById('searchResults');
    searchDiv.innerHTML = '';

    const selectedResults = results.length > 2 ? getRandomSelection(results, 2) : results;

    selectedResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        resultItem.innerHTML = `
            <img src="${result.imageUrl}" alt="${result.name}">
            <div class="result-text">
                <h3>${result.name}</h3>
            </div>
            <div class="result-text">
                <p>${result.description}</p>
            </div>
        `;

        searchDiv.appendChild(resultItem);
    });

    searchDiv.style.display = 'block';  // Show results once they are added
}

function getRandomSelection(array, count) {
    return array.sort(() => 0.5 - Math.random()).slice(0, count);
}
