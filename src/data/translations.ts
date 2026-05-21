import type { Lang } from '../types'

export type UiKey =
  | 'brand.tagline'
  | 'nav.menu'
  | 'nav.events'
  | 'nav.about'
  | 'nav.contacts'
  | 'nav.order'
  | 'hero.welcome'
  | 'hero.title'
  | 'hero.sub'
  | 'hero.menuCta'
  | 'hero.orderCta'
  | 'promo.pizza.title'
  | 'promo.pizza.text'
  | 'promo.pizza.cta'
  | 'promo.pasta.title'
  | 'promo.pasta.text'
  | 'promo.pasta.cta'
  | 'promo.starters.title'
  | 'promo.starters.text'
  | 'promo.starters.cta'
  | 'promo.bar.title'
  | 'promo.bar.text'
  | 'promo.bar.cta'
  | 'about.title'
  | 'about.text'
  | 'about.reserve'
  | 'about.contact'
  | 'featured.title'
  | 'featured.sub'
  | 'featured.order'
  | 'featured.menu'
  | 'banner.carousel.label'
  | 'banner.carousel.prev'
  | 'banner.carousel.next'
  | 'delivery.title'
  | 'delivery.text'
  | 'delivery.hours'
  | 'gallery.title'
  | 'gallery.eyebrow'
  | 'gallery.sub'
  | 'footer.onlineMenu'
  | 'footer.info'
  | 'footer.allergens'
  | 'footer.privacy'
  | 'footer.terms'
  | 'footer.partner'
  | 'footer.hoursLabel'
  | 'menu.title'
  | 'menu.sub'
  | 'menu.add'
  | 'menu.currency'
  | 'cart.title'
  | 'cart.empty'
  | 'cart.total'
  | 'cart.checkout'
  | 'cart.continue'
  | 'cart.remove'
  | 'favorites.title'
  | 'favorites.empty'
  | 'favorites.browseMenu'
  | 'favorites.remove'
  | 'favorites.itemOne'
  | 'favorites.itemMany'
  | 'contacts.title'
  | 'contacts.sub'
  | 'contacts.section.locations'
  | 'contacts.section.contacts'
  | 'contacts.address'
  | 'contacts.phone'
  | 'contacts.email'
  | 'contacts.hours.label'
  | 'contacts.phone.label'
  | 'contacts.email.label'
  | 'contacts.address.label'
  | 'contacts.form.name'
  | 'contacts.form.send'
  | 'about.page.title'
  | 'about.page.p1'
  | 'about.page.p2'
  | 'about.page.chef'
  | 'about.page.mission.label'
  | 'about.page.team.title'
  | 'about.page.team.sub'
  | 'about.page.food.title'
  | 'aria.openMenu'
  | 'aria.closeCart'
  | 'aria.lang'
  | 'nav.builder'
  | 'builder.title'
  | 'builder.sub'
  | 'builder.step.dough'
  | 'builder.step.sauce'
  | 'builder.step.toppings'
  | 'builder.next'
  | 'builder.back'
  | 'builder.addToCart'
  | 'builder.total'
  | 'builder.custom'
  | 'builder.toppings.hint'
  | 'builder.preview.empty'
  | 'builder.reset'
  | 'builder.added'
  | 'builder.adding'
  | 'builder.loading'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.username'
  | 'auth.email'
  | 'auth.password'
  | 'auth.login.title'
  | 'auth.login.submit'
  | 'auth.login.noAccount'
  | 'auth.login.register'
  | 'auth.register.title'
  | 'auth.register.confirm'
  | 'auth.register.submit'
  | 'auth.register.hasAccount'
  | 'auth.register.login'
  | 'auth.register.mismatch'
  | 'account.title'
  | 'account.tab.profile'
  | 'account.tab.favorites'
  | 'account.tab.orders'
  | 'account.profile.name'
  | 'account.profile.email'
  | 'account.profile.password'
  | 'account.profile.newPassword'
  | 'account.profile.confirmPassword'
  | 'account.profile.save'
  | 'account.profile.saved'
  | 'account.orders.empty'
  | 'account.orders.order'
  | 'account.orders.date'
  | 'account.orders.total'
  | 'account.orders.status'
  | 'account.orders.status.delivered'
  | 'account.orders.status.preparing'
  | 'account.orders.items'
  | 'account.nav'
  | 'account.tab.security'
  | 'account.security.title'
  | 'account.security.currentPassword'
  | 'account.security.newPassword'
  | 'account.security.confirmPassword'
  | 'account.security.save'
  | 'account.security.saved'
  | 'account.security.mismatch'
  | 'menu.search.placeholder'
  | 'menu.filter.price'
  | 'menu.filter.priceAsc'
  | 'menu.filter.priceDesc'
  | 'menu.filter.nameAsc'
  | 'menu.filter.nameDesc'
  | 'menu.filter.allergens'
  | 'menu.filter.noResults'
  | 'menu.filter.clearAll'
  | 'menu.loading'
  | 'legal.privacy.title'
  | 'legal.privacy.updated'
  | 'legal.privacy.intro'
  | 'legal.privacy.s1.title'
  | 'legal.privacy.s1.text'
  | 'legal.privacy.s2.title'
  | 'legal.privacy.s2.text'
  | 'legal.privacy.s3.title'
  | 'legal.privacy.s3.text'
  | 'legal.privacy.s4.title'
  | 'legal.privacy.s4.text'
  | 'legal.privacy.s5.title'
  | 'legal.privacy.s5.text'
  | 'legal.terms.title'
  | 'legal.terms.updated'
  | 'legal.terms.intro'
  | 'legal.terms.s1.title'
  | 'legal.terms.s1.text'
  | 'legal.terms.s2.title'
  | 'legal.terms.s2.text'
  | 'legal.terms.s3.title'
  | 'legal.terms.s3.text'
  | 'legal.terms.s4.title'
  | 'legal.terms.s4.text'
  | 'legal.terms.s5.title'
  | 'legal.terms.s5.text'
  | 'allergen.gluten'
  | 'allergen.dairy'
  | 'allergen.eggs'
  | 'allergen.fish'
  | 'allergen.nuts'
  | 'allergen.soy'
  | 'allergen.alcohol'
  | 'nav.blog'
  | 'blog.title'
  | 'blog.sub'
  | 'blog.readMore'
  | 'blog.back'
  | 'blog.notFound'
  | 'checkout.title'
  | 'checkout.form.title'
  | 'checkout.form.firstName'
  | 'checkout.form.lastName'
  | 'checkout.form.phone'
  | 'checkout.form.email'
  | 'checkout.form.district'
  | 'checkout.form.address'
  | 'checkout.form.notes'
  | 'checkout.payment.title'
  | 'checkout.payment.cash'
  | 'checkout.payment.card'
  | 'checkout.payment.change'
  | 'checkout.payment.cardType'
  | 'checkout.summary.title'
  | 'checkout.summary.subtotal'
  | 'checkout.summary.delivery'
  | 'checkout.summary.deliveryFree'
  | 'checkout.summary.discount'
  | 'checkout.summary.total'
  | 'checkout.promo.label'
  | 'checkout.promo.placeholder'
  | 'checkout.promo.apply'
  | 'checkout.promo.applied'
  | 'checkout.promo.invalid'
  | 'checkout.promo.loginHint'
  | 'checkout.promo.notFound'
  | 'checkout.promo.inactive'
  | 'checkout.promo.expired'
  | 'checkout.promo.used'
  | 'checkout.submit'
  | 'checkout.error.generic'
  | 'checkout.error.invalidItems'
  | 'checkout.terms'
  | 'checkout.deliveryNote'
  | 'order.success.title'
  | 'order.success.titleWithId'
  | 'order.success.sub'
  | 'order.success.back'
  | 'order.success.account'
  | 'order.status.new'
  | 'order.status.process'
  | 'order.status.done'
  | 'order.status.cancel'
  | 'nav.reviews'
  | 'reviews.title'
  | 'reviews.sub'
  | 'reviews.write.title'
  | 'reviews.write.rating'
  | 'reviews.write.placeholder'
  | 'reviews.write.submit'
  | 'reviews.write.submitted'
  | 'reviews.write.loginPrompt'
  | 'reviews.write.loginLink'
  | 'reviews.list.title'
  | 'reviews.list.empty'
  | 'reviews.list.loading'
  | 'reviews.list.error'
  | 'reviews.star'
  | 'reviews.stars'

const UI: Record<UiKey, Record<Lang, string>> = {
  'brand.tagline': {
    ro: 'Unde trăiește gustul Italiei',
    ru: 'Там, где живёт вкус Италии',
    en: 'Where the taste of Italy lives',
  },
  'nav.menu': { ro: 'Meniu', ru: 'Меню', en: 'Menu' },
  'nav.events': { ro: 'Evenimente', ru: 'События', en: 'Events' },
  'nav.about': { ro: 'Despre noi', ru: 'О нас', en: 'About' },
  'nav.contacts': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'nav.order': { ro: 'Comandă online', ru: 'Заказать онлайн', en: 'Order online' },
  'hero.welcome': {
    ro: 'Bine ați venit la',
    ru: 'Добро пожаловать в',
    en: 'Welcome to',
  },
  'hero.title': { ro: 'Papa Mia', ru: 'Papa Mia', en: 'Papa Mia' },
  'hero.sub': {
    ro: 'Aromele Italiei la masa ta — pizza autentică, preparată cu pasiune și ingrediente alese.',
    ru: 'Вкусы Италии — у тебя на столе. Настоящая пицца, приготовленная с душой и лучшими ингредиентами.',
    en: 'The flavours of Italy at your table — authentic pizza, made with passion and the finest ingredients.',
  },
  'hero.menuCta': { ro: 'Meniu restaurant', ru: 'Меню ресторана', en: 'Restaurant menu' },
  'hero.orderCta': { ro: 'Comandă acum', ru: 'Заказать сейчас', en: 'Order now' },
  'promo.pizza.title': { ro: 'Pizza', ru: 'Пицца', en: 'Pizza' },
  'promo.pizza.text': {
    ro: 'Coajă crocantă, sos de roșii San Marzano și mozzarella di bufala.',
    ru: 'Хрустящая корка, соус из томатов Сан-Марцано и моцарелла ди буфала.',
    en: 'Crisp crust, San Marzano tomato sauce, and bufala mozzarella.',
  },
  'promo.pizza.cta': { ro: 'Vezi tot', ru: 'Смотреть все', en: 'See all' },
  'promo.pasta.title': { ro: 'Paste / Risotto', ru: 'Паста / Ризотто', en: 'Pasta / Risotto' },
  'promo.pasta.text': {
    ro: 'Rețete clasice, unt de casă și parmigiano grattugiato la masă.',
    ru: 'Классические рецепты, домашнее масло и пармезан у стола.',
    en: 'Classic recipes, house butter, and parmesan finished at the table.',
  },
  'promo.pasta.cta': { ro: 'Vezi tot', ru: 'Смотреть все', en: 'See all' },
  'promo.starters.title': { ro: 'Antipasti', ru: 'Закуски', en: 'Starters' },
  'promo.starters.text': {
    ro: 'Deschideți masa cu arome delicate și ingrediente de sezon.',
    ru: 'Начните трапезу с нежных нот и сезонных продуктов.',
    en: 'Open the meal with delicate notes and seasonal ingredients.',
  },
  'promo.starters.cta': { ro: 'Vezi tot', ru: 'Смотреть все', en: 'See all' },
  'promo.bar.title': { ro: 'Bar', ru: 'Бар', en: 'Bar' },
  'promo.bar.text': {
    ro: 'Cocktail-uri italiene, spritz și selecție de vinuri.',
    ru: 'Итальянские коктейли, шприц и подборка вин.',
    en: 'Italian cocktails, spritz, and a curated wine list.',
  },
  'promo.bar.cta': { ro: 'Vezi tot', ru: 'Смотреть все', en: 'See all' },
  'about.title': { ro: 'Construiește pizza ta', ru: 'Собери свою пиццу', en: 'Build your own pizza' },
  'about.text': {
    ro: 'Alege aluatul, sosul și ingredientele preferate — și noi o coacem în cuptorul cu lemn. Fiecare pizza este unică, la fel ca tine.',
    ru: 'Выбери тесто, соус и любимые начинки — мы испечём её в дровяной печи. Каждая пицца уникальна, как и ты.',
    en: 'Choose your dough, sauce, and favourite toppings — we bake it in our wood-fired oven. Every pizza is unique, just like you.',
  },
  'about.reserve': { ro: 'Construiește acum', ru: 'Собрать сейчас', en: 'Build now' },
  'about.contact': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'featured.title': {
    ro: 'Recomandări',
    ru: 'Мы рекомендуем',
    en: 'We recommend',
  },
  'featured.sub': {
    ro: 'Cel mai bun sezon',
    ru: 'Лучшее в сезоне',
    en: 'Best of the season',
  },
  'featured.order': {
    ro: 'Comandă acum',
    ru: 'Заказать сейчас',
    en: 'Order now',
  },
  'featured.menu': {
    ro: 'Vezi meniul',
    ru: 'Смотреть меню',
    en: 'View menu',
  },
  'banner.carousel.label': {
    ro: 'Promoții',
    ru: 'Акции',
    en: 'Promotions',
  },
  'banner.carousel.prev': { ro: 'Slide anterior', ru: 'Предыдущий слайд', en: 'Previous slide' },
  'banner.carousel.next': { ro: 'Slide următor', ru: 'Следующий слайд', en: 'Next slide' },
  'delivery.title': {
    ro: 'Livrare în Chișinău și împrejurimi',
    ru: 'Доставка по Кишинёву и пригородам',
    en: 'Delivery in Chișinău and suburbs',
  },
  'delivery.text': {
    ro: 'Comenzi peste 500 MDL — livrare gratuită. Timp mediu 35–50 minute.',
    ru: 'Заказы от 500 MDL — бесплатная доставка. Среднее время 35–50 минут.',
    en: 'Orders over 500 MDL — free delivery. Typical time 35–50 minutes.',
  },
  'delivery.hours': {
    ro: 'Zilnic 10:00–22:00',
    ru: 'Ежедневно 10:00–22:00',
    en: 'Daily 10:00–22:00',
  },
  'gallery.title': { ro: 'Interior', ru: 'Интерьер', en: 'Interior' },
  'gallery.eyebrow': {
    ro: 'Atmosferă',
    ru: 'Атмосфера',
    en: 'Atmosphere',
  },
  'gallery.sub': {
    ro: 'Lemn, lumânări și aroma Italiei — exact ca într-o trattorie din Napoli.',
    ru: 'Дерево, свечи и аромат Италии — как в настоящей траттории Неаполя.',
    en: 'Wood, candlelight, and the scent of Italy — like a trattoria in Naples.',
  },
  'footer.onlineMenu': { ro: 'Meniu online', ru: 'Онлайн-меню', en: 'Online menu' },
  'footer.info': { ro: 'Informații', ru: 'Информация', en: 'Information' },
  'footer.allergens': { ro: 'Alergeni', ru: 'Аллергены', en: 'Allergens' },
  'footer.privacy': { ro: 'Confidențialitate', ru: 'Конфиденциальность', en: 'Privacy' },
  'footer.terms': { ro: 'Termeni', ru: 'Условия', en: 'Terms' },
  'footer.partner': { ro: 'Partener principal', ru: 'Основной партнёр', en: 'Main partner' },
  'footer.hoursLabel': { ro: 'Program', ru: 'Часы работы', en: 'Hours' },
  'menu.title': { ro: 'Meniu', ru: 'Меню', en: 'Menu' },
  'menu.sub': {
    ro: 'Alege categoria și adaugă în coș — rapid și clar.',
    ru: 'Выберите категорию и добавьте в корзину — быстро и понятно.',
    en: 'Pick a category and add to cart — fast and clear.',
  },
  'menu.add': { ro: 'În coș', ru: 'В корзину', en: 'Add to cart' },
  'menu.currency': { ro: 'MDL', ru: 'MDL', en: 'MDL' },
  'cart.title': { ro: 'Coș', ru: 'Корзина', en: 'Cart' },
  'cart.empty': {
    ro: 'Coșul este gol. Explorează meniul!',
    ru: 'Корзина пуста. Загляните в меню!',
    en: 'Your cart is empty. Browse the menu!',
  },
  'cart.total': { ro: 'Total', ru: 'Итого', en: 'Total' },
  'cart.checkout': { ro: 'Finalizează', ru: 'Оформить', en: 'Checkout' },
  'cart.continue': { ro: 'Continuă cumpărăturile', ru: 'Продолжить покупки', en: 'Continue shopping' },
  'cart.remove': { ro: 'Elimină', ru: 'Удалить', en: 'Remove' },
  'favorites.title': { ro: 'Favorite', ru: 'Избранное', en: 'Wishlist' },
  'favorites.empty': {
    ro: 'Nu ai încă preparate favorite. Explorează meniul și apasă ♥ pe produsele preferate.',
    ru: 'Пока нет избранных блюд. Откройте меню и нажмите ♥ на понравившихся позициях.',
    en: 'No favourites yet. Browse the menu and tap ♥ on dishes you love.',
  },
  'favorites.browseMenu': {
    ro: 'Vezi meniul',
    ru: 'Смотреть меню',
    en: 'View menu',
  },
  'favorites.remove': { ro: 'Elimină din favorite', ru: 'Убрать из избранного', en: 'Remove from wishlist' },
  'favorites.itemOne': { ro: 'preparat', ru: 'блюдо', en: 'dish' },
  'favorites.itemMany': { ro: 'preparate', ru: 'блюда', en: 'dishes' },
  'contacts.title': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'contacts.section.locations': { ro: 'Locații', ru: 'Локации', en: 'Locations' },
  'contacts.section.contacts': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'contacts.address': {
    ro: 'Chișinău, str. Ștefan cel Mare 65',
    ru: 'Кишинёв, ул. Штефан чел Маре 65',
    en: 'Chișinău, Ștefan cel Mare St. 65',
  },
  'contacts.phone': { ro: '+373 22 000 002', ru: '+373 22 000 002', en: '+373 22 000 002' },
  'contacts.email': { ro: 'hello@papamia.md', ru: 'hello@papamia.md', en: 'hello@papamia.md' },
  'contacts.sub': {
    ro: 'Găsește-ne în Chișinău',
    ru: 'Найдите нас в Кишинёве',
    en: 'Find us in Chișinău',
  },
  'contacts.hours.label': { ro: 'Program', ru: 'Часы работы', en: 'Hours' },
  'contacts.phone.label': { ro: 'Telefon', ru: 'Телефон', en: 'Phone' },
  'contacts.email.label': { ro: 'Email', ru: 'Email', en: 'Email' },
  'contacts.address.label': { ro: 'Adresă', ru: 'Адрес', en: 'Address' },
  'contacts.form.name': { ro: 'Nume', ru: 'Имя', en: 'Name' },
  'contacts.form.send': { ro: 'Trimite', ru: 'Отправить', en: 'Send' },
  'about.page.title': { ro: 'Povestea noastră', ru: 'Наша история', en: 'Our story' },
  'about.page.p1': {
    ro: 'Papa Mia s-a născut dintr-o dorință simplă: să aducem o bucățică din Roma la voi. Nu o interpretare, nu o adaptare — ci autenticitatea în starea ei pură. Mirosul aluatului dospit 48 de ore, căldura cuptorului cu lemn, gestul lent al unui bucătar care știe că graba strică totul. Credem că mâncarea bună este un act de respect — față de ingredient, față de tradiție și față de omul care stă la masă.',
    ru: 'Papa Mia родился из простого желания: привезти кусочек Рима к вам. Не интерпретацию, не адаптацию — а подлинность в чистом виде. Запах теста, выдержанного 48 часов, тепло дровяной печи, неспешный жест повара, который знает: торопливость всё портит. Мы верим, что хорошая еда — это акт уважения: к ингредиенту, к традиции и к человеку за столом.',
    en: 'Papa Mia was born from a simple desire: to bring a piece of Rome to you. Not an interpretation, not an adaptation — but authenticity in its purest form. The scent of 48-hour dough, the warmth of a wood-fired oven, the unhurried gesture of a cook who knows that rushing ruins everything. We believe good food is an act of respect — for the ingredient, for tradition, and for the person at the table.',
  },
  'about.page.p2': {
    ro: 'Fiecare rețetă pe care o servim a trecut prin mâinile a cel puțin două generații. Mozzarella di bufala sosește proaspătă în fiecare săptămână, roșiile San Marzano sunt singurele pe care le folosim, iar aluatul nu se grăbește niciodată. Aceasta nu este filozofie de marketing — este pur și simplu modul în care familia noastră a gătit dintotdeauna.',
    ru: 'Каждый рецепт, который мы подаём, прошёл через руки как минимум двух поколений. Моцарелла ди буфала приезжает свежей каждую неделю, томаты Сан-Марцано — единственные, что мы используем, а тесто никогда не торопится. Это не маркетинговая философия — это просто то, как наша семья готовила всегда.',
    en: 'Every recipe we serve has passed through the hands of at least two generations. Bufala mozzarella arrives fresh every week, San Marzano tomatoes are the only ones we use, and the dough is never rushed. This is not a marketing philosophy — it is simply the way our family has always cooked.',
  },
  'about.page.chef': {
    ro: '— Chef Antonio, Napoli',
    ru: '— Шеф Антонио, Неаполь',
    en: '— Chef Antonio, Naples',
  },
  'about.page.mission.label': {
    ro: 'Misiunea noastră',
    ru: 'Наша миссия',
    en: 'Our mission',
  },
  'about.page.team.title': {
    ro: 'Oamenii din spatele bucătăriei',
    ru: 'Люди за кухней',
    en: 'The people behind the kitchen',
  },
  'about.page.team.sub': {
    ro: 'Echipa noastră aduce cu sine ani de practică în Italia și dragostea sinceră pentru meșteșug.',
    ru: 'Наша команда несёт годы практики в Италии и искреннюю любовь к ремеслу.',
    en: 'Our team brings years of practice in Italy and a genuine love for the craft.',
  },
  'about.page.food.title': {
    ro: 'Simplitate. Prospețime. Pasiune.',
    ru: 'Простота. Свежесть. Страсть.',
    en: 'Simplicity. Freshness. Passion.',
  },
  'aria.openMenu': { ro: 'Deschide meniul', ru: 'Открыть меню', en: 'Open menu' },
  'aria.closeCart': { ro: 'Închide coșul', ru: 'Закрыть корзину', en: 'Close cart' },
  'aria.lang': { ro: 'Limbă', ru: 'Язык', en: 'Language' },
  'nav.builder': { ro: 'Constructor', ru: 'Конструктор', en: 'Pizza builder' },
  'builder.title': { ro: 'Constructor de pizza', ru: 'Конструктор пиццы', en: 'Pizza builder' },
  'builder.sub': {
    ro: 'Compune pizza ta pas cu pas',
    ru: 'Собери свою пиццу шаг за шагом',
    en: 'Build your pizza step by step',
  },
  'builder.step.dough': { ro: 'Alege aluatul', ru: 'Выберите тесто', en: 'Choose dough' },
  'builder.step.sauce': { ro: 'Alege sosul', ru: 'Выберите соус', en: 'Choose sauce' },
  'builder.step.toppings': { ro: 'Adaugă ingrediente', ru: 'Добавьте начинки', en: 'Add toppings' },
  'builder.next': { ro: 'Înainte', ru: 'Далее', en: 'Next' },
  'builder.back': { ro: 'Înapoi', ru: 'Назад', en: 'Back' },
  'builder.addToCart': { ro: 'Adaugă în coș', ru: 'Добавить в корзину', en: 'Add to cart' },
  'builder.total': { ro: 'Total', ru: 'Итого', en: 'Total' },
  'builder.custom': { ro: 'Pizza personalizată', ru: 'Своя пицца', en: 'Custom pizza' },
  'builder.toppings.hint': {
    ro: 'Poți alege mai multe ingrediente',
    ru: 'Можно выбрать несколько начинок',
    en: 'You can select multiple toppings',
  },
  'builder.preview.empty': {
    ro: 'Alege aluatul pentru a începe',
    ru: 'Выберите тесто, чтобы начать',
    en: 'Choose dough to start',
  },
  'builder.reset': { ro: 'Resetează', ru: 'Сбросить', en: 'Start over' },
  'builder.added': {
    ro: 'Adăugat în coș',
    ru: 'Добавлено в корзину',
    en: 'Added to cart',
  },
  'builder.adding': { ro: 'Se adaugă…', ru: 'Добавляем…', en: 'Adding…' },
  'builder.loading': { ro: 'Se încarcă…', ru: 'Загрузка…', en: 'Loading…' },
  'auth.login': { ro: 'Conectare', ru: 'Войти', en: 'Sign in' },
  'auth.logout': { ro: 'Ieșire', ru: 'Выйти', en: 'Sign out' },
  'auth.username': { ro: 'Nume de utilizator', ru: 'Имя пользователя', en: 'Username' },
  'auth.email': { ro: 'E-mail', ru: 'Электронная почта', en: 'Email' },
  'auth.password': { ro: 'Parolă', ru: 'Пароль', en: 'Password' },
  'auth.login.title': { ro: 'Conectare', ru: 'Вход', en: 'Sign in' },
  'auth.login.submit': { ro: 'Intră în cont', ru: 'Войти', en: 'Sign in' },
  'auth.login.noAccount': { ro: 'Nu ai cont?', ru: 'Нет аккаунта?', en: 'No account?' },
  'auth.login.register': { ro: 'Înregistrează-te', ru: 'Зарегистрируйтесь', en: 'Register' },
  'auth.register.title': { ro: 'Înregistrare', ru: 'Регистрация', en: 'Register' },
  'auth.register.confirm': { ro: 'Repetă parola', ru: 'Повторите пароль', en: 'Confirm password' },
  'auth.register.submit': { ro: 'Creează cont', ru: 'Зарегистрироваться', en: 'Create account' },
  'auth.register.hasAccount': { ro: 'Ai deja cont?', ru: 'Уже есть аккаунт?', en: 'Already have an account?' },
  'auth.register.login': { ro: 'Conectează-te', ru: 'Войти', en: 'Sign in' },
  'auth.register.mismatch': { ro: 'Parolele nu coincid', ru: 'Пароли не совпадают', en: 'Passwords do not match' },
  'account.title': { ro: 'Contul meu', ru: 'Личный кабинет', en: 'My account' },
  'account.tab.profile': { ro: 'Profil', ru: 'Профиль', en: 'Profile' },
  'account.tab.favorites': { ro: 'Favorite', ru: 'Избранное', en: 'Favourites' },
  'account.tab.orders': { ro: 'Comenzi', ru: 'История заказов', en: 'Order history' },
  'account.profile.name': { ro: 'Nume', ru: 'Имя', en: 'Name' },
  'account.profile.email': { ro: 'E-mail', ru: 'Электронная почта', en: 'Email' },
  'account.profile.password': { ro: 'Parolă curentă', ru: 'Текущий пароль', en: 'Current password' },
  'account.profile.newPassword': { ro: 'Parolă nouă', ru: 'Новый пароль', en: 'New password' },
  'account.profile.confirmPassword': { ro: 'Confirmă parola nouă', ru: 'Подтвердите новый пароль', en: 'Confirm new password' },
  'account.profile.save': { ro: 'Salvează', ru: 'Сохранить', en: 'Save changes' },
  'account.profile.saved': { ro: 'Salvat!', ru: 'Сохранено!', en: 'Saved!' },
  'account.orders.empty': { ro: 'Nu ai comenzi încă.', ru: 'Заказов пока нет.', en: 'No orders yet.' },
  'account.orders.order': { ro: 'Comanda', ru: 'Заказ', en: 'Order' },
  'account.orders.date': { ro: 'Data', ru: 'Дата', en: 'Date' },
  'account.orders.total': { ro: 'Total', ru: 'Итого', en: 'Total' },
  'account.orders.status': { ro: 'Status', ru: 'Статус', en: 'Status' },
  'account.orders.status.delivered': { ro: 'Livrat', ru: 'Доставлен', en: 'Delivered' },
  'account.orders.status.preparing': { ro: 'În pregătire', ru: 'Готовится', en: 'Preparing' },
  'account.orders.items': { ro: 'produse', ru: 'позиции', en: 'items' },
  'account.nav': { ro: 'Contul meu', ru: 'Личный кабинет', en: 'My account' },
  'account.tab.security': { ro: 'Securitate', ru: 'Безопасность', en: 'Security' },
  'account.security.title': { ro: 'Schimbă parola', ru: 'Изменение пароля', en: 'Change password' },
  'account.security.currentPassword': { ro: 'Parola curentă', ru: 'Текущий пароль', en: 'Current password' },
  'account.security.newPassword': { ro: 'Parolă nouă', ru: 'Новый пароль', en: 'New password' },
  'account.security.confirmPassword': { ro: 'Confirmă parola nouă', ru: 'Подтвердите новый пароль', en: 'Confirm new password' },
  'account.security.save': { ro: 'Salvează parola', ru: 'Сохранить пароль', en: 'Save password' },
  'account.security.saved': { ro: 'Salvat!', ru: 'Сохранено!', en: 'Saved!' },
  'account.security.mismatch': { ro: 'Parolele nu coincid', ru: 'Пароли не совпадают', en: 'Passwords do not match' },
  'menu.search.placeholder': { ro: 'Caută în meniu...', ru: 'Поиск по меню...', en: 'Search menu...' },
  'menu.filter.price': { ro: 'Sortare', ru: 'Сортировка', en: 'Sort' },
  'menu.filter.priceAsc': { ro: 'Preț: mic → mare', ru: 'Цена: по возрастанию', en: 'Price: low → high' },
  'menu.filter.priceDesc': { ro: 'Preț: mare → mic', ru: 'Цена: по убыванию', en: 'Price: high → low' },
  'menu.filter.nameAsc': { ro: 'Nume: A → Z', ru: 'Название: А → Я', en: 'Name: A → Z' },
  'menu.filter.nameDesc': { ro: 'Nume: Z → A', ru: 'Название: Я → А', en: 'Name: Z → A' },
  'menu.filter.allergens': { ro: 'Exclude alergeni', ru: 'Исключить аллергены', en: 'Exclude allergens' },
  'menu.filter.noResults': { ro: 'Niciun produs găsit.', ru: 'Ничего не найдено.', en: 'No items found.' },
  'menu.filter.clearAll': { ro: 'Resetează', ru: 'Сбросить', en: 'Clear all' },
  'menu.loading': { ro: 'Se actualizează meniul…', ru: 'Обновляем меню…', en: 'Updating menu…' },
  'legal.privacy.title': { ro: 'Politica de confidențialitate', ru: 'Политика конфиденциальности', en: 'Privacy Policy' },
  'legal.privacy.updated': { ro: 'Ultima actualizare: mai 2026', ru: 'Последнее обновление: май 2026', en: 'Last updated: May 2026' },
  'legal.privacy.intro': {
    ro: 'Papa Mia respectă confidențialitatea vizitatorilor site-ului și a clienților. Această pagină explică ce date colectăm, de ce le folosim și cum le protejăm.',
    ru: 'Papa Mia уважает конфиденциальность посетителей сайта и клиентов. На этой странице описано, какие данные мы собираем, зачем они нужны и как мы их защищаем.',
    en: 'Papa Mia respects the privacy of website visitors and customers. This page explains what data we collect, why we use it, and how we protect it.',
  },
  'legal.privacy.s1.title': { ro: 'Ce date colectăm', ru: 'Какие данные мы собираем', en: 'What data we collect' },
  'legal.privacy.s1.text': {
    ro: 'Putem prelucra numele, adresa de e-mail, numărul de telefon, adresa de livrare, istoricul comenzilor și preferințele indicate la plasarea comenzii sau crearea contului.',
    ru: 'Мы можем обрабатывать имя, адрес электронной почты, номер телефона, адрес доставки, историю заказов и предпочтения, указанные при оформлении заказа или регистрации.',
    en: 'We may process your name, email address, phone number, delivery address, order history, and preferences provided when placing an order or creating an account.',
  },
  'legal.privacy.s2.title': { ro: 'Cum folosim datele', ru: 'Как мы используем данные', en: 'How we use data' },
  'legal.privacy.s2.text': {
    ro: 'Datele sunt folosite pentru procesarea comenzilor, livrare, comunicarea cu clientul, îmbunătățirea serviciului și, cu acordul dvs., pentru informări despre promoții.',
    ru: 'Данные используются для обработки заказов, доставки, связи с клиентом, улучшения сервиса и — с вашего согласия — для информации об акциях.',
    en: 'Data is used to process orders, arrange delivery, communicate with you, improve our service, and—with your consent—for promotional updates.',
  },
  'legal.privacy.s3.title': { ro: 'Stocare și securitate', ru: 'Хранение и безопасность', en: 'Storage and security' },
  'legal.privacy.s3.text': {
    ro: 'Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele împotriva accesului neautorizat, pierderii sau divulgării.',
    ru: 'Мы применяем разумные технические и организационные меры для защиты данных от несанкционированного доступа, утраты или разглашения.',
    en: 'We apply reasonable technical and organizational measures to protect data against unauthorized access, loss, or disclosure.',
  },
  'legal.privacy.s4.title': { ro: 'Partajarea datelor', ru: 'Передача данных', en: 'Sharing data' },
  'legal.privacy.s4.text': {
    ro: 'Nu vindem datele personale. Le putem transmite doar partenerilor implicați în livrare sau procesarea plăților, în măsura necesară executării comenzii.',
    ru: 'Мы не продаём персональные данные. Мы можем передавать их только партнёрам, участвующим в доставке или обработке платежей, в объёме, необходимом для выполнения заказа.',
    en: 'We do not sell personal data. We may share it only with partners involved in delivery or payment processing, to the extent required to fulfill your order.',
  },
  'legal.privacy.s5.title': { ro: 'Contact', ru: 'Контакты', en: 'Contact' },
  'legal.privacy.s5.text': {
    ro: 'Pentru întrebări privind confidențialitatea, ne puteți contacta prin formularul de pe pagina Contacte sau la adresa indicată acolo.',
    ru: 'По вопросам конфиденциальности вы можете связаться с нами через форму на странице «Контакты» или по указанным там реквизитам.',
    en: 'For privacy-related questions, contact us via the form on the Contacts page or using the details listed there.',
  },
  'legal.terms.title': { ro: 'Termeni și condiții', ru: 'Условия использования', en: 'Terms & Conditions' },
  'legal.terms.updated': { ro: 'Ultima actualizare: mai 2026', ru: 'Последнее обновление: май 2026', en: 'Last updated: May 2026' },
  'legal.terms.intro': {
    ro: 'Prin utilizarea site-ului Papa Mia și plasarea comenzilor online, sunteți de acord cu termenii de mai jos. Vă rugăm să îi citiți înainte de a comanda.',
    ru: 'Используя сайт Papa Mia и оформляя заказы онлайн, вы соглашаетесь с условиями ниже. Пожалуйста, прочитайте их перед заказом.',
    en: 'By using the Papa Mia website and placing orders online, you agree to the terms below. Please read them before ordering.',
  },
  'legal.terms.s1.title': { ro: 'Comenzi și livrare', ru: 'Заказы и доставка', en: 'Orders and delivery' },
  'legal.terms.s1.text': {
    ro: 'Comanda este confirmată după procesarea acesteia de către restaurant. Timpul de livrare este estimativ și poate varia în funcție de încărcare și condițiile externe.',
    ru: 'Заказ считается подтверждённым после его обработки рестораном. Срок доставки является ориентировочным и может меняться в зависимости от загрузки и внешних условий.',
    en: 'An order is confirmed once processed by the restaurant. Delivery times are estimates and may vary depending on demand and external conditions.',
  },
  'legal.terms.s2.title': { ro: 'Prețuri și plată', ru: 'Цены и оплата', en: 'Prices and payment' },
  'legal.terms.s2.text': {
    ro: 'Prețurile afișate pe site sunt exprimate în MDL. Plata se poate efectua numerar la livrare sau cu cardul, conform opțiunilor disponibile la checkout.',
    ru: 'Цены на сайте указаны в MDL. Оплата возможна наличными при доставке или картой — в соответствии с доступными вариантами при оформлении заказа.',
    en: 'Prices shown on the site are in MDL. Payment may be made in cash on delivery or by card, according to the options available at checkout.',
  },
  'legal.terms.s3.title': { ro: 'Anulare și modificări', ru: 'Отмена и изменения', en: 'Cancellation and changes' },
  'legal.terms.s3.text': {
    ro: 'Pentru anularea sau modificarea comenzii, contactați-ne cât mai repede posibil. După ce prepararea a început, modificările pot fi limitate.',
    ru: 'Для отмены или изменения заказа свяжитесь с нами как можно скорее. После начала приготовления изменения могут быть ограничены.',
    en: 'To cancel or change an order, contact us as soon as possible. Once preparation has started, changes may be limited.',
  },
  'legal.terms.s4.title': { ro: 'Răspundere', ru: 'Ответственность', en: 'Liability' },
  'legal.terms.s4.text': {
    ro: 'Facem eforturi rezonabile pentru acuratețea informațiilor de pe site. Nu răspundem pentru întreruperi tehnice temporare sau informații furnizate incorect de utilizator.',
    ru: 'Мы стремимся поддерживать актуальность информации на сайте. Мы не несём ответственности за временные технические сбои или неверные данные, указанные пользователем.',
    en: 'We make reasonable efforts to keep site information accurate. We are not liable for temporary technical interruptions or incorrect information provided by the user.',
  },
  'legal.terms.s5.title': { ro: 'Modificări ale termenilor', ru: 'Изменение условий', en: 'Changes to terms' },
  'legal.terms.s5.text': {
    ro: 'Putem actualiza acești termeni periodic. Versiunea actuală este publicată pe această pagină; continuarea utilizării site-ului implică acceptarea modificărilor.',
    ru: 'Мы можем периодически обновлять эти условия. Актуальная версия публикуется на этой странице; продолжение использования сайта означает согласие с изменениями.',
    en: 'We may update these terms from time to time. The current version is published on this page; continued use of the site means you accept the changes.',
  },
  'allergen.gluten': { ro: 'Gluten', ru: 'Глютен', en: 'Gluten' },
  'allergen.dairy': { ro: 'Lactate', ru: 'Молочное', en: 'Dairy' },
  'allergen.eggs': { ro: 'Ouă', ru: 'Яйца', en: 'Eggs' },
  'allergen.fish': { ro: 'Pește', ru: 'Рыба', en: 'Fish' },
  'allergen.nuts': { ro: 'Nuci', ru: 'Орехи', en: 'Nuts' },
  'allergen.soy': { ro: 'Soia', ru: 'Соя', en: 'Soy' },
  'allergen.alcohol': { ro: 'Alcool', ru: 'Алкоголь', en: 'Alcohol' },
  'nav.blog': { ro: 'Blog', ru: 'Блог', en: 'Blog' },
  'blog.title': { ro: 'Blog', ru: 'Блог', en: 'Blog' },
  'blog.sub': {
    ro: 'Povești din bucătărie, ingrediente și tradiție italiană.',
    ru: 'Истории из кухни, ингредиенты и итальянские традиции.',
    en: 'Stories from the kitchen, ingredients and Italian tradition.',
  },
  'blog.readMore': { ro: 'Citește mai mult', ru: 'Читать далее', en: 'Read more' },
  'blog.back': { ro: '← Înapoi la blog', ru: '← Назад к блогу', en: '← Back to blog' },
  'blog.notFound': { ro: 'Articolul nu a fost găsit.', ru: 'Статья не найдена.', en: 'Article not found.' },

  'checkout.title': { ro: 'Finalizare comandă', ru: 'Оформление заказа', en: 'Checkout' },
  'checkout.form.title': { ro: 'Date de livrare', ru: 'Данные доставки', en: 'Delivery details' },
  'checkout.form.firstName': { ro: 'Prenume', ru: 'Имя', en: 'First name' },
  'checkout.form.lastName': { ro: 'Nume', ru: 'Фамилия', en: 'Last name' },
  'checkout.form.phone': { ro: 'Telefon', ru: 'Телефон', en: 'Phone' },
  'checkout.form.email': { ro: 'E-mail', ru: 'Электронная почта', en: 'Email' },
  'checkout.form.district': { ro: 'Sector / Raion', ru: 'Район', en: 'District' },
  'checkout.form.address': { ro: 'Adresă, apartament', ru: 'Адрес, квартира', en: 'Address, apartment' },
  'checkout.form.notes': { ro: 'Notă pentru curier (opțional)', ru: 'Примечание (необязательно)', en: 'Note for courier (optional)' },
  'checkout.payment.title': { ro: 'Metodă de plată', ru: 'Способ оплаты', en: 'Payment method' },
  'checkout.payment.cash': { ro: 'Numerar', ru: 'Наличными', en: 'Cash' },
  'checkout.payment.card': { ro: 'Card bancar', ru: 'Банковской картой', en: 'Bank card' },
  'checkout.payment.change': { ro: 'Rest de la suma (opțional)', ru: 'Сдача с суммы (необязательно)', en: 'Change from amount (optional)' },
  'checkout.payment.cardType': { ro: 'Tip card', ru: 'Тип карты', en: 'Card type' },
  'checkout.summary.title': { ro: 'Comanda ta', ru: 'Ваш заказ', en: 'Your order' },
  'checkout.summary.subtotal': { ro: 'Subtotal', ru: 'Подытог', en: 'Subtotal' },
  'checkout.summary.delivery': { ro: 'Livrare', ru: 'Доставка', en: 'Delivery' },
  'checkout.summary.deliveryFree': { ro: 'Gratuit', ru: 'Бесплатно', en: 'Free' },
  'checkout.summary.total': { ro: 'Total', ru: 'Итого', en: 'Total' },
  'checkout.summary.discount': { ro: 'Reducere', ru: 'Скидка', en: 'Discount' },
  'checkout.promo.label': { ro: 'Cod promoțional', ru: 'Промокод', en: 'Promo code' },
  'checkout.promo.placeholder': { ro: 'Introdu codul', ru: 'Введите код', en: 'Enter code' },
  'checkout.promo.apply': { ro: 'Aplică', ru: 'Применить', en: 'Apply' },
  'checkout.promo.applied': { ro: 'Reducere aplicată!', ru: 'Скидка применена!', en: 'Discount applied!' },
  'checkout.promo.invalid': { ro: 'Cod invalid', ru: 'Неверный код', en: 'Invalid code' },
  'checkout.promo.loginHint': {
    ro: 'Conectează-te pentru a aplica un cod promoțional.',
    ru: 'Войдите, чтобы применить промокод.',
    en: 'Sign in to apply a promo code.',
  },
  'checkout.promo.notFound': {
    ro: 'Codul nu a fost găsit',
    ru: 'Промокод не найден',
    en: 'Promo code not found',
  },
  'checkout.promo.inactive': {
    ro: 'Codul nu este activ',
    ru: 'Промокод неактивен',
    en: 'Promo code is inactive',
  },
  'checkout.promo.expired': {
    ro: 'Codul a expirat',
    ru: 'Срок промокода истёк',
    en: 'Promo code has expired',
  },
  'checkout.promo.used': {
    ro: 'Codul a fost deja folosit',
    ru: 'Промокод уже использован',
    en: 'Promo code already used',
  },
  'checkout.submit': { ro: 'Plasează comanda', ru: 'Оформить заказ', en: 'Place order' },
  'checkout.error.generic': {
    ro: 'Nu s-a putut plasa comanda. Încercați din nou.',
    ru: 'Не удалось оформить заказ. Попробуйте ещё раз.',
    en: 'Could not place the order. Please try again.',
  },
  'checkout.error.invalidItems': {
    ro: 'Verificați conținutul coșului — unele produse nu mai sunt disponibile.',
    ru: 'Проверьте корзину — некоторые позиции недоступны.',
    en: 'Check your cart — some items are no longer available.',
  },
  'checkout.terms': {
    ro: 'Sunt de acord cu termenii și condițiile',
    ru: 'Я согласен с условиями и положениями',
    en: 'I agree to the terms and conditions',
  },
  'checkout.deliveryNote': {
    ro: 'Comenzi peste 500 MDL — livrare gratuită',
    ru: 'При заказе от 500 MDL — доставка бесплатно',
    en: 'Orders over 500 MDL — free delivery',
  },
  'order.success.title': { ro: 'Comanda plasată!', ru: 'Заказ оформлен!', en: 'Order placed!' },
  'order.success.titleWithId': {
    ro: 'Comanda #{id} a fost plasată!',
    ru: 'Заказ #{id} оформлен!',
    en: 'Order #{id} placed!',
  },
  'order.success.sub': {
    ro: 'Mulțumim! Curierii noștri vor livra în 35–50 de minute.',
    ru: 'Спасибо! Курьер доставит ваш заказ за 35–50 минут.',
    en: 'Thank you! Your order will be delivered in 35–50 minutes.',
  },
  'order.success.back': { ro: 'Înapoi la meniu', ru: 'Вернуться в меню', en: 'Back to menu' },
  'order.success.account': { ro: 'Contul meu', ru: 'Мой аккаунт', en: 'My account' },
  'order.status.new': { ro: 'Nou', ru: 'Новый', en: 'New' },
  'order.status.process': { ro: 'În lucru', ru: 'В обработке', en: 'Processing' },
  'order.status.done': { ro: 'Finalizat', ru: 'Выполнен', en: 'Completed' },
  'order.status.cancel': { ro: 'Anulat', ru: 'Отменён', en: 'Cancelled' },

  'nav.reviews': { ro: 'Recenzii', ru: 'Отзывы', en: 'Reviews' },
  'reviews.title': { ro: 'Recenzii', ru: 'Отзывы', en: 'Reviews' },
  'reviews.sub': {
    ro: 'Părerile clienților noștri — sincere și nefiltrate.',
    ru: 'Мнения наших гостей — честные и нефильтрованные.',
    en: 'Our guests\' opinions — honest and unfiltered.',
  },
  'reviews.write.title': { ro: 'Lasă o recenzie', ru: 'Оставить отзыв', en: 'Write a review' },
  'reviews.write.rating': { ro: 'Evaluare', ru: 'Оценка', en: 'Rating' },
  'reviews.write.placeholder': {
    ro: 'Împărtășește experiența ta...',
    ru: 'Поделитесь своим впечатлением...',
    en: 'Share your experience...',
  },
  'reviews.write.submit': { ro: 'Trimite recenzia', ru: 'Отправить отзыв', en: 'Submit review' },
  'reviews.write.submitted': {
    ro: 'Recenzia ta a fost trimisă!',
    ru: 'Ваш отзыв отправлен!',
    en: 'Your review has been submitted!',
  },
  'reviews.write.loginPrompt': {
    ro: 'Pentru a lăsa o recenzie, te rugăm să',
    ru: 'Чтобы оставить отзыв, пожалуйста,',
    en: 'To write a review, please',
  },
  'reviews.write.loginLink': { ro: 'te conectezi', ru: 'войдите в аккаунт', en: 'sign in' },
  'reviews.list.title': { ro: 'Toate recenziile', ru: 'Все отзывы', en: 'All reviews' },
  'reviews.list.empty': {
    ro: 'Nu există recenzii încă. Fii primul!',
    ru: 'Отзывов пока нет. Будьте первым!',
    en: 'No reviews yet. Be the first!',
  },
  'reviews.list.loading': { ro: 'Se încarcă...', ru: 'Загрузка...', en: 'Loading...' },
  'reviews.list.error': {
    ro: 'Nu s-au putut încărca recenziile.',
    ru: 'Не удалось загрузить отзывы.',
    en: 'Could not load reviews.',
  },
  'reviews.star': { ro: 'stea', ru: 'звезда', en: 'star' },
  'reviews.stars': { ro: 'stele', ru: 'звёзд', en: 'stars' },
}

export function translate(lang: Lang, key: UiKey) {
  return UI[key][lang]
}
