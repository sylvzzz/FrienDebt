import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Cog } from "lucide-react"

export default function Navbar({ userData = {}, activePage = "" }) {
  const links = [
    { href: "/",       label: "Início",         key: "home"    },
    { href: "/friendshub", label: "Amigos",          key: "friends" },
    { href: "/post",   label: "Publicar Dívida", key: "post"    },
  ];

  return (
    <nav className="border-b border-white/10 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">FrienDebt</span>
        </a>

        {/* Links + Perfil */}
        <div className="flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {links.map(({ href, label, key }) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuLink
                    href={href}
                    className={`text-sm px-3 py-2 rounded-md transition-colors hover:text-white hover:bg-white/[0.06] ${
                      activePage === key
                        ? "text-white font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Perfil */}
          <div className="flex items-center gap-3 pl-4 ml-2 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white leading-tight">
                {userData.nome || "—"}
              </p>
              <p className="text-xs text-white/40">{userData.email || "—"}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-0">
                  {userData.nome ? userData.nome[0].toUpperCase() : "?"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-[#1a1a1f] border-white/10 rounded-xl flex flex-col gap-1"
              >
                <DropdownMenuItem asChild>
                  <a href="/account" className="text-white/70 hover:text-white cursor-pointer">
                    <Cog /> Definições
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/logout" className="text-red-400 hover:text-red-300 cursor-pointer">
                    <LogOut />
                    Encerrar Sessão
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}