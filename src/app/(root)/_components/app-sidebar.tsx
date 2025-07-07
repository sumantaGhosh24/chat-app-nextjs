"use client";

import Link from "next/link";
import {useTheme} from "next-themes";
import {ChevronDown, ChevronUp, Moon, Plus, Sun, UserPlus} from "lucide-react";

import useRoutes from "@/hooks/useRoutes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import DialogProvider from "./dialog-provider";
import UserList from "./user-list";
import ConversationList from "./conversation-list";
import GroupChat from "./group-chat";

const AppSidebar = () => {
  const routes = useRoutes();
  const {setTheme} = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Menu
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {routes.map((route) => (
                    <SidebarMenuItem key={route.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={route.active}
                        onClick={() => {
                          if (route.onClick) route.onClick();
                        }}
                      >
                        <Link href={route.href}>
                          <route.icon />
                          <span>{route.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Chats
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <DialogProvider
                    trigger={
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button>
                            <Plus />
                            <span>New Conversation</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    }
                    title="New Conversation"
                    description="Start a new conversation with a user"
                  >
                    <UserList />
                  </DialogProvider>
                  <DialogProvider
                    trigger={
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button>
                            <UserPlus />
                            <span>New Group</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    }
                    title="New Group"
                    description="Start a new group chat"
                  >
                    <GroupChat />
                  </DialogProvider>
                  <ConversationList />
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Toggle theme</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
