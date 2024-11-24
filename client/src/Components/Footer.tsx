import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="container mx-auto text-center">
            <p className="text-sm">&copy; 2024 CuCaiiiiiii. All rights reserved.</p>
            <nav className="mt-2">
              <ul className="flex justify-center">
                <li>
                  <a href="#" className="mx-2 text-sm hover:text-gray-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="mx-2 text-sm hover:text-gray-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="mx-2 text-sm hover:text-gray-400">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="mx-2 text-sm hover:text-gray-400">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="mx-2 text-sm hover:text-gray-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
