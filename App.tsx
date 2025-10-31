
import React, { useState, useEffect } from 'react';
import { UserRole, User, Project, Booking, Notification, Transaction, View } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_BOOKINGS, MOCK_NOTIFICATIONS } from './constants';

// --- Screen Components ---
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import ForgotPasswordScreen from './components/auth/ForgotPasswordScreen';
import VerifyOtpScreen from './components/auth/VerifyOtpScreen';
import AdminLoginScreen from './components/auth/AdminLoginScreen';
import HomeScreen from './components/user/HomeScreen';
import ProjectListScreen from './components/user/UserDashboard';
import ProjectDetail from './components/user/ProjectDetail';
import MyProfileScreen from './components/user/MyProfileScreen';
import ChatScreen from './components/user/ChatScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import BottomNavBar from './components/shared/BottomNavBar';
import SmartEstimatorScreen from './components/estimator/SmartEstimatorScreen';
import NotificationScreen from './components/user/NotificationScreen';
import BookingsScreen from './components/user/BookingsScreen';
import ConsultationScreen from './components/user/ConsultationScreen';
import LandingScreen from './components/landing/LandingScreen';
import ShopScreen from './components/user/ShopScreen';

const USER_MAIN_VIEWS: View[] = ['user_home', 'bookings', 'shop', 'chat', 'my_profile'];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('onboarding');
  const [previousView, setPreviousView] = useState<View>('user_home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // --- Auth Handlers ---

  const handleUserLogin = (mobile: string, pass: string) => {
    console.log(`Attempting login for ${mobile}`);
    const user = MOCK_USERS.find(u => u.mobile === mobile && u.role === UserRole.USER);
    if (user) {
      setCurrentUser(user);
      setCurrentView('user_home');
    } else {
      alert("Invalid credentials or you are not a registered user.");
    }
  };
  
  const handleRegister = (name: string, email: string, mobile: string, pass: string) => {
      console.log(`Registering ${name} with mobile ${mobile}`);
      const user = MOCK_USERS.find(u => u.role === UserRole.USER);
      if(user) {
          setCurrentUser({...user, name, email, mobile });
          setCurrentView('user_home');
      }
      alert("Registration successful! You are now logged in.");
  };

  const handleForgotPassword = (mobile: string) => {
      console.log(`Password reset OTP sent to ${mobile}`);
      alert(`An OTP has been sent to ${mobile}.`);
      setCurrentView('verify_otp');
  };

  const handleVerifyOtp = (otp: string) => {
    console.log(`Verifying OTP ${otp}`);
    if (otp === '123456') { // Mock OTP
        alert('Your identity has been verified. Please log in.');
        setCurrentView('login');
    } else {
        alert('Invalid OTP. Please try again.');
    }
  };

  const handleAdminLogin = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      setCurrentView(role === UserRole.ADMIN ? 'admin_dashboard' : 'super_admin_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProject(null);
    setCurrentView('login');
  };

  // --- Navigation Handlers ---

  const handleNavigation = (view: View) => {
      if (USER_MAIN_VIEWS.includes(currentView)) {
        setPreviousView(currentView);
      }
      setCurrentView(view);
  };
  
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project_detail');
  };
  
  const handleBackFromProject = () => {
      setSelectedProject(null);
      handleNavigation(previousView === 'project_detail' ? 'user_home' : previousView);
  };

  const handleUpdateProject = (updatedProject: Project) => {
      setProjects(prevProjects => 
          prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
      );
      if(selectedProject?.id === updatedProject.id) {
        setSelectedProject(updatedProject);
      }
  };
  
  const handleAddBooking = (bookingDetails: Omit<Booking, 'id'>) => {
      const newBooking: Booking = {
          id: `b${bookings.length + 1}-${Date.now()}`,
          ...bookingDetails,
      };
      setBookings(prevBookings => [...prevBookings, newBooking]);
      console.log("Admin Data: New Booking Added:", newBooking);
  };

  const handleMarkAsRead = (notificationId: string) => {
      setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
  };

  const renderContent = () => {
    const userProjects = currentUser ? projects.filter(p => p.userId === currentUser.id) : [];

    switch (currentView) {
      case 'onboarding':
        return <OnboardingScreen onFinish={() => setCurrentView('login')} />;
      case 'landing':
        return <LandingScreen onNavigate={handleNavigation} />;
      case 'login':
        return <LoginScreen 
            onLogin={handleUserLogin} 
            onNavigateToRegister={() => setCurrentView('register')}
            onNavigateToForgotPassword={() => setCurrentView('forgot_password')}
            onNavigateToAdminLogin={() => setCurrentView('admin_login')}
        />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setCurrentView('login')} />;
      case 'forgot_password':
        return <ForgotPasswordScreen onResetPassword={handleForgotPassword} onNavigateToLogin={() => setCurrentView('login')} />;
      case 'verify_otp':
        return <VerifyOtpScreen onVerify={handleVerifyOtp} onNavigateToLogin={() => setCurrentView('login')} />;
      case 'admin_login':
        return <AdminLoginScreen onLogin={handleAdminLogin} onNavigateToUserLogin={() => setCurrentView('login')} />;
      case 'smart_estimator':
        return <SmartEstimatorScreen onBack={() => handleNavigation(previousView)} onCTAClick={() => handleNavigation('consultation')} />;
      case 'consultation':
        return <ConsultationScreen onBack={() => handleNavigation(previousView)} />;
      case 'user_home':
        return <HomeScreen user={currentUser!} onNavigate={handleNavigation} onLogout={handleLogout} notifications={notifications} />;
      case 'project_list':
        return <ProjectListScreen 
                  user={currentUser!} 
                  onSelectProject={handleSelectProject} 
                  onLogout={handleLogout} 
                  projects={projects} 
                  onNavigate={handleNavigation} 
                  notifications={notifications} 
                  onBack={() => handleNavigation('user_home')}
               />;
      case 'project_detail':
        return <ProjectDetail 
                  project={selectedProject!} 
                  onBack={handleBackFromProject} 
                  user={currentUser!} 
                  onUpdateProject={handleUpdateProject} 
                  onAddBooking={handleAddBooking}
               />;
       case 'my_profile':
        return <MyProfileScreen user={currentUser!} onLogout={handleLogout} projects={userProjects} onSelectProject={handleSelectProject} onNavigate={handleNavigation}/>;
       case 'chat':
        return <ChatScreen user={currentUser!} onLogout={handleLogout} onNavigate={handleNavigation} notifications={notifications} />;
      case 'bookings':
        return <BookingsScreen 
                  user={currentUser!} 
                  bookings={bookings} 
                  onLogout={handleLogout} 
                  onNavigate={handleNavigation} 
                  notifications={notifications} 
               />;
      case 'shop':
        return <ShopScreen 
                  user={currentUser!} 
                  onLogout={handleLogout} 
                  onNavigate={handleNavigation} 
                  notifications={notifications} 
                />;
      case 'notifications':
        return <NotificationScreen 
                  user={currentUser!} 
                  notifications={notifications} 
                  onBack={() => handleNavigation(previousView)} 
                  onMarkAsRead={handleMarkAsRead}
                  onLogout={handleLogout}
               />;
      case 'admin_dashboard':
        return <AdminDashboard user={currentUser!} projects={projects} onLogout={handleLogout} onUpdateProject={handleUpdateProject} />;
      case 'super_admin_dashboard':
        return <SuperAdminDashboard user={currentUser!} onLogout={handleLogout} />;
      default:
        return <LoginScreen 
            onLogin={handleUserLogin} 
            onNavigateToRegister={() => setCurrentView('register')}
            onNavigateToForgotPassword={() => setCurrentView('forgot_password')}
            onNavigateToAdminLogin={() => setCurrentView('admin_login')}
        />;
    }
  };

  const showBottomNav = currentUser && USER_MAIN_VIEWS.includes(currentView);

  return (
    <div className="min-h-screen bg-slate-50">
      {renderContent()}
      {showBottomNav && (
        <BottomNavBar currentView={currentView} onNavigate={handleNavigation} />
      )}
    </div>
  );
}