"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WidgetDefinition,
  WidgetConfig,
  WidgetSize,
} from "@/types/widget-types";
import { WIDGET_SIZES } from "@/types/widget-types";

interface WidgetConfigDialogProps {
  widget: WidgetDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: WidgetConfig) => void;
}

const SIZE_OPTIONS: { label: string; value: keyof typeof WIDGET_SIZES }[] = [
  { label: "Small (2×2)", value: "SMALL" },
  { label: "Medium (4×2)", value: "MEDIUM" },
  { label: "Large (4×4)", value: "LARGE" },
  { label: "Wide (6×2)", value: "WIDE" },
  { label: "Tall (2×4)", value: "TALL" },
  { label: "Full Width (12×4)", value: "FULL" },
];

export function WidgetConfigDialog({
  widget,
  open,
  onOpenChange,
  onSave,
}: WidgetConfigDialogProps) {
  const [title, setTitle] = React.useState("");
  const [selectedSize, setSelectedSize] =
    React.useState<keyof typeof WIDGET_SIZES>("MEDIUM");

  // Reset form when widget changes
  React.useEffect(() => {
    if (widget) {
      setTitle(widget.label);
      // Find matching size or default to MEDIUM
      const sizeKey = Object.entries(WIDGET_SIZES).find(
        ([, size]) =>
          size.w === widget.defaultSize.w && size.h === widget.defaultSize.h
      )?.[0] as keyof typeof WIDGET_SIZES | undefined;
      setSelectedSize(sizeKey || "MEDIUM");
    }
  }, [widget]);

  const handleSave = () => {
    if (!widget) return;

    const size: WidgetSize = WIDGET_SIZES[selectedSize];
    const config: WidgetConfig = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: widget.type,
      title,
      w: size.w,
      h: size.h,
      minW: size.minW,
      minH: size.minH,
      maxW: size.maxW,
      maxH: size.maxH,
      data: widget.previewData,
    };

    onSave(config);
    onOpenChange(false);
  };

  if (!widget) return null;

  const Icon = widget.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="size-5" />}
            Configure Widget
          </DialogTitle>
          <DialogDescription>
            Customize the widget before adding it to your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Widget Title */}
          <div className="space-y-2">
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input
              id="widget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title"
            />
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label>Widget Size</Label>
            <Select
              value={selectedSize}
              onValueChange={(v) =>
                setSelectedSize(v as keyof typeof WIDGET_SIZES)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Widget-specific configuration would go here */}
          {widget.type === "stat-card" && (
            <div className="space-y-2">
              <Label>Data Source</Label>
              <Select defaultValue="passer-by">
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passer-by">Passer By Count</SelectItem>
                  <SelectItem value="entry">Entry Count</SelectItem>
                  <SelectItem value="exit">Exit Count</SelectItem>
                  <SelectItem value="occupancy">Current Occupancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {widget.type === "occupancy" && (
            <div className="space-y-2">
              <Label>Zone</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone-1">Zone 1</SelectItem>
                  <SelectItem value="zone-2">Zone 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add to Dashboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
