// Fallback: If DOMContentLoaded doesn't work, execute immediately after script load
(function() {
    'use strict';
    
    // Wait for DOM to be ready (double-check method)
    function init() {
        console.log('Initializing news app...');
        
        // Get elements with error handling
        const container = document.getElementById('news-container');
        const countrySelect = document.getElementById('country-select');
        const searchInput = document.getElementById('search-input');
        const fetchBtn = document.getElementById('fetch-btn');
        
        // Debug logging
        console.log('Elements found:', {
            container: !!container,
            countrySelect: !!countrySelect,
            searchInput: !!searchInput,
            fetchBtn: !!fetchBtn
        });
        
        if (!container) {
            document.body.innerHTML += '<p class="error">Error: News container element not found. Check HTML.</p>';
            return;
        }
        
        // NewsData.io API configuration
        const apiKey = 'pub_564f854645fd4182b0e7b30a7e8af49b';
        const apiUrl = 'https://newsdata.io/api/1/latest';
        
        // Country list (ISO 3166-1 alpha-2 codes for NewsData.io)
        const countries = [
            { code: 'us', name: 'United States' }, { code: 'gb', name: 'United Kingdom' }, 
            { code: 'ca', name: 'Canada' }, { code: 'au', name: 'Australia' }, { code: 'in', name: 'India' },
            { code: 'de', name: 'Germany' }, { code: 'fr', name: 'France' }, { code: 'it', name: 'Italy' },
            { code: 'es', name: 'Spain' }, { code: 'br', name: 'Brazil' }, { code: 'mx', name: 'Mexico' },
            { code: 'jp', name: 'Japan' }, { code: 'cn', name: 'China' }, { code: 'kr', name: 'South Korea' },
            { code: 'ru', name: 'Russia' }, { code: 'za', name: 'South Africa' }, { code: 'eg', name: 'Egypt' },
            { code: 'ng', name: 'Nigeria' }, { code: 'ke', name: 'Kenya' }, { code: 'pk', name: 'Pakistan' },
            { code: 'bd', name: 'Bangladesh' }, { code: 'id', name: 'Indonesia' }, { code: 'my', name: 'Malaysia' },
            { code: 'ph', name: 'Philippines' }, { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' },
            { code: 'tr', name: 'Turkey' }, { code: 'sa', name: 'Saudi Arabia' }, { code: 'ae', name: 'United Arab Emirates' },
            { code: 'il', name: 'Israel' }, { code: 'ar', name: 'Argentina' }, { code: 'cl', name: 'Chile' },
            { code: 'co', name: 'Colombia' }, { code: 'pe', name: 'Peru' }, { code: 've', name: 'Venezuela' },
            { code: 'ua', name: 'Ukraine' }, { code: 'pl', name: 'Poland' }, { code: 'se', name: 'Sweden' },
            { code: 'no', name: 'Norway' }, { code: 'dk', name: 'Denmark' }, { code: 'fi', name: 'Finland' },
            { code: 'nl', name: 'Netherlands' }, { code: 'be', name: 'Belgium' }, { code: 'ch', name: 'Switzerland' },
            { code: 'at', name: 'Austria' }, { code: 'pt', name: 'Portugal' }, { code: 'gr', name: 'Greece' },
            { code: 'cz', name: 'Czech Republic' }, { code: 'hu', name: 'Hungary' }, { code: 'ro', name: 'Romania' },
            { code: 'bg', name: 'Bulgaria' }, { code: 'hr', name: 'Croatia' }, { code: 'si', name: 'Slovenia' },
            { code: 'sk', name: 'Slovakia' }, { code: 'lt', name: 'Lithuania' }, { code: 'lv', name: 'Latvia' },
            { code: 'ee', name: 'Estonia' }, { code: 'ie', name: 'Ireland' }, { code: 'nz', name: 'New Zealand' },
            { code: 'sg', name: 'Singapore' }, { code: 'hk', name: 'Hong Kong' }, { code: 'tw', name: 'Taiwan' },
            { code: 'ir', name: 'Iran' }, { code: 'iq', name: 'Iraq' }, { code: 'sy', name: 'Syria' },
            { code: 'lb', name: 'Lebanon' }, { code: 'jo', name: 'Jordan' }, { code: 'kw', name: 'Kuwait' },
            { code: 'om', name: 'Oman' }, { code: 'qa', name: 'Qatar' }, { code: 'bh', name: 'Bahrain' },
            { code: 'ye', name: 'Yemen' }, { code: 'af', name: 'Afghanistan' }, { code: 'np', name: 'Nepal' },
            { code: 'bt', name: 'Bhutan' }, { code: 'lk', name: 'Sri Lanka' }, { code: 'mv', name: 'Maldives' },
            { code: 'mm', name: 'Myanmar' }, { code: 'la', name: 'Laos' }, { code: 'kh', name: 'Cambodia' },
            { code: 'bn', name: 'Brunei' }
            // Note: This is a subset; NewsData.io supports 206 countries
        ];
        
        // Populate countries only if select exists
        if (countrySelect) {
            console.log('Populating country dropdown...');
            // Keep default option, add countries
            const defaultOption = countrySelect.querySelector('option[value=""]') || 
                countrySelect.insertAdjacentHTML('afterbegin', '<option value="">Select a country</option>');
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });
            console.log(`Added ${countries.length} countries`);
        } else {
            console.error('CRITICAL: country-select element not found in DOM');
            container.innerHTML = '<p class="error">Setup error: Missing country selector. Verify index.html.</p>';
            return;
        }
        
        // News fetching function
        function fetchNews() {
            const country = countrySelect ? countrySelect.value : '';
            const query = searchInput ? (searchInput.value || '').trim() : '';
            
            if (!country && !query) {
                container.innerHTML = '<p class="error">Please select a country or enter a search term.</p>';
                return;
            }
            
            let url = `${apiUrl}?apikey=${apiKey}&pageSize=10`;
            if (country) url += `&country=${country}`;
            if (query) url += `&q=${encodeURIComponent(query)}`;
            
            console.log('Fetching from:', url);
            container.innerHTML = '<p class="loading">Loading latest news...</p>';
            
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    console.log('API Response:', data);
                    const articles = data.results || [];
                    container.innerHTML = '';
                    
                    if (articles.length === 0) {
                        container.innerHTML = '<p class="error">No news found. Try different keywords or country.</p>';
                        return;
                    }
                    
                    articles.slice(0, 10).forEach(article => { // Ensure max 10
                        if (!article.title || !article.link) return;
                        
                        const description = (article.description || article.content || 'No description available.')
                            .substring(0, 200) + '...';
                        const sourceName = article.source_id || article.creator || 'Unknown Source';
                        const pubDate = article.pubDate || article.date || 'Unknown date';
                        
                        const item = document.createElement('div');
                        item.className = 'news-item';
                        item.innerHTML = `
                            <h2>${article.title}</h2>
                            <p>${description}</p>
                            <a href="${article.link}" target="_blank" rel="noopener">Read more</a>
                            <div class="source">Source: ${sourceName} | Published: ${new Date(pubDate).toLocaleString()}</div>
                        `;
                        container.appendChild(item);
                    });
                    
                    console.log(`Displayed ${articles.length} articles`);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    container.innerHTML = `<p class="error">Failed to load news: ${error.message}. 
                        API may be rate-limited (200 credits/day). Try again later.</p>`;
                });
        }
        
        // Attach event listeners safely
        if (fetchBtn) {
            fetchBtn.addEventListener('click', fetchNews);
            console.log('Fetch button attached');
        }
        
        if (countrySelect) {
            countrySelect.addEventListener('change', fetchNews);
            console.log('Country selector attached');
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchNews();
                }
            });
            console.log('Search input attached');
        }
        
        console.log('News app initialized successfully');
    }
    
    // Execute when DOM is ready (primary method)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
    
    // Fallback: Also try window load event
    window.addEventListener('load', init);
    
})();
