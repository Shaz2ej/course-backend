import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Save, X, AlertCircle } from 'lucide-react'

export default function VideoForm({ video = null, courseId = null, onSuccess, trigger }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    video_embed: video?.video_embed || '',
    course_id: video?.course_id || courseId || ''
  })

  // Initialize input type and warnings when form opens
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.video_embed.trim()) {
        alert('Please enter an embed code.')
        return
      }
      
      if (!formData.course_id) {
        alert('Course ID is required. Please ensure you are adding the video to a specific course.')
        return
      }

      const videoData = {
        title: formData.title,
        description: formData.description || null,
        video_embed: formData.video_embed,
        course_id: formData.course_id // Ensure course_id is always included
      }

      console.log('Saving video data:', videoData)
      console.log('Video will be linked to course ID:', formData.course_id)

      // Stub implementation - replace with actual database call
      console.warn('Database functionality removed - video operation not implemented')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

      setOpen(false)
      setFormData({ 
        title: '', 
        description: '', 
        video_embed: '',
        course_id: courseId || '' 
      })
      onSuccess?.()
      
      alert(`Video would have been ${video ? 'updated' : 'created'} and linked to the course!`)
    } catch (error) {
      console.error('Error saving video:', error)
      alert('Error saving video. Please try again.')
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
            Add Video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {video ? 'Edit Video' : 'Add New Video'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter video description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_embed">Video Embed Code</Label>
            <Textarea
              id="video_embed"
              value={formData.video_embed}
              onChange={(e) => handleInputChange('video_embed', e.target.value)}
              placeholder="Paste your iframe embed code here..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Paste iframe embed code from YouTube, Vimeo, or other video platforms
            </p>
          </div>

          {/* Hidden course_id field - only show if courseId is not provided */}
          {!courseId && (
            <div className="space-y-2">
              <Label htmlFor="course_id">Course ID</Label>
              <Input
                id="course_id"
                value={formData.course_id}
                onChange={(e) => handleInputChange('course_id', e.target.value)}
                placeholder="Enter course ID"
                required
              />
              <p className="text-xs text-muted-foreground text-amber-600">
                ⚠️ Warning: Make sure this course exists. Videos are linked to specific courses only.
              </p>
            </div>
          )}
          
          {/* Show course info when courseId is provided */}
          {courseId && (
            <div className="space-y-2 mt-2 mb-4" style={{ zIndex: 10 }}>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ This video will be added to course ID: <code className="font-mono bg-green-100 px-1 rounded">{courseId}</code>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4" style={{ position: 'relative', zIndex: 20 }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (video ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}