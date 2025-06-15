"use client";
import {
  CreditCard,
  GitCompareArrowsIcon,
  HouseIcon,
  LogOut,
  MessageCircle,
  User,
} from "lucide-react";

import { Button } from "@cc/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@cc/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cc/components/ui/popover";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@cc/lib/auth-client";

// Navigation links array
const navigationLinks = [
  { href: "/", label: "Home", icon: HouseIcon, active: true },
  { href: "/compare", label: "Compare", icon: GitCompareArrowsIcon },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  async function logout() {
    await authClient.signOut();
  }
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="text-primary h-6 w-6" />
            <span className="text-xl font-bold">CardSift AI</span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-primary flex items-center justify-center text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon
                  className="mr-2 inline-block h-4 w-4"
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {session?.user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="bg-muted flex items-center space-x-2 rounded-full px-3 py-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {session.user.name}
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group size-8 md:hidden"
                  variant="ghost"
                  size="icon"
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            asChild
                            className="flex-row items-center gap-2 py-1.5"
                            active={link.active}
                          >
                            <Link href={link.href}>
                              <Icon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                              />
                              <span>{link.label}</span>
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </nav>
  );
}
