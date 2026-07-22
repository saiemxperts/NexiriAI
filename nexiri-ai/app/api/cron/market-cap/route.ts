import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function fetchGlobalMarketCap(): Promise<number> {
    const res = await fetch('https://api.coingecko.com/api/v3/global', { cache: 'no-store' });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const json = await res.json();
    const value = json?.data?.total_market_cap?.usd;
    if (typeof value !== 'number') throw new Error('Missing total_market_cap.usd');
    return value;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Only Vercel's own cron trigger should be able to call this
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const value = await fetchGlobalMarketCap();

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // normalize to midnight so it matches one row per day

        await prisma.marketCapSnapshot.upsert({
            where: { date: today },
            create: { date: today, value },
            update: { value }, // if run twice same day, updates instead of erroring
        });

        return NextResponse.json({ ok: true, date: today, value });
    } catch (err) {
        console.error('market-cap cron failed', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}