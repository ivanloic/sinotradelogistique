const CountriesAndRegions = [
  // {
  //   country: "United States",
  //   regions: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
  // },
  // {
  //   country: "Canada",
  //   regions: ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan"]
  // },
  // {
  //   country: "Australia",
  //   regions: ["Australian Capital Territory","New South Wales","Northern Territory","Queensland","South Australia","Tasmania","Victoria","Western Australia"]
  // },
  // {
  //   country: "India",
  //   regions: ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
  // },
  // {
  //   country: "United Kingdom",
  //   regions: ["England","Northern Ireland","Scotland","Wales"]
  // },

  // // ★★ 10 PRINCIPAUX PAYS D'AMÉRIQUE ★★
  // { country: "Brazil", regions: ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais", "Paraná", "Pernambuco", "Santa Catarina", "Goiás", "Ceará", "Amazonas"] },
  // { country: "Mexico", regions: ["Mexico City", "Jalisco", "Nuevo León", "Puebla", "Chiapas", "Veracruz", "Yucatán", "Guanajuato", "Oaxaca", "Sonora"] },
  // { country: "Argentina", regions: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Misiones", "Salta", "Formosa", "Chubut"] },
  // { country: "Chile", regions: ["Santiago", "Valparaíso", "Biobío", "Araucanía", "Antofagasta", "Los Lagos", "Maule", "Atacama", "Tarapacá", "Aysén"] },
  // { country: "Colombia", regions: ["Bogotá", "Antioquia", "Valle del Cauca", "Atlántico", "Bolívar", "Caldas", "Cauca", "Santander", "Nariño", "Tolima"] },
  // { country: "Peru", regions: ["Lima", "Cusco", "Arequipa", "Piura", "Loreto", "Junín", "Ica", "Ayacucho", "Tacna", "Huanuco"] },
  // { country: "Venezuela", regions: ["Distrito Capital", "Zulia", "Carabobo", "Lara", "Miranda", "Anzoátegui", "Bolívar", "Falcón", "Mérida", "Táchira"] },
  // { country: "Ecuador", regions: ["Pichincha", "Guayas", "Manabí", "Azuay", "Loja", "El Oro", "Santo Domingo", "Esmeraldas", "Chimborazo", "Cotopaxi"] },
  // { country: "Uruguay", regions: ["Montevideo", "Canelones", "Maldonado", "Colonia", "San José", "Rivera", "Salto", "Paysandú", "Durazno", "Flores"] },
  // { country: "Panama", regions: ["Panamá", "Colón", "Chiriquí", "Veraguas", "Los Santos", "Herrera", "Coclé", "Darién", "Bocas del Toro", "Guna Yala"] },

  // // ★★ 10 PAYS D'EUROPE ★★
  // { country: "France", regions: ["Île-de-France","Occitanie","Nouvelle-Aquitaine","Auvergne-Rhône-Alpes","Provence-Alpes-Côte d’Azur","Hauts-de-France","Grand Est","Normandie","Bretagne","Bourgogne-Franche-Comté"] },
  // { country: "Germany", regions: ["Bavaria","Berlin","Hamburg","Hesse","Saxony","Saxony-Anhalt","Brandenburg","North Rhine-Westphalia","Baden-Württemberg","Thuringia"] },
  // { country: "Spain", regions: ["Catalonia","Andalusia","Madrid","Valencia","Galicia","Basque Country","Murcia","Castilla-La Mancha","Castilla y León","Aragon"] },
  // { country: "Italy", regions: ["Lombardy","Lazio","Sicily","Tuscany","Veneto","Emilia-Romagna","Piemonte","Puglia","Campania","Sardinia"] },
  // { country: "Portugal", regions: ["Lisbon","Porto","Braga","Coimbra","Faro","Setúbal","Aveiro","Beja","Bragança","Guarda"] },
  // { country: "Netherlands", regions: ["North Holland","South Holland","Utrecht","Groningen","Limburg","Zeeland","Drenthe","Friesland","Gelderland","Overijssel"] },
  // { country: "Belgium", regions: ["Brussels","Flanders","Wallonia"] },
  // { country: "Switzerland", regions: ["Zurich","Geneva","Bern","Vaud","Basel-Stadt","Ticino","Valais","Neuchâtel","Fribourg","Schwyz"] },
  // { country: "Sweden", regions: ["Stockholm","Skåne","Västra Götaland","Uppsala","Örebro","Halland","Norrbotten","Södermanland","Värmland","Jämtland"] },
  // { country: "Greece", regions: ["Attica","Macedonia","Crete","Thessaly","Peloponnese","Epirus","Aegean Islands","Ionian Islands","Thrace","Central Greece"] },

{ country: "Bénin", regions: ["Littoral","Atlantique","Ouémé","Mono","Couffo","Donga","Alibori","Atacora"], indicatif: "+229" },
{ country: "Burkina Faso", regions: ["Centre","Hauts-Bassins","Cascades","Centre-Nord","Centre-Est","Centre-Ouest","Boucle du Mouhoun","Est","Nord","Sahel","Sud-Ouest"], indicatif: "+226" },
{ country: "Cap-Vert", regions: ["São Vicente","Santo Antão","São Filipe","Sal","Boa Vista","Maio","Ribeira Grande de Santiago","Tarrafal de São Nicolau","Santa Catarina do Fogo","Santa Cruz"], indicatif: "+238" },
{ country: "Côte d'Ivoire", regions: ["Abidjan","Yamoussoukro","Bouaké","San Pedro","Korhogo","Man","Daloa","Gagnoa","Odienné","Bondoukou"], indicatif: "+225" },
{ country: "Gambie", regions: ["Banjul","Kanifing","Kerewan","Kuntaur","Janjanbureh","Basse"], indicatif: "+220" },
{ country: "Guinée", regions: ["Conakry","Boke","Faranah","Kankan","Kindia","Labé","Mamou","Nzérékoré"], indicatif: "+224" },
{ country: "Guinée-Bissau", regions: ["Bissau","Bafatá","Gabú","Oio","Quinara","Cacheu","Tombali","Bolama"], indicatif: "+245" },
{ country: "Liberia", regions: ["Montserrado","Nimba","Bong","Lofa","Margibi","Rivercess","Grand Bassa","Grand Cape Mount","Sinoe","Grand Gedeh"], indicatif: "+231" },
{ country: "Mali", regions: ["Bamako","Kayes","Koulikoro","Sikasso","Ségou","Mopti","Tombouctou","Kidal","Gao","Taoudénit"], indicatif: "+223" },
{ country: "Mauritanie", regions: ["Nouakchott-Nord","Nouakchott-Ouest","Nouakchott-Sud","Adrar","Assaba","Brakna","Gorgol","Guidimaka","Hodh Ech Chargui","Hodh El Gharbi"], indicatif: "+222" },
{ country: "Niger", regions: ["Niamey","Agadez","Diffa","Dosso","Maradi","Tahoua","Tillabéri","Zinder"], indicatif: "+227" },
{ country: "Sénégal", regions: ["Dakar","Thiès","Saint-Louis","Ziguinchor","Kaolack","Tambacounda","Fatick","Louga","Kolda","Diourbel"], indicatif: "+221" },
{ country: "Sierra Leone", regions: ["Western Area","Northern Province","Eastern Province","Southern Province"], indicatif: "+232" },
{ country: "Togo", regions: ["Maritime","Plateaux","Centrale","Kara","Savanes"], indicatif: "+228" },
{ country: "Cameroun", regions: ["Centre","Littoral","Ouest","Nord","Extrême-Nord","Sud","Sud-Ouest","Nord-Ouest","Est","Adamaoua"], indicatif: "+237" },
{ country: "Centrafrique", regions: ["Bangui","Bamingui-Bangoran","Basse-Kotto","Haute-Kotto","Haut-Mbomou","Kémo","Lobaye","Mambéré-Kadéï","Mbomou","Nana-Grebizi"], indicatif: "+236" },
{ country: "Congo-Brazzaville", regions: ["Brazzaville","Bouenza","Cuvette","Cuvette-Ouest","Kouilou","Lékoumou","Likouala","Niari","Plateaux","Pointe-Noire"], indicatif: "+242" },
{ country: "Gabon", regions: ["Estuaire","Haut-Ogooué","Moyen-Ogooué","Ngounié","Nyanga","Ogooué-Ivindo","Ogooué-Lolo","Ogooué-Maritime","Woleu-Ntem"], indicatif: "+241" },
{ country: "Guinée équatoriale", regions: ["Bioko Norte","Bioko Sur","Centro-Sur","Kie-Ntem","Litoral","Wele-Nzas"], indicatif: "+240" },
{ country: "RDC", regions: ["Kinshasa","Kongo Central","Kwango","Kwilu","Mai-Ndombe","Équateur","Tshopo","Bas-Uélé","Haut-Uélé","Ituri"], indicatif: "+243" },
{ country: "Rwanda", regions: ["Kigali","Eastern Province","Western Province","Northern Province","Southern Province"], indicatif: "+250" },
{ country: "Sao Tomé-et-Principe", regions: ["Água Grande","Cantagalo","Caue","Lemba","Lobata","Mé-Zochi","Principe"], indicatif: "+239" },
{ country: "Tchad", regions: ["N'Djamena","Barh-El-Gazal","Batha","Borkou","Chari-Baguirmi","Ennedi-Est","Ennedi-Ouest","Guéra","Hadjer-Lamis","Kanem"], indicatif: "+235" },
{ country: "Algérie", regions: ["Alger","Oran","Constantine","Annaba","Tamanrasset","Tlemcen","Tindouf","Ghardaïa","Bejaia","Batna"], indicatif: "+213" },
{ country: "Égypte", regions: ["Cairo","Giza","Alexandria","Luxor","Aswan","Dakahlia","Gharbia","Suez","Qena","Fayoum"], indicatif: "+20" },
{ country: "Maroc", regions: ["Casablanca-Settat","Rabat-Salé-Kénitra","Marrakech-Safi","Fès-Meknès","Souss-Massa","Tanger-Tétouan-Al Hoceima","Oriental","Dakhla-Oued Ed-Dahab","Béni Mellal-Khénifra"], indicatif: "+212" },
{ country: "Tunisie", regions: ["Tunis","Sfax","Sousse","Kairouan","Gabès","Bizerte","Ariana","Gafsa","Monastir","Kasserine"], indicatif: "+216" },
{ country: "Nigeria", regions: ["Lagos","Abuja","Kano","Rivers","Kaduna","Oyo","Edo","Delta","Borno","Plateau"], indicatif: "+234" },
{ country: "Afrique du Sud", regions: ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Free State","Limpopo","Mpumalanga","Northern Cape","North West"], indicatif: "+27" },
{ country: "Ghana", regions: ["Greater Accra","Ashanti","Northern","Central","Eastern","Volta","Brong-Ahafo","Upper East","Upper West","Western"], indicatif: "+233" },
{ country: "Kenya", regions: ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Kiambu","Machakos","Meru","Kakamega","Turkana"], indicatif: "+254" },
{ country: "Éthiopie", regions: ["Addis Ababa","Amhara","Tigray","Oromia","Somali","Harari","Dire Dawa","Benishangul-Gumuz","Afar","SNNPR"], indicatif: "+251" },

// { 
//   country: "Democratic Republic of Congo",
//   regions: ["Kinshasa", "Lubumbashi", "Goma", "Kisangani", "Mbuji-Mayi", "Matadi", "Kananga", "Bukavu", "Kolwezi", "Bunia"]
// },

// { 
//   country: "Burkina Faso",
//   regions: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Fada N'gourma", "Tenkodogo", "Banfora", "Dédougou", "Gaoua", "Kaya"]
// },

// { 
//   country: "Benin",
//   regions: ["Cotonou", "Porto-Novo", "Parakou", "Abomey", "Allada", "Natitingou", "Bohicon", "Djougou", "Ouidah", "Lokossa"]
// },


//   // ★★ 5 PAYS D'ASIE ★★
//   { country: "China", regions: ["Beijing","Shanghai","Guangdong","Sichuan","Zhejiang","Yunnan","Hubei","Jiangsu","Shanxi","Anhui"] },
//   { country: "Japan", regions: ["Tokyo","Osaka","Hokkaido","Fukuoka","Nagoya","Kyoto","Okinawa","Hiroshima","Sendai","Kanagawa"] },
//   { country: "South Korea", regions: ["Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju","Ulsan","Jeju","Suwon","Changwon"] },
//   { country: "Indonesia", regions: ["Jakarta","Bali","Java","Sumatra","Kalimantan","Sulawesi","Papua","Yogyakarta","Riau","Aceh"] },
//   { country: "Saudi Arabia", regions: ["Riyadh","Mecca","Medina","Jeddah","Eastern Province","Tabuk","Najran","Qassim","Asir","Hail"] },
];

export default CountriesAndRegions;
