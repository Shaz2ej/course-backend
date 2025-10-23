import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, BookOpen, Calendar, DollarSign, X } from 'lucide-react'

export default function PackageDetailsModal({ package: pkg, trigger }) {
  const [open, setOpen] = useState(false)
  const [packageDetails, setPackageDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPackageDetails = async () => {
    if (!pkg?.id || !open) return
    
    try {
      setLoading(true)
      setError(null)
      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - getPackageById not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      setPackageDetails(pkg) // Use the passed package data
    } catch (error) {
      console.error('Error fetching package details:', error)
      setError('Failed to load package details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchPackageDetails()
    }
  }, [open, pkg?.id])

  const handleClose = () => {
    setOpen(false)
    setPackageDetails(null)
    setError(null)
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Loading skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              </div>
              <div className="aspect-video bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex justify-center space-x-2">
              <Button onClick={fetchPackageDetails} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Package Details</span>
          </DialogTitle>
        </DialogHeader>
        
        {packageDetails && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{packageDetails.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${packageDetails.price?.toLocaleString() || '0'}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {new Date(packageDetails.created_at).toLocaleDateString()}</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {packageDetails.description || 'No description provided.'}
                  </p>
                </div>
                
                {packageDetails.features && (
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <p className="text-muted-foreground">
                      {packageDetails.features}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Thumbnail */}
              <div>
                {packageDetails.thumbnail_url ? (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={packageDetails.thumbnail_url} 
                      alt={packageDetails.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No thumbnail available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Included Courses */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Included Courses</h3>
                <Badge variant="secondary">
                  {packageDetails.package_courses?.length || 0} course{packageDetails.package_courses?.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {packageDetails.package_courses && packageDetails.package_courses.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {packageDetails.package_courses.map((packageCourse, index) => {
                    const course = packageCourse.courses
                    return (
                      <Card key={course?.id || index} className="hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{course?.title || 'Untitled Course'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course?.description || 'No description available.'}
                          </p>
                          {course?.created_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Created {new Date(course.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No courses included in this package.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Footer Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleClose} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}