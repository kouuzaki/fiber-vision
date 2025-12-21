"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WidgetDefinition } from "@/types/widget-types";
import { cn } from "@/lib/utils";

interface WidgetPreviewCardProps {
  widget: WidgetDefinition;
  onClick?: () => void;
  className?: string;
}

export function WidgetPreviewCard({
  widget,
  onClick,
  className,
}: WidgetPreviewCardProps) {
  const Icon = widget.icon;
  const sizeLabel = `${widget.defaultSize.w}×${widget.defaultSize.h}`;
  const PreviewComponent = widget.PreviewComponent;

  return (
    <Card
      className={cn(
        "widget-preview cursor-pointer hover:border-primary transition-colors",
        className
      )}
      onClick={onClick}
    >
      {/* Hover overlay */}
      <div className="widget-preview-overlay" />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-muted-foreground" />}
            <CardTitle className="text-sm font-medium">
              {widget.label}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {sizeLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">• Card</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Preview content using the widget's PreviewComponent */}
        <div className="bg-muted/50 rounded-lg min-h-[80px] overflow-hidden">
          <PreviewComponent data={widget.previewData} />
        </div>
      </CardContent>
    </Card>
  );
}
