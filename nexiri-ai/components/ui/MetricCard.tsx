"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MetricCard
 * -----------
 * A compact stat display for things like market cap, 24h volume, TVL, etc.
 *
 *   2.18 T USD   -11.68 B   -0.53%
 *   Value
 *
 * `diff` and `percentage` are both optional and rendered independently —
 * you can pass one, both, or neither.
 */

const changeVariants = cva("font-medium tabular-nums", {
    variants: {
        trend: {
            up: "text-emerald-500 dark:text-emerald-400",
            down: "text-red-500 dark:text-red-400",
            neutral: "text-muted-foreground",
        },
    },
    defaultVariants: {
        trend: "neutral",
    },
});

export interface MetricCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof changeVariants> {
    /** Main formatted number, e.g. "2.18 T" */
    value: string | number;
    /** Unit/currency shown as a small superscript next to the value, e.g. "USD" */
    unit?: string;
    /** Label rendered below the value, e.g. "Value" */
    label: string;
    /** Absolute change, e.g. "-11.68 B" or -11_680_000_000. Omit to hide. */
    diff?: string | number;
    /** Percentage change, e.g. -0.53 or "-0.53%". Omit to hide. */
    percentage?: number | string;
    /**
     * Force the trend color instead of inferring it from the sign of
     * `diff`/`percentage`. Useful if you're passing pre-formatted strings
     * without a leading +/-.
     */
    trend?: "up" | "down" | "neutral";
}

function inferTrend(diff?: string | number, percentage?: string | number) {
    const source = percentage ?? diff;
    if (source === undefined || source === null) return "neutral" as const;

    const num =
        typeof source === "number" ? source : parseFloat(String(source));

    if (Number.isNaN(num) || num === 0) return "neutral" as const;
    return num > 0 ? ("up" as const) : ("down" as const);
}

function formatPercentage(percentage: string | number) {
    if (typeof percentage === "string") {
        return percentage.includes("%") ? percentage : `${percentage}%`;
    }
    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage}%`;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
    (
        { value, unit, label, diff, percentage, trend, className, ...props },
        ref
    ) => {
        const resolvedTrend = trend ?? inferTrend(diff, percentage);
        const hasChangeRow = diff !== undefined || percentage !== undefined;

        return (
            <div
                ref={ref}
                className={cn(
                    className
                )}
                {...props}
            >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-2xl font-semibold tracking-tight tabular-nums">
                        {value}
                        {unit && (
                            <span className="ml-1 align-super text-xs font-medium text-muted-foreground">
                                {unit}
                            </span>
                        )}
                    </span>

                    {hasChangeRow && (
                        <span className="flex items-baseline gap-2 text-sm">
                            {diff !== undefined && (
                                <span className={changeVariants({ trend: resolvedTrend })}>
                                    {diff}
                                </span>
                            )}
                            {percentage !== undefined && (
                                <span className={changeVariants({ trend: resolvedTrend })}>
                                    {formatPercentage(percentage)}
                                </span>
                            )}
                        </span>
                    )}
                </div>

                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
        );
    }
);
MetricCard.displayName = "MetricCard";