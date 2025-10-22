document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('news-container');
    const countrySelect = document.getElementById('country-select');
    const searchInput = document.getElementById('search-input');
    const fetchBtn = document.getElementById('fetch-btn');
    
    // NewsData.io API key - Your provided key
    const apiKey = 'pub_564f854645fd4182b0e7b30a7e8af49b';
    const apiUrl = 'https://newsdata.io/api/1/latest';
    
    // Comprehensive country list with ISO codes (subset for brevity; full list available via ISO standards)
    const countries = [
        { code: 'us', name: 'United States' }, { code: 'gb', name: 'United Kingdom' }, { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' }, { code: 'in', name: 'India' }, { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' }, { code: 'it', name: 'Italy' }, { code: 'es', name: 'Spain' },
        { code: 'br', name: 'Brazil' }, { code: 'mx', name: 'Mexico' }, { code: 'jp', name: 'Japan' },
        { code: 'cn', name: 'China' }, { code: 'kr', name: 'South Korea' }, { code: 'ru', name: 'Russia' },
        { code: 'za', name: 'South Africa' }, { code: 'eg', name: 'Egypt' }, { code: 'ng', name: 'Nigeria' },
        { code: 'ke', name: 'Kenya' }, { code: 'pk', name: 'Pakistan' }, { code: 'bd', name: 'Bangladesh' },
        { code: 'id', name: 'Indonesia' }, { code: 'my', name: 'Malaysia' }, { code: 'ph', name: 'Philippines' },
        { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' }, { code: 'tr', name: 'Turkey' },
        { code: 'sa', name: 'Saudi Arabia' }, { code: 'ae', name: 'United Arab Emirates' }, { code: 'il', name: 'Israel' },
        { code: 'ar', name: 'Argentina' }, { code: 'cl', name: 'Chile' }, { code: 'co', name: 'Colombia' },
        { code: 'pe', name: 'Peru' }, { code: 've', name: 'Venezuela' }, { code: 'ua', name: 'Ukraine' },
        { code: 'pl', name: 'Poland' }, { code: 'se', name: 'Sweden' }, { code: 'no', name: 'Norway' },
        { code: 'dk', name: 'Denmark' }, { code: 'fi', name: 'Finland' }, { code: 'nl', name: 'Netherlands' },
        { code: 'be', name: 'Belgium' }, { code: 'ch', name: 'Switzerland' }, { code: 'at', name: 'Austria' },
        { code: 'pt', name: 'Portugal' }, { code: 'gr', name: 'Greece' }, { code: 'cz', name: 'Czech Republic' },
        { code: 'hu', name: 'Hungary' }, { code: 'ro', name: 'Romania' }, { code: 'bg', name: 'Bulgaria' },
        { code: 'hr', name: 'Croatia' }, { code: 'si', name: 'Slovenia' }, { code: 'sk', name: 'Slovakia' },
        { code: 'lt', name: 'Lithuania' }, { code: 'lv', name: 'Latvia' }, { code: 'ee', name: 'Estonia' },
        { code: 'ie', name: 'Ireland' }, { code: 'nz', name: 'New Zealand' }, { code: 'sg', name: 'Singapore' },
        { code: 'hk', name: 'Hong Kong' }, { code: 'tw', name: 'Taiwan' }, { code: 'ir', name: 'Iran' },
        { code: 'iq', name: 'Iraq' }, { code: 'sy', name: 'Syria' }, { code: 'lb', name: 'Lebanon' },
        { code: 'jo', name: 'Jordan' }, { code: 'kw', name: 'Kuwait' }, { code: 'om', name: 'Oman' },
        { code: 'qa', name: 'Qatar' }, { code: 'bh', name: 'Bahrain' }, { code: 'ye', name: 'Yemen' },
        { code: 'af', name: 'Afghanistan' }, { code: 'np', name: 'Nepal' }, { code: 'bt', name: 'Bhutan' },
        { code: 'lk', name: 'Sri Lanka' }, { code: 'mv', name: 'Maldives' }, { code: 'mm', name: 'Myanmar' },
        { code: 'la', name: 'Laos' }, { code: 'kh', name: 'Cambodia' }, { code: 'bn', name: 'Brunei' },
        { code: 'tl', name: 'Timor-Leste' }, { code: 'fm', name: 'Micronesia' }, { code: 'pw', name: 'Palau' },
        { code: 'pg', name: 'Papua New Guinea' }, { code: 'sb', name: 'Solomon Islands' }, { code: 'vu', name: 'Vanuatu' },
        { code: 'nr', name: 'Nauru' }, { code: 'tv', name: 'Tuvalu' }, { code: 'ki', name: 'Kiribati' },
        { code: 'fj', name: 'Fiji' }, { code: 'to', name: 'Tonga' }, { code: 'ws', name: 'Samoa' },
        { code: 'nu', name: 'Niue' }, { code: 'ck', name: 'Cook Islands' }, { code: 'tk', name: 'Tokelau' },
        { code: 'pf', name: 'French Polynesia' }, { code: 'nc', name: 'New Caledonia' }, { code: 'wf', name: 'Wallis and Futuna' },
        { code: 'as', name: 'American Samoa' }, { code: 'gu', name: 'Guam' }, { code: 'mp', name: 'Northern Mariana Islands' },
        { code: 'pr', name: 'Puerto Rico' }, { code: 'vi', name: 'U.S. Virgin Islands' }, { code: 'um', name: 'U.S. Minor Outlying Islands' },
        // Add more as needed; full ISO list has 249 entries
    ];

    // Populate country dropdown
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });

    function fetchNews() {
        const country = countrySelect.value;
        const query = searchInput.value.trim();
        
        if (!country && !query) {
            container.innerHTML = '<p class="error">Please select a country or enter a search term.</p>';
            return;
        }

        let url = `${apiUrl}?apikey=${apiKey}&pageSize=10`;
        
        if (country) {
            url += `&country=${country}`;
        }
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        container.innerHTML = '<p class="loading">Loading latest news...</p>';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const articles = data.results || [];
                container.innerHTML = '';

                if (articles.length === 0) {
                    container.innerHTML = '<p class="error">No news found. Try different keywords or country.</p>';
                    return;
                }

                articles.forEach(article => {
                    if (!article.title || !article.link) return;

                    const description = article.description || article.content || 'No description available.';
                    const sourceName = article.source_id || article.creator || 'Unknown';
                    const pubDate = article.pubDate || article.date;

                    const item = document.createElement('div');
                    item.className = 'news-item';
                    item.innerHTML = `
                        <h2>${article.title}</h2>
                        <p>${description.substring(0, 200)}...</p>
                        <a href="${article.link}" target="_blank">Read more</a>
                        <div class="source">Source: ${sourceName} | ${new Date(pubDate).toLocaleString()}</div>
                    `;
                    container.appendChild(item);
                });
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                container.innerHTML = `<p class="error">Failed to load news: ${error.message}. Check API key or connection. Free tier: 200 credits/day.</p>`;
            });
    }

    fetchBtn.addEventListener('click', fetchNews);
    countrySelect.addEventListener('change', fetchNews);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchNews();
    });

    // Initial load (optional: fetch global news)
    // fetchNews();
});
