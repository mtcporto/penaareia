"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Building2, Users, Menu, Package, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Negócios", href: "/", icon: Briefcase },
  { name: "Empresas", href: "/companies", icon: Building2 },
  { name: "Contatos", href: "/contacts", icon: Users },
  { name: "Produtos", href: "/products", icon: Package },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname.startsWith('/deals/')) {
        return 'Detalhes do Negócio'
    }
    return navigation.find(item => item.href === pathname)?.name || 'Dashboard'
  }
  
  const NavLink = ({ item, isMobile }: { item: typeof navigation[0], isMobile?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        pathname === item.href && "bg-muted text-primary",
        isMobile ? "text-lg" : "text-sm"
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Bot className="h-6 w-6 text-primary" />
              <span className="">Pé na Areia</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navigation.map(item => <NavLink key={item.name} item={item} />)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="">Pé na Areia</span>
                </Link>
                {navigation.map(item => <NavLink key={item.name} item={item} isMobile />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <h1 className="text-xl font-semibold text-foreground">
                {getPageTitle()}
             </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
