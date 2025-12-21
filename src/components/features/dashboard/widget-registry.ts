import type { WidgetDefinition, WidgetCategory } from "@/types/widget-types";
import { WIDGET_SIZES } from "@/types/widget-types";
import {
  BarChart3Icon,
  CameraIcon,
  LineChartIcon,
  ListIcon,
  UsersIcon,
  ActivityIcon,
  LayoutGridIcon,
} from "lucide-react";
import {
  StatCardPreview, StatCardContent,
  OccupancyPreview, OccupancyContent,
  ZoneCountingPreview, ZoneCountingContent,
  LineCrossingPreview, LineCrossingContent,
  LineChartPreview, LineChartContent,
  BarChartPreview, BarChartContent,
  CameraFeedPreview, CameraFeedContent,
  EventListPreview, EventListContent,
} from "./widget-components";

/**
 * Widget Definitions with components and config
 */
export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    type: "stat-card",
    label: "Stat Card",
    description: "Display key metrics",
    icon: LayoutGridIcon,
    defaultSize: WIDGET_SIZES.MEDIUM,
    configurable: true,
    PreviewComponent: StatCardPreview,
    ContentComponent: StatCardContent,
  },
  {
    type: "occupancy",
    label: "Occupancy",
    description: "Real-time occupancy",
    icon: UsersIcon,
    defaultSize: WIDGET_SIZES.LARGE,
    configurable: true,
    PreviewComponent: OccupancyPreview,
    ContentComponent: OccupancyContent,
  },
  {
    type: "line-crossing",
    label: "Line Crossing",
    description: "Line crossing chart",
    icon: ActivityIcon,
    defaultSize: WIDGET_SIZES.MEDIUM,
    configurable: true,
    PreviewComponent: LineCrossingPreview,
    ContentComponent: LineCrossingContent,
  },
  {
    type: "zone-counting",
    label: "Zone Counting",
    description: "Zone analysis",
    icon: LayoutGridIcon,
    defaultSize: WIDGET_SIZES.MEDIUM,
    configurable: true,
    PreviewComponent: ZoneCountingPreview,
    ContentComponent: ZoneCountingContent,
  },
  {
    type: "line-chart",
    label: "Line Chart",
    description: "Trend visualization",
    icon: LineChartIcon,
    defaultSize: WIDGET_SIZES.WIDE,
    configurable: true,
    PreviewComponent: LineChartPreview,
    ContentComponent: LineChartContent,
  },
  {
    type: "bar-chart",
    label: "Bar Chart",
    description: "Bar visualization",
    icon: BarChart3Icon,
    defaultSize: WIDGET_SIZES.MEDIUM,
    configurable: true,
    PreviewComponent: BarChartPreview,
    ContentComponent: BarChartContent,
  },
  {
    type: "camera-feed",
    label: "Camera Feed",
    description: "Live camera stream",
    icon: CameraIcon,
    defaultSize: WIDGET_SIZES.LARGE,
    configurable: true,
    PreviewComponent: CameraFeedPreview,
    ContentComponent: CameraFeedContent,
  },
  {
    type: "event-list",
    label: "Event List",
    description: "Recent events",
    icon: ListIcon,
    defaultSize: WIDGET_SIZES.TALL,
    configurable: true,
    PreviewComponent: EventListPreview,
    ContentComponent: EventListContent,
  },
];

/**
 * Widget Categories
 */
export const WIDGET_CATEGORIES: WidgetCategory[] = [
  {
    id: "overview",
    label: "Business Overview",
    description: "Key metrics and insights",
    widgets: WIDGET_DEFINITIONS.filter((w) => ["stat-card", "occupancy"].includes(w.type)),
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Charts and analysis",
    widgets: WIDGET_DEFINITIONS.filter((w) => 
      ["line-crossing", "zone-counting", "line-chart", "bar-chart"].includes(w.type)
    ),
  },
  {
    id: "monitoring",
    label: "Monitoring",
    description: "Live feeds and logs",
    widgets: WIDGET_DEFINITIONS.filter((w) => ["camera-feed", "event-list"].includes(w.type)),
  },
];

/**
 * Get widget by type
 */
export function getWidgetByType(type: string): WidgetDefinition | undefined {
  return WIDGET_DEFINITIONS.find((w) => w.type === type);
}
