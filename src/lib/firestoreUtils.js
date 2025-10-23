import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

// Utility function to convert Firestore timestamp to JavaScript Date
export const convertTimestamp = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Students CRUD operations
export const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const students = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const dataToSave = {
      ...studentData,
      created_at: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'students'), dataToSave);
    return { id: docRef.id, ...dataToSave, created_at: convertTimestamp(dataToSave.created_at) };
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (id, updates) => {
  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Packages CRUD operations
export const getPackages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'packages'));
    const packages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      packages.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

export const getPackageById = async (id) => {
  try {
    const docRef = doc(db, 'packages', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

export const createPackage = async (packageData) => {
  try {
    const dataToSave = {
      ...packageData,
      created_at: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'packages'), dataToSave);
    return { id: docRef.id, ...dataToSave, created_at: convertTimestamp(dataToSave.created_at) };
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const updatePackage = async (id, updates) => {
  try {
    const docRef = doc(db, 'packages', id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

export const deletePackage = async (id) => {
  try {
    await deleteDoc(doc(db, 'packages', id));
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

// Courses CRUD operations (as subcollection of packages)
export const getCoursesByPackageId = async (packageId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'packages', packageId, 'courses'));
    const courses = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourseInPackage = async (packageId, courseData) => {
  try {
    const dataToSave = {
      ...courseData,
      created_at: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'packages', packageId, 'courses'), dataToSave);
    return { id: docRef.id, ...dataToSave, created_at: convertTimestamp(dataToSave.created_at) };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourseInPackage = async (packageId, courseId, updates) => {
  try {
    const docRef = doc(db, 'packages', packageId, 'courses', courseId);
    await updateDoc(docRef, updates);
    return { id: courseId, ...updates };
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourseFromPackage = async (packageId, courseId) => {
  try {
    await deleteDoc(doc(db, 'packages', packageId, 'courses', courseId));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Videos CRUD operations (as subcollection of courses)
export const getVideosByCourseId = async (packageId, courseId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'packages', packageId, 'courses', courseId, 'videos'));
    const videos = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const createVideoInCourse = async (packageId, courseId, videoData) => {
  try {
    const dataToSave = {
      ...videoData,
      created_at: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'packages', packageId, 'courses', courseId, 'videos'), dataToSave);
    return { id: docRef.id, ...dataToSave, created_at: convertTimestamp(dataToSave.created_at) };
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const updateVideoInCourse = async (packageId, courseId, videoId, updates) => {
  try {
    const docRef = doc(db, 'packages', packageId, 'courses', courseId, 'videos', videoId);
    await updateDoc(docRef, updates);
    return { id: videoId, ...updates };
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideoFromCourse = async (packageId, courseId, videoId) => {
  try {
    await deleteDoc(doc(db, 'packages', packageId, 'courses', courseId, 'videos', videoId));
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Purchases CRUD operations
export const getPurchases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'purchases'));
    const purchases = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      purchases.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        purchase_date: convertTimestamp(data.purchase_date)
      });
    });
    return purchases;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

export const createPurchase = async (purchaseData) => {
  try {
    const dataToSave = {
      ...purchaseData,
      purchase_date: Timestamp.now(),
      created_at: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'purchases'), dataToSave);
    return { id: docRef.id, ...dataToSave, created_at: convertTimestamp(dataToSave.created_at) };
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

export const updatePurchase = async (id, updates) => {
  try {
    const docRef = doc(db, 'purchases', id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating purchase:', error);
    throw error;
  }
};