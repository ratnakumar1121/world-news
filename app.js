/* 1.  ISO-3166 country name → 2-letter code */
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

/* 2.  Fill country list */
const list   = document.getElementById('countryList');
const search = document.getElementById('search');
const box    = document.getElementById('headlines');

function fillList(arr){
  list.innerHTML='';
  arr.forEach(([name,code])=>{
    const li=document.createElement('li');
    li.textContent=name;
    li.dataset.code=code;
    li.addEventListener('click',()=>fetchNews(code,name));
    list.appendChild(li);
  });
}
fillList(countries);

search.addEventListener('input',()=>{
  const q=search.value.toLowerCase();
  fillList(countries.filter(([n])=>n.toLowerCase().includes(q)));
});

/* 3.  Fetch headlines from GDELT */
async function fetchNews(code,name){
  box.innerHTML=`Loading <b>${name}</b>…`;
  /* GDELT v2 geo API: last 24 h, top 25 stories for country */
  const url=`https://api.gdeltproject.org/api/v2/geo/geo?format=html&timespan=24h&query=country:${code}&mode=artlist&maxrecords=25&format=json`;
  try{
    const r=await fetch(url);
    const j=await r.json();
    if(!j.articles || !j.articles.length){ box.innerHTML='No headlines found.'; return; }
    box.innerHTML='';
    j.articles.forEach(a=>{
      const art=document.createElement('article');
      art.innerHTML=`
        <a href="${a.url}" target="_blank" rel="noopener">${a.title}</a>
        <div class="time">${new Date(a.seendate).toLocaleString()}</div>`;
      box.appendChild(art);
    });
  }catch(e){ box.innerHTML='Error loading news.'; console.error(e); }
}