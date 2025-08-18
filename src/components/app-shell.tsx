
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, Building2, Users, Menu, Package, Bot, LogOut } from "lucide-react"
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter();
  const { user, signOut } = useAuth();


  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  
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
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {navigation.map(item => <NavLink key={item.name} item={item} />)}
        </nav>
        <div className="ml-auto flex items-center gap-4">
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
            {user && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Image
                                src={user.photoURL || `https://placehold.co/32x32.png`}
                                alt={user.displayName || 'User Avatar'}
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
                                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
