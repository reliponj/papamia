export type Category = 'pizza' | 'pasta' | 'soup'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: Category
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Маргарита классическая',
    description: 'Тонкое тесто, томатный соус, моцарелла, свежий базилик',
    price: 180,
    image:
      'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pizza',
  },
  {
    id: 2,
    name: 'Пепперони ди Папамия',
    description: 'Острые колбаски пепперони, моцарелла, томатный соус',
    price: 210,
    image:
      'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pizza',
  },
  {
    id: 3,
    name: 'Паста Карбонара',
    description: 'Спагетти, панчетта, сливочный соус, пармезан, желток',
    price: 195,
    image:
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pasta',
  },
  {
    id: 4,
    name: 'Тальятелле с песто',
    description: 'Свежая паста, соус песто из базилика, кедровые орехи',
    price: 185,
    image:
      'https://images.pexels.com/photos/6287520/pexels-photo-6287520.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pasta',
  },
  {
    id: 5,
    name: 'Суп Минестроне',
    description: 'Овощной суп с томатами, фасолью и ароматными травами',
    price: 130,
    image:
      'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'soup',
  },
  {
    id: 6,
    name: 'Суп Томато Басилико',
    description: 'Нежный томатный крем-суп с базиликом и гренками',
    price: 135,
    image:
      'https://images.pexels.com/photos/1907227/pexels-photo-1907227.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'soup',
  },
  {
    id: 7,
    name: 'Четыре сыра',
    description: 'Пицца на тонком тесте с моцареллой, горгонзолой, пармезаном и эмменталем',
    price: 220,
    image:
      'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pizza',
  },
  {
    id: 8,
    name: 'Паста Болоньезе',
    description: 'Спагетти с томатным соусом болоньезе из говядины и свежим пармезаном',
    price: 205,
    image:
      'https://images.pexels.com/photos/6287520/pexels-photo-6287520.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pasta',
  },
]

