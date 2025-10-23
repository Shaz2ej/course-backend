import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Plus, Edit, Trash2, Play } from 'lucide-react'
import VideoForm from '@/components/VideoForm'

export default function CourseVideos() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCourseAndVideos = async () => {
    try {
      setLoading(true)
      
      // Stub implementation - replace with actual database calls
      console.warn('Database functionality removed - getCourseById/getCourseVideos not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      // Mock course data
      const courseData = {
        id: id,
        title: 'Sample Course'
      }
      setCourse(courseData)
      
      // Mock videos data
      setVideos([])
    } catch (error) {
      console.error('Error fetching course data:', error)
      alert('Error loading course data. Please try again.')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCourseAndVideos()
    }
  }, [id])

  const handleFormSuccess = () => {
    fetchCourseAndVideos() // Refresh the data
  }

  const handleDeleteVideo = async (video) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
      try {
        // Stub implementation - replace with actual database call
        console.warn('Database functionality removed - deleteCourseVideo not implemented')
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        await fetchCourseAndVideos() // Refresh the list
        alert('Video would have been deleted!')
      } catch (error) {
        console.error('Error deleting video:', error)
        alert('Error deleting video. Please try again.')
      }
    }
  }

  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            disabled
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
          </div>
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

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Not Found</h1>
            <p className="text-muted-foreground">The requested course could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/courses')}
          title="Back to courses"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Videos - {course.title}</h1>
          <p className="text-muted-foreground">
            Manage videos for this course
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/courses/${id}`)}
          >
            Course Details
          </Button>
          <VideoForm 
            courseId={id}
            trigger={
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            }
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4">
        {filteredVideos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No videos found matching your search.' : 'No videos found. Add your first video to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        <Play className="mr-1 h-3 w-3" />
                        Video {video.video_order || 'Unordered'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(video.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <VideoForm 
                      courseId={id}
                      video={video}
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="Edit video"
                          aria-label="Edit video"
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
                      title="Delete video"
                      aria-label="Delete video"
                      type="button"
                      onClick={() => handleDeleteVideo(video)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {video.description && (
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  )}
                  {video.video_embed && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div 
                        className="aspect-video rounded overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: video.video_embed }}
                      />
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