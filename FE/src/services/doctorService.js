const API_URL = 'http://localhost:8000/api/doctor';

const doctorService = {
    async getListDoctor() {
        const res = await fetch(`${API_URL}/get-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy danh sách bác sĩ thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async createDoctor(doctorData) {
        const res = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(doctorData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Tạo bác sĩ thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async getDoctorDetail(id) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy thông tin bác sĩ thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async updateDoctor(id, doctorData) {
        const res = await fetch(`${API_URL}/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(doctorData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Cập nhật bác sĩ thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async deleteDoctor(id) {
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Xóa bác sĩ thất bại!');
        }

        return true;
    }

};

export default doctorService;
