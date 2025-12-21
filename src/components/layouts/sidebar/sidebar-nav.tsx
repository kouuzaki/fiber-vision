"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarNavItemComponent } from "./sidebar-nav-item";
import type { SidebarNavGroup } from "@/types/sidebar-types";

interface SidebarNavProps {
  groups: SidebarNavGroup[];
}

export function SidebarNav({ groups }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup
          key={group.label}
          className={
            group.hideOnCollapse
              ? "group-data-[collapsible=icon]:hidden"
              : undefined
          }
        >
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarNavItemComponent
                key={item.title}
                item={item}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
