import type { MenuProduct } from '../types'

export const MENU_PRODUCTS: MenuProduct[] = [
  {
    id: 'margherita',
    category: 'pizza',
    featured: true,
    name: {
      ro: 'Margherita',
      ru: 'Маргарита',
      en: 'Margherita',
    },
    description: {
      ro: 'Sos de roșii, mozzarella, ulei de măsline extra virgin.',
      ru: 'Томатный соус, моцарелла, оливковое масло extra virgin.',
      en: 'Tomato sauce, mozzarella, extra virgin olive oil.',
    },
    price: 95,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'capricciosa',
    category: 'pizza',
    featured: true,
    name: {
      ro: 'Capricciosa',
      ru: 'Капричоза',
      en: 'Capricciosa',
    },
    description: {
      ro: 'Sos de roșii, mozzarella, prosciutto cotto, măsline, ciuperci, anghinare.',
      ru: 'Томатный соус, моцарелла, ветчина, оливки, грибы, артишоки.',
      en: 'Tomato sauce, mozzarella, ham, olives, mushrooms, artichokes.',
    },
    price: 135,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'italiana',
    category: 'pizza',
    name: {
      ro: 'Italiana',
      ru: 'Итальяна',
      en: 'Italiana',
    },
    description: {
      ro: 'Sos de roșii, mozzarella, prosciutto crudo, rucola, grana padano.',
      ru: 'Томатный соус, моцарелла, прошутто крудо, руккола, грана падано.',
      en: 'Tomato sauce, mozzarella, prosciutto crudo, arugula, grana padano.',
    },
    price: 220,
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'diavola',
    category: 'pinsa',
    name: {
      ro: 'Diavola',
      ru: 'Дьявола',
      en: 'Diavola',
    },
    description: {
      ro: 'Sos de roșii, mozzarella, salami picant, ulei de măsline.',
      ru: 'Томатный соус, моцарелла, острый салями, оливковое масло.',
      en: 'Tomato sauce, mozzarella, spicy salami, olive oil.',
    },
    price: 180,
    image:
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'boscaiola',
    category: 'pinsa',
    featured: true,
    name: {
      ro: 'Boscaiola',
      ru: 'Боскайола',
      en: 'Boscaiola',
    },
    description: {
      ro: 'Sos de roșii, mozzarella, ciuperci porcini, speck, ulei de măsline.',
      ru: 'Томатный соус, моцарелла, белые грибы, спек, оливковое масло.',
      en: 'Tomato sauce, mozzarella, porcini, speck, olive oil.',
    },
    price: 235,
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'burrata-salad',
    category: 'antipasti',
    name: {
      ro: 'Salată cu burrata',
      ru: 'Салат с бурратой',
      en: 'Burrata salad',
    },
    description: {
      ro: 'Burrata, roșii cherry, rucola, pesto, ulei de măsline.',
      ru: 'Буррата, черри, руккола, песто, оливковое масло.',
      en: 'Burrata, cherry tomatoes, arugula, pesto, olive oil.',
    },
    price: 165,
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    allergens: ['dairy', 'nuts'],
  },
  {
    id: 'bruschetta',
    category: 'antipasti',
    name: {
      ro: 'Bruschetta trio',
      ru: 'Брускетта трио',
      en: 'Bruschetta trio',
    },
    description: {
      ro: 'Pâine prăjită cu roșii, ricotta și anșoa.',
      ru: 'Гренки с томатами, рикоттой и анчоусами.',
      en: 'Toasted bread with tomatoes, ricotta, and anchovies.',
    },
    price: 120,
    image:
      'https://images.unsplash.com/photo-1572695157199-bea00591eaa0?w=800&q=80',
    allergens: ['gluten', 'dairy', 'fish'],
  },
  {
    id: 'carbonara',
    category: 'pasta',
    name: {
      ro: 'Carbonara',
      ru: 'Карбонара',
      en: 'Carbonara',
    },
    description: {
      ro: 'Spaghetti, ou, pecorino, guanciale, piper negru.',
      ru: 'Спагетти, яйцо, пекорино, гуанчиале, чёрный перец.',
      en: 'Spaghetti, egg, pecorino, guanciale, black pepper.',
    },
    price: 145,
    image:
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
    allergens: ['gluten', 'dairy', 'eggs'],
  },
  {
    id: 'risotto-funghi',
    category: 'pasta',
    name: {
      ro: 'Risotto cu ciuperci',
      ru: 'Ризотто с грибами',
      en: 'Mushroom risotto',
    },
    description: {
      ro: 'Orez arborio, ciuperci sălbatice, parmezan, unt.',
      ru: 'Рис арборио, лесные грибы, пармезан, сливочное масло.',
      en: 'Arborio rice, wild mushrooms, parmesan, butter.',
    },
    price: 155,
    image:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db871?w=800&q=80',
    allergens: ['dairy'],
  },
  {
    id: 'tiramisu',
    category: 'dolci',
    name: {
      ro: 'Tiramisu clasic',
      ru: 'Классический тирамису',
      en: 'Classic tiramisu',
    },
    description: {
      ro: 'Mascarpone, cafea, pișcoturi, cacao.',
      ru: 'Маскарпоне, кофе, савоярди, какао.',
      en: 'Mascarpone, coffee, ladyfingers, cocoa.',
    },
    price: 85,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    allergens: ['gluten', 'dairy', 'eggs'],
  },
  {
    id: 'panna-cotta',
    category: 'dolci',
    name: {
      ro: 'Panna cotta',
      ru: 'Панна-котта',
      en: 'Panna cotta',
    },
    description: {
      ro: 'Fructe de pădure, vanilie, mentă.',
      ru: 'Лесные ягоды, ваниль, мята.',
      en: 'Berries, vanilla, mint.',
    },
    price: 75,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    allergens: ['dairy'],
  },
  {
    id: 'aperol-spritz',
    category: 'drinks',
    name: {
      ro: 'Aperol Spritz',
      ru: 'Апероль шприц',
      en: 'Aperol Spritz',
    },
    description: {
      ro: 'Aperol, prosecco, sodă, portocală.',
      ru: 'Апероль, просекко, сода, апельсин.',
      en: 'Aperol, prosecco, soda, orange.',
    },
    price: 95,
    image:
      'https://images.unsplash.com/photo-1560512820-29e2ae1dd490?w=800&q=80',
    allergens: ['alcohol'],
  },
  {
    id: 'limoncello-tonic',
    category: 'drinks',
    name: {
      ro: 'Limoncello & tonic',
      ru: 'Лимончелло и тоник',
      en: 'Limoncello & tonic',
    },
    description: {
      ro: 'Limoncello artizanal, tonic, rozmarin.',
      ru: 'Домашний лимончелло, тоник, розмарин.',
      en: 'Artisan limoncello, tonic, rosemary.',
    },
    price: 85,
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
    allergens: ['alcohol'],
  },
]

const byId = new Map(MENU_PRODUCTS.map((p) => [p.id, p]))

export function getProductById(id: string) {
  return byId.get(id)
}

export function getFeaturedProducts() {
  return MENU_PRODUCTS.filter((p) => p.featured)
}
