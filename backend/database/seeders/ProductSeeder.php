<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'title' => 'Nike Air Max 90',
                'price' => 129.99,
                'description' => 'Classic running shoes with Air Max cushioning. Perfect for daily wear and light running.',
                'category' => 'Running',
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            ],
            [
                'title' => 'Adidas Ultraboost 22',
                'price' => 179.99,
                'description' => 'Premium running shoes with Boost technology for maximum comfort and energy return.',
                'category' => 'Running',
                'image' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
            ],
            [
                'title' => 'Converse Chuck Taylor All Star',
                'price' => 59.99,
                'description' => 'Iconic canvas sneakers. Timeless style that goes with everything.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
            ],
            [
                'title' => 'Vans Old Skool',
                'price' => 65.00,
                'description' => 'Classic skate shoes with the iconic side stripe. Perfect for street style.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
            ],
            [
                'title' => 'Jordan 1 Retro High',
                'price' => 170.00,
                'description' => 'Legendary basketball shoes. The classic design that started it all.',
                'category' => 'Basketball',
                'image' => 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500',
            ],
            [
                'title' => 'New Balance 574',
                'price' => 79.99,
                'description' => 'Comfortable everyday sneakers with superior cushioning. Made for all-day comfort.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500',
            ],
            [
                'title' => 'Puma Suede Classic',
                'price' => 64.99,
                'description' => 'Classic suede sneakers with timeless style. Perfect for casual wear.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
            ],
            [
                'title' => 'Nike Dunk Low',
                'price' => 100.00,
                'description' => 'Versatile skate-inspired sneakers. Great for both style and performance.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500',
            ],
            [
                'title' => 'Adidas Stan Smith',
                'price' => 75.00,
                'description' => 'Iconic tennis shoes with minimalist design. A true classic.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
            ],
            [
                'title' => 'Reebok Classic Leather',
                'price' => 69.99,
                'description' => 'Timeless leather sneakers with retro style. Comfortable and stylish.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            ],
            [
                'title' => 'Nike Air Force 1',
                'price' => 90.00,
                'description' => 'The original basketball shoe. Clean, classic, and always in style.',
                'category' => 'Basketball',
                'image' => 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500',
            ],
            [
                'title' => 'Asics Gel-Kayano 28',
                'price' => 159.99,
                'description' => 'Premium stability running shoes with Gel cushioning. Perfect for long runs.',
                'category' => 'Running',
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
            ],
            [
                'title' => 'Nike Blazer Mid',
                'price' => 85.00,
                'description' => 'Retro basketball-inspired sneakers. High-top design with classic style.',
                'category' => 'Basketball',
                'image' => 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
            ],
            [
                'title' => 'Adidas Samba',
                'price' => 80.00,
                'description' => 'Classic indoor soccer shoes. Now a streetwear staple.',
                'category' => 'Casual',
                'image' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
            ],
            [
                'title' => 'Nike React Infinity Run',
                'price' => 150.00,
                'description' => 'Advanced running shoes with React foam. Designed to reduce injury risk.',
                'category' => 'Running',
                'image' => 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
