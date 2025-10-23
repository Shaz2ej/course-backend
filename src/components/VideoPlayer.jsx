import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Eye, EyeOff, Play, AlertTriangle } from 'lucide-react'
import { getVideoDisplayInfo, sanitizeEmbedCode, isTrustedEmbedSource } from '@/lib/videoUtils'

export default function VideoPlayer({ video, className = '' }) {
  const [showPreview, setShowPreview] = useState(false)
  const iframeRef = useRef(null)
  
  // Calculate display info safely
  const displayInfo = video ? getVideoDisplayInfo(video.video_url, video.embed_code) : { url: '' }
  
  useEffect(() => {
    // Only update iframe src if video exists and iframeRef is available
    if (video && iframeRef.current) {
      const info = getVideoDisplayInfo(video.video_url, video.embed_code)
      iframeRef.current.src = info.url
    }
  }, [video])
  
  // Handle the case where video is null
  if (!video) return null
  
  const hasEmbed = video.embed_code && video.embed_code.trim()
  const isTrusted = hasEmbed ? isTrustedEmbedSource(video.embed_code) : true
  
  const renderEmbedPreview = () => {
    if (!hasEmbed || !showPreview) return null
    
    return (
      <div className="border rounded-lg overflow-hidden bg-black/5 mb-3">
        <div 
          className="w-full" 
          style={{ aspectRatio: '16/9' }}
          dangerouslySetInnerHTML={{ 
            __html: sanitizeEmbedCode(video.embed_code)
          }} 
        />
      </div>
    )
  }
  
  // Replace process.env with import.meta.env for Vite
  const isDev = import.meta.env.DEV

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Platform and type info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {displayInfo.platform}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {displayInfo.displayText}
          </span>
          {hasEmbed && !isTrusted && (
            <div className="flex items-center space-x-1 text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs">Untrusted source</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Preview toggle for embed codes */}
          {hasEmbed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-6 px-2 text-xs"
            >
              {showPreview ? (
                <><EyeOff className="h-3 w-3 mr-1" />Hide</>
              ) : (
                <><Eye className="h-3 w-3 mr-1" />Preview</>
              )}
            </Button>
          )}
          
          {/* External link */}
          {displayInfo.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(displayInfo.url, '_blank')}
              className="h-6 px-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
          )}
          
          {/* Play button for URL-only videos */}
          {!hasEmbed && displayInfo.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(displayInfo.url, '_blank')}
              className="h-6 px-2 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Play
            </Button>
          )}
        </div>
      </div>
      
      {/* Embed preview */}
      {renderEmbedPreview()}
      
      {/* URL info */}
      {displayInfo.url && (
        <div className="text-xs text-muted-foreground break-all">
          <span className="font-medium">URL:</span> 
          <a 
            href={displayInfo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            {displayInfo.url}
          </a>
        </div>
      )}
      
      {/* Debug info for development */}
      {isDev && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Debug Info</summary>
          <div className="mt-2 space-y-1">
            <div>Type: {displayInfo.type}</div>
            <div>Platform: {displayInfo.platform}</div>
            <div>Has Embed: {hasEmbed ? 'Yes' : 'No'}</div>
            <div>Is Trusted: {isTrusted ? 'Yes' : 'No'}</div>
            <div>Can Preview: {displayInfo.canPreview ? 'Yes' : 'No'}</div>
          </div>
        </details>
      )}
    </div>
  )
}