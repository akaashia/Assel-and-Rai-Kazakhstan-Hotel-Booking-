import { Room, Service, PaidExtra, HotelInfo, News } from './types';

export const hotelInfo: HotelInfo = {
  name: 'Kazakhstan Grand Hotel',
  nameKz: 'Қазақстан Гранд Қонақ үйі',
  description: 'Experience the finest blend of traditional Kazakh hospitality and modern luxury in the heart of Kazakhstan.',
  descriptionKz: 'Қазақстанның жүрегінде дәстүрлі қазақ қонақжайлылығы мен заманауи люкстің үздік үйлесімін сезініңіз.',
  yearsInOperation: 15,
  achievements: [
    'Best Hotel in Central Asia 2023',
    'Excellence in Service Award',
    'Green Hotel Certificate',
    'TripAdvisor Certificate of Excellence'
  ],
  achievementsKz: [
    'Орталық Азиядағы ең үздік қонақ үй 2023',
    'Қызмет көрсетудегі үздік сыйлығы',
    'Жасыл қонақ үй сертификаты',
    'TripAdvisor үздік сертификаты'
  ],
  rating: 4.8,
  totalReviews: 2847,
  address: 'Astana, Nurzhol Boulevard 12',
  addressKz: 'Астана, Нұржол бульвары 12',
  phone: '+7 (7172) 555-000',
  email: 'info@kazakhstanhotel.kz'
};

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Deluxe Nomad Suite',
    nameKz: 'Делюкс Көшпенді Люксі',
    category: 'Luxury',
    categoryKz: 'Люкс',
    description: 'Spacious suite with traditional Kazakh ornaments and modern amenities. Features panoramic city views.',
    descriptionKz: 'Дәстүрлі қазақ өрнектері мен заманауи жайлылықтары бар кең люкс. Қаланың панорамалық көрінісімен.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    floor: 12,
    maxGuests: 3,
    size: 55,
    amenities: ['King Size Bed', 'Mini Bar', 'Safe', 'Work Desk', 'Sitting Area'],
    amenitiesKz: ['Король өлшемді төсек', 'Мини-бар', 'Сейф', 'Жұмыс үстелі', 'Отыру орны'],
    features: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Coffee Machine', 'Balcony'],
    featuresKz: ['Тегін WiFi', 'Кондиционер', 'Жалпақ экранды теледидар', 'Кофе машинасы', 'Балкон'],
    available: true,
    bookedDates: [],
    rating: 4.9,
    reviews: 234
  },
  {
    id: '2',
    name: 'Traditional Yurt Room',
    nameKz: 'Дәстүрлі Киіз үй Бөлмесі',
    category: 'Standard',
    categoryKz: 'Стандарт',
    description: 'Unique room designed to replicate a traditional Kazakh yurt with authentic decorations.',
    descriptionKz: 'Дәстүрлі қазақ киіз үйін нақты әшекейлермен қайталайтын ерекше бөлме.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
    ],
    floor: 5,
    maxGuests: 2,
    size: 35,
    amenities: ['Queen Bed', 'Mini Fridge', 'Traditional Decor'],
    amenitiesKz: ['Королева төсек', 'Мини тоңазытқыш', 'Дәстүрлі әшекей'],
    features: ['Free WiFi', 'Air Conditioning', 'TV', 'Tea Set'],
    featuresKz: ['Тегін WiFi', 'Кондиционер', 'Теледидар', 'Шай жиынтығы'],
    available: true,
    bookedDates: [],
    rating: 4.7,
    reviews: 189
  },
  {
    id: '3',
    name: 'Presidential Steppe Suite',
    nameKz: 'Президенттік Дала Люксі',
    category: 'Presidential',
    categoryKz: 'Президенттік',
    description: 'Our finest suite with premium furnishings, private terrace, and exclusive services.',
    descriptionKz: 'Премиум жиһаз, жеке терраса және эксклюзивті қызметтері бар біздің ең үздік люксіміз.',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
    ],
    floor: 15,
    maxGuests: 4,
    size: 85,
    amenities: ['King Bed', 'Living Room', 'Dining Area', 'Bar', 'Jacuzzi'],
    amenitiesKz: ['Король төсегі', 'Қонақ бөлме', 'Тамақтану аймағы', 'Бар', 'Джакузи'],
    features: ['Free WiFi', 'Smart Home', 'Private Terrace', 'Butler Service', 'Premium Minibar'],
    featuresKz: ['Тегін WiFi', 'Ақылды үй', 'Жеке терраса', 'Дворецкий қызметі', 'Премиум минибар'],
    available: true,
    bookedDates: [],
    rating: 5.0,
    reviews: 87
  },
  {
    id: '4',
    name: 'Comfort Family Room',
    nameKz: 'Жайлы Отбасылық Бөлме',
    category: 'Family',
    categoryKz: 'Отбасылық',
    description: 'Perfect for families, featuring two bedrooms and a connecting living area.',
    descriptionKz: 'Отбасыларға арналған керемет, екі жатын бөлме және қосылған қонақ бөлме бар.',
    price: 52000,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ],
    floor: 8,
    maxGuests: 5,
    size: 65,
    amenities: ['Two Bedrooms', 'Living Area', 'Kids Amenities', 'Extra Beds Available'],
    amenitiesKz: ['Екі жатын бөлме', 'Қонақ аймағы', 'Балалар үшін жайлылықтар', 'Қосымша төсектер бар'],
    features: ['Free WiFi', 'Two Bathrooms', 'Large TV', 'Kitchen Corner'],
    featuresKz: ['Тегін WiFi', 'Екі жуынатын бөлме', 'Үлкен теледидар', 'Ас үй бұрышы'],
    available: true,
    bookedDates: [],
    rating: 4.8,
    reviews: 156
  },
  {
    id: '5',
    name: 'Business Executive Room',
    nameKz: 'Бизнес Атқарушы Бөлме',
    category: 'Business',
    categoryKz: 'Бизнес',
    description: 'Designed for business travelers with workspace and high-speed internet.',
    descriptionKz: 'Жұмыс орны және жоғары жылдамдықты интернеті бар іс-сапар саяхатшыларына арналған.',
    price: 38000,
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800'
    ],
    floor: 10,
    maxGuests: 2,
    size: 40,
    amenities: ['Work Desk', 'Ergonomic Chair', 'Meeting Space', 'Printer Access'],
    amenitiesKz: ['Жұмыс үстелі', 'Эргономикалық креслосы', 'Кездесу орны', 'Принтер қол жеткізу'],
    features: ['Ultra-fast WiFi', 'Multi-plug Sockets', 'Nespresso Machine', 'Executive Lounge Access'],
    featuresKz: ['Өте жылдам WiFi', 'Көп ұяшықты розеткалар', 'Nespresso машинасы', 'Атқарушы залына кіру'],
    available: true,
    bookedDates: [],
    rating: 4.6,
    reviews: 203
  },
  {
    id: '6',
    name: 'Cozy Standard Room',
    nameKz: 'Жайлы Стандарт Бөлме',
    category: 'Standard',
    categoryKz: 'Стандарт',
    description: 'Comfortable and affordable room with all essential amenities.',
    descriptionKz: 'Барлық қажетті жайлылықтары бар жайлы және қолжетімді бөлме.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800'
    ],
    floor: 3,
    maxGuests: 2,
    size: 28,
    amenities: ['Double Bed', 'Wardrobe', 'Reading Light'],
    amenitiesKz: ['Қос төсек', 'Киім шкафы', 'Оқу шамы'],
    features: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
    featuresKz: ['Тегін WiFi', 'Кондиционер', 'Теледидар', 'Жеке жуынатын бөлме'],
    available: true,
    bookedDates: [],
    rating: 4.5,
    reviews: 421
  }
];

export const services: Service[] = [
  {
    id: 's1',
    name: 'Breakfast with Beautiful View',
    nameKz: 'Әдемі көрініспен таңғы ас',
    description: 'Start your day with a delicious breakfast while enjoying panoramic mountain views',
    descriptionKz: 'Тау панорамалық көрінісін тамашалай отырып, дәмді таңғы аспен күніңізді бастаңыз',
    price: 3500,
    icon: 'Coffee',
    available: true
  },
  {
    id: 's2',
    name: 'Lunch & Dinner',
    nameKz: 'Түскі ас және кешкі ас',
    description: 'Traditional Kazakh and international cuisine',
    descriptionKz: 'Дәстүрлі қазақ және халықаралық ас',
    price: 6500,
    icon: 'UtensilsCrossed',
    available: true
  },
  {
    id: 's3',
    name: 'Restaurant',
    nameKz: 'Мейрамхана',
    description: 'Premium dining experience with live music',
    descriptionKz: 'Тікелей музыкамен премиум тамақтану тәжірибесі',
    price: 8000,
    icon: 'ChefHat',
    available: true
  },
  {
    id: 's4',
    name: 'Swimming Pool',
    nameKz: 'Жүзу бассейні',
    description: 'Indoor heated pool with spa facilities',
    descriptionKz: 'Спа мүмкіндіктері бар жабық жылытылған бассейн',
    price: 2500,
    icon: 'Waves',
    available: true
  },
  {
    id: 's5',
    name: 'SPA & Wellness',
    nameKz: 'СПА және денсаулық',
    description: 'Relaxation and rejuvenation treatments',
    descriptionKz: 'Демалыс және жасарту процедуралары',
    price: 15000,
    icon: 'Sparkles',
    available: true
  },
  {
    id: 's6',
    name: 'Massage',
    nameKz: 'Массаж',
    description: 'Professional massage therapy',
    descriptionKz: 'Кәсіби массаж терапиясы',
    price: 12000,
    icon: 'Hand',
    available: true
  },
  {
    id: 's7',
    name: 'Waiting Room',
    nameKz: 'Күту бөлмесі',
    description: 'Comfortable lounge area',
    descriptionKz: 'Жайлы демалыс аймағы',
    price: 0,
    icon: 'Armchair',
    available: true
  },
  {
    id: 's8',
    name: 'Library',
    nameKz: 'Кітапхана',
    description: 'Quiet reading space with extensive book collection',
    descriptionKz: 'Кең кітап жиынтығы бар тыныш оқу орны',
    price: 0,
    icon: 'BookOpen',
    available: true
  },
  {
    id: 's9',
    name: 'Room Service',
    nameKz: 'Бөлме қызметі',
    description: '24/7 in-room dining and services',
    descriptionKz: '24/7 бөлмеде тамақтану және қызметтер',
    price: 1500,
    icon: 'BellRing',
    available: true
  },
  {
    id: 's10',
    name: 'Playground',
    nameKz: 'Ойын алаңы',
    description: 'Safe and fun area for children',
    descriptionKz: 'Балаларға арналған қауіпсіз және қызықты аймақ',
    price: 0,
    icon: 'Gamepad2',
    available: true
  },
  {
    id: 's11',
    name: 'Parking',
    nameKz: 'Паркинг',
    description: 'Secure underground parking',
    descriptionKz: 'Қауіпсіз жерасты паркингі',
    price: 2000,
    icon: 'Car',
    available: true
  },
  {
    id: 's12',
    name: 'Garden Walking',
    nameKz: 'Бақта серуендеу',
    description: 'Beautiful garden with traditional Kazakh landscaping',
    descriptionKz: 'Дәстүрлі қазақ ландшафтымен әдемі бақ',
    price: 0,
    icon: 'Trees',
    available: true
  }
];

export const paidExtras: PaidExtra[] = [
  {
    id: 'e1',
    name: 'Premium Towel Set',
    nameKz: 'Премиум сүлгі жиынтығы',
    price: 1500
  },
  {
    id: 'e2',
    name: 'Extra Pillow',
    nameKz: 'Қосымша жастық',
    price: 800
  },
  {
    id: 'e3',
    name: 'Luxury Bathrobe',
    nameKz: 'Люкс халаты',
    price: 2500
  },
  {
    id: 'e4',
    name: 'Slippers',
    nameKz: 'Тапочкалар',
    price: 500
  },
  {
    id: 'e5',
    name: 'Mini Bar Refill',
    nameKz: 'Мини бар толықтыру',
    price: 8000
  }
];

export const news: News[] = [
  {
    id: 'n1',
    title: 'Grand Opening of New Spa Wing',
    titleKz: 'Жаңа СПА қанатының ашылуы',
    content: 'We are excited to announce the opening of our brand new spa facilities.',
    contentKz: 'Біз жаңа СПА мүмкіндіктерімізді ашуды жариялауға қуаныштымыз.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    date: new Date('2024-11-15'),
    category: 'Facilities'
  },
  {
    id: 'n2',
    title: 'Special Winter Promotion',
    titleKz: 'Арнайы қысқы акция',
    content: 'Book now and get 20% off on all rooms during winter season.',
    contentKz: 'Қазір брондаңыз және қыс маусымында барлық бөлмелерге 20% жеңілдік алыңыз.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    date: new Date('2024-11-10'),
    category: 'Promotion'
  },
  {
    id: 'n3',
    title: 'Traditional Nauryz Celebration',
    titleKz: 'Дәстүрлі Наурыз мерекесі',
    content: 'Join us for special Nauryz festivities with traditional food and entertainment.',
    contentKz: 'Дәстүрлі тағам мен ойын-сауықпен арнайы Наурыз мейрамына қосылыңыз.',
    image: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?w=800',
    date: new Date('2024-03-20'),
    category: 'Events'
  }
];
