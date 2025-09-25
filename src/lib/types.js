/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} referral_code
 * @property {string} created_at
 */

/**
 * @typedef {Object} Purchase
 * @property {string} id
 * @property {string} student_id
 * @property {string} package_id
 * @property {number} amount
 * @property {string} status
 * @property {number} commission_earned
 */

/**
 * @typedef {'pending'|'approved'|'rejected'} WithdrawalStatus
 */

/**
 * @typedef {Object} Withdrawal
 * @property {string} id
 * @property {string} student_id
 * @property {number} amount
 * @property {WithdrawalStatus} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} Affiliate
 * @property {string} id
 * @property {string} student_id
 * @property {string} referral_code
 * @property {number} total_leads
 * @property {number} total_commission
 */

/**
 * @typedef {Object} Package
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string|null} thumbnail_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} created_at
 */

/**
 * @typedef {Object} PackageCourse
 * @property {string} package_id
 * @property {string} course_id
 */

/**
 * @typedef {Object} CourseVideo
 * @property {string} id
 * @property {string} course_id
 * @property {string} title
 * @property {string} description
 * @property {string} video_url
 * @property {string|null} embed_code
 * @property {string} created_at
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalStudents
 * @property {number} totalRevenue
 * @property {number} totalPurchases
 * @property {number} totalWithdrawals
 * @property {number} pendingWithdrawals
 */

export {}

