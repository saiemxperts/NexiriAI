import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const rows = await prisma.marketCapSnapshot.findMany({
        orderBy: { date: 'asc' },
    });

    const points = rows.map((r) => ({
        time: Math.floor(r.date.getTime() / 1000),
        value: Number(r.value),
    }));

    return NextResponse.json({ points });
}
