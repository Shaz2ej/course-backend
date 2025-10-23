import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Play, Plus, Trash2 } from 'lucide-react'
import CourseForm from '@/components/CourseForm'
import VideoForm from '@/components/VideoForm'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)

  const fetchCourse = async () => {
    try {
      setLoading(true)
      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - getCourses not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      // Mock course data
      const mockCourse = {
        id: id,
        title: 'Sample Course',
        description: 'This is a sample course description.',
        created_at: new Date().toISOString()
      }
      setCourse(mockCourse)
    } catch (error) {
      console.error('Error fetching course:', error)
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    try {
      setVideosLoading(true)
      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - getCourseVideos not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      // Mock videos data
      setVideos([])
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideos([])
    } finally {
      setVideosLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
    fetchVideos()
  }, [id])

  const handleFormSuccess = () => {
    fetchCourse()
    fetchVideos()
  }

  const handleDeleteCourse = async () => {
    try {
      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - checkCourseDependencies/deleteCourse not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      if (confirm(`Are you sure you want to delete this course?`)) {
        navigate('/courses')
        alert('Course would have been deleted!')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Error deleting course. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Course not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">
              Course Details
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <CourseForm 
            course={course}
            trigger={
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </Button>
            }
            onSuccess={handleFormSuccess}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/courses/${id}/videos`)}
          >
            <Play className="mr-2 h-4 w-4" />
            Manage Videos
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteCourse}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Course
          </Button>
        </div>
      </div>

      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {course.description || 'No description provided.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              <Play className="mr-1 h-3 w-3" />
              {videos.length} videos
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Videos ({videos.length})</CardTitle>
            <div className="flex space-x-2">
              <VideoForm 
                courseId={id}
                trigger={
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
                }
                onSuccess={handleFormSuccess}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/courses/${id}/videos`)}
              >
                <Play className="mr-2 h-4 w-4" />
                View All Videos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {videosLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No videos in this course yet.
              </p>
              <VideoForm 
                courseId={id}
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Video
                  </Button>
                }
                onSuccess={handleFormSuccess}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {videos.slice(0, 5).map((video, index) => (
                <div key={video.id} className="flex items-center justify-between p-3 border-gray-300 rounded-lg">
                  <div>
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {video.description || 'No description'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Video #{index + 1}
                  </Badge>
                </div>
              ))}
              {videos.length > 5 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/courses/${id}/videos`)}
                  >
                    View All {videos.length} Videos
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}