// Dummy authentication service for Credit2Cash
// Simulates OTP-based authentication without external API

export interface AuthResponse {
  success: boolean;
  error?: string;
}

// Simulate OTP sending
export const sendOtp = async (phone: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Store phone in session for verification
      sessionStorage.setItem('otp_phone', phone);
      sessionStorage.setItem('otp_sent_at', Date.now().toString());
      resolve({ success: true });
    }, 500);
  });
};

// Verify OTP (accepts "123456" as valid)
export const verifyOtp = async (phone: string, code: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedPhone = sessionStorage.getItem('otp_phone');
      
      if (storedPhone !== phone) {
        resolve({ success: false, error: 'Phone number mismatch' });
        return;
      }
      
      if (code === '123456') {
        // Create session
        const session = {
          phone,
          isAuthenticated: true,
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem('c2c_session', JSON.stringify(session));
        sessionStorage.removeItem('otp_phone');
        sessionStorage.removeItem('otp_sent_at');
        
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Incorrect OTP — try again' });
      }
    }, 600);
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const session = localStorage.getItem('c2c_session');
  return !!session;
};

// Get current session
export const getSession = () => {
  const session = localStorage.getItem('c2c_session');
  return session ? JSON.parse(session) : null;
};

// Logout
export const logout = () => {
  localStorage.removeItem('c2c_session');
  localStorage.removeItem('c2c_user_data');
  sessionStorage.clear();
};
