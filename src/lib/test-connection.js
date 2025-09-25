import { supabase } from './supabase.js'

export const testConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    console.log('Students table accessible, count:', data)
    return true
  } catch (err) {
    console.error('❌ Connection test error:', err)
    return false
  }
}

// Test all table access
export const testAllTables = async () => {
  const tables = [
    'students',
    'purchases', 
    'withdrawals',
    'affiliates',
    'packages',
    'courses',
    'package_courses',
    'course_videos'
  ]
  
  const results = {}
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      results[table] = error ? `❌ ${error.message}` : '✅ Accessible'
    } catch (err) {
      results[table] = `❌ ${err.message}`
    }
  }
  
  console.log('Table access test results:', results)
  return results
}

