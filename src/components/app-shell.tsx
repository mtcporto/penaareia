
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, Building2, Users, Menu, Package, Bot, LogOut, LifeBuoy, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const navigation = [
  { name: "Negócios", href: "/", icon: Briefcase },
  { name: "Empresas", href: "/companies", icon: Building2 },
  { name: "Contatos", href: "/contacts", icon: Users },
  { name: "Produtos", href: "/products", icon: Package },
]

const adminNavigation = [
    { name: "Corretores", href: "/brokers", icon: UserCog },
]

const supportNavigation = [
    { name: "Suporte", href: "/support", icon: LifeBuoy },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter();
  const { user, broker, isAdmin, signOut, loading } = useAuth(); // Use loading state

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  
  const NavLink = ({ item, isMobile = false }: { item: typeof navigation[0], isMobile?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        pathname === item.href && "text-primary bg-muted",
        isMobile ? "text-lg" : "text-sm font-medium"
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
  
  if (loading) {
     return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  const DesktopNav = () => (
    <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6 text-sm font-medium">
        {navigation.map(item => <NavLink key={item.href} item={item} />)}
        {isAdmin && adminNavigation.map(item => <NavLink key={item.href} item={item} />)}
        {supportNavigation.map(item => <NavLink key={item.href} item={item} />)}
    </nav>
  )

  const MobileNav = () => (
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
            <SheetHeader>
                <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Bot className="h-6 w-6 text-primary" />
                        <span>Pé na Areia</span>
                    </Link>
                </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-2 text-lg font-medium mt-4">
                {navigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
                {isAdmin && adminNavigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
                {supportNavigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
            </nav>
        </SheetContent>
    </Sheet>
  )

  const UserMenu = () => (
    <>
      {user && (
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                      <Image
                          src={broker?.photoURL || user.photoURL || `https://placehold.co/32x32.png`}
                          alt={broker?.name || user.displayName || 'User Avatar'}
                          width={32}
                          height={32}
                          className="rounded-full"
                          data-ai-hint="user avatar"
                      />
                      <span className="sr-only">Toggle user menu</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{broker?.name || user.displayName || user.email}</p>
                          {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                          {broker?.role && <p className="text-xs leading-none text-muted-foreground capitalize mt-1">{broker.role}</p>}
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
      )}
    </>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
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
              {navigation.map(item => <NavLink key={item.href} item={item} />)}
              {isAdmin && adminNavigation.map(item => <NavLink key={item.href} item={item} />)}
              {supportNavigation.map(item => <NavLink key={item.href} item={item} />)}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileNav />
            <div className="w-full flex-1">
              {/* Optional: Add search bar or other header content here */}
            </div>
            <UserMenu />
          </header>
          {/* Page Content */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
            {children}
          </main>
      </div>
    </div>
  )
}
