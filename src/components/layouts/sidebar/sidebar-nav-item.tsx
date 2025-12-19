"use client";

import * as React from "react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import type { SidebarNavItem, SidebarNavSubItem } from "@/types/sidebar-types";

interface SidebarNavItemProps {
  item: SidebarNavItem;
  pathname?: string;
}

export function SidebarNavItemComponent({
  item,
  pathname,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasSubItems = item.items && item.items.length > 0;
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if any child is active (for keeping collapsible open)
  const hasActiveChild =
    hasSubItems &&
    item.items?.some(
      (subItem) =>
        pathname === subItem.url || pathname?.startsWith(subItem.url + "/")
    );

  // Auto-open if child is active
  React.useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  // For items without sub-items: exact match only
  // For items with sub-items: active if exact match OR any child is active
  const isActive = hasSubItems
    ? pathname === item.url || hasActiveChild
    : pathname === item.url;

  // Debug log
  React.useEffect(() => {
    console.log(
      `[${item.title}] url: ${item.url}, pathname: ${pathname}, isActive: ${isActive}, hasSubItems: ${hasSubItems}, hasActiveChild: ${hasActiveChild}, match: ${pathname === item.url ? "EXACT" : pathname?.startsWith(item.url + "/") ? "CHILD" : "NONE"}`
    );
  }, [item.title, item.url, pathname, isActive, hasSubItems, hasActiveChild]);

  // Simple link item without sub-items
  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={item.title} asChild isActive={isActive}>
          <Link href={item.url}>
            <Icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Collapsible item with sub-items - matches example styling exactly
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      asChild
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            <Icon className="size-4 shrink-0" />
            <span>{item.title}</span>
            <ChevronRightIcon
              className={`ml-auto size-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarNavSubItemComponent
                key={subItem.title}
                item={subItem}
                pathname={pathname}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

interface SidebarNavSubItemProps {
  item: SidebarNavSubItem;
  pathname?: string;
}

function SidebarNavSubItemComponent({
  item,
  pathname,
}: SidebarNavSubItemProps) {
  const Icon = item.icon;
  const isActive = pathname === item.url;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link href={item.url}>
          {Icon && <Icon />}
          {item.title}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
