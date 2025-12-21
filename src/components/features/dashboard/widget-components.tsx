"use client";

import type {
  WidgetComponentProps,
  WidgetPreviewProps,
} from "@/types/widget-types";
import {
  UsersIcon,
  CameraIcon,
  ListIcon,
  BarChart3Icon,
  ActivityIcon,
  LayoutGridIcon,
  LineChartIcon,
} from "lucide-react";

// ============================================================
// STAT CARD
// ============================================================
export function StatCardPreview({ data }: WidgetPreviewProps) {
  const value = (data?.value as number) ?? 127;
  const subtitle = (data?.subtitle as string) ?? "Configured cameras";

  return (
    <div className="p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function StatCardContent({ widget }: WidgetComponentProps) {
  const value = (widget.data?.value as number) ?? 0;
  const subtitle = (widget.data?.subtitle as string) ?? "";

  return (
    <div className="h-full flex flex-col justify-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

// ============================================================
// OCCUPANCY
// ============================================================
export function OccupancyPreview({ data }: WidgetPreviewProps) {
  const current = (data?.current as number) ?? 0;
  const average = (data?.average as number) ?? 0;

  return (
    <div className="p-3 space-y-2">
      <div className="flex gap-2 text-xs">
        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded">
          Current: {current}
        </span>
        <span className="px-2 py-0.5 bg-violet-500/20 text-violet-500 rounded">
          Avg: {average}
        </span>
      </div>
      <UsersIcon className="size-8 mx-auto text-muted-foreground" />
    </div>
  );
}

export function OccupancyContent({ widget }: WidgetComponentProps) {
  const current = (widget.data?.current as number) ?? 0;
  const average = (widget.data?.average as number) ?? 0;
  const zone = (widget.data?.zone as string) ?? "Zone";

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">{zone}</span>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-500 rounded">
            Current: {current}
          </span>
          <span className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-500 rounded">
            Avg: {average}
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <UsersIcon className="size-12 mb-2" />
        <p className="font-medium">No Data Available</p>
      </div>
    </div>
  );
}

// ============================================================
// ZONE COUNTING
// ============================================================
export function ZoneCountingPreview() {
  return (
    <div className="p-3">
      <LayoutGridIcon className="size-4 text-muted-foreground mb-2" />
      <div className="flex items-end gap-0.5 h-10">
        {[40, 65, 30, 80, 55, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/50 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ZoneCountingContent() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-muted-foreground mb-2">Zone Analysis</p>
      <div className="flex-1 bg-muted/30 rounded-lg flex items-end p-4 gap-1">
        {[40, 65, 30, 80, 55, 70, 45, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/50 rounded-t hover:bg-primary transition-colors"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LINE CROSSING
// ============================================================
export function LineCrossingPreview() {
  return (
    <div className="p-3">
      <ActivityIcon className="size-4 text-muted-foreground mb-2" />
      <svg viewBox="0 0 100 30" className="w-full h-8">
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points="0,25 20,15 40,20 60,8 80,15 100,10"
        />
      </svg>
    </div>
  );
}

export function LineCrossingContent() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-muted-foreground mb-2">Line Crossing</p>
      <div className="flex-1 bg-muted/30 rounded-lg flex items-center p-4">
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points="0,50 30,35 60,42 90,20 120,30 150,15 180,25 200,18"
          />
        </svg>
      </div>
    </div>
  );
}

// ============================================================
// LINE CHART
// ============================================================
export function LineChartPreview() {
  return (
    <div className="p-3">
      <LineChartIcon className="size-4 text-muted-foreground mb-2" />
      <svg viewBox="0 0 100 30" className="w-full h-8">
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points="0,28 25,20 50,24 75,12 100,8"
        />
      </svg>
    </div>
  );
}

export function LineChartContent() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-muted-foreground mb-2">Trend</p>
      <div className="flex-1 bg-muted/30 rounded-lg flex items-center p-4">
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points="0,55 40,40 80,48 120,25 160,32 200,15"
          />
        </svg>
      </div>
    </div>
  );
}

// ============================================================
// BAR CHART
// ============================================================
export function BarChartPreview() {
  return (
    <div className="p-3">
      <BarChart3Icon className="size-4 text-muted-foreground mb-2" />
      <div className="flex items-end gap-1 h-10">
        {[60, 80, 45, 90, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/50 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function BarChartContent() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-muted-foreground mb-2">Bar Chart</p>
      <div className="flex-1 bg-muted/30 rounded-lg flex items-end p-4 gap-2">
        {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/50 rounded-t hover:bg-primary transition-colors"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CAMERA FEED
// ============================================================
export function CameraFeedPreview() {
  return (
    <div className="p-3 flex flex-col items-center justify-center text-muted-foreground">
      <CameraIcon className="size-8" />
      <p className="text-xs mt-1">Camera</p>
    </div>
  );
}

export function CameraFeedContent() {
  return (
    <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <CameraIcon className="size-12 mx-auto mb-2" />
        <p className="font-medium">No camera selected</p>
      </div>
    </div>
  );
}

// ============================================================
// EVENT LIST
// ============================================================
export function EventListPreview() {
  return (
    <div className="p-3 space-y-1">
      <ListIcon className="size-4 text-muted-foreground" />
      <div className="h-2 bg-muted rounded w-full" />
      <div className="h-2 bg-muted rounded w-3/4" />
      <div className="h-2 bg-muted rounded w-5/6" />
    </div>
  );
}

export function EventListContent() {
  return (
    <div className="h-full flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Events</p>
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <ListIcon className="size-8 mx-auto mb-2" />
          <p className="text-sm">No events</p>
        </div>
      </div>
    </div>
  );
}
