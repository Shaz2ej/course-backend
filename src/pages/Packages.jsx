import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { getPackages, deletePackage } from '@/lib/database'
import PackageForm from '@/components/PackageForm'
import PackageDetailsModal from '@/components/PackageDetailsModal'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await getPackages()
      setPackages(data || [])
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleAddPackage = () => {
    setSelectedPackage(null)
    setShowAddForm(true)
  }

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowEditForm(true)
  }

  const handleDeletePackage = async (pkg) => {
    if (confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
      try {
        await deletePackage(pkg.id)
        await fetchPackages() // Refresh the list
        console.log('Package deleted successfully')
      } catch (error) {
        console.error('Error deleting package:', error)
        alert('Error deleting package. Please try again.')
      }
    }
  }

  const handleViewDetails = (pkg) => {
    // Package details will be handled by the PackageDetailsModal component
  }

  const handleFormSuccess = () => {
    fetchPackages() // Refresh the packages list
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedPackage(null)
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
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
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">
            Create and manage course packages
          </p>
        </div>
        <PackageForm 
          trigger={
            <Button type="button">
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          }
          onSuccess={handleFormSuccess}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No packages found matching your search.' : 'No packages found. Create your first package to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <div className="flex space-x-1">
                    <PackageForm 
                      packageData={pkg}
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="Edit package"
                          aria-label="Edit package"
                          type="button"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      }
                      onSuccess={handleFormSuccess}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600"
                      title="Delete package"
                      aria-label="Delete package"
                      type="button"
                      onClick={() => handleDeletePackage(pkg)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pkg.thumbnail_url && (
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={pkg.thumbnail_url} 
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      ${pkg.price?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(pkg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <PackageDetailsModal 
                    package={pkg}
                    trigger={
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm" 
                        type="button"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

