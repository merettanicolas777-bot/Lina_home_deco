/**
 * Productos de ejemplo usados en "modo demo", cuando todavía no hay
 * credenciales de Supabase en el .env. Se guardan en localStorage para
 * que el panel de administración sea explorable.
 */
export const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Vela de Soja Ámbar & Vainilla',
    description:
      'Vela artesanal de cera de soja 100% vegetal, con mecha de algodón y 45 horas de duración.\n\nNotas: ámbar, vainilla y madera de sándalo. Recipiente de vidrio ámbar reutilizable, ideal para el living o la mesa de luz.',
    price: 18400,
    category: 'Velas',
    image_url: '/images/product-vela.svg',
    in_stock: true,
    created_at: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'demo-2',
    name: 'Difusor de Varillas Lino & Neroli',
    description:
      'Difusor de 200 ml con 6 varillas de ratán natural.\n\nNotas: lino recién lavado, neroli y un fondo de almizcle blanco. Perfuma espacios de hasta 25 m² durante 3 meses.',
    price: 24600,
    category: 'Difusores',
    image_url: '/images/product-difusor.svg',
    in_stock: true,
    created_at: '2026-11-09T10:00:00.000Z',
  },
  {
    id: 'demo-3',
    name: 'Home Spray Jardín de Té',
    description:
      'Bruma para ambiente y textiles de 100 ml, con válvula de niebla fina.\n\nNotas: té verde, hoja de higuera y almizcle. Apto para ropa de cama, cortinas y sillones.',
    price: 12900,
    category: 'Home Sprays',
    image_url: '/images/product-spray.svg',
    in_stock: true,
    created_at: '2026-11-08T10:00:00.000Z',
  },
  {
    id: 'demo-4',
    name: 'Manta de Algodón Crudo',
    description:
      'Tejido de algodón con textura de lino y flecos anudados a mano.\n\nMedidas: 130 x 170 cm. Lavar a mano o programa delicado, secar a la sombra.',
    price: 31500,
    category: 'Textil',
    image_url: '/images/product-textil.svg',
    in_stock: true,
    created_at: '2026-11-07T10:00:00.000Z',
  },
  {
    id: 'demo-5',
    name: 'Bandeja Oval de Madera',
    description:
      'Bandeja tallada en madera de paraíso con terminación mate al aceite.\n\nMedidas: 32 x 18 cm. Perfecta para armar un rincón de aromas junto a la vela y el difusor.',
    price: 19800,
    category: 'Deco',
    image_url: '/images/product-bandeja.svg',
    in_stock: true,
    created_at: '2026-11-06T10:00:00.000Z',
  },
  {
    id: 'demo-6',
    name: 'Jarrón de Cerámica Arena',
    description:
      'Pieza torneada a mano en cerámica mate color arena, 22 cm de alto.\n\nCada unidad es única: puede presentar pequeñas variaciones de textura y tono.',
    price: 22400,
    category: 'Deco',
    image_url: '/images/product-jarron.svg',
    in_stock: true,
    created_at: '2026-11-05T10:00:00.000Z',
  },
  {
    id: 'demo-7',
    name: 'Vela de Soja Higo & Cedro',
    description:
      'Perfil profundo y amaderado: higo maduro, cedro y un fondo apenas dulce de musgo.\n\nCera de soja, mecha de algodón, 40 horas de aroma. Ideal para el escritorio.',
    price: 17200,
    category: 'Velas',
    image_url: '/images/product-vela-2.svg',
    in_stock: true,
    created_at: '2026-11-04T10:00:00.000Z',
  },
  {
    id: 'demo-8',
    name: 'Difusor de Varillas Sándalo',
    description:
      'Notas amaderadas y ligeramente ahumadas para rincones de lectura.\n\nIncluye 6 varillas de ratán y aceite de 200 ml. Rotar las varillas cada semana intensifica el aroma.',
    price: 23800,
    category: 'Difusores',
    image_url: '/images/product-difusor.svg',
    in_stock: false,
    created_at: '2026-11-03T10:00:00.000Z',
  },
]

export const CATEGORIES = ['Velas', 'Difusores', 'Home Sprays', 'Textil', 'Deco']
