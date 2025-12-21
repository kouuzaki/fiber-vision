"use client";

import * as React from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "@/styles/gridstack-theme.css";
import type {
  WidgetDefinition,
  WidgetConfig,
  DashboardLayout,
} from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { AddWidgetDrawer } from "@/components/widgets/add-widget-drawer";
import { WidgetConfigDialog } from "@/components/widgets/widget-config-dialog";
import { WidgetRenderer } from "@/components/widgets/widget-renderers";

const LAYOUT_STORAGE_KEY = "dashboard-widget-layout";

export function WidgetDashboard() {
  const [widgets, setWidgets] = React.useState<WidgetConfig[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);
  const [selectedWidget, setSelectedWidget] =
    React.useState<WidgetDefinition | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<GridStack | null>(null);

  // Load saved layout on mount
  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored) {
        const layout: DashboardLayout = JSON.parse(stored);
        setWidgets(layout.widgets);
      }
    } catch (e) {
      console.error("Failed to load layout:", e);
    }
  }, []);

  // Initialize GridStack
  React.useEffect(() => {
    if (!containerRef.current || !mounted) return;

    if (gridRef.current) {
      gridRef.current.destroy(false);
    }

    const grid = GridStack.init(
      {
        column: 12,
        cellHeight: 100,
        margin: 8,
        float: false,
        animate: true,
      },
      containerRef.current
    );

    gridRef.current = grid;

    grid.on("change", () => {
      const items = grid.getGridItems();
      setWidgets((prev) =>
        prev.map((widget) => {
          const el = items.find(
            (item) => item.getAttribute("gs-id") === widget.id
          );
          if (el?.gridstackNode) {
            return {
              ...widget,
              x: el.gridstackNode.x ?? widget.x,
              y: el.gridstackNode.y ?? widget.y,
              w: el.gridstackNode.w ?? widget.w,
              h: el.gridstackNode.h ?? widget.h,
            };
          }
          return widget;
        })
      );
    });

    return () => {
      if (gridRef.current) {
        gridRef.current.off("change");
      }
    };
  }, [mounted, widgets.length]);

  // Auto-save layout
  React.useEffect(() => {
    if (widgets.length > 0) {
      const layout: DashboardLayout = {
        widgets,
        version: 1,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    }
  }, [widgets]);

  // Handlers with useCallback
  const handleOpenDrawer = React.useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleSelectWidget = React.useCallback((widget: WidgetDefinition) => {
    setSelectedWidget(widget);
    setDrawerOpen(false);
    setConfigDialogOpen(true);
  }, []);

  const handleAddWidget = React.useCallback((config: WidgetConfig) => {
    setWidgets((prev) => [...prev, config]);
    setConfigDialogOpen(false);
    setSelectedWidget(null);
  }, []);

  const handleRemoveWidget = React.useCallback((id: string) => {
    // Only update React state - let React handle DOM removal
    // GridStack will sync on next render
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleClearAll = React.useCallback(() => {
    if (gridRef.current) {
      gridRef.current.removeAll();
    }
    setWidgets([]);
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
  }, []);

  const handleConfigDialogChange = React.useCallback((open: boolean) => {
    setConfigDialogOpen(open);
    if (!open) setSelectedWidget(null);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const isEmpty = widgets.length === 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Dashboard Widgets</h2>
          <p className="text-sm text-muted-foreground">
            Drag widgets to rearrange
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2Icon className="size-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button size="sm" onClick={handleOpenDrawer}>
            <PlusIcon className="size-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="border-2 border-dashed border-border rounded-xl min-h-[400px] flex flex-col items-center justify-center text-muted-foreground">
          <div className="text-4xl mb-4">📊</div>
          <div className="font-medium">No widgets yet</div>
          <p className="text-sm mb-4">
            Add widgets to customize your dashboard
          </p>
          <Button onClick={handleOpenDrawer}>
            <PlusIcon className="size-4 mr-2" />
            Add Widget
          </Button>
        </div>
      ) : (
        <div ref={containerRef} className="grid-stack">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="grid-stack-item"
              gs-id={widget.id}
              gs-x={widget.x}
              gs-y={widget.y}
              gs-w={widget.w}
              gs-h={widget.h}
              gs-min-w={widget.minW}
              gs-min-h={widget.minH}
            >
              <div className="grid-stack-item-content">
                <Card className="h-full group">
                  <CardHeader className="flex flex-row items-center justify-between py-2 px-3 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      {widget.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="widget-size-badge">
                        {widget.w}×{widget.h}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveWidget(widget.id)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 h-[calc(100%-44px)] overflow-auto">
                    <WidgetRenderer widget={widget} />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddWidgetDrawer
        open={drawerOpen}
        onOpenChange={handleCloseDrawer}
        onSelectWidget={handleSelectWidget}
      />
      <WidgetConfigDialog
        widget={selectedWidget}
        open={configDialogOpen}
        onOpenChange={handleConfigDialogChange}
        onSave={handleAddWidget}
      />
    </div>
  );
}
