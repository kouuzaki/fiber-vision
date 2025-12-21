"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { WidgetConfig } from "@/types/widget-types";

interface DashboardLayoutResponse {
  layout: WidgetConfig[];
  version: number;
  updatedAt?: string;
}

interface SaveLayoutResponse {
  success: boolean;
  version: number;
}

const QUERY_KEY = ["dashboard-layout"];

/**
 * Fetch dashboard layout from API
 */
async function fetchDashboardLayout(): Promise<DashboardLayoutResponse> {
  const response = await fetch("/api/dashboard/layout");
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch layout");
  }
  return response.json();
}

/**
 * Save dashboard layout to API
 */
async function saveDashboardLayout(
  layout: WidgetConfig[]
): Promise<SaveLayoutResponse> {
  const response = await fetch("/api/dashboard/layout", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layout }),
  });
  if (!response.ok) {
    throw new Error("Failed to save layout");
  }
  return response.json();
}

/**
 * Clear dashboard layout
 */
async function clearDashboardLayout(): Promise<{ success: boolean }> {
  const response = await fetch("/api/dashboard/layout", {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to clear layout");
  }
  return response.json();
}

/**
 * Custom hook for dashboard layout with TanStack Query
 */
export function useDashboardLayout() {
  const queryClient = useQueryClient();

  // Fetch layout
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchDashboardLayout,
    retry: 1,
  });

  // Save layout mutation
  const saveMutation = useMutation({
    mutationFn: saveDashboardLayout,
    onSuccess: (result) => {
      // Update cache with new version
      queryClient.setQueryData(QUERY_KEY, (old: DashboardLayoutResponse | undefined) => ({
        ...old,
        version: result.version,
      }));
    },
  });

  // Clear layout mutation
  const clearMutation = useMutation({
    mutationFn: clearDashboardLayout,
    onSuccess: () => {
      // Clear cache
      queryClient.setQueryData(QUERY_KEY, {
        layout: [],
        version: 1,
      });
    },
  });

  return {
    // Data
    layout: data?.layout ?? [],
    version: data?.version ?? 1,
    updatedAt: data?.updatedAt,

    // Loading states
    isLoading,
    isError,
    error,
    isSaving: saveMutation.isPending,
    isClearing: clearMutation.isPending,

    // Actions
    saveLayout: saveMutation.mutateAsync,
    clearLayout: clearMutation.mutateAsync,
    refetch,

    // Update local cache optimistically
    setLocalLayout: (layout: WidgetConfig[]) => {
      queryClient.setQueryData(QUERY_KEY, (old: DashboardLayoutResponse | undefined) => ({
        ...old,
        layout,
      }));
    },
  };
}
