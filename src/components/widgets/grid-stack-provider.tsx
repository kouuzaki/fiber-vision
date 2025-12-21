"use client";

import * as React from "react";
import type { WidgetConfig, DashboardLayout } from "@/types/widget-types";

const LAYOUT_STORAGE_KEY = "dashboard-widget-layout";

interface GridStackContextValue {
  widgets: WidgetConfig[];
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  saveLayout: () => void;
  loadLayout: () => WidgetConfig[];
  clearLayout: () => void;
  isReady: boolean;
}

const GridStackContext = React.createContext<GridStackContextValue | null>(
  null
);

export function useGridStack() {
  const context = React.useContext(GridStackContext);
  if (!context) {
    throw new Error("useGridStack must be used within a GridStackProvider");
  }
  return context;
}

interface GridStackProviderProps {
  children: React.ReactNode;
  autoSave?: boolean;
}

export function GridStackProvider({
  children,
  autoSave = true,
}: GridStackProviderProps) {
  const [widgets, setWidgets] = React.useState<WidgetConfig[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  // Mark ready on mount
  React.useEffect(() => {
    setIsReady(true);
  }, []);

  // Add widget
  const addWidget = React.useCallback((widget: WidgetConfig) => {
    setWidgets((prev) => {
      if (prev.some((w) => w.id === widget.id)) return prev;
      return [...prev, widget];
    });
  }, []);

  // Remove widget
  const removeWidget = React.useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Save layout
  const saveLayout = React.useCallback(() => {
    const layout: DashboardLayout = {
      widgets,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  }, [widgets]);

  // Load layout
  const loadLayout = React.useCallback((): WidgetConfig[] => {
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored) {
        const layout: DashboardLayout = JSON.parse(stored);
        return layout.widgets;
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
    }
    return [];
  }, []);

  // Clear layout
  const clearLayout = React.useCallback(() => {
    setWidgets([]);
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
  }, []);

  // Auto-save
  React.useEffect(() => {
    if (autoSave && widgets.length > 0) {
      saveLayout();
    }
  }, [widgets, autoSave, saveLayout]);

  const value: GridStackContextValue = {
    widgets,
    addWidget,
    removeWidget,
    saveLayout,
    loadLayout,
    clearLayout,
    isReady,
  };

  return (
    <GridStackContext.Provider value={value}>
      {children}
    </GridStackContext.Provider>
  );
}
