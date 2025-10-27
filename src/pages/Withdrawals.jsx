import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Check, X } from 'lucide-react'
import { getWithdrawals, getStudents, updateWithdrawal } from '@/lib/firestoreUtils'

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true)
        const withdrawalsData = await getWithdrawals()
        const studentsData = await getStudents()
        
        const withdrawalsWithDetails = withdrawalsData.map(withdrawalData => {
          // Find related student data
          const studentData = studentsData.find(student => student.id === withdrawalData.student_id) || null
          
          return {
            id: withdrawalData.id,
            ...withdrawalData,
            students: studentData ? {
              name: studentData.name,
              email: studentData.email
            } : null,
            created_at: withdrawalData.created_at || new Date().toISOString()
          }
        })
        
        setWithdrawals(withdrawalsWithDetails)
      } catch (error) {
        console.error('Error fetching withdrawals:', error)
        setWithdrawals([])
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawals()
  }, [])

  const filteredWithdrawals = withdrawals.filter(withdrawal =>
    withdrawal.students?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.students?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id)
    try {
      await updateWithdrawal(id, { status })
      
      setWithdrawals(prev => 
        prev.map(w => w.id === id ? { ...w, status } : w)
      )
    } catch (error) {
      console.error('Error updating withdrawal status:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">
          Review and process withdrawal requests
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredWithdrawals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No withdrawals found matching your search.' : 'No withdrawal requests found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredWithdrawals.map((withdrawal) => (
            <Card key={withdrawal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        ${withdrawal.amount?.toLocaleString() || '0'}
                      </h3>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status || 'pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student: {withdrawal.students?.name || 'Unknown Student'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {withdrawal.students?.email || 'Unknown Email'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(withdrawal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {withdrawal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(withdrawal.id, 'approved')}
                        disabled={processingId === withdrawal.id}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        type="button"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
                        disabled={processingId === withdrawal.id}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        type="button"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

