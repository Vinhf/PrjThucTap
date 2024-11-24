import React, { useState, ReactNode } from 'react';
import Header from '../Components/Header/index';
import Sidebar from '../Components/Sidebar/sidebarInstructor';
import { Outlet } from 'react-router-dom';
interface InstructorLayoutProps {
  children?: ReactNode; // Thay đổi để `children` không phải là bắt buộc
}

const InstructorLayout: React.FC< InstructorLayoutProps > = ({ children }) => {
  
  const [sidebarOpenInstructor, setSidebarOpenInstructor] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpenInstructor={sidebarOpenInstructor} setSidebarOpenInstructor={setSidebarOpenInstructor} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpenInstructor} setSidebarOpen={setSidebarOpenInstructor} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default InstructorLayout;
