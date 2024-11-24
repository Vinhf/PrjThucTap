import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './Components/PageTitle';
import SignIn from './Pages/Authentication/SignIn';
import SignUp from './Pages/Authentication/SignUp';
import Calendar from './Pages/Calendar';
import ECommerce from './Pages/Dashboard/ECommerce';
import FormElements from './Pages/Form/FormElements';
import FormLayout from './Pages/Form/FormLayout';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import Buttons from './Pages/UiElements/Buttons';
import Home from './Pages/Home';
import ProtectedRoute from './hooks/Auth/ProtectedRoute';
import ErrorBoundary from './Components/specific/Login/ErrorBoundary';
import PublicRoute from './hooks/Auth/PublicRoute';
import { AuthProvider } from './hooks/Auth/AuthProvider';
import { useAuth } from './utils/auth';
import OTPInput from './Pages/sendMail/OTPInput';
import CategoryComponent from './Components/Tables/TableFive';
import ForgotPassword from './Pages/sendMail/ForgotPassword';
import OTPInputForgotPassword from './Pages/sendMail/OTPInputForgotPassword';
import TablesCatgories from './Pages/TablesCatgories';
import TablesEnroll from './Pages/TablesEnroll';
import PaymentForm from './Pages/Payment/payment';
import Wallet from './Pages/Wallet/wallet';
import SuccessPayment from './Pages/Payment/SuccessPayment';
import DetailPage from './Pages/detailPage';
import TableThree from './Components/Tables/TableThree';
import TablesUser from './Pages/TablesUser';
import useTokenChecker from './hooks/Auth/useTokenChecker';
import CreateCoureFor from './Pages/IntructorPage/CreateCoureFor';
import UserLayout from './layout/UserLayout';
import DetailPaymentCourse from './Pages/Payment/BuyCourse/detailPaymentCourse';
import Bill from './Pages/Payment/BuyCourse/Bill';
import Wishlist from './Pages/Wishlist/Wishlist';
import DetailCourseEnroll from './Pages/detailCourseEnroll';
import TableCourse from './Components/Tables/TableCourse';
import Test from './Components/IntructorPage/test';
import TableReact from './Components/Tables/TablesCompoment';
import ErrorPage from './Pages/Error';
import InstructorLayout from './layout/InstructorLayout';
import AdminLayout from './layout/AdminLayout';
import Search from './Components/Search';
import CartShopping from './Pages/CartShopping/cart';
import BillInformation from './Pages/Payment/BuyCourse/BillInformation';
import HelpCenter from './Pages/Help Center/Help';
import TransferMoneyForm from './Pages/Payment/TransferMoneyForm';
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  useTokenChecker();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const authInfo = useAuth();

  return (
    <ErrorBoundary>
      <AuthProvider>
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            {/* Public Routes */}
            {!authInfo ? (
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="/detailpage/:id" element={<DetailPage />} />
                <Route
                    path="/detailCourseEnroll/:id"
                    element={<DetailCourseEnroll />}
                  />
                <Route path="/auth/" element={<PublicRoute />}>
                  <Route
                    index
                    element={
                      <>
                        <PageTitle title="Signin" />
                        <SignIn />
                      </>
                    }
                  />
                  <Route
                    path="forgotpassword"
                    element={
                      <>
                        <PageTitle title="Forgot Password " />
                        <ForgotPassword />
                      </>
                    }
                  />

                  <Route
                    path="signup/sendmail"
                    element={
                      <>
                        <PageTitle title="Signup " />
                        <OTPInput />
                      </>
                    }
                  />
                  <Route
                    path="forgotpassword/sendotp"
                    element={
                      <>
                        <PageTitle title="Forgot Password OTP " />
                        <OTPInputForgotPassword />
                      </>
                    }
                  />
                  <Route
                    path="signup"
                    element={
                      <>
                        <PageTitle title="Signup" />
                        <SignUp />
                      </>
                    }
                  />
                </Route>
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute />}>
              {/* Admin Routes */}
              {authInfo?.role.includes('ROLE_ADMIN') ? (
                <Route path="/" element={<AdminLayout />}>
                  <Route path="/detailpage/:id" element={<DetailPage />} />
                  <Route path="/transfer" element={<TransferMoneyForm />} />
                  <Route
                    path="/detailCourseEnroll/:id"
                    element={<DetailCourseEnroll />}
                  />
                  <Route
                    index
                    element={
                      <>
                        <PageTitle title="eCommerce Dashboard " />
                        <ECommerce />
                      </>
                    }
                  />
                  <Route
                    path="home"
                    element={
                      <>
                        <PageTitle title="home" />
                        <Home />
                      </>
                    }
                  />
                  <Route
                    path="wallet"
                    element={
                      <>
                        <PageTitle title="WALLET " />
                        <Wallet />
                      </>
                    }
                  />
                  <Route
                    path="paymentselection"
                    element={
                      <>
                        <PageTitle title="PAYMENT " />
                        <PaymentForm />
                      </>
                    }
                  />
                  <Route
                    path="payment/success/:amount"
                    element={
                      <>
                        <PageTitle title="PAYMENT " />
                        <SuccessPayment />
                      </>
                    }
                  />
                  <Route
                    path="calendar"
                    element={
                      <>
                        <PageTitle title="Calendar " />
                        <Calendar />
                      </>
                    }
                  />

                  <Route
                    path="forms/form-elements"
                    element={
                      <>
                        <PageTitle title="Form Elements" />
                        <FormElements />
                      </>
                    }
                  />
                  <Route
                    path="forms/form-layout"
                    element={
                      <>
                        <PageTitle title="Form Layout " />
                        <FormLayout />
                      </>
                    }
                  />
                  <Route
                    path="tables/tablesCatgories"
                    element={
                      <>
                        <PageTitle title="Tables Categories" />
                        <TablesCatgories />
                      </>
                    }
                  />

                  <Route path="/CreateCoureFor" element={<CreateCoureFor />} />
                  <Route
                    path="tables/user"
                    element={
                      <>
                        <PageTitle title="Users" />
                        <TablesUser />
                      </>
                    }
                  />
                  <Route path="/TableCourse" element={<TableReact />} />
                  <Route
                    path="/TableCourse"
                    element={
                      <>
                        <PageTitle title="Table Couse" />
                        <TableReact />
                      </>
                    }
                  />
                  <Route
                    path="/addUser"
                    element={
                      <>
                        <PageTitle title="Add User " />
                        <TableThree />
                      </>
                    }
                  />

                  <Route path="/edit-user/:userId" element={<TableThree />} />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}

              {/* Student Routes */}

              {authInfo?.role.includes('ROLE_STUDENT') ? (
                <Route path="/" element={<UserLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/search/:keyword" element={<Search />} />
                  <Route path="/detailpage/:id" element={<DetailPage />} />
                  <Route path="/button" element={<Buttons />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cartshopping" element={<CartShopping />} />
                  <Route path="/transfer" element={<TransferMoneyForm />} />

                  <Route
                    path="/cartshopping/bill"
                    element={<BillInformation />}
                  />

                  
                  <Route
                    path="/wallet/paymentselection"
                    element={<PaymentForm />}
                  />
                  <Route path="/protected/wallet" element={<Wallet />} />
                  <Route path="/detailpage/buy/succsess" element={<Bill />} />
                  <Route
                    path="/detailpage/buy/:id"
                    element={<DetailPaymentCourse />}
                  />
                  <Route path="/detailpage/:id" element={<DetailPage />} />
                  <Route
                    path="/detailCourseEnroll/:id"
                    element={<DetailCourseEnroll />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <>
                        <PageTitle title="Profile " />
                        <Profile />
                      </>
                    }
                  />
                  
                  
                  <Route path="/edit-user/:userId" element={<TableThree />} />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}

              {/* Instructor Routes */}
              {authInfo?.role.includes('ROLE_INSTRUCTOR') ? (
                <Route path="/" element={<InstructorLayout />}>
                  <Route path="/edit-user/:userId" element={<TableThree />} />
                  <Route
                    index
                    element={
                      <>
                        <PageTitle title="Instructor Home" />
                        <Home />
                      </>
                    }
                  />
                  <Route
                    path="/detailpage/buy/:id"
                    element={<DetailPaymentCourse />}
                  />
                  <Route
                    path="/eCommerce"
                    element={
                      <>
                        <PageTitle title="eCommerce Dashboard " />
                        <ECommerce />
                      </>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <>
                        <PageTitle title="Settings " />
                        <Settings />
                      </>
                    }
                  />
                  <Route path="/cartshopping" element={<CartShopping />} />
                  <Route
                    path="/cartshopping/bill"
                    element={<BillInformation />}
                  />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/CreateCoureFor" element={<CreateCoureFor />} />
                  <Route path="/TableCourse" element={<TableReact />} />
                  <Route path="/detailpage/:id" element={<DetailPage />} />
                  <Route path="/transfer" element={<TransferMoneyForm />} />
                  <Route
                    path="/cartshopping/bill"
                    element={<BillInformation />}
                  />
                  <Route
                    path="/wallet/paymentselection"
                    element={<PaymentForm />}
                  />
                  <Route path="/protected/wallet" element={<Wallet />} />
                  <Route
                    path="/detailpage/buy/succsess/:id"
                    element={<Bill />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <>
                        <PageTitle title="Profile " />
                        <Profile />
                      </>
                    }
                  />
                  <Route
                    path="courses"
                    element={<PageTitle title="Courses " />}
                  />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}
            </Route>

            {/* Other Routes */}
            <Route path="/buton" element={<Buttons />} />
            <Route path="/test" element={<Test />} />
            <Route path="/help" element={<HelpCenter />} />

            {/* Error Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
