import React, { useState } from 'react';
import DoctorManagement from './sections/DoctorManagement';
import PatientManagement from './sections/PatientManagement';
import AppointmentManagement from './sections/AppointmentManagement';
import ChatbotPredict from './sections/ChatbotPredict';

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect to login page
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'doctors':
        return <DoctorManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'chatbot-heart-disease':
        return <ChatbotPredict />;
      default:
        return (
          <div style={styles.dashboard}>
            <h2 style={styles.dashboardTitle}>Tổng quan</h2>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Bác sĩ</h3>
                <p style={styles.statValue}>25</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Bệnh nhân</h3>
                <p style={styles.statValue}>150</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Cuộc hẹn hôm nay</h3>
                <p style={styles.statValue}>12</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>Admin Panel</div>
          <button
            style={styles.toggleButton}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? '☰' : '✕'}
          </button>
        </div>
        <nav style={styles.nav}>
          <div
            style={selectedSection === 'dashboard' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            onClick={() => setSelectedSection('dashboard')}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span style={isSidebarCollapsed ? styles.navTextHidden : styles.navText}>Trang chủ</span>
          </div>
          <div
            style={selectedSection === 'doctors' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            onClick={() => setSelectedSection('doctors')}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v1.09c2.88 1.66 4.9 4.66 4.9 8.41 0 1.06-.2 2.08-.58 3z" />
            </svg>
            <span style={isSidebarCollapsed ? styles.navTextHidden : styles.navText}>Quản lý bác sĩ</span>
          </div>
          <div
            style={selectedSection === 'patients' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            onClick={() => setSelectedSection('patients')}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span style={isSidebarCollapsed ? styles.navTextHidden : styles.navText}>Quản lý bệnh nhân</span>
          </div>
          <div
            style={selectedSection === 'appointments' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            onClick={() => setSelectedSection('appointments')}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            <span style={isSidebarCollapsed ? styles.navTextHidden : styles.navText}>Quản lý cuộc hẹn</span>
          </div>
          <div
            style={selectedSection === 'chatbot-heart-disease' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            onClick={() => setSelectedSection('chatbot-heart-disease')}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8 5v2z" />
            </svg>
            <span style={isSidebarCollapsed ? styles.navTextHidden : styles.navText}>Chatbot dự đoán</span>
          </div>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <span>Xin chào, Admin</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Đăng xuất
            </button>
          </div>
        </div>
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Roboto', -apple-system, Arial, sans-serif",
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #2b6cb0, #1a4971)',
    color: '#ffffff',
    padding: '1rem',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
  },
  sidebarCollapsed: {
    width: '80px',
    background: 'linear-gradient(180deg, #2b6cb0, #1a4971)',
    color: '#ffffff',
    padding: '1rem',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#d1d5db',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background 0.2s, transform 0.2s, color 0.2s',
  },
  navLinkActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontWeight: '500',
  },
  navIcon: {
    width: '24px',
    height: '24px',
    marginRight: '0.75rem',
  },
  navText: {
    display: 'inline',
  },
  navTextHidden: {
    display: 'none',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  header: {
    background: 'linear-gradient(90deg, #edf2f7, #e2e8f0)',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    color: '#2d3748',
  },
  logoutButton: {
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  content: {
    padding: '1.5rem',
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f7fafc',
    animation: 'fadeIn 0.3s ease-in',
  },
  dashboard: {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  dashboardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '1rem',
    color: '#718096',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2d3748',
  },
};

// Add keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  div:hover[style*='cursor: pointer'] {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
  button:hover[style*='background-color: #e53e3e'] {
    background-color: #c53030 !important;
  }
  button:hover[style*='background: none'] {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminPage;