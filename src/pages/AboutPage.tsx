import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'
import { ImageSlider } from '../components/ui/ImageSlider'

const TEAM = [
  {
    name: 'Antonio Ferrara',
    role: { ro: 'Chef executiv', ru: 'Шеф-повар', en: 'Executive Chef' },
    origin: 'Napoli',
    bio: {
      ro: '20 de ani în bucătăriile din Napoli și Roma. Specialist în aluat napoletan și tehnica cuptorului cu lemn.',
      ru: '20 лет на кухнях Неаполя и Рима. Специалист по неаполитанскому тесту и технике дровяной печи.',
      en: '20 years in kitchens across Naples and Rome. Specialist in Neapolitan dough and wood-fired oven technique.',
    },
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
  },
  {
    name: 'Giulia Martini',
    role: { ro: 'Chef de partie — paste', ru: 'Шеф де парти — паста', en: 'Chef de Partie — Pasta' },
    origin: 'Bologna',
    bio: {
      ro: 'Crescută cu pasta fresca în familie. Aduce rețetele Bolognei și dragostea pentru sfecle și trufă.',
      ru: 'Выросла с pasta fresca в семье. Привносит рецепты Болоньи и любовь к свёкле и трюфелю.',
      en: "Raised on pasta fresca at home. Brings Bologna's recipes and a love for beet and truffle.",
    },
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80',
  },
  {
    name: 'Marco Conti',
    role: { ro: 'Patiser', ru: 'Кондитер', en: 'Pastry Chef' },
    origin: 'Firenze',
    bio: {
      ro: 'Deserturile lui Marco sunt o poveste de textură și echilibru — tiramisu clasic, panna cotta cu vanilie bourbon.',
      ru: 'Десерты Марко — история текстуры и баланса: классическое тирамису, панна-котта с бурбонской ванилью.',
      en: "Marco's desserts are a story of texture and balance — classic tiramisù, panna cotta with bourbon vanilla.",
    },
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
]

const FOOD_SHOTS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1400&q=90', alt: 'Cheese pull pizza' },
  { id: 2, src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=90', alt: 'Fresh basil Margherita' },
  { id: 3, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=90', alt: 'Pasta al pomodoro' },
  { id: 4, src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1400&q=90', alt: 'Wood-fired oven' },
  { id: 5, src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1400&q=90', alt: 'Italian ingredients' },
]

const QUOTE: Record<Lang, string> = {
  ro: 'Mâncarea bună nu are nevoie de trucuri — are nevoie de respect față de ingredient.',
  ru: 'Хорошая еда не нуждается в трюках — она нуждается в уважении к ингредиенту.',
  en: 'Good food needs no tricks — it needs respect for the ingredient.',
}

export function AboutPage() {
  const { t, lang } = useLocale()

  return (
    <article className="about-page">
      <div className="about-hero">
        <div className="about-hero__img">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=85"
            alt="Papa Mia restaurant interior"
          />
        </div>
        <div className="about-hero__text">
          <h1 className="about-hero__title">{t('about.page.title')}</h1>
          <p className="about-hero__body">{t('about.page.p1')}</p>
          <p className="about-hero__body">{t('about.page.p2')}</p>
          <blockquote className="about-hero__quote">
            <p>«{QUOTE[lang as Lang]}»</p>
            <cite>{t('about.page.chef')}</cite>
          </blockquote>
        </div>
      </div>

      <div className="about-food section">
        <p className="about-food__label">{t('about.page.food.title')}</p>
        <ImageSlider
          slides={FOOD_SHOTS}
          className="about-food-slider"
          ariaLabel={t('about.page.food.title')}
          prevLabel={t('banner.carousel.prev')}
          nextLabel={t('banner.carousel.next')}
        />
      </div>

      <div className="about-team">
        <div className="section-head">
          <h2 className="section-title">{t('about.page.team.title')}</h2>
          <p className="section-sub">{t('about.page.team.sub')}</p>
        </div>
        <div className="about-team__grid">
          {TEAM.map((member) => (
            <article key={member.name} className="chef-card">
              <div className="chef-card__photo">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>
              <div className="chef-card__body">
                <h3 className="chef-card__name">{member.name}</h3>
                <p className="chef-card__role">{member.role[lang as Lang]}</p>
                <span className="chef-card__origin">{member.origin}</span>
                <p className="chef-card__bio">{member.bio[lang as Lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </article>
  )
}
