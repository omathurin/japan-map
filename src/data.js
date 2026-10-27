import {culturalStories} from './cultural-stories.js';
import {storyReference,wikipediaReference} from './references.js';
import {additionalStories} from './more-stories.js';
export const lenses = [['all','Toutes les histoires','✳'],['politique','Politique','♜'],['guerres','Guerres','⚔'],['religion','Religion','⛩'],['culture','Culture','◈'],['arts','Arts','✿'],['cuisine','Cuisine','♨']];
export const eras = [
 {name:'Nara',start:710,end:793,title:'Aux sources d’un empire',intro:'Une capitale se dessine. Le bouddhisme et les institutions venues du continent transforment l’archipel.',city:'Nara',lat:34.685,lon:135.805},
 {name:'Heian',start:794,end:1184,title:'Le temps de la cour impériale',intro:'À Heian-kyō, une culture de cour s’épanouit. Poésie, littérature et sensibilité aux saisons façonnent un nouvel imaginaire.',city:'Kyoto',lat:35.01,lon:135.77},
 {name:'Kamakura',start:1185,end:1332,title:'L’avènement des samouraïs',intro:'Le pouvoir militaire s’installe à Kamakura. De nouveaux courants bouddhiques et les invasions mongoles marquent cette époque.',city:'Kamakura',lat:35.32,lon:139.55},
 {name:'Muromachi',start:1333,end:1572,title:'La beauté au milieu des troubles',intro:'Alors que le pouvoir se fragmente, jardins secs, théâtre nō et culture du thé trouvent de nouvelles expressions.',city:'Kyoto',lat:35.01,lon:135.77},
 {name:'Azuchi–Momoyama',start:1573,end:1602,title:'Un archipel à réunifier',intro:'Châteaux monumentaux et alliances changeantes accompagnent les campagnes d’unification de Nobunaga et de Hideyoshi.',city:'Osaka',lat:34.69,lon:135.5},
 {name:'Edo',start:1603,end:1867,title:'Un monde flottant s’éveille',intro:'Sous les Tokugawa, les villes grandissent. Estampes, kabuki et saveurs populaires font naître une effervescence nouvelle.',city:'Edo · Tokyo',lat:35.68,lon:139.69},
 {name:'Meiji',start:1868,end:1911,title:'Le Japon à la croisée des mondes',intro:'La restauration impériale ouvre une transformation rapide : chemins de fer, industrie et nouvelles institutions redessinent le pays.',city:'Tokyo',lat:35.68,lon:139.69},
 {name:'Taishō',start:1912,end:1925,title:'Les promesses de la modernité',intro:'Culture urbaine, mouvements sociaux et débats démocratiques animent une société en pleine mutation.',city:'Tokyo',lat:35.68,lon:139.69},
 {name:'Shōwa',start:1926,end:1988,title:'Un siècle de bouleversements',intro:'Expansion impériale, guerre et dévastation précèdent la reconstruction, puis une croissance économique spectaculaire.',city:'Hiroshima',lat:34.39,lon:132.45},
 {name:'Contemporain',start:1989,end:2025,title:'Entre mémoire et nouveaux horizons',intro:'L’archipel réinvente ses traditions. Architecture, gastronomie et cultures visuelles dialoguent avec le monde.',city:'Tokyo',lat:35.68,lon:139.69}
];
const topics = {
 politique:['Les lieux du pouvoir','Des institutions et des équilibres en mouvement'],guerres:['Conflits et transformations','Les affrontements qui ont changé l’archipel'],religion:['Le sacré au quotidien','Temples, croyances et chemins spirituels'],culture:['Une manière d’habiter le monde','Rituels, récits et vie quotidienne'],arts:['Le geste et la beauté','Des formes qui traversent les siècles'],cuisine:['Une histoire de saveurs','À la rencontre des tables japonaises']
};
const initialStories = [
 [0,'religion','Le grand Bouddha de Nara',752,'Nara',34.685,135.84,'Au Tōdai-ji, la consécration du grand Bouddha en 752 exprime le rôle du bouddhisme dans la protection de l’État. Le temple reste un témoin majeur de la capitale de Nara.','https://www.todaiji.or.jp/en/'],
 [1,'culture','Une voix venue de la cour',1008,'Kyoto',35.01,135.77,'Au début du XIe siècle, Murasaki Shikibu compose Le Dit du Genji. Ce récit explore les relations, les ambitions et la fragilité de la vie à la cour de Heian.','https://www.metmuseum.org/essays/heian-period-794-1185'],
 [2,'guerres','Face aux flottes mongoles',1281,'Baie de Hakata',33.6,130.4,'En 1274 puis en 1281, des forces de l’empire mongol tentent d’envahir le Japon. La résistance et les tempêtes contribuent à leur échec, tout en pesant sur le régime de Kamakura.','https://www.britannica.com/event/Mongol-invasions-of-Japan'],
 [3,'arts','Le silence d’un jardin zen',1450,'Kyoto',35.034,135.718,'Fondé en 1450, le Ryōan-ji est célèbre pour son jardin de pierres, dont la date de création et l’auteur restent incertains. Son espace dépouillé invite à une contemplation sans interprétation unique.','https://www.ryoanji.jp/smph/eng/'],
 [4,'politique','Le château d’un unificateur',1583,'Osaka',34.687,135.526,'Toyotomi Hideyoshi entreprend la construction du château d’Osaka en 1583. Cette place forte devient un symbole de sa puissance pendant l’unification du Japon.','https://www.osakacastle.net/'],
 [5,'arts','Les images du monde flottant',1831,'Edo · Tokyo',35.68,139.69,'Vers 1830–1832, Hokusai publie sa célèbre Grande Vague, dans la série des Trente-six vues du mont Fuji. Les estampes ukiyo-e circulent dans une société urbaine avide d’images et de récits.','https://www.metmuseum.org/art/collection/search/45434'],
 [5,'cuisine','Le sushi prend la rue',1824,'Edo · Tokyo',35.57,139.8,'Au XIXe siècle, le nigiri-zushi se développe à Edo : poisson et riz vinaigré forment une restauration rapide adaptée à la vie de la ville. Sa forme évoluera encore avec la conservation et la réfrigération.','https://www.maff.go.jp/e/policies/market/k_ryouri/'],
 [5,'religion','Sur les chemins d’Ise',1705,'Ise',34.46,136.72,'Pendant l’époque d’Edo, les pèlerinages à Ise attirent des foules considérables. Le voyage associe ferveur, sociabilité et découverte, dans les limites imposées aux déplacements.','https://www.isejingu.or.jp/en/'],
 [5,'politique','Une autre porte sur le monde',1641,'Nagasaki',32.75,129.88,'En 1641, le comptoir néerlandais est transféré sur l’île de Dejima. Malgré des restrictions fortes, des échanges avec les Néerlandais et les Chinois continuent à Nagasaki.','https://nagasakidejima.jp/english/'],
 [5,'culture','Kyoto, la scène des traditions',1629,'Kyoto',35.01,135.77,'Le kabuki naît au début du XVIIe siècle à Kyoto. Après l’interdiction faite aux femmes de jouer en 1629, ses formes et ses interprètes se transforment ; le théâtre prospère aussi à Edo et Osaka.','https://www2.ntj.jac.go.jp/unesco/kabuki/en/'],
 [5,'guerres','Sekigahara, à l’aube d’Edo',1600,'Sekigahara',35.37,136.47,'La victoire de Tokugawa Ieyasu à Sekigahara, en 1600, précède la fondation du shogunat en 1603. Elle éclaire la réorganisation politique qui ouvre l’époque d’Edo.','https://www.britannica.com/event/Battle-of-Sekigahara'],
 [6,'politique','Une nouvelle capitale politique',1868,'Tokyo',35.68,139.69,'En 1868, Edo prend le nom de Tokyo. La restauration de Meiji replace l’empereur au centre du nouvel ordre politique ; des réformes profondes suivent dans les années suivantes.','https://www.britannica.com/event/Meiji-Restoration'],
 [7,'culture','La ville entre dans une autre ère',1920,'Tokyo',35.68,139.69,'Dans le Japon de Taishō, cafés, magazines et cinéma accompagnent la diffusion d’une culture de masse. Ces évolutions côtoient de fortes inégalités et des tensions politiques.','https://www.britannica.com/event/Taisho-period'],
 [8,'guerres','Hiroshima, la mémoire pour horizon',1945,'Hiroshima',34.39,132.45,'Le 6 août 1945, une bombe atomique américaine dévaste Hiroshima. Le parc du Mémorial de la paix porte aujourd’hui la mémoire des victimes et un appel au désarmement nucléaire.','https://hpmmuseum.jp/?lang=eng'],
 [9,'arts','L’art prend le large',2010,'Naoshima',34.46,133.99,'Sur Naoshima et les îles voisines, musées et installations font dialoguer art contemporain, architecture et paysage. La première Triennale de Setouchi, en 2010, étend cette rencontre à l’échelle de la mer intérieure.','https://setouchi-artfest.jp/en/']
].map((s,i)=>({id:i,era:s[0],lens:s[1],title:s[2],year:s[3],city:s[4],lat:s[5],lon:s[6],text:s[7],source:s[8]}));
const historicalStories = [...initialStories, ...additionalStories.map((s,i)=>({...s,id:initialStories.length+i}))];
export const stories = [
 ...historicalStories.map(s=>({...s,reference:storyReference(s.id)})),
 ...culturalStories.map((s,i)=>{const reference=wikipediaReference(s.article,s.referenceTitle);return{...s,id:historicalStories.length+i,source:reference.url,reference}})
];
export {topics};
