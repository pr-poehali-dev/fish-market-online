export interface Product {
  id: number;
  name: string;
  species: string;
  type: 'dried' | 'smoked';
  weight: number;
  price: number;
  image: string;
  description: string;
  badge?: string;
  isNew?: boolean;
  rating: number;
  reviews: number;
}

export const SPECIES = ['Вобла', 'Лещ', 'Судак', 'Сом', 'Щука', 'Карп', 'Окунь', 'Чехонь'];
export const TYPES = { dried: 'Вяленая', smoked: 'Копчёная' };
export const WEIGHTS = [100, 200, 300, 500, 1000];

const IMG1 = 'https://cdn.poehali.dev/projects/0a48bec4-ad72-4dec-954d-2e8af7b2e423/files/c625175e-6f3e-4d5d-93bb-2cfa7a7c4eb2.jpg';
const IMG2 = 'https://cdn.poehali.dev/projects/0a48bec4-ad72-4dec-954d-2e8af7b2e423/files/141eb813-c818-444b-b5ff-4e7dcbffede1.jpg';
const IMG3 = 'https://cdn.poehali.dev/projects/0a48bec4-ad72-4dec-954d-2e8af7b2e423/files/e2adf87f-26f9-49b3-8bb3-2e1e2cddbeb9.jpg';
const IMG4 = 'https://cdn.poehali.dev/projects/0a48bec4-ad72-4dec-954d-2e8af7b2e423/files/572d910c-4842-4480-a818-92a18674bdd4.jpg';

export const products: Product[] = [
  { id: 1, name: 'Вобла вяленая', species: 'Вобла', type: 'dried', weight: 200, price: 280, image: IMG4, description: 'Классическая вяленая вобла из Астрахани. Натуральная засолка, сушка на свежем воздухе. Отличная закуска к пиву.', badge: 'Хит', rating: 4.9, reviews: 124 },
  { id: 2, name: 'Лещ копчёный', species: 'Лещ', type: 'smoked', weight: 500, price: 590, image: IMG2, description: 'Крупный лещ горячего копчения на ольховых опилках. Сочное мясо с насыщенным дымным ароматом.', badge: 'Популярное', rating: 4.8, reviews: 89 },
  { id: 3, name: 'Судак вяленый', species: 'Судак', type: 'dried', weight: 300, price: 420, image: IMG1, description: 'Судак натуральной сушки. Плотное белое мясо с характерным вяленым вкусом. Без консервантов.', isNew: true, rating: 4.7, reviews: 45 },
  { id: 4, name: 'Сом копчёный', species: 'Сом', type: 'smoked', weight: 1000, price: 980, image: IMG3, description: 'Крупный сом холодного копчения. Нежная структура мяса, выраженный дымный аромат. Идеально для нарезки.', rating: 4.9, reviews: 67 },
  { id: 5, name: 'Щука вяленая', species: 'Щука', type: 'dried', weight: 200, price: 350, image: IMG4, description: 'Вяленая щука из чистых волжских водоёмов. Традиционный рецепт засолки.', isNew: true, rating: 4.6, reviews: 32 },
  { id: 6, name: 'Карп копчёный', species: 'Карп', type: 'smoked', weight: 500, price: 460, image: IMG2, description: 'Карп горячего копчения. Жирное мясо с золотистой корочкой и нежным дымным вкусом.', rating: 4.7, reviews: 51 },
  { id: 7, name: 'Окунь вяленый', species: 'Окунь', type: 'dried', weight: 100, price: 190, image: IMG1, description: 'Маленький, но ароматный — вяленый окунь для настоящих ценителей. Подходит к светлому пиву.', badge: 'Хит', rating: 4.8, reviews: 98 },
  { id: 8, name: 'Чехонь вяленая', species: 'Чехонь', type: 'dried', weight: 300, price: 310, image: IMG3, description: 'Нежная вяленая чехонь с тонкими костями. Любимая рыбка рыболовов с Дона и Волги.', rating: 4.5, reviews: 29 },
  { id: 9, name: 'Лещ вяленый', species: 'Лещ', type: 'dried', weight: 500, price: 480, image: IMG4, description: 'Крупный вяленый лещ. Традиционный способ приготовления, сушка 3 недели на свежем воздухе.', isNew: true, rating: 4.9, reviews: 73 },
  { id: 10, name: 'Судак копчёный', species: 'Судак', type: 'smoked', weight: 300, price: 520, image: IMG2, description: 'Судак холодного копчения. Деликатесная рыба с нежным ароматом и плотным мясом.', badge: 'Новинка', isNew: true, rating: 4.7, reviews: 18 },
  { id: 11, name: 'Вобла копчёная', species: 'Вобла', type: 'smoked', weight: 200, price: 320, image: IMG3, description: 'Вобла горячего копчения. Сочная, ароматная, с хрустящей кожицей.', rating: 4.6, reviews: 44 },
  { id: 12, name: 'Сом вяленый', species: 'Сом', type: 'dried', weight: 1000, price: 860, image: IMG1, description: 'Вяленый сом крупной нарезкой. Жирное мясо с насыщенным вкусом. Отличный деликатес.', rating: 4.8, reviews: 36 },
];

export const categories = [
  { id: 'all', label: 'Все товары', icon: '🐟', count: products.length },
  { id: 'dried', label: 'Вяленая', icon: '🌿', count: products.filter(p => p.type === 'dried').length },
  { id: 'smoked', label: 'Копчёная', icon: '🔥', count: products.filter(p => p.type === 'smoked').length },
];
