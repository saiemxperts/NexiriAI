'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  AreaSeries,
  LineSeries,
  createChart,
  createSeriesMarkers,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
  type SeriesType,
  type DeepPartial,
  type ChartOptions,
} from 'lightweight-charts';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type { UTCTimestamp, Time };

export interface ChartPoint {
  time: UTCTimestamp | Time;
  value: number;
}

export type SeriesKind = 'line' | 'area';

export interface SeriesConfig {
  /** Unique id used to reference this series later (updateSeries, pushPoint, ...) */
  id: string;
  /** 'area' gives the filled gradient look from the reference screenshot, 'line' is a plain stroke */
  type: SeriesKind;
  /** Stroke / line color, e.g. '#ef4444' */
  color: string;
  /** Only used for type: 'area'. Defaults are derived from `color` when omitted. */
  topColor?: string;
  bottomColor?: string;
  lineWidth?: 1 | 2 | 3 | 4;
  /** Initial data for this series */
  data?: ChartPoint[];
  title?: string;
  lastValueVisible?: boolean;
  priceLineVisible?: boolean;
  /** Show a colored dot marker on the most recent data point. Defaults to true. */
  showLastPointMarker?: boolean;
  /** Color of the last-point marker. Defaults to '#ef4444' (red). */
  lastPointMarkerColor?: string;
}

export interface AreaChartHandle {
  /** Push/update a single latest point on a series (creates it if the time is new, updates it if it matches the last bar) */
  updatePoint: (seriesId: string, point: ChartPoint) => void;
  /** Replace all data for a series */
  setSeriesData: (seriesId: string, data: ChartPoint[]) => void;
  /** Add a brand-new series at runtime */
  addSeries: (config: SeriesConfig) => void;
  /** Remove a series at runtime */
  removeSeries: (seriesId: string) => void;
  /** Access the underlying lightweight-charts chart instance for advanced use */
  getChart: () => IChartApi | null;
  /** Fit all visible data into view */
  fitContent: () => void;
}

export interface AreaChartProps {
  series: SeriesConfig[];
  height?: number;
  /** When true (default) the chart resizes itself to its container */
  autosize?: boolean;
  background?: string;
  gridColor?: string;
  textColor?: string;
  borderColor?: string;
  /** Show the crosshair + built-in legend price labels */
  showCrosshair?: boolean;
  /** Show the vertical (right) price scale. Defaults to true. */
  showPriceScale?: boolean;
  className?: string;
  chartOptions?: DeepPartial<ChartOptions>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lastPointMarker(
  time: Time,
  color: string
): SeriesMarker<Time>[] {
  return [
    {
      time,
      position: 'inBar',
      color,
      shape: 'circle',
      size: 1,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Reusable, realtime-capable multi-series chart built on TradingView's
 * lightweight-charts (v5). Supports any mix of line/area series, each with
 * its own color, and an imperative handle for pushing live ticks without
 * re-rendering React.
 *
 * Usage:
 *   const chartRef = useRef<AreaChartHandle>(null);
 *   <AreaChart ref={chartRef} series={[{ id: 'btc', type: 'area', color: '#ef4444', data }]} />
 *   chartRef.current?.updatePoint('btc', { time: nowAsUnixSeconds, value: 42000 });
 */
const AreaChart = forwardRef<AreaChartHandle, AreaChartProps>(
  (
    {
      series,
      height = 400,
      autosize = true,
      background = '#ffffff',
      gridColor = 'rgba(0, 0, 0, 0.04)',
      textColor = '#1f2937',
      borderColor = 'rgba(0, 0, 0, 0.08)',
      showCrosshair = true,
      showPriceScale = true,
      className,
      chartOptions,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesMapRef = useRef<Map<string, ISeriesApi<SeriesType>>>(new Map());
    const markersMapRef = useRef<Map<string, ISeriesMarkersPluginApi<Time>>>(
      new Map()
    );
    // Keep latest configs around so imperative addSeries can reuse the same styling logic
    const initialSeriesRef = useRef<SeriesConfig[]>(series);
    const seriesConfigMapRef = useRef<Map<string, SeriesConfig>>(new Map());

    /* --- create chart once --------------------------------------- */
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const chart = createChart(container, {
        height,
        layout: {
          background: { type: ColorType.Solid, color: background },
          textColor,
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
        rightPriceScale: {
          visible: showPriceScale,
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
          vertLine: { visible: showCrosshair, labelVisible: showCrosshair },
          horzLine: { visible: showCrosshair, labelVisible: showCrosshair },
        },
        ...chartOptions,
      });

      chartRef.current = chart;

      initialSeriesRef.current.forEach((config) => addSeriesInternal(config));

      chart.timeScale().fitContent();

      const resizeObserver = new ResizeObserver((entries) => {
        if (!autosize || !entries.length) return;
        const { width } = entries[0].contentRect;
        chart.applyOptions({ width: Math.floor(width) });
      });
      if (autosize) resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        chart.remove();
        chartRef.current = null;
        seriesMapRef.current.clear();
        markersMapRef.current.clear();
        seriesConfigMapRef.current.clear();
      };
      // Intentionally only re-run on mount/unmount; series content updates
      // are handled imperatively via the ref API + the effect below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* --- keep chart-level style props in sync ---------------------- */
    useEffect(() => {
      chartRef.current?.applyOptions({
        height,
        layout: {
          background: { type: ColorType.Solid, color: background },
          textColor,
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
        rightPriceScale: {
          visible: showPriceScale,
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        crosshair: {
          mode: showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
          vertLine: { visible: showCrosshair, labelVisible: showCrosshair },
          horzLine: { visible: showCrosshair, labelVisible: showCrosshair },
        },
      });
    }, [height, background, textColor, gridColor, borderColor, showCrosshair, showPriceScale]);

    /* --- internal helpers ------------------------------------------ */
    function addSeriesInternal(config: SeriesConfig) {
      const chart = chartRef.current;
      if (!chart) return;

      let created: ISeriesApi<SeriesType>;
      if (config.type === 'area') {
        created = chart.addSeries(AreaSeries, {
          lineColor: config.color,
          topColor: config.topColor ?? hexToRgba(config.color, 0.35),
          bottomColor: config.bottomColor ?? hexToRgba(config.color, 0.02),
          lineWidth: config.lineWidth ?? 2,
          title: config.title,
          lastValueVisible: config.lastValueVisible ?? true,
          priceLineVisible: config.priceLineVisible ?? false,
        });
      } else {
        created = chart.addSeries(LineSeries, {
          color: config.color,
          lineWidth: config.lineWidth ?? 2,
          title: config.title,
          lastValueVisible: config.lastValueVisible ?? true,
          priceLineVisible: config.priceLineVisible ?? false,
        });
      }

      if (config.data?.length) {
        created.setData(config.data as never);
      }
      seriesMapRef.current.set(config.id, created);
      seriesConfigMapRef.current.set(config.id, config);

      if (config.showLastPointMarker !== false) {
        const markersApi = createSeriesMarkers(created, []);
        markersMapRef.current.set(config.id, markersApi);
        if (config.data?.length) {
          const last = config.data[config.data.length - 1];
          markersApi.setMarkers(
            lastPointMarker(last.time, config.lastPointMarkerColor ?? '#ef4444')
          );
        }
      }
    }

    function refreshLastPointMarker(seriesId: string, time: Time) {
      const markersApi = markersMapRef.current.get(seriesId);
      const config = seriesConfigMapRef.current.get(seriesId);
      if (!markersApi || !config || config.showLastPointMarker === false) return;
      markersApi.setMarkers(
        lastPointMarker(time, config.lastPointMarkerColor ?? '#ef4444')
      );
    }

    /* --- imperative handle ------------------------------------------ */
    useImperativeHandle(
      ref,
      () => ({
        updatePoint(seriesId, point) {
          const s = seriesMapRef.current.get(seriesId);
          if (!s) return;
          s.update(point as never);
          refreshLastPointMarker(seriesId, point.time as Time);
        },
        setSeriesData(seriesId, data) {
          const s = seriesMapRef.current.get(seriesId);
          if (!s) return;
          s.setData(data as never);
          if (data.length) {
            refreshLastPointMarker(seriesId, data[data.length - 1].time as Time);
          }
        },
        addSeries(config) {
          if (seriesMapRef.current.has(config.id)) return;
          addSeriesInternal(config);
        },
        removeSeries(seriesId) {
          const chart = chartRef.current;
          const s = seriesMapRef.current.get(seriesId);
          if (!chart || !s) return;
          chart.removeSeries(s);
          seriesMapRef.current.delete(seriesId);
          markersMapRef.current.delete(seriesId);
          seriesConfigMapRef.current.delete(seriesId);
        },
        getChart() {
          return chartRef.current;
        },
        fitContent() {
          chartRef.current?.timeScale().fitContent();
        },
      }),
      []
    );

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height }}
      />
    );
  }
);

AreaChart.displayName = 'AreaChart';

export default AreaChart;