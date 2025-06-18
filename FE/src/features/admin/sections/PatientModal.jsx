import React, { useState, useEffect } from 'react';

const GENDER_CHOICES = [
    { value: 'M', label: 'Nam' },
    { value: 'F', label: 'Nữ' },
    { value: 'O', label: 'Khác' },
];

const PatientModal = ({ isOpen, mode, patientData, onClose, onSaveCreate, onSaveUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        gender: 'M',
        address: '',
        phone_number: '',
        email: '',
        medical_history: '',
    });

    useEffect(() => {
        if (patientData) {
            setFormData({ ...patientData });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                dob: '',
                gender: 'M',
                address: '',
                phone_number: '',
                email: '',
                medical_history: '',
            });
        }
    }, [patientData]);

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const isUpdateMode = mode === 'update';

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getGenderLabel = (value) => {
        const found = GENDER_CHOICES.find((item) => item.value === value);
        return found ? found.label : value;
    };

    const handleSave = () => {
        if (isCreateMode) {
            onSaveCreate(formData);
        } else if (isUpdateMode) {
            onSaveUpdate(formData);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={{ marginBottom: '16px' }}>
                    {isViewMode
                        ? 'Thông tin bệnh nhân'
                        : isCreateMode
                            ? 'Thêm bệnh nhân mới'
                            : 'Sửa thông tin bệnh nhân'}
                </h2>

                {[
                    { label: 'Họ', name: 'last_name' },
                    { label: 'Tên', name: 'first_name' },
                    { label: 'Ngày sinh', name: 'dob', type: 'date' },
                    { label: 'Địa chỉ', name: 'address' },
                    { label: 'Số điện thoại', name: 'phone_number' },
                    { label: 'Email', name: 'email', type: 'email' },
                ].map(({ label, name, type }) => (
                    <div key={name} style={isViewMode ? styles.viewRow : styles.editGroup}>
                        <label style={styles.label}>{label}</label>
                        {isViewMode ? (
                            <p style={styles.viewValue}>{formData[name]}</p>
                        ) : (
                            <input
                                name={name}
                                type={type || 'text'}
                                value={formData[name]}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        )}
                    </div>
                ))}

                {/* Giới tính */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Giới tính</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{getGenderLabel(formData.gender)}</p>
                    ) : (
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            {GENDER_CHOICES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Tiền sử bệnh */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Tiền sử bệnh</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.medical_history}</p>
                    ) : (
                        <textarea
                            name="medical_history"
                            rows={3}
                            value={formData.medical_history}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                <div style={styles.buttonRow}>
                    <button onClick={onClose} style={styles.closeBtn}>
                        Đóng
                    </button>
                    {!isViewMode && (
                        <button onClick={handleSave} style={styles.saveBtn}>
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientModal;

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
        minWidth: '120px',
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
