"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import type { BreadcrumbItemConfig } from "@/types/sidebar-types";

interface CustomBreadcrumbProps {
  /** Manual breadcrumb items - overrides auto-generation */
  items?: BreadcrumbItemConfig[];
  /** Custom home label (default: "Dashboard") */
  homeLabel?: string;
  /** Custom home href (default: "/dashboard") */
  homeHref?: string;
  /** Show home as first item (default: true) */
  showHome?: boolean;
  /** Custom separator element */
  separator?: React.ReactNode;
  /** Custom path-to-label mapping for auto-generation */
  pathLabels?: Record<string, string>;
}

/**
 * Customizable breadcrumb component with auto-generation support
 */
export function CustomBreadcrumb({
  items,
  homeLabel = "Dashboard",
  homeHref = "/dashboard",
  showHome = true,
  separator,
  pathLabels = {},
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

  // If pathname is exactly /dashboard and no custom items, show just home
  const isHomePage = pathname === "/dashboard" || pathname === "/dashboard/";

  if (isHomePage && !items) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <HomeIcon className="size-3.5" />
              {homeLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={homeHref} className="flex items-center gap-1.5">
                  <HomeIcon className="size-3.5" />
                  {homeLabel}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems.length > 0 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </>
        )}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {Icon && <Icon className="size-3.5" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href || "#"}
                      className="flex items-center gap-1.5"
                    >
                      {Icon && <Icon className="size-3.5" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
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
