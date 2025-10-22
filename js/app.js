document.addEventListener('DOMContentLoaded', function () {
  const countrySelect = document.getElementById('countryList');
  const newsFeed = document.getElementById('headlines');
  const searchInput = document.getElementById('search');

  // List of country codes and names (full list)
  const countriesStr = [
    "Afghanistan,AF","Albania,AL","Algeria,DZ","Andorra,AD","Angola,AO","Antigua and Barbuda,AG",
    "Argentina,AR","Armenia,AM","Australia,AU","Austria,AT","Azerbaijan,AZ","Bahamas,BS",
    "Bahrain,BH","Bangladesh,BD","Barbados,BB","Belarus,BY","Belgium,BE","Belize,BZ","Benin,BJ",
    "Bhutan,BT","Bolivia,BO","Bosnia and Herzegovina,BA","Botswana,BW","Brazil,BR","Brunei,BN",
    "Bulgaria,BG","Burkina Faso,BF","Burundi,BI","Cabo Verde,CV","Cambodia,KH","Cameroon,CM",
    "Canada,CA","Central African Republic,CF","Chad,TD","Chile,CL","China,CN","Colombia,CO",
    "Comoros,KM","Congo,CG","Congo (Democratic Republic),CD","Costa Rica,CR","Croatia,HR",
    "Cuba,CU","Cyprus,CY","Czechia,CZ","Denmark,DK","Djibouti,DJ","Dominica,DM","Dominican Republic,DO",
    "Ecuador,EC","Egypt,EG","El Salvador,SV","Equatorial Guinea,GQ","Eritrea,ER","Estonia,EE",
    "Eswatini,SZ","Ethiopia,ET","Fiji,FJ","Finland,FI","France,FR","Gabon,GA","Gambia,GM","Georgia,GE",
    "Germany,DE","Ghana,GH","Greece,GR","Grenada,GD","Guatemala,GT","Guinea,GN","Guinea-Bissau,GW",
    "Guyana,GY","Haiti,HT","Honduras,HN","Hungary,HU","Iceland,IS","India,IN","Indonesia,ID",
    "Iran,IR","Iraq,IQ","Ireland,IE","Israel,IL","Italy,IT","Jamaica,JM","Japan,JP","Jordan,JO",
    "Kazakhstan,KZ","Kenya,KE","Kiribati,KI","Kuwait,KW","Kyrgyzstan,KG","Laos,LA","Latvia,LV",
    "Lebanon,LB","Lesotho,LS","Liberia,LR","Libya,LY","Liechtenstein,LI","Lithuania,LT","Luxembourg,LU",
    "Madagascar,MG","Malawi,MW","Malaysia,MY","Maldives,MV","Mali,ML","Malta,MT","Marshall Islands,MH",
    "Mauritania,MR","Mauritius,MU","Mexico,MX","Micronesia,FM","Moldova,MD","Monaco,MC","Mongolia,MN",
    "Montenegro,ME","Morocco,MA","Mozambique,MZ","Myanmar,MM","Namibia,NA","Nauru,NR","Nepal,NP",
    "Netherlands,NL","New Zealand,NZ","Nicaragua,NI","Niger,NE","Nigeria,NG","North Korea,KP",
    "North Macedonia,MK","Norway,NO","Oman,OM","Pakistan,PK","Palau,PW","Palestine,PS","Panama,PA",
    "Papua New Guinea,PG","Paraguay,PY","Peru,PE","Philippines,PH","Poland,PL","Portugal,PT","Qatar,QA",
    "Romania,RO","Russia,RU","Rwanda,RW","Saint Kitts and Nevis,KN","Saint Lucia,LC","Saint Vincent and the Grenadines,VC",
    "Samoa,WS","San Marino,SM","Sao Tome and Principe,ST","Saudi Arabia,SA","Senegal,SN","Serbia,RS",
    "Seychelles,SC","Sierra Leone,SL","Singapore,SG","Slovakia,SK","Slovenia,SI","Solomon Islands,SB",
    "Somalia,SO","South Africa,ZA","South Korea,KR","South Sudan,SS","Spain,ES","Sri Lanka,LK",
    "Sudan,SD","Suriname,SR","Sweden,SE","Switzerland,CH","Syria,SY","Taiwan,TW","Tajikistan,TJ",
    "Tanzania,TZ","Thailand,TH","Timor-Leste,TL","Togo,TG","Tonga,TO","Trinidad and Tobago,TT",
    "Tunisia,TN","Turkey,TR","Turkmenistan,TM","Tuvalu,TV","Uganda,UG","Ukraine,UA",
    "United Arab Emirates,AE","United Kingdom,GB","United States,US","Uruguay,UY","Uzbekistan,UZ",
    "Vanuatu,VU","Vatican City,VA","Venezuela,VE","Vietnam,VN","Yemen,YE","Zambia,ZM","Zimbabwe,ZW"
  ];

  // Parse into objects with name and code properties
  const countries = countriesStr.map(c => {
    const [name, code] = c.split(',');
    return { name, code };
  });

  // Fill the country list with <li> elements (matches CSS styling)
  countries.forEach(country => {
    const li = document.createElement('li');
    li.textContent = country.name;
    li.dataset.code = country.code;
    countrySelect.appendChild(li);
  });

  // Event listener for country selection (click on li)
  countrySelect.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
      const selectedCountryCode = e.target.dataset.code;
      if (selectedCountryCode) {
        fetchNews(selectedCountryCode);
        // Remove active class from all, add to selected
        countrySelect.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');
      }
    }
  });

  // Event listener for search input (filter and repopulate li elements)
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredCountries = countries.filter(country => 
      country.name.toLowerCase().includes(query)
    );
    countrySelect.innerHTML = filteredCountries.map(country => 
      `<li data-code="${country.code}">${country.name}</li>`
    ).join('');
  });

  // Function to fetch news with improved error handling
  async function fetchNews(countryCode) {
    const apiKey = 'c1444727e95a47f0b09baf3e77a5744a'; // Get from newsapi.org
    const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status !== 'ok') {
        throw new Error(`API error: ${data.message}`);
      }
      displayNews(data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      newsFeed.innerHTML = '<p>Failed to load news. Check API key or try again later.</p>';
    }
  }

  // Function to display news articles
  function displayNews(articles) {
    if (!articles || articles.length === 0) {
      newsFeed.innerHTML = '<p>No news available for this country.</p>';
      return;
    }
    newsFeed.innerHTML = articles.map(article => {
      const time = new Date(article.publishedAt).toLocaleString();
      return `
        <article>
          <a href="${article.url}" target="_blank">${article.title}</a>
          <div class="time">${time}</div>
        </article>
      `;
    }).join('');
  }

  // Initial load: Fetch news for India (IN) as default
  fetchNews('IN');
});
