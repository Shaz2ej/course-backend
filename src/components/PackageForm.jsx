import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, Save, X, Upload, Trash2 } from 'lucide-react'
import { createPackage, updatePackage, getCourses, linkPackageToCourse, unlinkPackageFromCourse, uploadFile } from '@/lib/database'

export default function PackageForm({ packageData = null, onSuccess, trigger }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableCourses, setAvailableCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [formData, setFormData] = useState({
    title: packageData?.title || '',
    description: packageData?.description || '',
    price: packageData?.price || '',
    thumbnail_url: packageData?.thumbnail_url || ''
  })
  const [selectedCourses, setSelectedCourses] = useState([])
  const [uploading, setUploading] = useState(false)

  // Fetch available courses when dialog opens
  useEffect(() => {
    if (open) {
      fetchCourses()
      if (packageData) {
        fetchPackageCourses()
      }
    }
  }, [open, packageData])

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true)
      const courses = await getCourses()
      setAvailableCourses(courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setAvailableCourses([])
    } finally {
      setLoadingCourses(false)
    }
  }

  const fetchPackageCourses = async () => {
    try {
      if (packageData?.package_courses) {
        const courseIds = packageData.package_courses.map(pc => pc.courses.id)
        setSelectedCourses(courseIds)
      }
    } catch (error) {
      console.error('Error fetching package courses:', error)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const thumbnailUrl = await uploadFile(file, 'thumbnails')
      setFormData(prev => ({ ...prev, thumbnail_url: thumbnailUrl }))
      console.log('Thumbnail uploaded successfully:', thumbnailUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
      // Show specific error message from uploadFile function
      alert(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail_url: '' }))
  }

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId)
      } else {
        return [...prev, courseId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const packageSubmitData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        thumbnail_url: formData.thumbnail_url
      }

      let savedPackage
      if (packageData) {
        savedPackage = await updatePackage(packageData.id, packageSubmitData)
        
        // Handle course relationships for existing package
        if (packageData.package_courses) {
          const currentCourseIds = packageData.package_courses.map(pc => pc.courses.id)
          
          // Remove courses that are no longer selected
          for (const courseId of currentCourseIds) {
            if (!selectedCourses.includes(courseId)) {
              await unlinkPackageFromCourse(packageData.id, courseId)
            }
          }
          
          // Add newly selected courses
          for (const courseId of selectedCourses) {
            if (!currentCourseIds.includes(courseId)) {
              await linkPackageToCourse(packageData.id, courseId)
            }
          }
        } else {
          // If no existing courses, add all selected ones
          for (const courseId of selectedCourses) {
            await linkPackageToCourse(packageData.id, courseId)
          }
        }
      } else {
        savedPackage = await createPackage(packageSubmitData)
        
        // Link selected courses to new package
        for (const courseId of selectedCourses) {
          await linkPackageToCourse(savedPackage.id, courseId)
        }
      }

      setOpen(false)
      setFormData({ title: '', description: '', price: '', thumbnail_url: '' })
      setSelectedCourses([])
      onSuccess?.()
      
      alert(`Package ${packageData ? 'updated' : 'created'} successfully!`)
    } catch (error) {
      console.error('Error saving package:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      alert(`Error saving package: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {packageData ? 'Edit Package' : 'Add New Package'}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Package Details</TabsTrigger>
            <TabsTrigger value="courses">Included Courses</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Package Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter package title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter package description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image file (JPEG, PNG, GIF, WebP). Max size: 10MB.
                  </p>
                  {uploading && (
                    <p className="text-sm text-blue-600">Uploading...</p>
                  )}
                  {formData.thumbnail_url && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Thumbnail preview" 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm text-green-600">Thumbnail uploaded successfully</p>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="w-fit mt-1"
                          onClick={handleDeleteThumbnail}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete Thumbnail
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="courses" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Courses to Include</Label>
                {loadingCourses ? (
                  <p className="text-sm text-muted-foreground">Loading courses...</p>
                ) : availableCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No courses available</p>
                ) : (
                  <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                    {availableCourses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id={`course-${course.id}`}
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => handleCourseToggle(course.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`course-${course.id}`} 
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {course.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Select which courses should be included in this package
                </p>
              </div>
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : (packageData ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}