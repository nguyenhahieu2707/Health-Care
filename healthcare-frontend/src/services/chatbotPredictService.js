const API_URL = 'http://localhost:8000/api/heart-disease-prediction';

const chatbotPredictService = {
    async predict(requestData) {
        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(requestData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Dự đoán thất bại! Vui lòng kiểm tra lại dữ liệu đầu vào.');
        }

        const data = await res.json();
        return data;
    },
};

export default chatbotPredictService;
