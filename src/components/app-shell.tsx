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
  
  const NavLink = ({ item }: { item: typeof navigation[0] }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        pathname === item.href
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-primary hover:bg-muted/50"
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Bot className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Pé na Areia</span>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-auto">
          {navigation.map(item => <NavLink key={item.name} item={item} />)}
        </nav>
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
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Bot className="h-6 w-6 text-primary" />
                <span className="sr-only">Pé na Areia</span>
              </Link>
              {navigation.map(item => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn("flex items-center gap-4 px-2.5",
                        pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
