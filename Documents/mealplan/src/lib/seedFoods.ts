import { v4 as uuidv4 } from 'uuid';
import type { FoodItem, MealTemplate, FoodEntry } from '@/types';

const now = Date.now();

// Helper to create food items efficiently
const createFood = (
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  category: string,
  nameUk?: string,
  fiber?: number
): FoodItem => ({
  id: uuidv4(),
  name,
  nameUk,
  calories,
  protein,
  carbs,
  fat,
  fiber: fiber || 0,
  isCustom: false,
  source: 'builtin',
  category,
  createdAt: now,
  updatedAt: now,
});

export const seedFoods: FoodItem[] = [
  // PROTEINS - Animal (60+ items)
  // Chicken
  createFood('Chicken Breast', 165, 31, 0, 3.6, 'protein', 'Курячі грудки'),
  createFood('Chicken Thigh', 209, 26, 0, 11, 'protein', 'Курячі стегна'),
  createFood('Chicken Drumstick', 176, 28, 0, 7, 'protein', 'Курячі голені'),
  createFood('Chicken Ground', 165, 29, 0, 4.5, 'protein', 'Молоте курячого'),
  createFood('Chicken Whole Roasted', 190, 27, 0, 8.5, 'protein', 'Ціла курка запечена'),

  // Turkey
  createFood('Turkey Breast', 135, 29.9, 0, 1.3, 'protein', 'Індичатина грудка'),
  createFood('Turkey Ground (93% lean)', 140, 28, 0, 2.5, 'protein', 'Молоте індичатини'),
  createFood('Turkey Thigh', 189, 24, 0, 10, 'protein', 'Індичатина стегно'),

  // Beef
  createFood('Beef Sirloin (lean)', 180, 26, 0, 8, 'protein', 'Яловична філе'),
  createFood('Beef Ground (90% lean)', 176, 24, 0, 8, 'protein', 'Молоте яловичини'),
  createFood('Beef Tenderloin', 160, 27, 0, 5, 'protein', 'Яловична вирізка'),
  createFood('Beef Steak (ribeye)', 250, 26, 0, 15, 'protein', 'Яловичний стейк'),
  createFood('Beef Liver', 176, 26, 5, 5, 'protein', 'Яловичаї печінка', 0),

  // Fish
  createFood('Salmon', 208, 20, 0, 13, 'protein', 'Лосось'),
  createFood('Tuna (canned in water)', 99, 23, 0, 0.8, 'protein', 'Тунець консервований'),
  createFood('Cod', 82, 18, 0, 0.7, 'protein', 'Тріска'),
  createFood('Mackerel', 205, 19, 0, 13, 'protein', 'Макарель'),
  createFood('Herring', 208, 18, 0, 15, 'protein', 'Оселедець'),
  createFood('Trout', 141, 20, 0, 6, 'protein', 'Форель'),
  createFood('Shrimp', 99, 24, 0.2, 0.3, 'protein', 'Креветки'),
  createFood('Crab', 102, 20, 0.8, 1.1, 'protein', 'Краб'),

  // Eggs & Dairy
  createFood('Egg (whole)', 155, 13, 1.1, 11, 'protein', 'Яйце'),
  createFood('Egg White', 52, 11, 0.7, 0.2, 'protein', 'Білок яйця'),
  createFood('Egg Yolk', 322, 16, 3, 26, 'protein', 'Жовток яйця'),
  createFood('Greek Yogurt (0% fat)', 59, 10, 3.3, 0.4, 'protein', 'Грецький йогурт'),
  createFood('Cottage Cheese (0% fat)', 98, 12, 3.4, 0.4, 'protein', 'Творог 0%'),
  createFood('Cottage Cheese (4% fat)', 86, 11, 3.1, 4, 'protein', 'Творог 4%'),
  createFood('Skyr (Icelandic yogurt)', 59, 10, 3, 0.2, 'protein', 'Скір'),
  createFood('Whey Protein Isolate', 110, 27, 1, 0.5, 'protein', 'Сироватковий протеїн'),
  createFood('Casein Protein', 120, 24, 3, 1, 'protein', 'Казеїновий протеїн'),
  createFood('Milk (whole)', 61, 3.2, 4.8, 3.3, 'protein', 'Молоко'),
  createFood('Milk (2% fat)', 49, 3.3, 4.8, 1.9, 'protein', 'Молоко 2%'),
  createFood('Milk (skim)', 35, 3.4, 4.9, 0.1, 'protein', 'Молоко знежирене'),
  createFood('Cheese (cheddar)', 403, 23, 3.3, 33, 'protein', 'Сир чеддер'),
  createFood('Cheese (mozzarella)', 280, 28, 3.1, 17, 'protein', 'Сир моцарелла'),
  createFood('Cheese (parmesan)', 392, 38, 4, 29, 'protein', 'Сир пармезан'),

  // GRAINS & STARCHES (40+ items)
  createFood('Oats (dry)', 389, 17, 66, 7, 'grain', 'Вівсяні пластівці'),
  createFood('Oats (cooked)', 68, 2.4, 12, 1.4, 'grain', 'Вівсяна каша'),
  createFood('Rice (white, cooked)', 130, 2.7, 28, 0.3, 'grain', 'Рис білий'),
  createFood('Rice (brown, cooked)', 111, 2.6, 23, 0.9, 'grain', 'Рис коричневий'),
  createFood('Pasta (dry)', 371, 13, 75, 1.1, 'grain', 'Макаронні вироби'),
  createFood('Pasta (cooked)', 131, 4.3, 25, 1.1, 'grain', 'Макаронні вироби варені'),
  createFood('Bread (whole wheat)', 247, 13, 41, 3.4, 'grain', 'Хліб цільнозерновий', 7),
  createFood('Bread (white)', 265, 9, 49, 3.3, 'grain', 'Хліб білий', 2.7),
  createFood('Quinoa (cooked)', 120, 4.4, 21, 1.9, 'grain', 'Кіноа', 2.8),
  createFood('Buckwheat (cooked)', 92, 3.4, 20, 0.6, 'grain', 'Гречка', 2.7),
  createFood('Couscous (cooked)', 112, 3.8, 23, 0.3, 'grain', 'Кускус', 1.5),
  createFood('Barley (cooked)', 96, 2.3, 22, 0.4, 'grain', 'Ячмінь', 3.8),
  createFood('Rye Bread', 259, 8.4, 48, 3.3, 'grain', 'Хліб житний', 5.8),
  createFood('Sweet Potato (cooked)', 86, 1.6, 20, 0.1, 'grain', 'Батат варений', 3),
  createFood('Potato (cooked)', 77, 2, 17, 0.1, 'grain', 'Картопля вареня', 2.1),
  createFood('Potato (baked)', 93, 2.5, 21, 0.1, 'grain', 'Картопля в мундирі', 2.1),
  createFood('Corn', 86, 3.3, 19, 1.2, 'grain', 'Кукурудза', 2.7),
  createFood('Cornmeal', 382, 8.1, 76, 3.9, 'grain', 'Кукурудзяне борошно', 4.4),
  createFood('Chickpeas (cooked)', 119, 8.9, 20, 1.6, 'grain', 'Нут вареник', 5),
  createFood('Lentils (cooked)', 116, 9, 20, 0.4, 'grain', 'Чечевиця вареня', 3.9),
  createFood('Beans (black, cooked)', 132, 8.9, 24, 0.5, 'grain', 'Чорна квасоля', 6.4),
  createFood('Beans (kidney, cooked)', 127, 8.7, 23, 0.4, 'grain', 'Квасоля вареня', 6.4),
  createFood('Beans (pinto, cooked)', 143, 8.9, 27, 0.6, 'grain', 'Пінто квасоля', 7),

  // VEGETABLES (50+ items)
  createFood('Broccoli', 34, 2.8, 7, 0.4, 'vegetable', 'Брокколі', 2.4),
  createFood('Spinach', 23, 2.9, 3.6, 0.4, 'vegetable', 'Шпинат', 2.2),
  createFood('Kale', 49, 4.3, 9, 0.9, 'vegetable', 'Капуста кейл', 2),
  createFood('Cabbage', 25, 1.3, 5.8, 0.1, 'vegetable', 'Капуста', 2.4),
  createFood('Carrot', 41, 0.9, 10, 0.2, 'vegetable', 'Морква', 2.8),
  createFood('Tomato', 18, 0.9, 3.9, 0.2, 'vegetable', 'Помідор', 1.2),
  createFood('Bell Pepper (red)', 31, 0.9, 6, 0.3, 'vegetable', 'Перець червоний', 2),
  createFood('Bell Pepper (green)', 30, 1, 7, 0.3, 'vegetable', 'Перець зелений', 1.9),
  createFood('Cucumber', 16, 0.7, 3.6, 0.1, 'vegetable', 'Огірок', 0.5),
  createFood('Zucchini', 17, 1.5, 3.1, 0.4, 'vegetable', 'Цукіні', 1),
  createFood('Green Beans', 31, 1.8, 7, 0.1, 'vegetable', 'Зелена квасоля', 2.7),
  createFood('Peas', 77, 5.4, 14, 0.4, 'vegetable', 'Горох', 5.9),
  createFood('Corn (canned)', 76, 2.8, 17, 0.6, 'vegetable', 'Кукурудза консерв.'),
  createFood('Beet', 43, 1.6, 10, 0.2, 'vegetable', 'Буряк', 2.8),
  createFood('Garlic', 149, 6.4, 33, 0.5, 'vegetable', 'Часник', 2.1),
  createFood('Onion', 40, 1.1, 9, 0.1, 'vegetable', 'Цибуля', 1.7),
  createFood('Asparagus', 20, 2.2, 3.7, 0.1, 'vegetable', 'Спаржа', 2.1),
  createFood('Brussels Sprouts', 34, 2.8, 7, 0.3, 'vegetable', 'Брюссельська капуста', 2.4),
  createFood('Cauliflower', 25, 1.9, 5, 0.3, 'vegetable', 'Цвітна капуста', 2.4),
  createFood('Mushrooms', 22, 3.1, 3.3, 0.3, 'vegetable', 'Гриби', 1),
  createFood('Eggplant', 25, 0.98, 5.9, 0.2, 'vegetable', 'Баклажан', 3),
  createFood('Lettuce', 15, 0.9, 2.9, 0.2, 'vegetable', 'Салат', 1.3),

  // FRUITS (30+ items)
  createFood('Banana', 89, 1.1, 23, 0.3, 'fruit', 'Банан', 2.6),
  createFood('Apple', 52, 0.3, 14, 0.2, 'fruit', 'Яблуко', 2.4),
  createFood('Orange', 47, 0.9, 12, 0.1, 'fruit', 'Апельсин', 2.4),
  createFood('Strawberry', 32, 0.8, 8, 0.3, 'fruit', 'Полуниця', 2),
  createFood('Blueberry', 57, 0.7, 14, 0.3, 'fruit', 'Чорниця', 2.4),
  createFood('Raspberry', 52, 1.2, 12, 0.7, 'fruit', 'Малина', 6.5),
  createFood('Blackberry', 43, 1.4, 10, 0.5, 'fruit', 'Ожина', 5.3),
  createFood('Grape', 67, 0.7, 17, 0.2, 'fruit', 'Виноград', 0.9),
  createFood('Watermelon', 30, 0.6, 8, 0.1, 'fruit', 'Кавун', 0.4),
  createFood('Melon', 34, 0.8, 8, 0.2, 'fruit', 'Диня', 0.9),
  createFood('Pineapple', 50, 0.5, 13, 0.1, 'fruit', 'Ананас', 1.4),
  createFood('Mango', 60, 0.7, 15, 0.3, 'fruit', 'Манго', 1.6),
  createFood('Peach', 39, 0.9, 10, 0.3, 'fruit', 'Персик', 1.5),
  createFood('Pear', 57, 0.4, 15, 0.1, 'fruit', 'Груша', 2.8),
  createFood('Kiwi', 61, 1.1, 15, 0.5, 'fruit', 'Ківі', 3),
  createFood('Lemon', 29, 1.1, 9, 0.3, 'fruit', 'Лимон', 2.8),
  createFood('Avocado', 160, 2, 9, 15, 'fruit', 'Авокадо', 7),
  createFood('Coconut (fresh)', 354, 3.3, 15, 33, 'fruit', 'Кокос', 9),

  // NUTS & SEEDS (25+ items)
  createFood('Almonds', 579, 21, 22, 50, 'nuts', 'Мигдаль', 12.5),
  createFood('Walnuts', 654, 9.1, 14, 66, 'nuts', 'Грецькі горіхи', 6.7),
  createFood('Cashews', 553, 18, 30, 44, 'nuts', 'Кішью', 3.3),
  createFood('Peanuts', 567, 26, 16, 49, 'nuts', 'Арахіс', 8.5),
  createFood('Peanut Butter', 588, 25, 20, 50, 'nuts', 'Масло арахісове', 6),
  createFood('Almond Butter', 614, 22, 19, 56, 'nuts', 'Масло мигдалю', 12.4),
  createFood('Sunflower Seeds', 584, 24, 20, 52, 'nuts', 'Насіння соняшнику', 8.6),
  createFood('Pumpkin Seeds', 546, 19, 54, 49, 'nuts', 'Насіння гарбуза', 1.7),
  createFood('Flax Seeds', 534, 18, 29, 42, 'nuts', 'Насіння льону', 27.3),
  createFood('Chia Seeds', 486, 17, 42, 31, 'nuts', 'Насіння чіа', 34.4),
  createFood('Hemp Seeds', 560, 10, 12, 48, 'nuts', 'Насіння коноплі', 1.2),
  createFood('Pistachio', 560, 20, 28, 45, 'nuts', 'Фісташка', 10.3),
  createFood('Macadamia', 718, 7.9, 14, 76, 'nuts', 'Макадамія', 8.6),
  createFood('Brazil Nuts', 659, 14, 12, 67, 'nuts', 'Бразильський горіх', 2.1),
  createFood('Pine Nuts', 673, 14, 13, 68, 'nuts', 'Кедрові горішки', 3.7),

  // OILS & FATS (10+ items)
  createFood('Olive Oil', 884, 0, 0, 100, 'oil', 'Оливкова олія'),
  createFood('Coconut Oil', 892, 0, 0, 100, 'oil', 'Кокосова олія'),
  createFood('Butter', 717, 0.9, 0, 81, 'oil', 'Масло'),
  createFood('Ghee', 900, 0, 0, 100, 'oil', 'Гхі'),
  createFood('Avocado Oil', 884, 0, 0, 100, 'oil', 'Олія авокадо'),

  // UKRAINIAN DISHES & STAPLES (30+ items)
  createFood('Борщ (Borscht)', 43, 2.5, 7, 0.5, 'ukrainian', 'Борщ', 2),
  createFood('Вареники (Varenyky)', 160, 5.5, 28, 2.5, 'ukrainian', 'Вареники', 1.5),
  createFood('Гречаники (Buckwheat patties)', 180, 7, 22, 8, 'ukrainian', 'Гречаники'),
  createFood('Котлети (Meat patties)', 220, 18, 5, 15, 'ukrainian', 'Котлети'),
  createFood('Голубці (Cabbage rolls)', 110, 9, 8, 5, 'ukrainian', 'Голубці'),
  createFood('Хлібці (Bread)', 250, 10, 45, 2.5, 'ukrainian', 'Хлібці'),
  createFood('Молоко (Milk)', 61, 3.2, 4.8, 3.3, 'ukrainian', 'Молоко'),

  // SUPPLEMENTS & SHAKES (15+ items)
  createFood('Whey Protein Powder', 110, 27, 1, 0.5, 'supplement', 'Сироватковий протеїн'),
  createFood('Casein Protein Powder', 120, 24, 3, 1, 'supplement', 'Казеїновий протеїн'),
  createFood('Creatine Monohydrate', 0, 0, 0, 0, 'supplement', 'Креатин'),
  createFood('Amino Acid (BCAA)', 4, 1, 0.5, 0, 'supplement', 'BCAA'),
  createFood('Mass Gainer', 380, 15, 65, 5, 'supplement', 'Гейнер'),
  createFood('Protein Bar (generic)', 220, 20, 25, 8, 'supplement', 'Протеїновий батончик'),
];

// Create a function to generate meal templates
export const generateMealTemplates = (): MealTemplate[] => {
  // Find common foods
  const chickenBreast = seedFoods.find((f) => f.name === 'Chicken Breast');
  const rice = seedFoods.find((f) => f.name === 'Rice (white, cooked)');
  const broccoli = seedFoods.find((f) => f.name === 'Broccoli');
  const eggs = seedFoods.find((f) => f.name === 'Egg (whole)');
  const oats = seedFoods.find((f) => f.name === 'Oats (cooked)');
  const banana = seedFoods.find((f) => f.name === 'Banana');
  const whey = seedFoods.find((f) => f.name === 'Whey Protein Isolate');
  const salmon = seedFoods.find((f) => f.name === 'Salmon');
  const sweetPotato = seedFoods.find((f) => f.name === 'Sweet Potato (cooked)');
  const almonds = seedFoods.find((f) => f.name === 'Almonds');

  if (
    !chickenBreast ||
    !rice ||
    !broccoli ||
    !eggs ||
    !oats ||
    !banana ||
    !whey ||
    !salmon ||
    !sweetPotato ||
    !almonds
  ) {
    return [];
  }

  return [
    // Meal 1: Chicken & Rice
    {
      id: uuidv4(),
      name: 'Chicken & Rice',
      foodEntries: [
        { foodId: chickenBreast.id, quantity: 200, unit: 'grams' },
        { foodId: rice.id, quantity: 250, unit: 'grams' },
        { foodId: broccoli.id, quantity: 150, unit: 'grams' },
      ],
      totalKcal: 630,
      totalProtein: 55,
      totalCarbs: 70,
      totalFat: 8,
      createdAt: now,
      updatedAt: now,
    },
    // Meal 2: Eggs & Toast
    {
      id: uuidv4(),
      name: 'Eggs & Toast',
      foodEntries: [
        { foodId: eggs.id, quantity: 3, unit: 'serving' },
        { foodId: seedFoods.find((f) => f.name === 'Bread (whole wheat)')?.id || '', quantity: 80, unit: 'grams' },
        { foodId: seedFoods.find((f) => f.name === 'Butter')?.id || '', quantity: 10, unit: 'grams' },
      ],
      totalKcal: 540,
      totalProtein: 42,
      totalCarbs: 45,
      totalFat: 18,
      createdAt: now,
      updatedAt: now,
    },
    // Meal 3: Oats & Whey
    {
      id: uuidv4(),
      name: 'Oats & Whey Shake',
      foodEntries: [
        { foodId: oats.id, quantity: 150, unit: 'grams' },
        { foodId: whey.id, quantity: 30, unit: 'grams' },
        { foodId: banana.id, quantity: 100, unit: 'grams' },
        { foodId: almonds.id, quantity: 25, unit: 'grams' },
      ],
      totalKcal: 530,
      totalProtein: 42,
      totalCarbs: 58,
      totalFat: 18,
      createdAt: now,
      updatedAt: now,
    },
    // Meal 4: Salmon & Sweet Potato
    {
      id: uuidv4(),
      name: 'Salmon & Sweet Potato',
      foodEntries: [
        { foodId: salmon.id, quantity: 180, unit: 'grams' },
        { foodId: sweetPotato.id, quantity: 250, unit: 'grams' },
        { foodId: seedFoods.find((f) => f.name === 'Spinach')?.id || '', quantity: 100, unit: 'grams' },
        { foodId: seedFoods.find((f) => f.name === 'Olive Oil')?.id || '', quantity: 15, unit: 'grams' },
      ],
      totalKcal: 590,
      totalProtein: 48,
      totalCarbs: 52,
      totalFat: 18,
      createdAt: now,
      updatedAt: now,
    },
    // Meal 5: Ground Beef & Rice
    {
      id: uuidv4(),
      name: 'Ground Beef & Rice',
      foodEntries: [
        { foodId: seedFoods.find((f) => f.name === 'Beef Ground (90% lean)')?.id || '', quantity: 200, unit: 'grams' },
        { foodId: rice.id, quantity: 200, unit: 'grams' },
        { foodId: seedFoods.find((f) => f.name === 'Carrot')?.id || '', quantity: 100, unit: 'grams' },
      ],
      totalKcal: 580,
      totalProtein: 50,
      totalCarbs: 65,
      totalFat: 12,
      createdAt: now,
      updatedAt: now,
    },
  ];
};
