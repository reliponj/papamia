import type { Localized } from '../types'

export type BlogPost = {
  id: string
  slug: string
  date: string
  image: string
  title: Localized
  excerpt: Localized
  body: Localized
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'secretul-aluatului-napoletan',
    date: '2026-04-15',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85',
    title: {
      ro: 'Secretul aluatului napoletan',
      ru: 'Секрет неаполитанского теста',
      en: 'The secret of Neapolitan dough',
    },
    excerpt: {
      ro: 'De ce 48 de ore de fermentare fac diferența dintre o pizza bună și una excepțională. Chef Antonio dezvăluie tehnica sa.',
      ru: 'Почему 48 часов ферментации делают разницу между хорошей и исключительной пиццей. Шеф Антонио раскрывает свою технику.',
      en: 'Why 48 hours of fermentation make the difference between a good and an exceptional pizza. Chef Antonio reveals his technique.',
    },
    body: {
      ro: `Aluatul este sufletul oricărei pizze napoletane. Fără el, orice garnitură își pierde sensul. La Papa Mia, folosim o rețetă transmisă de trei generații de pizzaioli din Napoli — simplă în ingrediente, exigentă în execuție.

Totul începe cu făina. Folosim exclusiv Caputo "00", măcinată fin, cu un conținut de gluten de 12,5%. Aceasta conferă aluatului elasticitatea necesară pentru a fi întins manual, fără a se rupe. Hidratarea este de 65% — suficientă pentru o textură aerată, dar ferm ținută.

Secretul real, însă, stă în timp. Fermentarea lentă la rece, 48 de ore la 4°C, permite drojdiei să lucreze în profunzime. Zaharurile complexe se descompun treptat, creând o structură mai ușor digerabilă și un gust cu adevărat complex — ușor acru, cu note de cereale, imposibil de obținut în fermentări scurte.

La formare, fiecare bilă de aluat este scoasă din frigider cu două ore înainte de coacere, pentru a atinge temperatura camerei. Întinderea se face exclusiv cu mâna — niciodată cu sucitorul. Mișcările circulare păstrează bulele de gaz formate în fermentare, garantând cornicione-ul înalt și pufos pe care îl veți ști după prima mușcătură.

Cuptorul nostru arde la 450°C. Pizza se coace 90 de secunde. Nu mai mult, nu mai puțin. Dacă aluatul este corect, temperatura face tot restul.`,
      ru: `Тесто — это душа любой неаполитанской пиццы. Без него любая начинка теряет смысл. В Papa Mia мы используем рецепт, переданный тремя поколениями пиццайоло из Неаполя — простой по ингредиентам, требовательный в исполнении.

Всё начинается с муки. Мы используем исключительно Caputo "00", мелкого помола, с содержанием глютена 12,5%. Это придаёт тесту необходимую эластичность для ручного растягивания без разрывов. Гидратация — 65%: достаточно для воздушной текстуры, но с хорошей структурой.

Настоящий секрет, однако, заключается во времени. Медленная холодная ферментация — 48 часов при 4°C — позволяет дрожжам работать в глубину. Сложные сахара постепенно расщепляются, создавая более лёгкую для переваривания структуру и по-настоящему сложный вкус — слегка кисловатый, с нотами злаков, которого невозможно достичь при короткой ферментации.

При формовке каждый шар теста вынимается из холодильника за два часа до выпечки, чтобы достичь комнатной температуры. Растягивание — исключительно руками, никогда скалкой. Круговые движения сохраняют пузырьки газа, образовавшиеся при ферментации, гарантируя высокий пышный корничоне, который вы узнаете с первого укуса.

Наша печь раскаляется до 450°C. Пицца выпекается 90 секунд. Не больше и не меньше. Если тесто правильное, температура делает всё остальное.`,
      en: `The dough is the soul of every Neapolitan pizza. Without it, every topping loses its meaning. At Papa Mia, we use a recipe passed down by three generations of pizzaioli from Naples — simple in ingredients, demanding in execution.

It all starts with the flour. We use exclusively Caputo "00", finely milled, with a gluten content of 12.5%. This gives the dough the elasticity needed for hand-stretching without tearing. Hydration sits at 65% — enough for an airy texture while maintaining structure.

The real secret, however, lies in time. Slow cold fermentation — 48 hours at 4°C — allows the yeast to work deeply. Complex sugars break down gradually, creating a more easily digestible structure and a truly complex flavour — slightly sour, with cereal notes, impossible to achieve with short fermentation.

During shaping, each dough ball is taken out of the refrigerator two hours before baking to reach room temperature. Stretching is done exclusively by hand — never with a rolling pin. The circular movements preserve the gas bubbles formed during fermentation, guaranteeing the tall, puffy cornicione you will recognise from the first bite.

Our oven burns at 450°C. The pizza bakes for 90 seconds. No more, no less. If the dough is right, the temperature does the rest.`,
    },
  },
  {
    id: '2',
    slug: 'san-marzano-tomatele-noastre',
    date: '2026-03-28',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85',
    title: {
      ro: 'San Marzano — roșiile noastre',
      ru: 'Сан-Марцано — наши помидоры',
      en: 'San Marzano — our tomatoes',
    },
    excerpt: {
      ro: 'De ce singura roșie demnă de o pizza autentică vine dintr-o singură vale din Campania. Povestea DOP care schimbă totul.',
      ru: 'Почему единственный помидор, достойный настоящей пиццы, растёт в одной долине в Кампании. История DOP, которая меняет всё.',
      en: 'Why the only tomato worthy of authentic pizza comes from a single valley in Campania. The DOP story that changes everything.',
    },
    body: {
      ro: `În lumea pizzei napoletane, nu toate roșiile sunt egale. Există un singur soi care merită să poarte sosul unei pizze adevărate: San Marzano dell'Agro Sarnese-Nocerino, cu denumire de origine protejată (DOP).

Cultivate în solul vulcanic de la poalele Vezuviului, roșiile San Marzano au o aciditate naturală mai scăzută, o pulpă mai densă și mai puține semințe decât orice altă varietate. Gustul lor este bogat și complex — dulce la bază, cu o ușoară amăreală care echilibrează totul.

La Papa Mia, comandăm roșiile întregi, în conservă, direct de la o cooperativă din Nocera Inferiore. Sosul se prepară simplu: roșiile se zdrobesc manual, fără a fi gătite. Se adaugă un praf de sare și câteva frunze de busuioc proaspăt. Niciun condiment, nicio gătire, nicio complicație.

Filosofia este simplă: când ingredientul este perfect, trebuie să te dai la o parte și să-l lași să vorbească. Tratamentul termic vine din cuptor, nu din oală. Cele 90 de secunde la 450°C transformă sosul crud într-o concentrație intensă, cu note caramelizate la margini, imposibil de reprodus altfel.

Data viitoare când mușcați dintr-o Margherita la Papa Mia, știți că sosul acela a crescut în cenușa Vezuviului.`,
      ru: `В мире неаполитанской пиццы не все помидоры равны. Существует только один сорт, достойный нести соус настоящей пиццы: San Marzano dell'Agro Sarnese-Nocerino с защищённым наименованием происхождения (DOP).

Выращенные на вулканической почве у подножия Везувия, помидоры Сан-Марцано имеют более низкую естественную кислотность, более плотную мякоть и меньше семян, чем любой другой сорт. Их вкус богатый и сложный — сладкий в основе, с лёгкой горчинкой, которая уравновешивает всё.

В Papa Mia мы заказываем целые консервированные помидоры напрямую от кооператива из Ночера Инфериоре. Соус готовится просто: помидоры раздавливаются вручную без варки. Добавляется щепотка соли и несколько листьев свежего базилика. Никаких специй, никакой готовки, никаких сложностей.

Философия проста: когда ингредиент идеален, нужно отступить и дать ему говорить. Термическая обработка происходит в печи, а не в кастрюле. Те самые 90 секунд при 450°C превращают сырой соус в интенсивную концентрацию с карамелизованными нотками по краям, которую невозможно воспроизвести иначе.

В следующий раз, откусывая кусок Маргариты в Papa Mia, знайте: этот соус вырос в пепле Везувия.`,
      en: `In the world of Neapolitan pizza, not all tomatoes are equal. There is only one variety worthy of carrying the sauce of a true pizza: San Marzano dell'Agro Sarnese-Nocerino, with a protected designation of origin (DOP).

Grown in the volcanic soil at the foot of Vesuvius, San Marzano tomatoes have a naturally lower acidity, denser flesh, and fewer seeds than any other variety. Their flavour is rich and complex — sweet at the base, with a slight bitterness that balances everything.

At Papa Mia, we order whole canned tomatoes directly from a cooperative in Nocera Inferiore. The sauce is prepared simply: the tomatoes are crushed by hand, without cooking. A pinch of salt and a few fresh basil leaves are added. No seasoning, no cooking, no complication.

The philosophy is simple: when the ingredient is perfect, you must step aside and let it speak. The heat treatment comes from the oven, not the pot. Those 90 seconds at 450°C transform the raw sauce into an intense concentration, with caramelised notes at the edges, impossible to reproduce otherwise.

Next time you bite into a Margherita at Papa Mia, know that that sauce grew in the ash of Vesuvius.`,
    },
  },
  {
    id: '3',
    slug: 'pinsa-vs-pizza',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85',
    title: {
      ro: 'Pinsa vs Pizza — care e diferența?',
      ru: 'Пинса vs Пицца — в чём разница?',
      en: 'Pinsa vs Pizza — what is the difference?',
    },
    excerpt: {
      ro: 'Pinsa romană cucerește lumea cu o textură crocantă la exterior și pufoasă la interior. Dar de unde vine și cu ce diferă?',
      ru: 'Римская пинса покоряет мир своей хрустящей снаружи и воздушной внутри текстурой. Но откуда она и чем отличается?',
      en: 'Roman pinsa is conquering the world with its crispy exterior and airy interior. But where does it come from and how does it differ?',
    },
    body: {
      ro: `Dacă pizza napoletană este regina sudului, pinsa romană este aristocrația capitalei. Cele două par asemănătoare la prima vedere — aluat, sos, topping — dar diferențele sunt profunde și fascinante.

Pinsa provine din latinescul "pinsere" — a zdrobi, a aplatiza. Romanii antici preparau o turtă plată din cereale zdrobite, ierburi și ulei, coaptă pe pietre fierbinți. Ceea ce preparăm astăzi păstrează această filosofie de bază, cu modernizările evidente.

Aluatul de pinsa este un amestec unic: făină de grâu, făină de soia și făină de orez. Această combinație creează o structură diferită de pizza — mai ușoară, cu o digestibilitate mai bună datorită hidratării ridicate (80% față de 65% la pizza). Fermentarea durează 72 de ore, mai lungă decât la pizza napoletană.

Forma este distinctiv ovalară, nu circulară. Marginile — cornicione-ul — sunt mai înalte și mai aeriene. Textura finală este paradoxală: crocantă și aproape friabilă la exterior, pufoasă și umplută cu bule la interior. Este mai ușoară caloric, mai ușor digerabilă și oferă o experiență texturală diferită.

La Papa Mia, secțiunea de Pinsa este o invitație de a descoperi o altă față a culturii italiene a aluatului. Aceleași ingrediente premium, o altă filozofie a texturii.`,
      ru: `Если неаполитанская пицца — королева юга, то римская пинса — аристократия столицы. На первый взгляд они кажутся похожими — тесто, соус, начинка — но различия глубоки и увлекательны.

Пинса происходит от латинского "pinsere" — толочь, расплющивать. Древние римляне готовили плоскую лепёшку из толчёных злаков, трав и масла, запечённую на горячих камнях. То, что мы готовим сегодня, сохраняет эту базовую философию с очевидными современными доработками.

Тесто для пинсы — уникальная смесь: пшеничная мука, соевая мука и рисовая мука. Эта комбинация создаёт структуру, отличную от пиццы — более лёгкую, с лучшей усвояемостью благодаря высокой гидратации (80% против 65% у пиццы). Ферментация длится 72 часа — дольше, чем у неаполитанской пиццы.

Форма — характерно овальная, не круглая. Края — корничоне — выше и воздушнее. Финальная текстура парадоксальна: хрустящая и почти рассыпчатая снаружи, пышная и пузырчатая внутри. Она менее калорийна, лучше усваивается и предлагает иной текстурный опыт.

В Papa Mia раздел Пинса — это приглашение открыть другую грань итальянской культуры теста. Те же премиальные ингредиенты, другая философия текстуры.`,
      en: `If Neapolitan pizza is the queen of the south, Roman pinsa is the aristocracy of the capital. The two look similar at first glance — dough, sauce, toppings — but the differences are profound and fascinating.

Pinsa comes from the Latin "pinsere" — to crush, to flatten. The ancient Romans prepared a flat cake from crushed grains, herbs, and oil, baked on hot stones. What we prepare today preserves this basic philosophy, with obvious modernisations.

Pinsa dough is a unique blend: wheat flour, soy flour, and rice flour. This combination creates a different structure from pizza — lighter, with better digestibility thanks to high hydration (80% compared to 65% for pizza). Fermentation lasts 72 hours, longer than Neapolitan pizza.

The shape is distinctly oval, not circular. The edges — the cornicione — are higher and more airy. The final texture is paradoxical: crispy and almost crumbly on the outside, fluffy and bubble-filled on the inside. It is lighter in calories, easier to digest, and offers a different textural experience.

At Papa Mia, the Pinsa section is an invitation to discover another face of Italian dough culture. The same premium ingredients, a different philosophy of texture.`,
    },
  },
  {
    id: '4',
    slug: 'carbona-reteta-originala',
    date: '2026-02-20',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900&q=85',
    title: {
      ro: 'Carbonara: rețeta originală fără smântână',
      ru: 'Карбонара: оригинальный рецепт без сливок',
      en: 'Carbonara: the original recipe without cream',
    },
    excerpt: {
      ro: 'Una dintre cele mai controversate paste din lume. De ce rețeta autentică nu conține smântână și cum se obține crema perfectă.',
      ru: 'Одна из самых спорных паст в мире. Почему аутентичный рецепт не содержит сливок и как получить идеальный крем.',
      en: 'One of the most controversial pastas in the world. Why the authentic recipe contains no cream and how to achieve the perfect cream.',
    },
    body: {
      ro: `Carbonara este poate cea mai discutată și mai greșit interpretată pastă din lume. Menționați-o unui roman și veți vedea un zâmbet încrâncenat. Adăugați smântână și veți provoca un scandal diplomatic.

Rețeta autentică este magistral simplă: spaghetti, guanciale (obraz de porc), ouă întregi plus gălbenușuri, Pecorino Romano, piper negru. Atât. Nu smântână, nu ceapă, nu usturoi, nu ulei de măsline.

Secretul care sperie pe oricine este temperatura. Emulsia de ou și brânză trebuie să atingă exact 65–70°C — suficient pentru a se lega și a crea o cremă mătăsoasă, insuficient pentru a scramble. Totul se face off-heat: pasta fierbinte, cu un pic din apa de gătit, creează temperatura necesară fără a găti oul.

Guanciale, nu bacon. Această distincție este fundamentală. Obrazul de porc are o grăsime diferită calitativ — mai parfumată, mai bogată, cu un punct de topire mai jos. Când se rumenește lent la foc mediu, eliberează o untositate care devine parte din sos.

La Papa Mia, Giulia respectă aceste proporții cu strictețe: 3 gălbenușuri și 1 ou întreg la 200g de paste. Pecorino, nu Parmezan — deși o combinație 50/50 este tolerată și iubită. Și multă răbdare în mișcarea continuă care leagă totul.`,
      ru: `Карбонара — возможно, самая обсуждаемая и неправильно интерпретируемая паста в мире. Упомяните её римлянину, и вы увидите упрямую улыбку. Добавьте сливки — и вы спровоцируете дипломатический скандал.

Аутентичный рецепт мастерски прост: спагетти, гуанчиале (свиные щёки), целые яйца плюс желтки, Пекорино Романо, чёрный перец. Всё. Никаких сливок, никакого лука, никакого чеснока, никакого оливкового масла.

Секрет, который пугает всех, — это температура. Эмульсия из яйца и сыра должна достичь ровно 65–70°C — достаточно, чтобы связаться и создать шелковистый крем, но недостаточно, чтобы стать яичницей. Всё делается off-heat: горячая паста с небольшим количеством воды от варки создаёт необходимую температуру, не приготавливая яйцо.

Гуанчиале, не бекон. Это различие принципиально. Свиная щека имеет качественно иной жир — более ароматный, более богатый, с более низкой точкой плавления. Когда она медленно подрумянивается на среднем огне, выделяется маслянистость, которая становится частью соуса.

В Papa Mia Джулия строго соблюдает эти пропорции: 3 желтка и 1 целое яйцо на 200 г пасты. Пекорино, не Пармезан — хотя комбинация 50/50 допускается и любима. И много терпения в непрерывном движении, которое связывает всё воедино.`,
      en: `Carbonara is perhaps the most discussed and most misinterpreted pasta in the world. Mention it to a Roman and you will see an indignant smile. Add cream and you will provoke a diplomatic incident.

The authentic recipe is masterfully simple: spaghetti, guanciale (pork cheek), whole eggs plus yolks, Pecorino Romano, black pepper. That is all. No cream, no onion, no garlic, no olive oil.

The secret that frightens everyone is the temperature. The egg and cheese emulsion must reach exactly 65–70°C — enough to bind and create a silky cream, not enough to scramble. Everything is done off-heat: the hot pasta, with a little of the cooking water, creates the necessary temperature without cooking the egg.

Guanciale, not bacon. This distinction is fundamental. Pork cheek has a qualitatively different fat — more fragrant, richer, with a lower melting point. When it browns slowly over medium heat, it releases an unctuousness that becomes part of the sauce.

At Papa Mia, Giulia observes these proportions strictly: 3 yolks and 1 whole egg per 200g of pasta. Pecorino, not Parmesan — although a 50/50 combination is tolerated and loved. And plenty of patience in the continuous movement that binds everything together.`,
    },
  },
  {
    id: '5',
    slug: 'mozzarella-di-bufala',
    date: '2026-02-05',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=85',
    title: {
      ro: 'Mozzarella di bufala — regina brânzeturilor proaspete',
      ru: 'Моцарелла ди буфала — королева свежих сыров',
      en: 'Mozzarella di bufala — queen of fresh cheeses',
    },
    excerpt: {
      ro: 'Ce face ca laptele de bivoliță să producă o mozzarella incomparabil mai cremoasă? Și de ce la Papa Mia aceasta sosește proaspătă în fiecare marți.',
      ru: 'Что делает молоко буйволицы несравнимо более кремовым? И почему в Papa Mia она приходит свежей каждый вторник.',
      en: 'What makes buffalo milk produce an incomparably creamier mozzarella? And why at Papa Mia it arrives fresh every Tuesday.',
    },
    body: {
      ro: `Mozzarella di bufala Campana DOP este, fără îndoială, una dintre cele mai nobile brânzeturi din lume. Produsă exclusiv din lapte de bivoliță în anumite zone din Campania, Lazio, Puglia și Molise, ea beneficiază de o protecție legală similară vinurilor mari.

Diferența față de mozzarella de vacă începe cu laptele. Laptele de bivoliță conține aproape dublu cantitate de grăsimi (7–8% față de 3,5%) și mai multă proteină. Rezultatul este o textură inimaginabil de cremoasă, o aromă mai intensă și un gust ușor fermentat, aproape animal în complexitate.

Procesul de producere respectă reguli stricte. Laptele proaspăt este coagulat, tăiat, filat — o tehnică specifică brânzeturilor "pasta filata" — și format manual în bile. Întreaga operație durează câteva ore și trebuie finalizată în ziua mulsului.

La Papa Mia, mozzarella di bufala sosește în fiecare marți dimineața, direct de la un producător din Caserta. Ajunge în apă de transport, la temperatura corectă, și este utilizată în ziua sosirii sau a doua zi. Niciodată mai mult de 48 de ore de la producere.

Pe pizza, se adaugă după coacere sau în ultimele 30 de secunde — niciodată înainte, pentru a nu pierde umiditatea esențială. Pe salată, simplu, cu ulei de măsline și sare de mare. Excelența nu are nevoie de decor.`,
      ru: `Mozzarella di Bufala Campana DOP — без сомнения, один из благороднейших сыров мира. Производимая исключительно из молока буйволиц в определённых районах Кампании, Лацио, Апулии и Молизе, она пользуется правовой защитой, сравнимой с великими винами.

Отличие от коровьей моцареллы начинается с молока. Молоко буйволицы содержит почти вдвое больше жира (7–8% против 3,5%) и больше белка. Результат — немыслимо кремовая текстура, более интенсивный аромат и слегка ферментированный вкус, почти животный по сложности.

Процесс производства подчиняется строгим правилам. Свежее молоко коагулируется, нарезается, вытягивается — техника, характерная для сыров "pasta filata" — и вручную формируется в шары. Вся операция занимает несколько часов и должна завершиться в день дойки.

В Papa Mia моцарелла ди буфала приходит каждый вторник утром, напрямую от производителя из Казерты. Она приезжает в транспортировочной воде при правильной температуре и используется в день прибытия или на следующий день. Никогда более 48 часов с момента производства.

На пиццу она добавляется после выпечки или в последние 30 секунд — никогда раньше, чтобы не потерять необходимую влажность. На салат — просто, с оливковым маслом и морской солью. Совершенству не нужен декор.`,
      en: `Mozzarella di Bufala Campana DOP is, without doubt, one of the noblest cheeses in the world. Produced exclusively from buffalo milk in certain areas of Campania, Lazio, Puglia, and Molise, it benefits from legal protection similar to great wines.

The difference from cow's milk mozzarella starts with the milk. Buffalo milk contains almost double the fat content (7–8% compared to 3.5%) and more protein. The result is an unimaginably creamy texture, a more intense aroma, and a slightly fermented taste, almost animal in complexity.

The production process follows strict rules. Fresh milk is coagulated, cut, stretched — a technique specific to "pasta filata" cheeses — and formed by hand into balls. The entire operation takes a few hours and must be completed on the day of milking.

At Papa Mia, mozzarella di bufala arrives every Tuesday morning, directly from a producer in Caserta. It arrives in transport water, at the correct temperature, and is used on the day of arrival or the next day. Never more than 48 hours from production.

On pizza, it is added after baking or in the last 30 seconds — never before, so as not to lose the essential moisture. On salad, simply, with olive oil and sea salt. Excellence needs no decoration.`,
    },
  },
  {
    id: '6',
    slug: 'tiramisu-istoria',
    date: '2026-01-18',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=85',
    title: {
      ro: 'Tiramisu — istoria unui desert controversat',
      ru: 'Тирамису — история спорного десерта',
      en: 'Tiramisù — the story of a controversial dessert',
    },
    excerpt: {
      ro: 'Veneția, Treviso sau Friuli? Disputa privind originea tiramisu-ului continuă. Dar toți sunt de acord că mascarpone-ul trebuie să fie perfect.',
      ru: 'Венеция, Тревизо или Фриули? Спор о происхождении тирамису продолжается. Но все согласны, что маскарпоне должен быть идеальным.',
      en: 'Venice, Treviso, or Friuli? The dispute over the origin of tiramisù continues. But everyone agrees the mascarpone must be perfect.',
    },
    body: {
      ro: `Tiramisu este poate cel mai cunoscut desert italian din lume, dar istoria sa este surprinzător de recentă și extrem de disputată. Spre deosebire de pizza sau pasta, nu vorbim de secole de tradiție — vorbim de decenii și de instanțe juridice.

Cel mai citat loc de naștere este restaurantul Le Beccherie din Treviso, unde, conform narațiunii oficiale, bucătarul-patiser Roberto Linguanotto a creat tiramisu-ul în jurul anului 1969. Rețeta sa originală — mascarpone, gălbenușuri de ou, zahăr, cafea, pișcoturi Savoiardi și cacao — rămâne standardul de referință.

Dar Friuli-Venezia Giulia revendică prioritatea printr-o versiune mai veche atribuită localului Vetturino din Pieris. Dezbaterea juridică a culminat cu o decizie a Ministerului Italian al Agriculturii care a înregistrat tiramisu-ul ca produs tradițional din Friuli.

Dincolo de dispute, esența rămâne aceeași. Mascarpone proaspăt, bătut cu gălbenușuri și zahăr până devine o spumă cremoasă. Pișcoturi înmuiate rapid în cafea tare — nu prea mult, nu prea puțin. Alternanță de straturi. Pudră de cacao la final.

La Papa Mia, Marco respectă rețeta clasică fără modificări. Nu frișcă, nu gelatină de stabilizare, nu aromă artificială de cafea. Tiramisu-ul se prepară în fiecare dimineață și se servește în ziua respectivă. Răbdarea de două ore la frigider face diferența dintre un desert bun și unul excepțional.`,
      ru: `Тирамису — пожалуй, самый известный итальянский десерт в мире, но его история удивительно молода и крайне спорна. В отличие от пиццы или пасты, речь идёт не о веках традиций, а о десятилетиях и судебных инстанциях.

Наиболее часто упоминаемым местом рождения является ресторан Le Beccherie в Тревизо, где, согласно официальной версии, шеф-кондитер Роберто Лингуанотто создал тирамису около 1969 года. Его оригинальный рецепт — маскарпоне, яичные желтки, сахар, кофе, савоярди и какао — остаётся эталоном.

Но Фриули-Венеция-Джулия претендует на приоритет с более ранней версией, приписываемой заведению Vetturino в Пьерисе. Судебная дискуссия завершилась решением Министерства сельского хозяйства Италии, зарегистрировавшего тирамису как традиционный продукт Фриули.

По ту сторону споров суть остаётся неизменной. Свежий маскарпоне, взбитый с желтками и сахаром до кремовой пены. Савоярди, быстро окунутые в крепкий кофе — не слишком долго и не слишком мало. Чередование слоёв. Какао-пудра в конце.

В Papa Mia Марко соблюдает классический рецепт без изменений. Никаких взбитых сливок, никакого стабилизирующего желатина, никакого искусственного кофейного ароматизатора. Тирамису готовится каждое утро и подаётся в тот же день. Терпение двух часов в холодильнике делает разницу между хорошим и исключительным десертом.`,
      en: `Tiramisù is perhaps the most famous Italian dessert in the world, but its history is surprisingly recent and extremely disputed. Unlike pizza or pasta, we are not talking about centuries of tradition — we are talking about decades and legal proceedings.

The most cited birthplace is the restaurant Le Beccherie in Treviso, where, according to the official narrative, pastry chef Roberto Linguanotto created tiramisù around 1969. His original recipe — mascarpone, egg yolks, sugar, coffee, Savoiardi biscuits, and cocoa — remains the reference standard.

But Friuli-Venezia Giulia claims priority with an older version attributed to the Vetturino establishment in Pieris. The legal debate culminated in a decision by the Italian Ministry of Agriculture that registered tiramisù as a traditional product of Friuli.

Beyond the disputes, the essence remains the same. Fresh mascarpone, beaten with yolks and sugar until it becomes a creamy foam. Biscuits quickly soaked in strong coffee — not too long, not too little. Alternating layers. Cocoa powder at the end.

At Papa Mia, Marco follows the classic recipe without modifications. No cream, no stabilising gelatine, no artificial coffee flavouring. The tiramisù is prepared every morning and served the same day. The patience of two hours in the refrigerator makes the difference between a good and an exceptional dessert.`,
    },
  },
]

const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]))

export function getPostBySlug(slug: string) {
  return bySlug.get(slug)
}
