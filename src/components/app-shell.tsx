
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, Building2, Users, Menu, Package, Bot, LogOut, LifeBuoy, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
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
  const { user, broker, isAdmin, signOut } = useAuth();


  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  
  const NavLink = ({ item, isMobile = false }: { item: typeof navigation[0], isMobile?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-md font-medium transition-colors",
        isMobile 
          ? `px-2.5 text-lg ${pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
          : `px-3 py-2 text-sm ${pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"}`
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        
        {/* Mobile Menu */}
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
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                        <Bot className="h-6 w-6 text-primary" />
                        <span>Pé na Areia</span>
                    </Link>
                    {navigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
                    {isAdmin && adminNavigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
                    {supportNavigation.map(item => <NavLink key={item.href} item={item} isMobile={true}/>)}
                </nav>
            </SheetContent>
        </Sheet>
        
        <div className="flex w-full items-center">
             <Link href="/" className="hidden items-center gap-2 font-semibold md:flex">
                <Bot className="h-6 w-6 text-primary" />
                <span>Pé na Areia</span>
            </Link>
            <nav className="hidden flex-row items-center gap-5 text-sm md:flex lg:gap-6 ml-auto">
                {navigation.map(item => <NavLink key={item.name} item={item} />)}
                {isAdmin && adminNavigation.map(item => <NavLink key={item.name} item={item} />)}
                {supportNavigation.map(item => <NavLink key={item.name} item={item} />)}
            </nav>
            
            {user && (
                 <div className="flex items-center gap-4 ml-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Image
                                    src={broker?.photoURL || user.photoURL || `https://placehold.co/32x32.png`}
                                    alt={broker?.name || user.displayName || 'User Avatar'}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    data-ai-hint="user avatar"
                                />
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
                </div>
            )}
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
