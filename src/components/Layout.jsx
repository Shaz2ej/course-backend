import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  BookOpen, 
  Menu, 
  X,
  BarChart3,
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Withdrawals', href: '/withdrawals', icon: CreditCard },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Package Referral Codes', href: '/package-referral-codes', icon: Gift },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const NavItems = ({ mobile = false }) => (
    <nav className={`${mobile ? 'px-4' : 'px-6'} space-y-2`}>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setSidebarOpen(false)}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-lg font-semibold">Course Admin</h1>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <NavItems mobile />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-0">
          <div className="flex h-16 shrink-0 items-center border-b px-6">
            <h1 className="text-lg font-semibold text-foreground">Course Admin</h1>
          </div>
          <div className="flex flex-1 flex-col py-4">
            <NavItems />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                title="Open sidebar"
                aria-label="Open sidebar"
                type="button"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-foreground">
                {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}