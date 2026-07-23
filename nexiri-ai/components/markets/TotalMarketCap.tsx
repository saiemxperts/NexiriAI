'use client';

import { useEffect, useRef, useState } from 'react';
import AreaChart, {
    type AreaChartHandle,
    type ChartPoint,
    type UTCTimestamp,
} from '../../components/charts/areaChart';
import LinkedSectionHeading from '../ui/LinkedSectionHeading';
import { MetricCard } from '../ui/MetricCard';

/* ------------------------------------------------------------------ */
/*  Fake tick generator — swap this out for your websocket/API feed    */
/* ------------------------------------------------------------------ */

function useRandomWalk(seed: number, start: number) {
    const valueRef = useRef(start);
    return () => {
        valueRef.current += (Math.random() - 0.5) * seed;
        return valueRef.current;
    };
}

export default function TotalMarketCap() {
    const chartRef = useRef<AreaChartHandle>(null);

    const [seedData] = useState(() => {
        const now = Math.floor(Date.now() / 1000);
        const points = (base: number, vol: number): ChartPoint[] =>
            Array.from({ length: 60 }, (_, i) => {
                base += (Math.random() - 0.5) * vol;
                return {
                    time: (now - (60 - i) * 5) as UTCTimestamp,
                    value: Number(base.toFixed(2)),
                };
            });
        return {
            price: points(100, 2.2),
            fast: points(98, 1.4),
            slow: points(102, 1.4),
        };
    });

    const priceWalk = useRandomWalk(2.2, seedData.price.at(-1)!.value);
    const fastWalk = useRandomWalk(1.4, seedData.fast.at(-1)!.value);
    const slowWalk = useRandomWalk(1.4, seedData.slow.at(-1)!.value);

    useEffect(() => {
        const interval = setInterval(() => {
            const time = Math.floor(Date.now() / 1000) as UTCTimestamp;
            chartRef.current?.updatePoint('price', { time, value: priceWalk() });
            chartRef.current?.updatePoint('fast', { time, value: fastWalk() });
            chartRef.current?.updatePoint('slow', { time, value: slowWalk() });
        }, 4000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="mx-4 mt-2">
                <LinkedSectionHeading fontSize="lg" href="/markets/cryptocurrencies/market-cap" label="Crypto total market cap" />
                <div className="flex flex-wrap gap-12 mt-4">
                    <MetricCard
                        value="2.18 T"
                        unit="USD"
                        label="Value"
                        diff="-11.68 B"
                        percentage={-0.53}
                    />
                    <MetricCard
                        value="2.18 T"
                        unit="USD"
                        label="Volume"
                        percentage={+0.53}
                    />
                </div>
            </div>
            <AreaChart
                ref={chartRef}
                gridColor="transparent"
                height={420}
                showYaxisScale={false}
                showXaxisScale={true}
                series={[
                    {
                        id: 'price',
                        type: 'area',
                        color: '#ef4444', // red, like the screenshot
                        data: seedData.price,
                        priceLineVisible: false,
                        lastValueVisible: false,
                    },
                ]}
            />
        </div>
    );
}