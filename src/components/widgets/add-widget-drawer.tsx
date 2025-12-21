"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WIDGET_CATEGORIES } from "@/components/features/dashboard/widget-registry";
import { WidgetPreviewCard } from "./widget-preview-card";
import type { WidgetDefinition } from "@/types/widget-types";

interface AddWidgetDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget: (widget: WidgetDefinition) => void;
}

export function AddWidgetDrawer({
  open,
  onOpenChange,
  onSelectWidget,
}: AddWidgetDrawerProps) {
  const handleWidgetClick = (widget: WidgetDefinition) => {
    onSelectWidget(widget);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Available Widgets</DrawerTitle>
          <DrawerDescription>
            Click on a widget to add it to your dashboard
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-8">
            {WIDGET_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-3">
                {/* Category header */}
                <div>
                  <h3 className="font-semibold">{category.label}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Widget grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.widgets.map((widget) => (
                    <WidgetPreviewCard
                      key={widget.type}
                      widget={widget}
                      onClick={() => handleWidgetClick(widget)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
