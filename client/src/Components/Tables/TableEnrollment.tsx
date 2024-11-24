import React, { useEffect, useState } from 'react';
import EnrollmentService from '../../services/EnrollmentService';

const TableEnrollment: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchEnrollments();
    } else {
      console.error('User is not authenticated');
      // Handle unauthenticated state, e.g., redirect to login
    }
  }, []);

  const fetchEnrollments = () => {
      EnrollmentService.getAllEnrollments()
        .then((response) => {
          const formattedEnrollments = response.data.map((enrollment: any) => ({
            ...enrollment,
            enrollDate: new Date(enrollment.enrollDate).toLocaleString(),
            status: enrollment.status || 'Waiting for results', // Set default status
            isEditing: false,
          }));
          setEnrollments(formattedEnrollments);
        })
        .catch((error) => {
          console.error('Error fetching enrollments:', error);
        });
  };

  const handleStatusEditToggle = (enrollmentId: number) => {
    const updatedEnrollments = enrollments.map((enrollment) => {
      if (enrollment.enrollmentId === enrollmentId) {
        return { ...enrollment, isEditing: !enrollment.isEditing };
      }
      return enrollment;
    });
    setEnrollments(updatedEnrollments);
  };

  const handleStatusChange = (
    enrollmentId: number,
    userId: number,
    newStatus: string,
  ) => {
    EnrollmentService.updateEnrollmentStatus(enrollmentId, userId, newStatus)
      .then(() => {
        setEnrollments((prevEnrollments) =>
          prevEnrollments.map((enrollment) => {
            if (enrollment.enrollmentId === enrollmentId) {
              return { ...enrollment, status: newStatus, isEditing: false };
            }
            return enrollment;
          }),
        );
      })
      .catch((error) => {
        console.error('Error updating enrollment status:', error);
      });
  };

  return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  User ID
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Course ID
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Enroll Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.enrollmentId}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {enrollment.user_id}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {enrollment.course}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {enrollment.enrollDate}
                    </p>
                  </td>
                  <td className="py-2 px-4">
                    {enrollment.isEditing ? (
                      <select
                        value={enrollment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            enrollment.enrollmentId,
                            enrollment.user_id,
                            e.target.value,
                          )
                        }
                        onBlur={() =>
                          handleStatusEditToggle(enrollment.enrollmentId)
                        }
                        className="bg-gray-600 text-black px-2 py-1 rounded"
                      >
                        <option value="Accept">Accept</option>
                        <option value="Reject">Reject</option>
                        <option value="Waiting for results">
                          Waiting for results
                        </option>
                      </select>
                    ) : (
                      <span>{enrollment.status}</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <td className="py-2 px-4">
                      <button
                        onClick={() =>
                          handleStatusEditToggle(enrollment.enrollmentId)
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                      >
                        {enrollment.isEditing ? 'Save' : 'Edit'}
                      </button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default TableEnrollment;
