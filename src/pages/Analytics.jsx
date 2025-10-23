import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    revenueGrowth: 0,
    studentGrowth: 0,
    avgOrderValue: 0
  })
  const [revenueTrends, setRevenueTrends] = useState([])
  const [studentAcquisition, setStudentAcquisition] = useState([])
  const [topPackages, setTopPackages] = useState([])
  const [error, setError] = useState(null)

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Stub implementation - replace with actual database calls
      console.warn('Database functionality removed - analytics functions not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      // Mock data
      setAnalyticsData({
        revenueGrowth: 12.5,
        studentGrowth: 8.3,
        avgOrderValue: 45.75
      })
      setRevenueTrends([
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 14000 },
        { month: 'May', revenue: 22000 },
        { month: 'Jun', revenue: 25000 }
      ])
      setStudentAcquisition([
        { month: 'Jan', students: 120 },
        { month: 'Feb', students: 150 },
        { month: 'Mar', students: 180 },
        { month: 'Apr', students: 140 },
        { month: 'May', students: 220 },
        { month: 'Jun', students: 250 }
      ])
      setTopPackages([
        { title: 'Beginner Course Package', totalRevenue: 12500 },
        { title: 'Advanced Course Package', totalRevenue: 9800 },
        { title: 'Complete Bundle', totalRevenue: 7600 }
      ])
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights
          </p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Growth
            </CardTitle>
            <TrendingUp className={`h-4 w-4 ${
              analyticsData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analyticsData.revenueGrowth)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Growth
            </CardTitle>
            <Users className={`h-4 w-4 ${
              analyticsData.studentGrowth >= 0 ? 'text-blue-600' : 'text-red-600'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analyticsData.studentGrowth)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData.avgOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              per purchase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              placeholder value
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue over the last 6 months
            </p>
          </CardHeader>
          <CardContent>
            {revenueTrends.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <div className="h-64 space-y-2">
                {revenueTrends.map((item, index) => {
                  const maxRevenue = Math.max(...revenueTrends.map(r => r.revenue))
                  const barWidth = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                  
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-muted-foreground">
                        {item.month}
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className="bg-blue-600 h-6 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(barWidth, 5)}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Acquisition</CardTitle>
            <p className="text-sm text-muted-foreground">
              New students acquired monthly
            </p>
          </CardHeader>
          <CardContent>
            {studentAcquisition.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No student data available
              </div>
            ) : (
              <div className="h-64 space-y-2">
                {studentAcquisition.map((item, index) => {
                  const maxStudents = Math.max(...studentAcquisition.map(s => s.students))
                  const barWidth = maxStudents > 0 ? (item.students / maxStudents) * 100 : 0
                  
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-muted-foreground">
                        {item.month}
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className="bg-green-600 h-6 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(barWidth, 5)}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {item.students}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Packages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Packages ranked by total revenue generated
          </p>
        </CardHeader>
        <CardContent>
          {topPackages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No package revenue data available
            </div>
          ) : (
            <div className="space-y-4">
              {topPackages.map((pkg, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{pkg.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(pkg.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

