"use client";

import * as React from "react";
import type { WidgetConfig } from "@/types/widget-types";
import { getWidgetByType } from "@/components/features/dashboard/widget-registry";

interface WidgetRendererProps {
  widget: WidgetConfig;
}

/**
 * Main widget renderer that looks up the ContentComponent from registry
 */
export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const definition = getWidgetByType(widget.type);

  if (!definition) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-2xl mb-2">❓</div>
          <div className="text-sm">Unknown widget: {widget.type}</div>
        </div>
      </div>
    );
  }

  const ContentComponent = definition.ContentComponent;

  return <ContentComponent widget={widget} />;
}
