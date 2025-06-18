import React, { useState, useEffect, useRef } from 'react';
import chatbotPredictService from '../../../services/chatbotPredictService';

const questions = [
    { key: 'age', question: 'Bạn bao nhiêu tuổi?', type: 'number' },
    { key: 'sex', question: 'Giới tính của bạn?', type: 'select', options: ['Nữ', 'Nam'] },
    {
        key: 'cp',
        question: 'Bạn có đau ngực loại nào?',
        type: 'select',
        options: ['Không triệu chứng', 'Đau ngực không điển hình', 'Đau ngực không do tim', 'Đau ngực điển hình'],
    },
    { key: 'trestbps', question: 'Huyết áp khi nghỉ ngơi của bạn?', type: 'number' },
    { key: 'chol', question: 'Mức cholesterol của bạn?', type: 'number' },
    { key: 'fbs', question: 'Đường huyết lúc đói có > 120 mg/dl không?', type: 'select', options: ['Không', 'Có'] },
    {
        key: 'restecg',
        question: 'Điện tâm đồ khi nghỉ ngơi?',
        type: 'select',
        options: ['Phì đại thất trái', 'Bình thường', 'Bất thường đoạn ST-T'],
    },
    { key: 'thalch', question: 'Mức độ nhịp tim cao nhất bạn đạt được?', type: 'number' },
    { key: 'exang', question: 'Bạn có bị đau thắt ngực khi tập thể dục?', type: 'select', options: ['Không', 'Có'] },
    { key: 'oldpeak', question: 'ST depression tương ứng với bài tập?', type: 'number' },
    {
        key: 'slope',
        question: 'Độ dốc của đoạn ST?',
        type: 'select',
        options: ['Đi xuống', 'Bằng phẳng', 'Đi lên'],
    },
    { key: 'ca', question: 'Số lượng mạch chính bị tắc (0-3)?', type: 'number' },
    {
        key: 'thal',
        question: 'Trạng thái Thalassemia?',
        type: 'select',
        options: ['Khuyết tật cố định', 'Bình thường', 'Khuyết tật đảo ngược'],
    },
];

const selectValueMap = {
    sex: { 'Nữ': 0, 'Nam': 1 },
    fbs: { 'Không': 0, 'Có': 1 },
    exang: { 'Không': 0, 'Có': 1 },
    cp: {
        'Không triệu chứng': 'asymptomatic',
        'Đau ngực không điển hình': 'atypical angina',
        'Đau ngực không do tim': 'non-anginal',
        'Đau ngực điển hình': 'typical angina',
    },
    restecg: {
        'Phì đại thất trái': 'lv hypertrophy',
        'Bình thường': 'normal',
        'Bất thường đoạn ST-T': 'st-t abnormality',
    },
    slope: {
        'Đi xuống': 'downsloping',
        'Bằng phẳng': 'flat',
        'Đi lên': 'upsloping',
    },
    thal: {
        'Khuyết tật cố định': 'fixed defect',
        'Bình thường': 'normal',
        'Khuyết tật đảo ngược': 'reversable defect',
    },
};

const ChatbotPredict = () => {
    const [started, setStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectValue, setSelectValue] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (started) {
            const first = questions[0];
            setMessages([{ sender: 'bot', text: first.question }]);
            setShowOptions(first.type === 'select');
            setCurrentStep(0);
        } else {
            setMessages([
                {
                    sender: 'bot',
                    text: 'Chào bạn! Mình sẽ giúp bạn dự đoán nguy cơ bệnh tim mạch. Nhấn "Bắt đầu" để bắt đầu nhé!',
                },
            ]);
        }
    }, [started]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleStart = () => {
        setStarted(true);
        setAnswers({});
        setInput('');
        setSelectValue('');
    };

    const handleAnswer = (value) => {
        const question = questions[currentStep];
        const key = question.key;

        let parsedValue = value;

        if (question.type === 'number') {
            parsedValue = Number(value);
            if (isNaN(parsedValue)) {
                alert('Vui lòng nhập một số hợp lệ!');
                return;
            }
        }

        if (question.type === 'select') {
            if (selectValueMap[key]) {
                parsedValue = selectValueMap[key][value];
            }
        }

        const newAnswers = { ...answers, [key]: parsedValue };
        const newMessages = [...messages, { sender: 'user', text: value.toString() }];

        if (currentStep < questions.length - 1) {
            const nextQuestion = questions[currentStep + 1];
            newMessages.push({ sender: 'bot', text: nextQuestion.question });
            setShowOptions(nextQuestion.type === 'select');
            setCurrentStep(currentStep + 1);
            setSelectValue('');
        } else {
            setLoading(true);
            chatbotPredictService
                .predict(newAnswers)
                .then((response) => {
                    const hasDisease = response.result === 1;
                    const prob = response.probability.toFixed(1);
                    const messageText = hasDisease
                        ? `🚨 *Cảnh báo sức khỏe!* Có dấu hiệu bệnh tim.\n📈 Xác suất mắc bệnh: ${prob}%`
                        : `💖 Sức khỏe tim mạch tốt! Không có dấu hiệu bệnh tim.\n📉 Xác suất mắc bệnh: ${(100 - prob).toFixed(1)}%`;

                    newMessages.push({ sender: 'bot', text: messageText });

                    const adviceText = hasDisease
                        ? '⚠️ Kết quả chỉ mang tính chất tham khảo. Để đảm bảo sức khỏe, bạn nên đến cơ sở y tế chuyên khoa để được thăm khám và chẩn đoán chính xác.'
                        : '😊 Kết quả rất tốt! Hãy duy trì thói quen sinh hoạt lành mạnh và lối sống tích cực để bảo vệ sức khỏe lâu dài.';

                    newMessages.push({ sender: 'bot', text: adviceText });
                    newMessages.push({
                        sender: 'bot',
                        text: 'Bạn có muốn dự đoán tiếp không?',
                        action: 'restart',
                    });

                    setMessages(newMessages);
                })
                .catch((error) => {
                    newMessages.push({ sender: 'bot', text: `❌ Lỗi: ${error.message}` });
                    setMessages(newMessages);
                })
                .finally(() => {
                    setLoading(false);
                });
            return;
        }

        setAnswers(newAnswers);
        setMessages(newMessages);
        setInput('');
        setSelectValue('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() !== '') handleAnswer(input.trim());
    };

    const handleRestart = () => {
        setStarted(true);
        setAnswers({});
        setMessages([{ sender: 'bot', text: questions[0].question }]);
        setCurrentStep(0);
        setInput('');
        setShowOptions(questions[0].type === 'select');
        setLoading(false);
        setSelectValue('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatBox}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#3498db' : '#ecf0f1',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {msg.text}
                        {msg.action === 'restart' && (
                            <button onClick={handleRestart} style={styles.restartButton}>
                                🔄 Dự đoán tiếp
                            </button>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef} />
                {loading && <div style={{ marginTop: 10 }}>⏳ Đang xử lý...</div>}
            </div>

            {!loading && started && currentStep < questions.length && (
                <form style={styles.inputArea} onSubmit={handleSubmit}>
                    {showOptions ? (
                        <select
                            style={styles.select}
                            value={selectValue}
                            onChange={(e) => {
                                setSelectValue(e.target.value);
                                handleAnswer(e.target.value);
                            }}
                            required
                        >
                            <option value="" disabled>
                                -- Chọn --
                            </option>
                            {questions[currentStep].options.map((opt, i) => (
                                <option key={i} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <input
                                type={questions[currentStep].type === 'number' ? 'number' : 'text'}
                                step={questions[currentStep].key === 'oldpeak' ? 'any' : '1'}
                                style={styles.input}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập câu trả lời..."
                                required
                            />
                            <button type="submit" style={styles.button}>
                                Gửi
                            </button>
                        </>
                    )}
                </form>
            )}

            {!started && (
                <div style={{ textAlign: 'center' }}>
                    <button onClick={handleStart} style={styles.startButton}>
                        Bắt đầu
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatbotPredict;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '85vh',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#fff',
    },
    chatBox: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto',
        marginBottom: '20px',
        paddingRight: '5px',
    },
    message: {
        padding: '10px 15px',
        borderRadius: '15px',
        maxWidth: '80%',
    },
    inputArea: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    select: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
    startButton: {
        padding: '15px 30px',
        fontSize: '18px',
        borderRadius: '10px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginTop: '20px',
    },
    restartButton: {
        marginTop: '10px',
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '8px',
        backgroundColor: '#e67e22',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'block',
    },
};
