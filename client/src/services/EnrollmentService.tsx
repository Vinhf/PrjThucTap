import axios from 'axios';

const localhost = import.meta.env.VITE_SERVERHOST
const API_URL = localhost+'/api/v1/enrollment';

class EnrollmentService {
  getAllEnrollments() {
    return axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure you have the token stored in localStorage
      }
    });
  }

  updateEnrollmentStatus(enrollmentId: number, userId: number, status: string) {
    return axios.put(`${API_URL}/status/${enrollmentId}?user_id=${userId}&status=${status}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure you have the token stored in localStorage
      }
    });
  }

  // Other methods (createEnrollment, deleteEnrollment, etc.)
}

export default new EnrollmentService();
