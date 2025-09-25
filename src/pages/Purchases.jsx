import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, UserCheck, UserX } from 'lucide-react'
import { getPurchases } from '@/lib/database'

export default function Purchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await getPurchases()
        setPurchases(data || [])
      } catch (error) {
        console.error('Error fetching purchases:', error)
        setPurchases([])
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const filteredPurchases = purchases.filter(purchase =>
    purchase.students?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.packages?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.referrer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
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
        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
        <p className="text-muted-foreground">
          View and manage all purchase transactions
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchases, students, packages, or referrers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPurchases.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No purchases found matching your search.' : 'No purchases found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPurchases.map((purchase) => {
            const isReferralPurchase = purchase.affiliate_id !== null
            const referrerName = purchase.referrer?.name
            const referrerEmail = purchase.referrer?.email
            
            return (
              <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">
                          {purchase.packages?.title || 'Unknown Package'}
                        </h3>
                        <Badge className={getStatusColor(purchase.status)}>
                          {purchase.status || 'Unknown'}
                        </Badge>
                      </div>
                      
                      {/* Buyer Information */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Buyer: {purchase.students?.name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Email: {purchase.students?.email || 'Unknown Email'}
                        </p>
                      </div>
                      
                      {/* Package Information */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Package: {purchase.packages?.title || 'Unknown Package'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Package Price: ${purchase.packages?.price?.toLocaleString() || '0'}
                        </p>
                      </div>
                      
                      {/* Purchase Amount and Commission */}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">
                          Amount: ${purchase.amount?.toLocaleString() || '0'}
                        </span>
                        <span className="text-muted-foreground">
                          Commission: ${purchase.commission?.toLocaleString() || '0'}
                        </span>
                      </div>
                      
                      {/* Referral Information */}
                      <div className="flex items-center space-x-2">
                        {isReferralPurchase ? (
                          <>
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Referral Purchase
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {referrerName || 'Unknown Referrer'} ({referrerEmail || 'No email'})
                            </span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 text-blue-600" />
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Direct Purchase
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      {/* Purchase Date */}
                      <p className="text-xs text-muted-foreground">
                        Purchase Date: {new Date(purchase.created_at || purchase.purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

