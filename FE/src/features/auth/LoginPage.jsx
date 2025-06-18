// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../../services/authService';

// export default function LoginPage() {
//     const navigate = useNavigate();

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);

//         try {
//             const data = await authService.login(username, password);
//             console.log('Token:', data.access);
//             console.log('Refresh Token:', data.refresh);
//             console.log('Role Token:', data.role);

//             // Lưu token vào localStorage
//             localStorage.setItem('accessToken', data.access);
//             localStorage.setItem('refreshToken', data.refresh);

//             // Điều hướng dựa trên role
//             switch (data.role.toLowerCase()) {
//                 case 'admin':
//                     navigate('/admin');
//                     break;
//                 case 'doctor':
//                     navigate('/doctor');
//                     break;
//                 case 'patient':
//                     navigate('/patient');
//                     break;
//                 default:
//                     alert('Không có quyền truy cập cho vai trò này.');
//                     break;
//             }
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.formWrapper}>
//                 <h2 style={styles.title}>Hệ thống Health Care</h2>
//                 <form onSubmit={handleSubmit} style={styles.form}>
//                     <label style={styles.label}>
//                         Username
//                         <input
//                             type="username"
//                             value={username}
//                             onChange={e => setUsername(e.target.value)}
//                             required
//                             placeholder="Nhập username"
//                             style={styles.input}
//                         />
//                     </label>

//                     <label style={styles.label}>
//                         Mật khẩu
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={e => setPassword(e.target.value)}
//                             required
//                             placeholder="Nhập mật khẩu"
//                             style={styles.input}
//                         />
//                     </label>

//                     {error && <p style={styles.error}>{error}</p>}

//                     <button type="submit" disabled={loading} style={styles.button}>
//                         {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     container: {
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: 'linear-gradient(135deg, #71b7e6, #9b59b6)',
//         padding: '20px',
//     },
//     formWrapper: {
//         backgroundColor: 'white',
//         padding: '40px',
//         borderRadius: '10px',
//         boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
//         width: '100%',
//         maxWidth: '400px',
//     },
//     form: {
//         width: '100%',
//     },
//     title: {
//         marginBottom: '24px',
//         textAlign: 'center',
//         color: '#333',
//     },
//     label: {
//         display: 'block',
//         marginBottom: '15px',
//         color: '#555',
//         fontWeight: '600',
//     },
//     input: {
//         boxSizing: 'border-box',
//         marginTop: '6px',
//         width: '100%',
//         padding: '10px',
//         borderRadius: '6px',
//         border: '1px solid #ccc',
//         fontSize: '16px',
//         outline: 'none',
//         transition: 'border-color 0.3s',
//     },
//     error: {
//         color: 'red',
//         marginBottom: '15px',
//         fontWeight: '600',
//     },
//     button: {
//         width: '100%',
//         padding: '12px',
//         backgroundColor: '#6a5acd',
//         border: 'none',
//         borderRadius: '6px',
//         color: 'white',
//         fontSize: '16px',
//         cursor: 'pointer',
//         fontWeight: '600',
//         transition: 'background-color 0.3s',
//     },
// };


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login(username, password);
      console.log('Token:', data.access);
      console.log('Refresh Token:', data.refresh);
      console.log('Role Token:', data.role);

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      switch (data.role.toLowerCase()) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          alert('Không có quyền truy cập cho vai trò này.');
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Hệ thống Health Care</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              type="text" // Sửa từ type="username" thành type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nhập username"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </label>

          <label style={styles.label}>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <svg
                  style={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)', // Gradient hiện đại
    padding: '20px',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)', // Shadow mạnh hơn
    width: '100%',
    maxWidth: '420px',
  },
  form: {
    width: '100%',
  },
  title: {
    marginBottom: '24px',
    textAlign: 'center',
    color: '#2d3748',
    fontSize: '28px',
    fontWeight: '700',
  },
  label: {
    display: 'block',
    marginBottom: '16px',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '600',
  },
  input: {
    boxSizing: 'border-box',
    marginTop: '8px',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  error: {
    color: '#e53e3e',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(145deg, #4299e1, #3182ce)', // Gradient cho button
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.3s',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    height: '20px',
    width: '20px',
    marginRight: '8px',
  },
};

// Thêm keyframes cho spinner
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);