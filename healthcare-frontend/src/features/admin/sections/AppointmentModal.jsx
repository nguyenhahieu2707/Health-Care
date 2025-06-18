import React, { useState, useEffect } from 'react';
import doctorService from '../../../services/doctorService';
import patientService from '../../../services/patientService';

const STATUS_CHOICES = [
    { value: 'Requested', label: 'Đã yêu cầu' },
    { value: 'Confirmed', label: 'Đã xác nhận' },
    { value: 'Completed', label: 'Đã hoàn thành' },
    { value: 'CanceledByPatient', label: 'Đã hủy bởi bệnh nhân' },
    { value: 'CanceledByDoctor', label: 'Đã hủy bởi bác sĩ' },
];

const DURATION_OPTIONS = [
    { value: 15, label: '15 phút' },
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '1 tiếng' },
    { value: 90, label: '1 tiếng 30 phút' },
    { value: 120, label: '2 tiếng' },
];

const AppointmentModal = ({ isOpen, mode, appointmentData, onClose, onSaveCreate, onSaveUpdate }) => {
    const [formData, setFormData] = useState({
        scheduled_time: '',
        duration_minutes: 30,
        status: 'Requested',
        patient: '',
        doctor: '',
        id: null,
    });

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorList = await doctorService.getListDoctor();
                const patientList = await patientService.getListPatient();
                setDoctors(doctorList);
                setPatients(patientList);
            } catch (error) {
                alert('Không thể tải danh sách bác sĩ hoặc bệnh nhân');
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (appointmentData) {
            setFormData({
                scheduled_time: appointmentData.scheduled_time ? appointmentData.scheduled_time.slice(0, 16) : '',
                duration_minutes: appointmentData.duration_minutes || 30,
                status: appointmentData.status || 'Requested',
                patient: appointmentData.patient || '',
                doctor: appointmentData.doctor || '',
                id: appointmentData.id || null,
            });
        } else {
            setFormData({
                scheduled_time: '',
                duration_minutes: 30,
                status: 'Requested',
                patient: '',
                doctor: '',
                id: null,
            });
        }
    }, [appointmentData]);

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const isUpdateMode = mode === 'update';

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getStatusLabel = (value) => STATUS_CHOICES.find(item => item.value === value)?.label || value;

    const getPatientName = (id) => {
        const p = patients.find(p => p.id === parseInt(id));
        return p ? `${p.last_name} ${p.first_name}` : id;
    };

    const getDoctorName = (id) => {
        const d = doctors.find(d => d.id === parseInt(id));
        return d ? `${d.last_name} ${d.first_name}` : id;
    };

    const handleSave = () => {
        if (isCreateMode) {
            onSaveCreate(formData);
        } else if (isUpdateMode) {
            onSaveUpdate(formData);
        }
    };

    const fields = [
        { label: 'Thời gian', name: 'scheduled_time', type: 'datetime-local' },
        { label: 'Thời lượng', name: 'duration_minutes', type: 'select', options: DURATION_OPTIONS },
        { label: 'Trạng thái', name: 'status', type: 'select', options: STATUS_CHOICES },
        { label: 'Bệnh nhân', name: 'patient', type: 'select', options: patients.map(p => ({ value: p.id, label: `${p.last_name} ${p.first_name}` })) },
        { label: 'Bác sĩ', name: 'doctor', type: 'select', options: doctors.map(d => ({ value: d.id, label: `${d.last_name} ${d.first_name}` })) },
    ];

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={{ marginBottom: '16px' }}>
                    {isViewMode
                        ? 'Thông tin lịch hẹn'
                        : isCreateMode
                            ? 'Thêm lịch hẹn mới'
                            : 'Sửa lịch hẹn'}
                </h2>

                {fields.map(({ label, name, type, options }) => (
                    <div key={name} style={isViewMode ? styles.viewRow : styles.editGroup}>
                        <label style={styles.label}>{label}</label>
                        {isViewMode ? (
                            <p style={styles.viewValue}>
                                {name === 'status'
                                    ? getStatusLabel(formData.status)
                                    : name === 'duration_minutes'
                                        ? DURATION_OPTIONS.find(opt => opt.value === Number(formData.duration_minutes))?.label
                                        : name === 'patient'
                                            ? getPatientName(formData.patient)
                                            : name === 'doctor'
                                                ? getDoctorName(formData.doctor)
                                                : formData[name]}
                            </p>
                        ) : type === 'select' ? (
                            <select
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                style={styles.select}
                            >
                                <option value="">-- Chọn --</option>
                                {options.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        )}
                    </div>
                ))}

                <div style={styles.buttonRow}>
                    <button onClick={onClose} style={styles.closeBtn}>Đóng</button>
                    {!isViewMode && (
                        <button onClick={handleSave} style={styles.saveBtn}>Lưu</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
    },
    label: {
        fontWeight: 'bold',
        marginRight: '12px',
        minWidth: '140px',
    },
    viewRow: {
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        columnGap: '12px',
        alignItems: 'center',
        marginBottom: '12px',
    },
    viewValue: {
        margin: 0,
        justifySelf: 'start',
        color: '#333',
    },
    editGroup: {
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '4px',
    },
    select: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '4px',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    closeBtn: {
        padding: '8px 16px',
        marginRight: '8px',
        backgroundColor: '#7f8c8d',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    saveBtn: {
        padding: '8px 16px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};
