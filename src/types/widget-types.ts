import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Widget type identifiers
 */
export type WidgetType =
  | "stat-card"
  | "line-chart"
  | "bar-chart"
  | "zone-counting"
  | "line-crossing"
  | "occupancy"
  | "camera-feed"
  | "event-list";

/**
 * Predefined widget sizes (width x height in grid units)
 */
export interface WidgetSize {
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

/**
 * Common widget sizes
 */
export const WIDGET_SIZES = {
  SMALL: { w: 2, h: 2, minW: 2, minH: 2 },
  MEDIUM: { w: 4, h: 2, minW: 2, minH: 2 },
  LARGE: { w: 4, h: 4, minW: 2, minH: 2 },
  WIDE: { w: 6, h: 2, minW: 4, minH: 2 },
  TALL: { w: 2, h: 4, minW: 2, minH: 2 },
  FULL: { w: 12, h: 4, minW: 4, minH: 2 },
} as const;

/**
 * Props passed to widget content and preview components
 */
export interface WidgetComponentProps {
  widget: WidgetConfig;
}

/**
 * Props for preview components (simpler, just for drawer display)
 */
export interface WidgetPreviewProps {
  data?: Record<string, unknown>;
}

/**
 * Widget definition with both preview and content components
 */
export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  description?: string;
  icon?: LucideIcon;
  defaultSize: WidgetSize;
  configurable?: boolean;
  /** Component to render in the drawer as preview */
  PreviewComponent: ComponentType<WidgetPreviewProps>;
  /** Component to render on the dashboard as content */
  ContentComponent: ComponentType<WidgetComponentProps>;
  /** Default data for preview */
  previewData?: Record<string, unknown>;
}

/**
 * Widget configuration for a placed widget
 */
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  x?: number;
  y?: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  data?: Record<string, unknown>;
  locked?: boolean;
}

/**
 * Widget category for organization in drawer
 */
export interface WidgetCategory {
  id: string;
  label: string;
  description?: string;
  widgets: WidgetDefinition[];
}

/**
 * Available widget template (legacy, use WidgetDefinition)
 */
export interface AvailableWidget {
  type: WidgetType;
  label: string;
  description?: string;
  icon?: LucideIcon;
  defaultSize: WidgetSize;
  previewData?: Record<string, unknown>;
  configurable?: boolean;
}

/**
 * Layout save format
 */
export interface DashboardLayout {
  widgets: WidgetConfig[];
  version: number;
  updatedAt: string;
}
