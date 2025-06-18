const API_URL = 'http://localhost:8000/api/auth';

const authService = {
    async login(username, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.');
        }

        const data = await res.json();
        return data;
    },
};

export default authService;
