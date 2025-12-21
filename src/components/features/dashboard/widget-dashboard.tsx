"use client";

import * as React from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "@/styles/gridstack-theme.css";
import type { WidgetDefinition, WidgetConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Trash2Icon,
  SaveIcon,
  FolderIcon,
  Loader2Icon,
} from "lucide-react";
import { AddWidgetDrawer } from "@/components/widgets/add-widget-drawer";
import { WidgetConfigDialog } from "@/components/widgets/widget-config-dialog";
import { WidgetRenderer } from "@/components/widgets/widget-renderers";
import { WidgetCard } from "@/components/widgets/widget-card";
import { useDashboardLayout } from "@/hooks/use-dashboard-layout";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function WidgetDashboard() {
  const {
    layout,
    isLoading,
    isError,
    isSaving,
    isClearing,
    saveLayout,
    clearLayout,
    setLocalLayout,
  } = useDashboardLayout();

  const [widgets, setWidgets] = React.useState<WidgetConfig[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);
  const [selectedWidget, setSelectedWidget] =
    React.useState<WidgetDefinition | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<GridStack | null>(null);
  const initialLoadRef = React.useRef(true);

  // Sync widgets from server
  React.useEffect(() => {
    if (!isLoading && layout.length > 0 && initialLoadRef.current) {
      setWidgets(layout);
      initialLoadRef.current = false;
    }
  }, [layout, isLoading]);

  // Mount
  React.useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      initialLoadRef.current = false;
    }, 500);
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
      setHasChanges(true);
    });

    return () => {
      if (gridRef.current) {
        gridRef.current.off("change");
      }
    };
  }, [mounted, widgets.length]);

  // Track changes
  React.useEffect(() => {
    if (!initialLoadRef.current && mounted) {
      setHasChanges(true);
    }
  }, [widgets, mounted]);

  // Handlers
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
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleClearAll = React.useCallback(async () => {
    try {
      await clearLayout();
      setWidgets([]);
      setHasChanges(false);
      toast.success("Dashboard cleared");
    } catch {
      toast.error("Failed to clear dashboard");
    }
  }, [clearLayout]);

  const handleSaveLayout = React.useCallback(async () => {
    try {
      await saveLayout(widgets);
      setLocalLayout(widgets);
      setHasChanges(false);
      toast.success("Layout saved");
    } catch {
      toast.error("Failed to save layout");
    }
  }, [widgets, saveLayout, setLocalLayout]);

  const handleConfigDialogChange = React.useCallback((open: boolean) => {
    setConfigDialogOpen(open);
    if (!open) setSelectedWidget(null);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-96 flex items-center justify-center text-destructive">
        Failed to load dashboard. Please refresh the page.
      </div>
    );
  }

  const isEmpty = widgets.length === 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className=""></div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveLayout}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : (
                <SaveIcon className="size-4 mr-2" />
              )}
              Save Layout
            </Button>
          )}
          {!isEmpty && (
            <Button size="sm" onClick={handleOpenDrawer}>
              <PlusIcon className="size-4 mr-2" />
              Add Widget
            </Button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>No Widgets Yet</EmptyTitle>
            <EmptyDescription>
              You can add widgets to your dashboard by clicking the &quot;Add
              Widget&quot; button above.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleOpenDrawer}>
                <PlusIcon className="size-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </EmptyContent>
        </Empty>
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
                <WidgetCard
                  widget={widget}
                  onRemove={() => handleRemoveWidget(widget.id)}
                >
                  <WidgetRenderer widget={widget} />
                </WidgetCard>
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
