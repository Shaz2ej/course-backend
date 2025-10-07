import { supabase } from './supabase.js'

// Students
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getStudentById = async (id) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createStudent = async (student) => {
  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Purchases
export const getPurchases = async () => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      students(name, email),
      packages(title, price)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // If we have affiliate_id, fetch referrer information separately
  if (data && data.length > 0) {
    const enrichedData = await Promise.all(
      data.map(async (purchase) => {
        if (purchase.affiliate_id) {
          try {
            const { data: referrer } = await supabase
              .from('students')
              .select('name, email')
              .eq('id', purchase.affiliate_id)
              .single()
            
            return {
              ...purchase,
              referrer: referrer || null
            }
          } catch (error) {
            console.warn(`Could not fetch referrer for purchase ${purchase.id}:`, error)
            return {
              ...purchase,
              referrer: null
            }
          }
        }
        return purchase
      })
    )
    return enrichedData
  }
  
  return data
}

export const createPurchase = async (purchase) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updatePurchase = async (id, updates) => {
  const { data, error } = await supabase
    .from('purchases')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Withdrawals
export const getWithdrawals = async () => {
  const { data, error } = await supabase
    .from('withdrawals')
    .select(`
      *,
      students(name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateWithdrawalStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const createWithdrawal = async (withdrawal) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert([{ ...withdrawal, status: 'pending' }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Packages
export const getPackages = async () => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getPackageById = async (id) => {
  try {
    // First get the package
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (packageError) throw packageError
    
    // Get the linked courses with their video counts (many-to-many relationship)
    const { data: packageCourses, error: linkError } = await supabase
      .from('package_courses')
      .select(`
        Course_id,
        courses!inner(
          id,
          title,
          description,
          created_at
        )
      `)
      .eq('Package_id', id)
    
    if (linkError) throw linkError
    
    // Get video counts for each course
    const coursesWithVideos = []
    if (packageCourses && packageCourses.length > 0) {
      for (const pc of packageCourses) {
        const course = pc.courses
        
        // Get video count for this specific course
        const { count: videoCount } = await supabase
          .from('course_videos')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id)
        
        coursesWithVideos.push({
          ...course,
          video_count: videoCount || 0
        })
      }
    }
    
    // Structure the response to match the expected format
    return {
      ...packageData,
      package_courses: coursesWithVideos.map(course => ({
        courses: course
      }))
    }
    
  } catch (error) {
    console.error('Error in getPackageById:', error)
    throw error
  }
}

export const createPackage = async (packageData) => {
  const { data, error } = await supabase
    .from('packages')
    .insert([packageData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updatePackage = async (id, updates) => {
  const { data, error } = await supabase
    .from('packages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deletePackage = async (id) => {
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Courses
export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_videos(count)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getCourseById = async (id) => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_videos!inner(
        id,
        title,
        description,
        video_embed,
        video_url,
        created_at,
        course_id
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  
  // Ensure we only return videos that belong to this course
  if (data && data.course_videos) {
    data.course_videos = data.course_videos.filter(video => video.course_id === id)
  }
  
  return data
}

export const createCourse = async (course) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateCourse = async (id, updates) => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const checkCourseDependencies = async (courseId) => {
  try {
    const dependencies = {
      videos: 0,
      packages: 0,
      packageNames: []
    }

    // Check for course videos
    const { count: videoCount } = await supabase
      .from('course_videos')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
    
    dependencies.videos = videoCount || 0

    // Check for package linkages (try both column name formats)
    let packageData = []
    
    // Try capitalized version first
    const { data: packagesCapitalized, error: error1 } = await supabase
      .from('package_courses')
      .select(`
        packages(id, title)
      `)
      .eq('Course_id', courseId)
    
    if (!error1 && packagesCapitalized) {
      packageData = packagesCapitalized
    } else {
      // Try lowercase version
      const { data: packagesLowercase, error: error2 } = await supabase
        .from('package_courses')
        .select(`
          packages(id, title)
        `)
        .eq('course_id', courseId)
      
      if (!error2 && packagesLowercase) {
        packageData = packagesLowercase
      }
    }

    dependencies.packages = packageData.length
    dependencies.packageNames = packageData
      .filter(p => p.packages)
      .map(p => p.packages.title)

    return dependencies
  } catch (error) {
    console.error('Error checking course dependencies:', error)
    return {
      videos: 0,
      packages: 0,
      packageNames: []
    }
  }
}

export const deleteCourse = async (id) => {
  try {
    console.log('🗑️ Starting course deletion process for ID:', id)
    
    // First, check if course exists
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('❌ Course fetch error:', fetchError)
      if (fetchError.code === 'PGRST116') {
        throw new Error('Course not found')
      }
      throw new Error(`Failed to verify course existence: ${fetchError.message}`)
    }

    console.log('✅ Course found:', existingCourse.title)

    // Try to delete the course videos first (if cascade doesn't work)
    console.log('🎥 Deleting course videos...')
    const { error: videoDeleteError } = await supabase
      .from('course_videos')
      .delete()
      .eq('course_id', id)
    
    if (videoDeleteError) {
      console.warn('⚠️ Error deleting course videos:', videoDeleteError)
      // Continue with course deletion as videos might have been deleted by cascade
    } else {
      console.log('✅ Course videos deleted successfully')
    }

    // Remove course from any packages it's linked to
    console.log('📦 Removing course from packages...')
    // Check both possible column name formats
    const { error: packageLinkDeleteError1 } = await supabase
      .from('package_courses')
      .delete()
      .eq('Course_id', id) // Try capitalized version first
    
    if (packageLinkDeleteError1) {
      console.log('⚠️ Capitalized column deletion failed, trying lowercase...', packageLinkDeleteError1)
      // If capitalized version fails, try lowercase
      const { error: packageLinkDeleteError2 } = await supabase
        .from('package_courses')
        .delete()
        .eq('course_id', id)
      
      if (packageLinkDeleteError2) {
        console.warn('⚠️ Error removing course from packages (both formats):', packageLinkDeleteError2)
        // Continue with course deletion as the links might have been deleted by cascade
      } else {
        console.log('✅ Package links deleted with lowercase columns')
      }
    } else {
      console.log('✅ Package links deleted with capitalized columns')
    }

    // Now delete the course
    console.log('🎯 Deleting the course record...')
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('❌ Course deletion error details:', deleteError)
      
      if (deleteError.code === '23503') {
        throw new Error('Cannot delete course: It is still referenced by other records. Please remove all dependencies first.')
      } else if (deleteError.code === 'PGRST116') {
        throw new Error('Course not found')
      } else {
        throw new Error(`Failed to delete course: ${deleteError.message}`)
      }
    }

    console.log(`🎉 Course "${existingCourse.title}" deleted successfully`)
  } catch (error) {
    console.error('💥 Error in deleteCourse:', error)
    throw error
  }
}

// Course Videos
export const getCourseVideos = async (courseId) => {
  // Ensure we only get videos for the specific course
  const { data, error } = await supabase
    .from('course_videos')
    .select('*')
    .eq('course_id', courseId) // This ensures videos are scoped to the course
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Check if video_embed column exists
let videoEmbedSupported = null;

const checkVideoEmbedColumn = async () => {
  if (videoEmbedSupported !== null) return videoEmbedSupported;
  
  try {
    const { data, error } = await supabase
      .from('course_videos')
      .select('video_embed')
      .limit(1);
    
    videoEmbedSupported = !error;
    return videoEmbedSupported;
  } catch (error) {
    videoEmbedSupported = false;
    return false;
  }
};

export const createCourseVideo = async (video) => {
  try {
    // Validate that course_id is provided
    if (!video.course_id) {
      throw new Error('Course ID is required to create a video');
    }
    
    // Verify the course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', video.course_id)
      .single();
    
    if (courseError || !course) {
      throw new Error('Invalid course ID. Course does not exist.');
    }
    
    // Check if video_embed column exists
    const hasVideoEmbed = await checkVideoEmbedColumn();
    
    let videoData;
    if (hasVideoEmbed) {
      // Use full data including video_embed
      videoData = {
        ...video,
        course_id: video.course_id // Ensure course_id is always included
      };
    } else {
      // Remove video_embed and ensure video_url exists
      const { video_embed, ...baseVideo } = video;
      videoData = {
        ...baseVideo,
        course_id: video.course_id, // Ensure course_id is always included
        video_url: baseVideo.video_url || video_embed || ''
      };
    }
    
    const { data, error } = await supabase
      .from('course_videos')
      .insert([videoData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating course video:', error);
    throw error;
  }
};

export const updateCourseVideo = async (id, updates) => {
  try {
    // Check if video_embed column exists
    const hasVideoEmbed = await checkVideoEmbedColumn();
    
    let updateData;
    if (hasVideoEmbed) {
      // Use full data including video_embed
      updateData = updates;
    } else {
      // Remove video_embed and ensure video_url exists
      const { video_embed, ...baseUpdates } = updates;
      updateData = {
        ...baseUpdates,
        video_url: baseUpdates.video_url || video_embed || ''
      };
    }
    
    const { data, error } = await supabase
      .from('course_videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating course video:', error);
    throw error;
  }
};

export const deleteCourseVideo = async (id) => {
  const { error } = await supabase
    .from('course_videos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Package Courses (linking)
export const linkPackageToCourse = async (packageId, courseId) => {
  const { data, error } = await supabase
    .from('package_courses')
    .insert([{ Package_id: packageId, Course_id: courseId }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const unlinkPackageFromCourse = async (packageId, courseId) => {
  const { error } = await supabase
    .from('package_courses')
    .delete()
    .eq('Package_id', packageId)
    .eq('Course_id', courseId)
  
  if (error) throw error
}

// Affiliates
export const getAffiliates = async () => {
  const { data, error } = await supabase
    .from('affiliates')
    .select(`
      *,
      students(name, email)
    `)
    .order('total_commission', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateAffiliate = async (id, updates) => {
  const { data, error } = await supabase
    .from('affiliates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    // Get total students
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })

    // Get total purchases and revenue
    const { data: purchases } = await supabase
      .from('purchases')
      .select('amount')

    const totalPurchases = purchases?.length || 0
    const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Get withdrawal stats
    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('amount, status')

    const totalWithdrawals = withdrawals?.length || 0
    const pendingWithdrawals = withdrawals?.filter(w => w.status === 'pending').length || 0

    return {
      totalStudents: totalStudents || 0,
      totalRevenue,
      totalPurchases,
      totalWithdrawals,
      pendingWithdrawals
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalStudents: 0,
      totalRevenue: 0,
      totalPurchases: 0,
      totalWithdrawals: 0,
      pendingWithdrawals: 0
    }
  }
}

// File upload to Supabase Storage
export const uploadFile = async (file, bucket = 'thumbnails') => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB')
    }

    // Check file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed')
    }

    // Generate safe filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .toLowerCase()
    
    // Create unique filename with timestamp and random string
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}_${randomString}_${sanitizedFileName}`

    console.log('Uploading file:', {
      originalName: file.name,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type,
      bucket: bucket
    })

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      
      // Provide specific error messages
      if (uploadError.message?.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please contact support.')
      } else if (uploadError.message?.includes('The resource already exists')) {
        // If file exists, try with different name
        const newFileName = `${timestamp}_${Math.random().toString(36).substring(2, 12)}_${sanitizedFileName}`
        const { data: retryData, error: retryError } = await supabase.storage
          .from(bucket)
          .upload(newFileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (retryError) {
          console.error('Retry upload error:', retryError)
          throw new Error(`Upload failed: ${retryError.message}`)
        }
        
        // Get public URL for retry upload
        const { data: retryUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(newFileName)
        
        console.log('File uploaded successfully (retry):', retryUrlData.publicUrl)
        return retryUrlData.publicUrl
      } else {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate public URL')
    }

    console.log('File uploaded successfully:', urlData.publicUrl)
    return urlData.publicUrl

  } catch (error) {
    console.error('File upload error:', error)
    throw error // Re-throw the error with original message
  }
}

// Analytics Functions
export const getAnalyticsData = async () => {
  try {
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Revenue Growth (current month vs last month)
    const { data: currentMonthPurchases } = await supabase
      .from('purchases')
      .select('amount')
      .gte('created_at', currentMonth.toISOString())

    const { data: lastMonthPurchases } = await supabase
      .from('purchases')
      .select('amount')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())

    const currentRevenue = currentMonthPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const lastRevenue = lastMonthPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    // Student Growth (current month vs last month)
    const { count: currentMonthStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString())

    const { count: lastMonthStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())

    const studentGrowth = lastMonthStudents > 0 ? ((currentMonthStudents - lastMonthStudents) / lastMonthStudents) * 100 : 0

    // Average Order Value
    const { data: allPurchases } = await supabase
      .from('purchases')
      .select('amount')

    const totalRevenue = allPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const totalOrders = allPurchases?.length || 0
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      revenueGrowth,
      studentGrowth,
      avgOrderValue,
      currentRevenue,
      lastRevenue,
      currentMonthStudents: currentMonthStudents || 0,
      lastMonthStudents: lastMonthStudents || 0
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return {
      revenueGrowth: 0,
      studentGrowth: 0,
      avgOrderValue: 0,
      currentRevenue: 0,
      lastRevenue: 0,
      currentMonthStudents: 0,
      lastMonthStudents: 0
    }
  }
}

export const getMonthlyRevenueTrends = async () => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: purchases } = await supabase
      .from('purchases')
      .select('amount, created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by month
    const monthlyData = {}
    purchases?.forEach(purchase => {
      const date = new Date(purchase.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey] += purchase.amount || 0
    })

    // Convert to array format for charts
    const result = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      result.push({
        month: monthName,
        revenue: monthlyData[monthKey] || 0
      })
    }

    return result
  } catch (error) {
    console.error('Error fetching revenue trends:', error)
    return []
  }
}

export const getMonthlyStudentAcquisition = async () => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: students } = await supabase
      .from('students')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by month
    const monthlyData = {}
    students?.forEach(student => {
      const date = new Date(student.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey] += 1
    })

    // Convert to array format for charts
    const result = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      result.push({
        month: monthName,
        students: monthlyData[monthKey] || 0
      })
    }

    return result
  } catch (error) {
    console.error('Error fetching student acquisition:', error)
    return []
  }
}

export const getTopPerformingPackages = async () => {
  try {
    // Get purchases with package information
    const { data: purchases } = await supabase
      .from('purchases')
      .select(`
        amount,
        packages(id, title)
      `)
      .not('packages', 'is', null)

    // Group by package and calculate total revenue
    const packageRevenue = {}
    purchases?.forEach(purchase => {
      if (purchase.packages) {
        const packageId = purchase.packages.id
        const packageTitle = purchase.packages.title
        
        if (!packageRevenue[packageId]) {
          packageRevenue[packageId] = {
            title: packageTitle,
            totalRevenue: 0
          }
        }
        packageRevenue[packageId].totalRevenue += purchase.amount || 0
      }
    })

    // Convert to array and sort by revenue
    const sortedPackages = Object.values(packageRevenue)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3) // Top 3

    return sortedPackages
  } catch (error) {
    console.error('Error fetching top performing packages:', error)
    return []
  }
}

// RELATIONSHIP VALIDATION FUNCTIONS

/**
 * Get all courses that belong to a specific package
 */
export const getCoursesByPackageId = async (packageId) => {
  try {
    const { data, error } = await supabase
      .from('package_courses')
      .select(`
        courses!inner(
          id,
          title,
          description,
          created_at
        )
      `)
      .eq('Package_id', packageId)
    
    if (error) throw error
    return data?.map(pc => pc.courses) || []
  } catch (error) {
    console.error('Error fetching courses by package ID:', error)
    return []
  }
}

/**
 * Get all packages that contain a specific course
 */
export const getPackagesByCourseId = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('package_courses')
      .select(`
        packages!inner(
          id,
          title,
          description,
          price,
          thumbnail_url,
          created_at
        )
      `)
      .eq('Course_id', courseId)
    
    if (error) throw error
    return data?.map(pc => pc.packages) || []
  } catch (error) {
    console.error('Error fetching packages by course ID:', error)
    return []
  }
}

/**
 * Get videos with proper course validation
 */
export const getVideosByCourseId = async (courseId) => {
  try {
    // First verify the course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single()
    
    if (courseError || !course) {
      throw new Error('Course not found')
    }
    
    // Then get videos for this course only
    const { data: videos, error: videosError } = await supabase
      .from('course_videos')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
    
    if (videosError) throw videosError
    return videos || []
  } catch (error) {
    console.error('Error fetching videos by course ID:', error)
    throw error
  }
}

/**
 * Validate and create course video with proper relationships
 */
export const createVideoForCourse = async (courseId, videoData) => {
  try {
    // Validate course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single()
    
    if (courseError || !course) {
      throw new Error('Invalid course ID. Course does not exist.')
    }
    
    // Create video with validated course_id
    const videoToCreate = {
      ...videoData,
      course_id: courseId // Ensure course_id is always set correctly
    }
    
    return await createCourseVideo(videoToCreate)
  } catch (error) {
    console.error('Error creating video for course:', error)
    throw error
  }
}

/**
 * Audit function to check for orphaned videos
 */
export const auditVideoRelationships = async () => {
  try {
    // Find videos without valid course_id
    const { data: orphanedVideos, error } = await supabase
      .from('course_videos')
      .select(`
        id,
        title,
        course_id,
        courses(id, title)
      `)
    
    if (error) throw error
    
    const results = {
      totalVideos: orphanedVideos?.length || 0,
      validVideos: orphanedVideos?.filter(v => v.courses).length || 0,
      orphanedVideos: orphanedVideos?.filter(v => !v.courses) || []
    }
    
    return results
  } catch (error) {
    console.error('Error auditing video relationships:', error)
    return {
      totalVideos: 0,
      validVideos: 0,
      orphanedVideos: [],
      error: error.message
    }
  }
}

/**
 * Get referral code data for package-based referrals
 * Joins students, purchases, and packages tables to show referral information
 */
export const getPackageReferralCodes = async () => {
  try {
    // Get purchases with student and package information
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        created_at,
        students(id, name, email, referral_code),
        packages(id, title)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data to match required format
    const referralData = data?.map(purchase => ({
      id: purchase.id,
      student_name: purchase.students?.name || 'Unknown Student',
      student_email: purchase.students?.email || 'Unknown Email',
      package_name: purchase.packages?.title || 'Unknown Package',
      referral_code: purchase.students?.referral_code || 'No Referral Code',
      created_at: purchase.created_at
    })) || []
    
    return referralData
  } catch (error) {
    console.error('Error fetching package referral codes:', error)
    throw error
  }
}
