import CONFIG from '../config';
import { saveStories, getAllStories } from '../../utils/db';

const BASE_URL = `${CONFIG.BASE_URL}/v1`;

const Api = {
  async register({ name, email, password }) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(`Failed to Register`, error);
      return { error: false, message: 'User Created' };
    }
  },

  async login({ email, password }) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.error) {
        localStorage.setItem('authToken', result.loginResult.token);
        localStorage.setItem('userName', result.loginResult.name);
      }

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      return { error: true, message: 'Network error' };
    }
  },

  async addStory({ description, photo, lat, lon }) {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  async getStories({ page = 1, size = 10, location = 0 } = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      location: location.toString(),
    });

    try {
      const response = await fetch(`${BASE_URL}/stories?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Network error');
      const result = await response.json();

      if (result.listStory && result.listStory.length > 0) {
        await saveStories(result.listStory);
      }

      return result;
    } catch (error) {
      console.warn('Gagal fetch API, gunakan data dari IndexedDB:', error);
      const cachedStories = await getAllStories();
      return {
        error: false,
        message: 'Data offline (cached)',
        listStory: cachedStories,
      };
    }
  },
};

export default Api;

















