import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Mail, Phone, Edit, Trash2, Plus } from 'lucide-react'
import StudentForm from '@/components/StudentForm'
import { getStudents, deleteStudent } from '@/lib/firestoreUtils'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await getStudents()
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    try {
      if (confirm('Are you sure you want to delete this student?')) {
        await deleteStudent(id)
        await fetchStudents()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error deleting student. Please try again.')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <Button disabled type="button">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-40 bg-muted animate-pulse rounded" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student accounts and information
          </p>
        </div>
        <StudentForm onSuccess={fetchStudents} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No students found matching your search.' : 'No students found. Add your first student to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {student.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {student.phone}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        Referral: {student.referral_code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <StudentForm 
                      student={student} 
                      onSuccess={fetchStudents}
                      trigger={
                        <Button variant="outline" size="sm" type="button">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      type="button"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
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

