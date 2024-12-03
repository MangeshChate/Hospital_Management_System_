"use client"

import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function SidebarTopLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:bg-white flex items-center  gap-3">
          <div className="relative w-10 h-10 flex-shrink-0  ">
            <div className=" flex  items-center justify-center ">
              <Image 
                src="/demologo.png" 
                width={60} 
                height={60} 
                alt="logo" 
                className="size-10 object-contain  "
              />
            </div>
          </div>
          
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-xl">Curea</span>
            <span className="truncate text-xs">Hospital Management</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}