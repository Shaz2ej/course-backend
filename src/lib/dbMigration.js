import { supabase } from './supabase'

/**
 * Check if the database has been updated to support embed codes
 */
export async function checkEmbedCodeSupport() {
  try {
    // Try to query with embed_code column
    const { error } = await supabase
      .from('course_videos')
      .select('embed_code')
      .limit(1)
    
    if (error) {
      if (error.code === '42703' || error.message.includes('embed_code') || error.message.includes('column "embed_code" does not exist')) {
        return {
          supported: false,
          needsUpdate: true,
          message: 'Database needs update for embed code support'
        }
      }
      throw error
    }
    
    return {
      supported: true,
      needsUpdate: false,
      message: 'Embed code support is available'
    }
  } catch (error) {
    console.error('Error checking embed code support:', error)
    return {
      supported: false,
      needsUpdate: true,
      message: 'Unable to check embed code support',
      error: error.message
    }
  }
}

/**
 * Get migration instructions for the user
 */
export function getMigrationInstructions() {
  return {
    title: 'Database Update Required',
    description: 'To use embed codes, please update your database schema:',
    steps: [
      '1. Open your Supabase project dashboard',
      '2. Go to SQL Editor',
      '3. Run this command: ALTER TABLE course_videos ADD COLUMN embed_code TEXT;',
      '4. Click "Run" to execute'
    ],
    alternativeMessage: 'Or continue using regular video URLs without updating.'
  }
}