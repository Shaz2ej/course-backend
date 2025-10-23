import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PackageReferralCodes() {
  const [referralCodes, setReferralCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchReferralCodes = async () => {
      try {
        // Stub implementation - replace with actual database call
        console.warn('Database functionality removed - getPackageReferralCodes not implemented')
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        
        // Mock referral codes data
        setReferralCodes([
          {
            id: '1',
            student_name: 'John Doe',
            student_email: 'john@example.com',
            package_name: 'Basic Course Package',
            referral_code: 'JD001',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            student_name: 'Jane Smith',
            student_email: 'jane@example.com',
            package_name: 'Premium Course Package',
            referral_code: 'JS002',
            created_at: new Date().toISOString()
          }
        ])
      } catch (error) {
        console.error('Error fetching referral codes:', error)
        setReferralCodes([])
      } finally {
        setLoading(false)
      }
    }

    fetchReferralCodes()
  }, [])

  const filteredReferralCodes = referralCodes.filter(code =>
    code.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.student_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Package Referral Codes</h1>
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

  // Generate referral link from code
  const generateReferralLink = (referralCode) => {
    return `${window.location.origin}/register?ref=${referralCode}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Package Referral Codes</h1>
        <p className="text-muted-foreground">
          View referral codes used for package purchases
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, package, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReferralCodes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No referral codes found matching your search.' : 'No referral codes found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReferralCodes.map((code) => (
            <Card key={code.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        {code.package_name}
                      </h3>
                      <Badge variant="outline">
                        {new Date(code.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    {/* Student Information */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Student: {code.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Email: {code.student_email}
                      </p>
                    </div>
                    
                    {/* Referral Information */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Referral Code: <span className="font-mono">{code.referral_code}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Referral Link: <span className="font-mono break-all">{generateReferralLink(code.referral_code)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}