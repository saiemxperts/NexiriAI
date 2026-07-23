import { PrismaClient } from '../lib/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    const res = await fetch('https://api.coingecko.com/api/v3/global', { cache: 'no-store' });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const json = await res.json();
    const value = json?.data?.total_market_cap?.usd;
    if (typeof value !== 'number') throw new Error('Missing total_market_cap.usd');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.marketCapSnapshot.upsert({
        where: { date: today },
        create: { date: today, value },
        update: { value },
    });

    console.log(`Saved market cap for ${today.toISOString()}: ${value}`);
}

main()
    .catch((err) => {
        console.error('Failed to update market cap:', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());