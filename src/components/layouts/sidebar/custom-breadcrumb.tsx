"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BreadcrumbItemConfig } from "@/types/sidebar-types";

interface CustomBreadcrumbProps {
  /** Manual breadcrumb items - overrides auto-generation */
  items?: BreadcrumbItemConfig[];
  /** Custom home label (default: "Home") */
  homeLabel?: string;
  /** Custom home href (default: "/dashboard") */
  homeHref?: string;
  /** Show home as first item (default: true) */
  showHome?: boolean;
  /** Custom separator element */
  separator?: React.ReactNode;
  /** Custom path-to-label mapping for auto-generation */
  pathLabels?: Record<string, string>;
  /** Max visible items before collapsing to dropdown (default: 3) */
  maxVisibleItems?: number;
}

/**
 * Customizable breadcrumb component with auto-generation support
 * Collapses to dropdown when there are more than maxVisibleItems
 */
export function CustomBreadcrumb({
  items,
  homeLabel = "Home",
  homeHref = "/dashboard",
  showHome = true,
  separator,
  pathLabels = {},
  maxVisibleItems = 3,
}: CustomBreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems: BreadcrumbItemConfig[] = React.useMemo(() => {
    if (items) {
      return items;
    }

    // Auto-generate from pathname
    const segments = pathname
      .split("/")
      .filter((segment) => segment && segment !== "dashboard");

    return segments.map((segment, index) => {
      const href = `/dashboard/${segments.slice(0, index + 1).join("/")}`;
      const label =
        pathLabels[segment] ||
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return { label, href } as BreadcrumbItemConfig;
    });
  }, [items, pathname, pathLabels]);

  // Build full items list including home
  const allItems: BreadcrumbItemConfig[] = React.useMemo(() => {
    if (showHome) {
      return [{ label: homeLabel, href: homeHref }, ...breadcrumbItems];
    }
    return breadcrumbItems;
  }, [showHome, homeLabel, homeHref, breadcrumbItems]);

  // If pathname is exactly /dashboard and no custom items, show just home
  const isHomePage = pathname === "/dashboard" || pathname === "/dashboard/";

  if (isHomePage && !items) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{homeLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Calculate if we need to collapse items
  const shouldCollapse = allItems.length > maxVisibleItems;

  // When collapsing: show first item, ellipsis dropdown, and last item
  // The dropdown contains all middle items
  const firstItem = allItems[0];
  const lastItem = allItems[allItems.length - 1];
  const middleItems = shouldCollapse ? allItems.slice(1, -1) : [];

  // Render a single breadcrumb item
  const renderItem = (item: BreadcrumbItemConfig, isLast: boolean) => {
    if (isLast) {
      return <BreadcrumbPage>{item.label}</BreadcrumbPage>;
    }
    return (
      <BreadcrumbLink asChild>
        <Link href={item.href || "#"}>{item.label}</Link>
      </BreadcrumbLink>
    );
  };

  // When NOT collapsing, render all items normally
  if (!shouldCollapse) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>{renderItem(item, isLast)}</BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // When collapsing: First > Ellipsis Dropdown > Last
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={firstItem.href || "#"}>{firstItem.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>

        {/* Ellipsis dropdown for middle items */}
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-foreground">
              <BreadcrumbEllipsis />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {middleItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href || "#"}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>

        {/* Last item (current page) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{lastItem.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
