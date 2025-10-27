import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Play, Plus, Trash2 } from 'lucide-react'
import CourseForm from '@/components/CourseForm'
import VideoForm from '@/components/VideoForm'
import { getPackages, getCoursesByPackageId, getVideosByCourseId, deleteCourseFromPackage } from '@/lib/firestoreUtils'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true)
      // We need to find the course across all packages since we only have the course ID
      // In a real implementation, you might want to pass the packageId as well
      const packagesData = await getPackages()
      let foundCourse = null
      let foundPackageId = null
      
      for (const packageData of packagesData) {
        const coursesData = await getCoursesByPackageId(packageData.id)
        const courseData = coursesData.find(course => course.id === id)
        if (courseData) {
          foundCourse = { id: courseData.id, ...courseData }
          foundPackageId = packageData.id
          break
        }
      }
      
      if (foundCourse) {
        setCourse({
          ...foundCourse,
          packageId: foundPackageId,
          created_at: foundCourse.created_at || new Date().toISOString()
        })
      } else {
        navigate('/courses') // Redirect if course not found
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  const fetchVideos = useCallback(async () => {
    try {
      setVideosLoading(true)
      if (course?.packageId) {
        const videosData = await getVideosByCourseId(course.packageId, id)
        const formattedVideos = videosData.map(videoData => ({
          id: videoData.id,
          ...videoData,
          created_at: videoData.created_at || new Date().toISOString()
        }))
        setVideos(formattedVideos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideos([])
    } finally {
      setVideosLoading(false)
    }
  }, [course?.packageId, id])

  useEffect(() => {
    fetchCourse()
  }, [id, fetchCourse])

  useEffect(() => {
    if (course) {
      fetchVideos()
    }
  }, [course, fetchVideos])

  const handleFormSuccess = () => {
    fetchCourse()
    fetchVideos()
  }

  const handleDeleteCourse = async () => {
    try {
      if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
        await deleteCourseFromPackage(course.packageId, id)
        navigate('/courses')
        alert('Course deleted successfully!')
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