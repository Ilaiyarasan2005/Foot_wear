// constants.ts
import { Review } from './types';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be hashed and stored securely.

export const MOCK_PRODUCTS = [
  {
    id: 'prod1',
    title: 'Sporty Air Max',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    price: 120.00,
    availableSizes: ['US7', 'US8', 'US9', 'US10'],
    description: 'Lightweight and breathable, perfect for running and everyday wear. Features advanced cushioning for maximum comfort.',
    dateAdded: new Date('2023-01-15T10:00:00Z').toISOString(),
    stockQuantity: 10,
  },
  {
    id: 'prod2',
    title: 'Classic Leather Boots',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    price: 180.00,
    availableSizes: ['US8', 'US9', 'US10', 'US11'],
    description: 'Durable leather boots with a timeless design. Ideal for both casual outings and rugged adventures.',
    dateAdded: new Date('2023-02-20T11:30:00Z').toISOString(),
    stockQuantity: 15,
  },
  {
    id: 'prod3',
    title: 'Elegant High Heels',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    price: 95.00,
    availableSizes: ['US6', 'US7', 'US8', 'US9'],
    description: 'Sophisticated high heels designed for elegance and comfort. Perfect for special occasions.',
    dateAdded: new Date('2023-03-01T14:00:00Z').toISOString(),
    stockQuantity: 7,
  },
  {
    id: 'prod4',
    title: 'Comfortable Sneakers',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    price: 85.00,
    availableSizes: ['US7', 'US8', 'US9', 'US10', 'US11'],
    description: 'All-day comfort with a stylish look. Great for walking, light sports, or just relaxing.',
    dateAdded: new Date('2023-04-10T09:15:00Z').toISOString(),
    stockQuantity: 20,
  },
  {
    id: 'prod5',
    title: 'Kids\' Fun Trainers',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    price: 50.00,
    availableSizes: ['KID10', 'KID11', 'KID12', 'KID13'],
    description: 'Colorful and durable trainers for active kids. Designed for play and everyday adventures.',
    dateAdded: new Date('2023-05-22T16:45:00Z').toISOString(),
    stockQuantity: 12,
  },
  {
    id: 'prod6',
    title: 'Hiking Trail Shoes',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    price: 140.00,
    availableSizes: ['US9', 'US10', 'US11', 'US12'],
    description: 'Robust and waterproof hiking shoes, providing excellent grip and support on challenging terrains.',
    dateAdded: new Date('2023-06-05T08:00:00Z').toISOString(),
    stockQuantity: 8,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev1',
    productId: 'prod1',
    userName: 'Rajesh K.',
    rating: 5,
    comment: 'These shoes are incredibly comfortable and stylish. Perfect for my daily runs!',
    date: new Date('2024-07-01T09:00:00Z').toISOString(),
  },
  {
    id: 'rev2',
    productId: 'prod1',
    userName: 'Priya S.',
    rating: 4,
    comment: 'Great value for money. A bit snug at first but broke in quickly. Would recommend.',
    date: new Date('2024-07-03T14:30:00Z').toISOString(),
  },
  {
    id: 'rev3',
    productId: 'prod2',
    userName: 'Amit V.',
    rating: 5,
    comment: 'Classic design and very durable. I wear them everywhere!',
    date: new Date('2024-06-28T11:00:00Z').toISOString(),
  },
  {
    id: 'rev4',
    productId: 'prod3',
    userName: 'Sneha L.',
    rating: 3,
    comment: 'Beautiful heels but a little uncomfortable for long periods. Still love them for events.',
    date: new Date('2024-07-02T18:00:00Z').toISOString(),
  },
  {
    id: 'rev5',
    productId: 'prod4',
    userName: 'Karthik R.',
    rating: 5,
    comment: 'Best everyday sneakers. Super comfortable for long walks.',
    date: new Date('2024-07-04T10:00:00Z').toISOString(),
  },
];