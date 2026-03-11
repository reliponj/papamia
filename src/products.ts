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
    image: 'https://images.pexels.com/photos/1596881/pexels-photo-1596881.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pizza',
  },
  {
    id: 2,
    name: 'Пепперони ди Папамия',
    description: 'Острые колбаски пепперони, моцарелла, томатный соус',
    price: 210,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pizza',
  },
  {
    id: 3,
    name: 'Паста Карбонара',
    description: 'Спагетти, панчетта, сливочный соус, пармезан, желток',
    price: 195,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pasta',
  },
  {
    id: 4,
    name: 'Тальятелле с песто',
    description: 'Свежая паста, соус песто из базилика, кедровые орехи',
    price: 185,
    image: 'https://images.pexels.com/photos/1279332/pexels-photo-1279332.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'pasta',
  },
  {
    id: 5,
    name: 'Суп Минестроне',
    description: 'Овощной суп с томатами, фасолью и ароматными травами',
    price: 130,
    image: 'https://images.pexels.com/photos/1437269/pexels-photo-1437269.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'soup',
  },
  {
    id: 6,
    name: 'Суп Томато Басилико',
    description: 'Нежный томатный крем-суп с базиликом и гренками',
    price: 135,
    image: 'https://images.pexels.com/photos/730922/pexels-photo-730922.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'soup',
  },
]

