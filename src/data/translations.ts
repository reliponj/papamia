import type { Lang, MenuCategory } from '../types'

export const CATEGORY_LABELS: Record<MenuCategory, Record<Lang, string>> = {
  pizza: { ro: 'Pizza', ru: 'Пицца', en: 'Pizza' },
  pinsa: { ro: 'Pinsa', ru: 'Пинса', en: 'Pinsa' },
  antipasti: { ro: 'Antipasti', ru: 'Закуски', en: 'Starters' },
  pasta: { ro: 'Paste / Risotto', ru: 'Паста / Ризотто', en: 'Pasta / Risotto' },
  dolci: { ro: 'Deserturi', ru: 'Десерты', en: 'Desserts' },
  drinks: { ro: 'Bar', ru: 'Бар', en: 'Bar' },
}

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
  | 'delivery.title'
  | 'delivery.text'
  | 'delivery.hours'
  | 'gallery.title'
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
  | 'contacts.title'
  | 'contacts.address'
  | 'contacts.phone'
  | 'contacts.email'
  | 'contacts.form.name'
  | 'contacts.form.send'
  | 'about.page.title'
  | 'about.page.p1'
  | 'about.page.p2'
  | 'about.page.chef'
  | 'aria.openMenu'
  | 'aria.closeCart'
  | 'aria.lang'

const UI: Record<UiKey, Record<Lang, string>> = {
  'brand.tagline': {
    ro: 'Bucătărie italiană autentică din 2007',
    ru: 'Подлинная итальянская кухня с 2007 года',
    en: 'Authentic Italian kitchen since 2007',
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
    ro: 'Ingrediente proaspete, aluat dospit lent și livrare rapidă în oraș.',
    ru: 'Свежие ингредиенты, медленное тесто и быстрая доставка по городу.',
    en: 'Fresh ingredients, slow-leavened dough, and fast city-wide delivery.',
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
  'about.title': { ro: 'Papa Mia Ristorante', ru: 'Papa Mia Ristorante', en: 'Papa Mia Ristorante' },
  'about.text': {
    ro: 'Atmosferă caldă, cuptor cu lemn și rețete transmise în familie. Vă așteptăm pentru cină, prânz sau livrare acasă.',
    ru: 'Тёплая атмосфера, дровяная печь и семейные рецепты. Ждём вас на ужин, обед или доставку домой.',
    en: 'Warm atmosphere, wood-fired oven, and family recipes. Join us for dinner, lunch, or home delivery.',
  },
  'about.reserve': { ro: 'Rezervare', ru: 'Забронировать', en: 'Book a table' },
  'about.contact': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'featured.title': { ro: 'Recomandări', ru: 'Мы рекомендуем', en: 'We recommend' },
  'featured.sub': { ro: 'Cel mai bun sezon', ru: 'Лучшее в сезоне', en: 'Best of the season' },
  'featured.order': { ro: 'Comandă acum', ru: 'Заказать сейчас', en: 'Order now' },
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
    ro: 'Niciun produs salvat.',
    ru: 'Нет сохранённых блюд.',
    en: 'No saved dishes yet.',
  },
  'contacts.title': { ro: 'Contacte', ru: 'Контакты', en: 'Contacts' },
  'contacts.address': {
    ro: 'Chișinău, str. Exemplu 10',
    ru: 'Кишинёв, ул. Примерная 10',
    en: 'Chișinău, 10 Sample Street',
  },
  'contacts.phone': { ro: '079 000 000', ru: '079 000 000', en: '079 000 000' },
  'contacts.email': { ro: 'hello@papamia.md', ru: 'hello@papamia.md', en: 'hello@papamia.md' },
  'contacts.form.name': { ro: 'Nume', ru: 'Имя', en: 'Name' },
  'contacts.form.send': { ro: 'Trimite', ru: 'Отправить', en: 'Send' },
  'about.page.title': { ro: 'Povestea noastră', ru: 'Наша история', en: 'Our story' },
  'about.page.p1': {
    ro: 'Papa Mia a început din pasiunea pentru aluat dospit 48 de ore și ingrediente italiane verificate.',
    ru: 'Papa Mia начался с любви к тесту на 48 часов и проверенным итальянским продуктам.',
    en: 'Papa Mia began with a passion for 48-hour dough and verified Italian ingredients.',
  },
  'about.page.p2': {
    ro: 'Fiecare pizza este coaptă la temperatură înaltă pentru crustă aerată și topping-uri echilibrate.',
    ru: 'Каждая пицца запекается при высокой температуре — воздушная корка и сбалансированные топпинги.',
    en: 'Every pizza is baked hot for an airy crust and balanced toppings.',
  },
  'about.page.chef': {
    ro: 'Chef Antonio — Napoli',
    ru: 'Шеф Антонио — Неаполь',
    en: 'Chef Antonio — Naples',
  },
  'aria.openMenu': { ro: 'Deschide meniul', ru: 'Открыть меню', en: 'Open menu' },
  'aria.closeCart': { ro: 'Închide coșul', ru: 'Закрыть корзину', en: 'Close cart' },
  'aria.lang': { ro: 'Limbă', ru: 'Язык', en: 'Language' },
}

export function translate(lang: Lang, key: UiKey) {
  return UI[key][lang]
}
