import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Edit, Trash2, Plus } from 'lucide-react'
import VideoForm from './VideoForm'
import VideoPlayer from './VideoPlayer'

export default function VideosModal({ course, trigger }) {
  const [open, setOpen] = useState(false)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchVideos = async () => {
    if (!course?.id) return
    
    try {
      setLoading(true)
      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - getCourseVideos not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      setVideos([])
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchVideos()
    }
  }, [open, course?.id])

  const handleDeleteVideo = async (video) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
      try {
        // Stub implementation - replace with actual database call
        console.warn('Database functionality removed - deleteCourseVideo not implemented')
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        await fetchVideos() // Refresh the list
        alert('Video would have been deleted!')
      } catch (error) {
        console.error('Error deleting video:', error)
        alert('Error deleting video. Please try again.')
      }
    }
  }

  const handleVideoFormSuccess = () => {
    fetchVideos() // Refresh the videos list
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            <Play className="mr-2 h-4 w-4" />
            View Videos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Videos in "{course?.title}"</span>
            <VideoForm 
              courseId={course?.id}
              trigger={
                <Button size="sm" type="button">
                  <Plus className="mr-2 h-3 w-3" />
                  Add Video
                </Button>
              }
              onSuccess={handleVideoFormSuccess}
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No videos found in this course.
              </p>
              <VideoForm 
                courseId={course?.id}
                trigger={
                  <Button type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Video
                  </Button>
                }
                onSuccess={handleVideoFormSuccess}
              />
            </div>
          ) : (
            videos.map((video, index) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{video.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Video #{index + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <VideoForm 
                        video={video}
                        courseId={course?.id}
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
                        onSuccess={handleVideoFormSuccess}
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
                  {video.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {video.description}
                    </p>
                  )}
                  <VideoPlayer video={video} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}