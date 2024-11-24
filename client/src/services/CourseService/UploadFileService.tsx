import axios from 'axios';

const localhost = import.meta.env.VITE_SERVERHOST
const API_URL = localhost+'/';


export const addContent = async (file?: File) => {
  const formData = new FormData();
  if (file) {
    formData.append('image', file);
  }

  try {
    const response = await axios.post(
      `${API_URL}api/v1/auth/upload/file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log("test: " + response.data.url );
    console.log("test: " + response.data.public_id );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error adding content:', error);
    throw error;
  }
};
