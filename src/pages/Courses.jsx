import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Play, Eye, Video } from 'lucide-react'
import { getCourses, deleteCourse, getCourseVideos, checkCourseDependencies } from '@/lib/database'
import CourseForm from '@/components/CourseForm'
import VideoForm from '@/components/VideoForm'
import VideosModal from '@/components/VideosModal'

export default function Courses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await getCourses()
      
      // Process courses to ensure proper video count display
      const processedCourses = data?.map(course => ({
        ...course,
        video_count: course.course_videos?.length || 0
      })) || []
      
      setCourses(processedCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleFormSuccess = () => {
    fetchCourses() // Refresh the courses list
  }

  const handleDeleteCourse = async (course) => {
    try {
      // Check dependencies first
      const dependencies = await checkCourseDependencies(course.id)
      
      let confirmMessage = `Are you sure you want to delete "${course.title}"?`
      
      if (dependencies.videos > 0) {
        confirmMessage += `\n\nThis will also delete ${dependencies.videos} associated video(s).`
      }
      
      if (dependencies.packages > 0) {
        confirmMessage += `\n\nThis course is linked to ${dependencies.packages} package(s): ${dependencies.packageNames.join(', ')}. It will be removed from these packages.`
      }
      
      if (confirm(confirmMessage)) {
        await deleteCourse(course.id)
        await fetchCourses() // Refresh the list
        alert('Course deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Error deleting course. Please try again.'
      
      if (error.message.includes('not found')) {
        errorMessage = 'Course not found. It may have already been deleted.'
      } else if (error.message.includes('referenced by other records')) {
        errorMessage = 'Cannot delete course: It is still linked to packages or has dependencies. Please remove all references first.'
      } else if (error.message.includes('Course')) {
        errorMessage = error.message // Use the specific error message from database function
      }
      
      alert(errorMessage)
    }
  }

  const handleViewVideos = async (course) => {
    // The VideosModal component will handle fetching and displaying videos
    // No additional logic needed here as the modal handles everything
  }

  const handleAddVideo = (course) => {
    // The VideoForm component will handle adding videos
    // No additional logic needed here as the form handles everything
  }

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <Button disabled type="button">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
        <div className="grid gap-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Create and manage course content and videos
          </p>
        </div>
        <CourseForm 
          trigger={
            <Button type="button">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          }
          onSuccess={handleFormSuccess}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No courses found matching your search.' : 'No courses found. Create your first course to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        <Play className="mr-1 h-3 w-3" />
                        {course.video_count || course.course_videos?.length || 0} videos
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <CourseForm 
                      course={course}
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="Edit course"
                          aria-label="Edit course"
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
                      title="Delete course"
                      aria-label="Delete course"
                      type="button"
                      onClick={() => handleDeleteCourse(course)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => navigate(`/courses/${course.id}/videos`)}
                    >
                      <Video className="mr-1 h-3 w-3" />
                      View Videos
                    </Button>
                    <VideoForm 
                      courseId={course.id}
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm" 
                          type="button"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Video
                        </Button>
                      }
                      onSuccess={handleFormSuccess}
                    />
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

