import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, ShoppingCart, CreditCard } from 'lucide-react'
import { getStudents, getPurchases, getWithdrawals } from '@/lib/firestoreUtils'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch students count
        const studentsData = await getStudents()
        const totalStudents = studentsData.length
        
        // Fetch purchases and calculate revenue
        const purchasesData = await getPurchases()
        let totalRevenue = 0
        let totalPurchases = 0
        
        purchasesData.forEach((purchaseData) => {
          if (purchaseData.status === 'completed') {
            totalRevenue += purchaseData.amount || 0
          }
          totalPurchases++
        })
        
        // Fetch withdrawals
        const withdrawalsData = await getWithdrawals()
        let totalWithdrawals = withdrawalsData.length
        let pendingWithdrawals = 0
        
        withdrawalsData.forEach((withdrawalData) => {
          if (withdrawalData.status === 'pending') {
            pendingWithdrawals++
          }
        })
        
        setStats({
          totalStudents,
          totalRevenue,
          totalPurchases,
          totalWithdrawals,
          pendingWithdrawals
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Purchases',
      value: stats.totalPurchases,
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals,
      icon: CreditCard,
      color: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your course admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    System initialized successfully
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Admin panel is ready to use
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Manage students and their progress
            </div>
            <div className="text-sm text-muted-foreground">
              • Review purchase transactions
            </div>
            <div className="text-sm text-muted-foreground">
              • Process withdrawal requests
            </div>
            <div className="text-sm text-muted-foreground">
              • Create and manage course packages
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

