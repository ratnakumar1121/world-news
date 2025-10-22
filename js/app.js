document.addEventListener('DOMContentLoaded', function () {
  const countrySelect = document.getElementById('countryList');
  const newsFeed = document.getElementById('headlines');
  const searchInput = document.getElementById('search');

  // List of country codes and names
const countries = [
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
].map(c=>c.split(','));

  // Fill the country dropdown
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    countrySelect.appendChild(option);
  });

  // Event listener for country selection
  countrySelect.addEventListener('change', function () {
    const selectedCountryCode = this.value;
    if (!selectedCountryCode) return;
    fetchNews(selectedCountryCode);
  });

  // Event listener for search input
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(query)
    );
    countrySelect.innerHTML = filteredCountries.map(country => `
      <option value="${country.code}">${country.name}</option>
    `).join('');
  });

  // Function to fetch news
  async function fetchNews(countryCode) {
    const apiKey = 'c1444727e95a47f0b09baf3e77a5744a'; // Replace with your NewsAPI.org API key
    const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      newsFeed.textContent = 'Failed to load news.';
    }
  }

  // Function to display news articles
  function displayNews(articles) {
    newsFeed.innerHTML = articles.map(article => `
      <div>
        <a href="${article.url}" target="_blank">${article.title}</a>
        <small>${new Date(article.publishedAt).toLocaleDateString()}</small>
      </div>
    `).join('');
  }
});