"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import type { WidgetConfig } from "@/types/widget-types";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  widget: WidgetConfig;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({
  widget,
  onRemove,
  children,
  className,
}: WidgetCardProps) {
  return (
    <Card className={cn("h-full relative group", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-2 px-3 space-y-0">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="widget-size-badge">
            {widget.w}×{widget.h}
          </span>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-3 pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
