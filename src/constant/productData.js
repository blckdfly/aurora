import Product1 from '../assets/marketProduct/Product1.png';
import Product2 from '../assets/marketProduct/Product2.png';
import Product3 from '../assets/marketProduct/Product3.png';
import Product4 from '../assets/marketProduct/Product4.png';
import Product5 from '../assets/marketProduct/Product5.png';
import Product6 from '../assets/marketProduct/Product6.png';
import Product7 from '../assets/marketProduct/Product7.png';
import Product8 from '../assets/marketProduct/Product8.png';
import Product9 from '../assets/marketProduct/Product9.png';
import Product10 from '../assets/marketProduct/Product10.png';
import Product11 from '../assets/marketProduct/Product11.png';
import Product12 from '../assets/marketProduct/Product12.png';

export const STATUS = {
    AVAILABLE: 'AVAILABLE',
    PENDING_SHIPPING: 'PENDING_SHIPPING',
    SHIPPED: 'SHIPPED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    SOLD: 'SOLD'
  };
  
export const dummyMarketProducts = [
    {
      id: 1,
      name: 'Ins. Jacket Bastianisee',
      description: 'Soft hoodie jacket in a trendy mustard yellow shade, offering comfort and style.',
      price: '0.01',
      image: Product1,
      seller: '0xdC25EF3F5B8A186998338A2ADA83795FBA2D695E',
      buyer: null,
      status: STATUS.AVAILABLE,
      trackingNumber: "",
      createdAt: '2023-12-20' 
    },
    {
      id: 2,
      name: 'Nordic Thermal Parka',
      description: 'Wind-resistant parka with warm lining and classic design, ideal for outdoor adventures.',
      price: '0.05',
      image: Product2,
      seller: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      buyer: null,
      status: STATUS.AVAILABLE,
      trackingNumber: "",
      createdAt: '2023-12-18' 
    },
    {
      id: 15,
      name: 'Scarpa Trails',
      description: 'Durable hiking shoes with a gray and yellow design, featuring anti-slip soles for rough terrains.',
      price: '0.027',
      image: Product11,
      seller: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
      buyer: null,
      status: STATUS.AVAILABLE,
      trackingNumber: "",
      createdAt: '2023-12-18' 
    },
    {
      id: 16,
      name: 'Evergreen Sherpa Sweater',
      description: 'Warm knitted sweater with a soft texture and moss green color, great for casual everyday looks.',
      price: '0.033',
      image: Product12,
      seller: '0x40b38765696e3d5d8d9d834d8aad4bb6e418e489',
      buyer: null,
      status: STATUS.AVAILABLE,
      trackingNumber: "",
      createdAt: '2023-12-18' 
    },
];
  
export const dummyMyListings = [
    {
      id: 4,
      name: 'Glacier Insulated Jacket',
      description: 'Lightweight windbreaker in an elegant navy color, designed to protect against wind and light rain.',
      price: '0.02',
      image: Product3,
      seller: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      buyer: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      status: STATUS.PENDING_SHIPPING,
      trackingNumber: "",
      createdAt: '2024-01-17'
    },
    {
      id: 5,
      name: 'Highland Puffer Jacket',
      description: 'Stylish and cozy teddy jacket, providing extra warmth with a casual look..',
      price: '0.017',
      image: Product4,
      seller: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      buyer: '0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a',
      status: STATUS.SHIPPED,
      trackingNumber: "ALY-847362-XQZ",
      createdAt: '2024-01-16'
    },
    {
      id: 12,
      name: 'Summit Down Jacket',
      description: 'Eye-catching blue puffer jacket, designed for optimal warmth in winter conditions.',
      price: '0.02',
      image: Product5,
      seller: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      buyer: '0xda9dfa130df4de4673b89022ee50ff26f6ea73cf',
      status: STATUS.SHIPPED,
      trackingNumber: "ALY-501937-BLM",
      createdAt: '2024-01-16'
    },
    {
      id: 13,
      name: 'Cozy Fleece Jacket',
      description: 'Lightweight sports jacket with a vibrant red and blue color combination, perfect for outdoor activities.',
      price: '0.032',
      image: Product6,
      seller: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      buyer: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
      status: STATUS.SHIPPED,
      trackingNumber: "ALY-715849-VWX",
      createdAt: '2024-01-16'
    }
];
  
export const dummyMyPurchases = [
    {
      id: 6,
      name: 'Sierra Hiking',
      description: 'Lightweight and stylish slip-on shoes from The North Face, perfect for everyday wear.',
      price: '0.012',
      image: Product7,
      seller: '0xbeb5fc579115071764c7423a4f12edde41f106ed',
      buyer: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      status: STATUS.SHIPPED,
      trackingNumber: "ALY-920384-ZTY",
      createdAt: '2024-01-14'
    },
    {
      id: 7,
      name: 'Winter Expedition Parka',
      description: 'Soft and cozy fleece jacket, ideal for staying warm during cold weather.',
      price: '0.015',
      image: Product8,
      seller: '0xa6715eafe5d215b82cb9e90a9d6c8970a7c90033',
      buyer: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      status: STATUS.COMPLETED,
      trackingNumber: "ALY-159753-NOP",
      createdAt: '2024-01-13'
    },
    {
      id: 8,
      name: 'Winter Wander Jacket',
      description: 'Windproof down jacket with premium insulation, providing maximum warmth in chilly conditions..',
      price: '0.011',
      image: Product9,
      seller: '0x0e58e8993100f1cbe45376c410f97f4893d9bfcd',
      buyer: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      status: STATUS.COMPLETED,
      trackingNumber: "ALY-864209-MNB",
      createdAt: '2024-01-13'
    },
    {
      id: 9,
      name: 'Peak Climber Jacket',
      description: 'Comfortable and fluffy brown vest, perfect for casual and cozy outfits.',
      price: '0.019',
      image: Product10,
      seller: '0xe92d1a43df510f82c66382592a047d288f85226f',
      buyer: '0x8b31b47788ce18498369F7685ABaB9123B040e0c',
      status: STATUS.COMPLETED,
      trackingNumber: "ALY-753198-JHG",
      createdAt: '2024-01-13'
    }
];