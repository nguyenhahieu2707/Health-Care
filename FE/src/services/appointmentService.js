const API_URL = 'http://localhost:8000/api/appointment';

const appointmentService = {
    async getListAppointments() {
        const res = await fetch(`${API_URL}/get-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy danh sách cuộc hẹn thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async createAppointment(appointmentData) {
        const res = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(appointmentData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Tạo cuộc hẹn thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async getDetailAppointment(appointmentId) {
        const res = await fetch(`${API_URL}/get-detail/${appointmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy chi tiết cuộc hẹn thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async updateAppointment(appointmentId, appointmentData) {
        const res = await fetch(`${API_URL}/update/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(appointmentData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Cập nhật cuộc hẹn thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async deleteAppointment(appointmentId) {
        const res = await fetch(`${API_URL}/delete/${appointmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Xoá cuộc hẹn thất bại!');
        }

        return { message: 'Xoá cuộc hẹn thành công!' };
    }
}
export default appointmentService;
