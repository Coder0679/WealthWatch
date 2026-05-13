import axios from 'axios';
import { authService } from './authService';

const API_URL = '/api/assets';
const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${authService.getToken()}` } });

export interface Asset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  purchaseValue: number;
  purchaseDate: string;
  notes?: string;
}

export const assetService = {
  getAssets: async (): Promise<Asset[]> => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },
  addAsset: async (data: any): Promise<Asset> => {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },
  deleteAsset: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};
