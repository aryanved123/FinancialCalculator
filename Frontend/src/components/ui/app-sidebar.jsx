import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import "./app-sidebar.scss"

import {
  Home,
  Calculator,
  Calendar,
  ChartArea,
  Binoculars,
  SquareUserRound,
  CircleUserRound,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
   // title: "Financial Tools",
    title: "Startup Hub",
    url: "/financialtools",
    icon: Calculator,
  },

];

const divStyle = {
  backgroundColor: '#FDFBEE',
  padding: '1rem', 
};


export function AppSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <Sidebar style={divStyle}>
      <SidebarHeader style={divStyle} className="text-2xl text font-semibold text-center">
        Gross Innovation Inc
      </SidebarHeader>
      <SidebarContent style={divStyle}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-menu-item">
                  <SidebarMenuButton className="[&>svg]:size-6 sidebar-menu-item" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter style={divStyle}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="[&>svg]:size-6 sidebar-menu-item">
                  <SquareUserRound />
                  <span className="text-base">{user.firstName} {user.lastName}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <CircleUserRound />
                  <span
                    className="text-base"
                    onClick={() => navigate("/userregistration")}
                  >
                    Profile
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  <span className="text-base">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  <span className="text-base">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
