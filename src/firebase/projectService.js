// Firebase service for managing projects
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

const PROJECTS_COLLECTION = 'projects';

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} projectId - Unique identifier for the project
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadProjectImage = async (file, projectId) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `projects/${projectId}_${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Add a new project to Firestore
 * @param {Object} projectData - Project information
 * @returns {Promise<Object>} - Created project with ID
 */
export const addProject = async (projectData) => {
  try {
    const projectWithTimestamp = {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectWithTimestamp);
    
    return {
      id: docRef.id,
      ...projectData
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw new Error('Failed to add project');
  }
};

/**
 * Get all projects from Firestore
 * @returns {Promise<Array>} - Array of projects
 */
export const getAllProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by creation date (newest first)
    projects.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

/**
 * Update a project in Firestore
 * @param {string} projectId - ID of the project to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, updates) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

/**
 * Delete a project from Firestore
 * @param {string} projectId - ID of the project to delete
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteProjectImage = async (imageUrl) => {
  try {
    // Extract the storage path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error here as the image might already be deleted
  }
};

