import axios from 'axios';

// Configure Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize data - No longer needed as backend handles it, but kept for compatibility
export const initializeData = async () => {
  console.log('App connected to API backend');
};

// Generic get data
export const getData = async (key: string) => {
  try {
    const response = await api.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
};

// Generic set data (Used for updating settings mostly)
export const setData = async (key: string, value: any) => {
  try {
    // For settings, we might post to /settings or /settings/:key
    // This depends on how the API is structured.
    // Our Settings API expects PUT /settings/:key
    if (key === 'settings' || key === 'seoSettings' || key === 'cmsPages' || key === 'menus') {
        // In the old app, these were big objects. 
        // In API, we expose them as endpoints.
        // If the frontend tries to save the whole object, we should handle it.
        // For now, let's assume specific endpoints.
        await api.put(`/settings/${key}`, value);
    } else {
        console.warn(`setData not fully implemented for generic key: ${key}`);
    }
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
};

// Update specific item
export const updateItem = async (key: string, id: string, updates: any) => {
  try {
    const response = await api.put(`/${key}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating item in ${key}:`, error);
    return null;
  }
};

// Add item
export const addItem = async (key: string, item: any) => {
  try {
    const response = await api.post(`/${key}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error adding item to ${key}:`, error);
    return null;
  }
};

// Delete item
export const deleteItem = async (key: string, id: string) => {
  try {
    await api.delete(`/${key}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting item from ${key}:`, error);
    return false;
  }
};

// Convert image to base64 (remains the same client-side utility)
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};