const API_URL = 'http://localhost:8000/api/patient';

const patientService = {
    async getListPatient() {
        const res = await fetch(`${API_URL}/get-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy danh sách bệnh nhân thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async createPatient(patientData) {
        const res = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(patientData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Tạo bệnh nhân thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async getPatientDetail(id) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lấy thông tin bệnh nhân thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async updatePatient(id, patientData) {
        const res = await fetch(`${API_URL}/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(patientData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Cập nhật thông tin bệnh nhân thất bại!');
        }

        const data = await res.json();
        return data;
    },

    async deletePatient(id) {
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Xóa bệnh nhân thất bại!');
        }

        return true;
    }
}
export default patientService;
