import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react'
import { 
  auditVideoRelationships, 
  getCoursesByPackageId, 
  getPackagesByCourseId,
  getVideosByCourseId 
} from '@/lib/database'

export default function DatabaseAudit() {
  const [auditData, setAuditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState({})

  const runAudit = async () => {
    setLoading(true)
    try {
      // Audit video relationships
      const videoAudit = await auditVideoRelationships()
      setAuditData(videoAudit)
      
      // Test sample relationships
      const results = {}
      
      // Test if we can fetch courses for a package (this should work)
      try {
        const samplePackages = await fetch('/api/packages').then(r => r.json()).catch(() => [])
        if (samplePackages.length > 0) {
          const packageCourses = await getCoursesByPackageId(samplePackages[0].id)
          results.packageCourseLink = {
            success: true,
            message: `Found ${packageCourses.length} courses for package`,
            data: packageCourses
          }
        }
      } catch (error) {
        results.packageCourseLink = {
          success: false,
          message: `Error testing package-course relationship: ${error.message}`
        }
      }
      
      setTestResults(results)
    } catch (error) {
      console.error('Audit failed:', error)
      setAuditData({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runAudit()
  }, [])

  const getStatusColor = (hasIssues) => {
    return hasIssues ? 'destructive' : 'secondary'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database Relationships Audit</CardTitle>
          </div>
          <Button onClick={runAudit} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Auditing...' : 'Run Audit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Relationships */}
        {auditData && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Video-Course Relationships</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {auditData.totalVideos}
                </div>
                <div className="text-sm text-blue-800">Total Videos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {auditData.validVideos}
                </div>
                <div className="text-sm text-green-800">Valid Relationships</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {auditData.orphanedVideos?.length || 0}
                </div>
                <div className="text-sm text-red-800">Orphaned Videos</div>
              </div>
            </div>
            
            {auditData.orphanedVideos && auditData.orphanedVideos.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Orphaned Videos Found</h4>
                </div>
                <div className="space-y-2">
                  {auditData.orphanedVideos.map(video => (
                    <div key={video.id} className="bg-white p-3 rounded border-[var(--border)]">
                      <div className="font-medium">{video.title}</div>
                      <div className="text-sm text-gray-600">
                        Video ID: {video.id} | Course ID: {video.course_id || 'NULL'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Relationship Tests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Relationship Tests</h3>
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="flex items-center justify-between p-3 border-[var(--border)] rounded-lg">
              <div>
                <div className="font-medium">{test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                <div className="text-sm text-gray-600">{result.message}</div>
              </div>
              <Badge variant={result.success ? 'secondary' : 'destructive'}>
                {result.success ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {result.success ? 'Pass' : 'Fail'}
              </Badge>
            </div>
          ))}
        </div>

        {/* Quick Fix Suggestions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Fixes</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Database Schema Commands</h4>
            <div className="space-y-2 text-sm font-mono bg-blue-100 p-3 rounded">
              <div>-- Ensure proper foreign key constraints</div>
              <div>ALTER TABLE course_videos ADD CONSTRAINT fk_course_videos_course_id </div>
              <div>FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;</div>
              <div className="mt-2">-- Add video_embed column if missing</div>
              <div>ALTER TABLE course_videos ADD COLUMN IF NOT EXISTS video_embed TEXT;</div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Best Practices</h4>
            <ul className="text-sm space-y-1 text-amber-700">
              <li>• Always add videos through the course's "Add Video" button</li>
              <li>• Videos belong to specific courses, not packages directly</li>
              <li>• Packages contain courses, courses contain videos</li>
              <li>• Use the CourseVideos page to manage videos for a specific course</li>
            </ul>
          </div>
        </div>

        {auditData?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Audit Error</h4>
            </div>
            <p className="text-red-700 mt-2">{auditData.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}