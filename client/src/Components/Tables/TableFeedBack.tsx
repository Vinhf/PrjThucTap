// import React, { useEffect, useState } from "react";
// import { getListFeedBack } from "../../services/FeedBackservice.tsx";

// const TableFeedBack = () => {
//   const [feedback, setFeedback] = useState([]);

//   useEffect(() => {
//     getListFeedBack()
//       .then((response) => {
//         setFeedback(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <div className="max-w-screen-lg mx-auto p-4 bg-gray-900 text-white">
//       <h2 className="text-center text-3xl font-bold my-6">List of FeedBack</h2>
//       <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead className="bg-gray-800">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 FeedBack Id
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Createdate
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Message
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Subject
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 User Id
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-gray-900 divide-y divide-gray-700">
//             {feedback.map((feedback) => (
//               <tr key={feedback.feedbackId}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {feedback.feedbackId}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {feedback.createDate}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {feedback.message}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {feedback.subject}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {feedback.user.user_id}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TableFeedBack;
