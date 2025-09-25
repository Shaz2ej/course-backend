/**
 * Video utilities for handling URLs and embed codes
 */

/**
 * Detects if the input is an embed code (iframe) or a URL
 * @param {string} input - The input string to analyze
 * @returns {string} - 'embed' if it's an embed code, 'url' if it's a URL, 'unknown' if neither
 */
export function detectVideoInputType(input) {
  if (!input || typeof input !== 'string') {
    return 'unknown'
  }

  const trimmedInput = input.trim()
  
  // Check if it's an iframe embed code
  if (trimmedInput.includes('<iframe') && trimmedInput.includes('</iframe>')) {
    return 'embed'
  }
  
  // Check if it starts with common embed code patterns
  if (trimmedInput.startsWith('<iframe') || 
      trimmedInput.includes('src="') && (trimmedInput.includes('youtube') || trimmedInput.includes('vimeo') || trimmedInput.includes('odysee'))) {
    return 'embed'
  }
  
  // Check if it's a URL
  try {
    new URL(trimmedInput)
    return 'url'
  } catch {
    // Could be a relative URL or just a domain
    if (trimmedInput.includes('.') && !trimmedInput.includes('<')) {
      return 'url'
    }
  }
  
  return 'unknown'
}

/**
 * Extracts video URL from embed code if possible
 * @param {string} embedCode - The HTML embed code
 * @returns {string|null} - Extracted URL or null if not found
 */
export function extractUrlFromEmbed(embedCode) {
  if (!embedCode) return null
  
  // Use regex to find src attribute in iframe
  const srcMatch = embedCode.match(/src=["']([^"']+)["']/i)
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1]
  }
  
  return null
}

/**
 * Sanitizes embed code for safe rendering
 * @param {string} embedCode - Raw embed code
 * @returns {string} - Sanitized embed code
 */
export function sanitizeEmbedCode(embedCode) {
  if (!embedCode) return ''
  
  // Remove potentially dangerous attributes and ensure proper iframe structure
  let sanitized = embedCode
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/script/gi, '')
    
  // Ensure iframe has sandbox attribute for security
  if (sanitized.includes('<iframe') && !sanitized.includes('sandbox=')) {
    sanitized = sanitized.replace('<iframe', '<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms"')
  }
  
  return sanitized
}

/**
 * Validates if the embed code is from a trusted source
 * @param {string} embedCode - The embed code to validate
 * @returns {boolean} - True if from trusted source
 */
export function isTrustedEmbedSource(embedCode) {
  if (!embedCode) return false
  
  const trustedDomains = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'odysee.com',
    'player.vimeo.com',
    'www.youtube.com',
    'www.youtube-nocookie.com'
  ]
  
  const url = extractUrlFromEmbed(embedCode)
  if (!url) return false
  
  try {
    const urlObj = new URL(url)
    return trustedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

/**
 * Gets video platform from URL or embed code
 * @param {string} input - URL or embed code
 * @returns {string} - Platform name (youtube, vimeo, odysee, other)
 */
export function getVideoPlatform(input) {
  if (!input) return 'other'
  
  const inputLower = input.toLowerCase()
  
  if (inputLower.includes('youtube') || inputLower.includes('youtu.be')) {
    return 'youtube'
  }
  
  if (inputLower.includes('vimeo')) {
    return 'vimeo'
  }
  
  if (inputLower.includes('odysee')) {
    return 'odysee'
  }
  
  return 'other'
}

/**
 * Formats display text for video source
 * @param {string} videoUrl - Video URL
 * @param {string} embedCode - Embed code
 * @returns {object} - Display information
 */
export function getVideoDisplayInfo(videoUrl, embedCode) {
  const hasEmbed = embedCode && embedCode.trim()
  const hasUrl = videoUrl && videoUrl.trim()
  
  if (hasEmbed) {
    const platform = getVideoPlatform(embedCode)
    const url = extractUrlFromEmbed(embedCode)
    
    return {
      type: 'embed',
      platform: platform,
      displayText: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Embed`,
      url: url || videoUrl,
      canPreview: true
    }
  }
  
  if (hasUrl) {
    const platform = getVideoPlatform(videoUrl)
    
    return {
      type: 'url',
      platform: platform,
      displayText: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
      url: videoUrl,
      canPreview: false
    }
  }
  
  return {
    type: 'none',
    platform: 'unknown',
    displayText: 'No video source',
    url: null,
    canPreview: false
  }
}