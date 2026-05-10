import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.postReaction.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.tripShare.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.tripNote.deleteMany();
  await prisma.packingItem.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.sectionActivity.deleteMany();
  await prisma.itinerarySection.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activityCatalog.deleteMany();
  await prisma.city.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('Password1', 12);

  // 3 Users
  const [admin, aksh, dixit] = await Promise.all([
    prisma.user.create({ data: { username: 'krish_admin', first_name: 'Krish', last_name: 'Gupta', email: 'krish@traveloop.com', password_hash: hash, phone: '+919876543210', city: 'Mumbai', country: 'India', role: 'ADMIN', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=krish' } }),
    prisma.user.create({ data: { username: 'aksh_traveler', first_name: 'Aksh', last_name: 'Narwani', email: 'aksh@traveloop.com', password_hash: hash, phone: '+919876543211', city: 'Delhi', country: 'India', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aksh' } }),
    prisma.user.create({ data: { username: 'dixit_explorer', first_name: 'Dixit', last_name: 'Malviya', email: 'dixit@traveloop.com', password_hash: hash, phone: '+919876543212', city: 'Jaipur', country: 'India', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dixit' } }),
  ]);
  console.log('✅ 3 users created');

  // 10 Cities
  const cityData = [
    { name: 'Paris', country: 'France', region: 'Europe', cost_index: 85, popularity_score: 98, description: 'The City of Light, known for the Eiffel Tower, art museums, and exquisite cuisine.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
    { name: 'Tokyo', country: 'Japan', region: 'Asia', cost_index: 80, popularity_score: 95, description: 'A vibrant metropolis blending ultramodern and traditional, from neon-lit skyscrapers to historic temples.', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    { name: 'Bali', country: 'Indonesia', region: 'Asia', cost_index: 35, popularity_score: 92, description: 'Tropical paradise with stunning beaches, rice terraces, and ancient temples.', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
    { name: 'New York', country: 'USA', region: 'North America', cost_index: 90, popularity_score: 97, description: 'The Big Apple — world-class museums, Broadway shows, and iconic skyline.', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
    { name: 'Dubai', country: 'UAE', region: 'Middle East', cost_index: 88, popularity_score: 90, description: 'Futuristic cityscape with the worlds tallest building, luxury shopping, and desert adventures.', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
    { name: 'Rome', country: 'Italy', region: 'Europe', cost_index: 70, popularity_score: 93, description: 'The Eternal City with ancient ruins, Vatican City, and world-famous Italian cuisine.', image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
    { name: 'Bangkok', country: 'Thailand', region: 'Asia', cost_index: 30, popularity_score: 88, description: 'Bustling capital known for ornate temples, vibrant street life, and incredible food.', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800' },
    { name: 'London', country: 'UK', region: 'Europe', cost_index: 92, popularity_score: 96, description: 'Historic capital with royal palaces, world-class museums, and diverse culture.', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
    { name: 'Sydney', country: 'Australia', region: 'Oceania', cost_index: 82, popularity_score: 89, description: 'Harbor city famous for its Opera House, Bondi Beach, and stunning coastal walks.', image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800' },
    { name: 'Jaipur', country: 'India', region: 'Asia', cost_index: 20, popularity_score: 85, description: 'The Pink City — majestic forts, vibrant bazaars, and rich Rajasthani culture.', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800' },
  ];
  const cities = await Promise.all(cityData.map(c => prisma.city.create({ data: c })));
  console.log('✅ 10 cities created');

  // 6 Expense Categories
  const catData = [
    { name: 'Hotel', icon: '🏨', color_hex: '#4F46E5' },
    { name: 'Flight', icon: '✈️', color_hex: '#0EA5E9' },
    { name: 'Food', icon: '🍽️', color_hex: '#F59E0B' },
    { name: 'Transport', icon: '🚕', color_hex: '#10B981' },
    { name: 'Activity', icon: '🎯', color_hex: '#8B5CF6' },
    { name: 'Other', icon: '📦', color_hex: '#6B7280' },
  ];
  const categories = await Promise.all(catData.map(c => prisma.expenseCategory.create({ data: c })));
  console.log('✅ 6 expense categories created');

  // 50 Activities (5 per city)
  const activityTypes = ['SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'STAY'] as const;
  const actTemplates = [
    { suffix: 'City Tour', cat: 'SIGHTSEEING' as const, cost: 45, dur: 180 },
    { suffix: 'Food Walk', cat: 'FOOD' as const, cost: 35, dur: 120 },
    { suffix: 'Adventure Trek', cat: 'ADVENTURE' as const, cost: 80, dur: 240 },
    { suffix: 'Museum Visit', cat: 'CULTURE' as const, cost: 25, dur: 150 },
    { suffix: 'Boutique Hotel', cat: 'STAY' as const, cost: 150, dur: 1440 },
  ];
  for (const city of cities) {
    for (const t of actTemplates) {
      await prisma.activityCatalog.create({
        data: { city_id: city.id, name: `${city.name} ${t.suffix}`, category: t.cat, description: `Experience the best ${t.suffix.toLowerCase()} in ${city.name}`, avg_cost: t.cost * (city.cost_index / 50), duration_mins: t.dur },
      });
    }
  }
  console.log('✅ 50 activities created');

  // 5 Trips
  const tripData = [
    { user: aksh, name: 'European Adventure', place: 'Paris', city: cities[0], status: 'COMPLETED' as const, start: '2025-06-01', end: '2025-06-15', budget: 5000 },
    { user: aksh, name: 'Tokyo Discovery', place: 'Tokyo', city: cities[1], status: 'ONGOING' as const, start: '2025-12-01', end: '2025-12-14', budget: 4500 },
    { user: dixit, name: 'Bali Retreat', place: 'Bali', city: cities[2], status: 'PLANNED' as const, start: '2026-03-01', end: '2026-03-10', budget: 3000 },
    { user: dixit, name: 'NYC Weekend', place: 'New York', city: cities[3], status: 'PLANNED' as const, start: '2026-05-15', end: '2026-05-20', budget: 3500 },
    { user: admin, name: 'Dubai Luxury', place: 'Dubai', city: cities[4], status: 'COMPLETED' as const, start: '2025-01-10', end: '2025-01-20', budget: 8000 },
  ];

  for (const td of tripData) {
    const trip = await prisma.trip.create({
      data: { user_id: td.user.id, name: td.name, place: td.place, start_date: new Date(td.start), end_date: new Date(td.end), status: td.status, total_budget: td.budget, is_public: true },
    });

    // Stop
    await prisma.tripStop.create({
      data: { trip_id: trip.id, city_id: td.city.id, order_index: 0, arrival_date: new Date(td.start), departure_date: new Date(td.end) },
    });

    // 2 Sections per trip
    for (let s = 0; s < 2; s++) {
      const startD = new Date(td.start);
      startD.setDate(startD.getDate() + s * 5);
      const endD = new Date(startD);
      endD.setDate(endD.getDate() + 4);

      const section = await prisma.itinerarySection.create({
        data: { trip_id: trip.id, title: `Section ${s + 1}: ${s === 0 ? 'Exploration' : 'Relaxation'}`, description: `${s === 0 ? 'Explore the city highlights' : 'Wind down and enjoy local culture'}`, date_from: startD, date_to: endD, budget: td.budget / 2, order_index: s },
      });

      // 2 activities per section
      const cityActivities = await prisma.activityCatalog.findMany({ where: { city_id: td.city.id }, take: 2, skip: s * 2 });
      for (const act of cityActivities) {
        await prisma.sectionActivity.create({
          data: { section_id: section.id, activity_id: act.id, custom_name: act.name, cost: act.avg_cost, duration_mins: act.duration_mins || 120 },
        });
      }
    }

    // 3 Expenses per trip
    for (let e = 0; e < 3; e++) {
      const cat = categories[e % categories.length];
      const unitCost = 50 + Math.random() * 200;
      await prisma.expense.create({
        data: { trip_id: trip.id, user_id: td.user.id, category_id: cat.id, description: `${cat.name} expense for ${td.name}`, quantity: 1 + Math.floor(Math.random() * 3), unit_cost: Math.round(unitCost * 100) / 100, amount: Math.round(unitCost * 100) / 100, expense_date: new Date(td.start), payment_status: td.status === 'COMPLETED' ? 'PAID' : 'PENDING' },
      });
    }

    // Packing items
    const packItems = [
      { name: 'Passport', category: 'DOCUMENTS' as const },
      { name: 'Travel Insurance', category: 'DOCUMENTS' as const },
      { name: 'T-Shirts', category: 'CLOTHING' as const },
      { name: 'Jacket', category: 'CLOTHING' as const },
      { name: 'Phone Charger', category: 'ELECTRONICS' as const },
      { name: 'Camera', category: 'ELECTRONICS' as const },
    ];
    for (const pi of packItems) {
      await prisma.packingItem.create({
        data: { trip_id: trip.id, user_id: td.user.id, name: pi.name, category: pi.category, is_packed: td.status === 'COMPLETED' },
      });
    }

    // 2 Notes per trip
    await prisma.tripNote.create({
      data: { trip_id: trip.id, user_id: td.user.id, title: 'Hotel Check-in', content: `Check-in at the hotel in ${td.place}. Room details and WiFi password noted.`, note_date: new Date(td.start) },
    });
    await prisma.tripNote.create({
      data: { trip_id: trip.id, user_id: td.user.id, title: 'Local Tips', content: `Best restaurants and hidden gems discovered in ${td.place}.`, note_date: new Date(td.start) },
    });
  }
  console.log('✅ 5 trips with sections, expenses, packing, notes created');

  // 3 Community posts
  await prisma.communityPost.create({ data: { user_id: aksh.id, title: 'My Paris Adventure 🗼', content: 'Just got back from an amazing trip to Paris! The Eiffel Tower at sunset was breathtaking. Here are my top recommendations for first-time visitors...', is_public: true } });
  await prisma.communityPost.create({ data: { user_id: dixit.id, title: 'Bali on a Budget 🌴', content: 'You dont need to spend a fortune to enjoy Bali. Here is how I planned a 10-day trip for under $1000 including flights...', is_public: true } });
  await prisma.communityPost.create({ data: { user_id: admin.id, title: 'Dubai Travel Guide ✨', content: 'Dubai is a city of contrasts - from futuristic skyscrapers to traditional souks. Here is my comprehensive guide...', is_public: true } });
  console.log('✅ 3 community posts created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
