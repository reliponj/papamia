import type { Localized } from '../types'

export type PizzaIngredient = {
  id: string
  name: Localized
  price: number
  /** CSS color or gradient used for the visual layer */
  color: string
}

export type PizzaTopping = PizzaIngredient & {
  /** dot pattern color on the pizza canvas */
  dotColor: string
}

export const DOUGHS: PizzaIngredient[] = [
  {
    id: 'classic',
    name: { ro: 'Clasic', ru: 'Классическое', en: 'Classic' },
    price: 45,
    color: '#e8c97a',
  },
  {
    id: 'thin',
    name: { ro: 'Subțire', ru: 'Тонкое', en: 'Thin crust' },
    price: 40,
    color: '#d4aa55',
  },
  {
    id: 'whole',
    name: { ro: 'Integral', ru: 'Цельнозерновое', en: 'Wholegrain' },
    price: 50,
    color: '#b8895a',
  },
]

export const SAUCES: PizzaIngredient[] = [
  {
    id: 'tomato',
    name: { ro: 'Sos roșii San Marzano', ru: 'Соус Сан-Марцано', en: 'San Marzano tomato' },
    price: 15,
    color: '#c0392b',
  },
  {
    id: 'cream',
    name: { ro: 'Cremă', ru: 'Сливочный', en: 'Cream' },
    price: 18,
    color: '#f5e6c8',
  },
  {
    id: 'pesto',
    name: { ro: 'Pesto', ru: 'Песто', en: 'Pesto' },
    price: 22,
    color: '#4a7c59',
  },
  {
    id: 'bbq',
    name: { ro: 'BBQ', ru: 'BBQ', en: 'BBQ' },
    price: 18,
    color: '#6b2d0f',
  },
]

export const TOPPINGS: PizzaTopping[] = [
  {
    id: 'mozzarella',
    name: { ro: 'Mozzarella di bufala', ru: 'Моцарелла ди буфала', en: 'Bufala mozzarella' },
    price: 30,
    color: '#fffde7',
    dotColor: '#f9f3c8',
  },
  {
    id: 'prosciutto',
    name: { ro: 'Prosciutto crudo', ru: 'Прошутто крудо', en: 'Prosciutto crudo' },
    price: 45,
    color: '#e8a090',
    dotColor: '#c0605a',
  },
  {
    id: 'mushrooms',
    name: { ro: 'Ciuperci', ru: 'Грибы', en: 'Mushrooms' },
    price: 25,
    color: '#9e8472',
    dotColor: '#7a5c48',
  },
  {
    id: 'pepperoni',
    name: { ro: 'Pepperoni', ru: 'Пепперони', en: 'Pepperoni' },
    price: 38,
    color: '#b84040',
    dotColor: '#8b2020',
  },
  {
    id: 'olives',
    name: { ro: 'Măsline', ru: 'Оливки', en: 'Olives' },
    price: 20,
    color: '#4a5240',
    dotColor: '#2e3328',
  },
  {
    id: 'bell_pepper',
    name: { ro: 'Ardei gras', ru: 'Болгарский перец', en: 'Bell pepper' },
    price: 18,
    color: '#d4541a',
    dotColor: '#a03010',
  },
  {
    id: 'arugula',
    name: { ro: 'Rucola', ru: 'Руккола', en: 'Arugula' },
    price: 15,
    color: '#5a8c3a',
    dotColor: '#3a6020',
  },
  {
    id: 'cherry_tomato',
    name: { ro: 'Roșii cherry', ru: 'Томаты черри', en: 'Cherry tomatoes' },
    price: 15,
    color: '#e03030',
    dotColor: '#b01010',
  },
]

export type CustomPizza = {
  dough: PizzaIngredient
  sauce: PizzaIngredient
  toppings: PizzaTopping[]
}

export function calcPizzaPrice(pizza: CustomPizza): number {
  return (
    pizza.dough.price +
    pizza.sauce.price +
    pizza.toppings.reduce((sum, t) => sum + t.price, 0)
  )
}
