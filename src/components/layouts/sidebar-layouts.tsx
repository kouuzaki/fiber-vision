"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarHeaderContent,
  SidebarNav,
  SidebarUserFooter,
  CustomBreadcrumb,
} from "./sidebar";
import {
  sidebarNavigation,
  defaultTeam,
  filterNavByRole,
} from "@/config/sidebar-data";
import type {
  SidebarUser,
  SidebarTeam,
  SidebarNavGroup,
  UserRole,
  BreadcrumbItemConfig,
} from "@/types/sidebar-types";

export interface SidebarLayoutProps {
  children: React.ReactNode;
  /** Current user data for footer */
  user?: SidebarUser;
  /** User role for filtering navigation */
  userRole?: UserRole;
  /** Custom navigation groups (overrides default) */
  navigation?: SidebarNavGroup[];
  /** Custom team data */
  team?: SidebarTeam;
  /** Multiple teams for team switcher */
  teams?: SidebarTeam[];
  /** Custom breadcrumb items */
  breadcrumbItems?: BreadcrumbItemConfig[];
  /** Custom breadcrumb home label */
  breadcrumbHomeLabel?: string;
  /** Show breadcrumb (default: true) */
  showBreadcrumb?: boolean;
  /** Custom path labels for breadcrumb auto-generation */
  breadcrumbPathLabels?: Record<string, string>;
  /** Default sidebar open state */
  defaultOpen?: boolean;
}

export function SidebarLayout({
  children,
  user,
  userRole,
  navigation,
  team = defaultTeam,
  teams,
  breadcrumbItems,
  breadcrumbHomeLabel,
  showBreadcrumb = true,
  breadcrumbPathLabels,
  defaultOpen = true,
}: SidebarLayoutProps) {
  // Use provided navigation or filter default by role
  const filteredNavigation = React.useMemo(() => {
    const navToFilter = navigation ?? sidebarNavigation;
    return filterNavByRole(navToFilter, userRole);
  }, [navigation, userRole]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarHeaderContent teams={teams} defaultTeam={team} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav groups={filteredNavigation} />
        </SidebarContent>
        {user && (
          <SidebarFooter>
            <SidebarUserFooter user={user} />
          </SidebarFooter>
        )}
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {showBreadcrumb && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <CustomBreadcrumb
                  items={breadcrumbItems}
                  homeLabel={breadcrumbHomeLabel}
                  pathLabels={breadcrumbPathLabels}
                />
              </>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
