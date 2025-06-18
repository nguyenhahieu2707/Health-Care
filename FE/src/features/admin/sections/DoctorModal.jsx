import React, { useState, useEffect } from 'react';

const SPECIALTY_CHOICES = [
    { value: 'ND', label: 'Nội khoa' },
    { value: 'NK', label: 'Nhi khoa' },
    { value: 'TM', label: 'Tim mạch' },
    { value: 'DL', label: 'Da liễu' },
    { value: 'DK', label: 'Đa khoa' },
    { value: 'CT', label: 'Chấn thương chỉnh hình' },
    { value: 'TT', label: 'Tâm thần' },
    { value: 'TK', label: 'Thần kinh' },
];

const DoctorModal = ({ isOpen, mode, doctorData, onClose, onSaveCreate, onSaveUpdate }) => {
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        specialty: '',
        experience_years: '',
        phone_number: '',
        email: '',
        address: '',
    });

    useEffect(() => {
        if (doctorData) {
            setFormData({
                id: doctorData.id || '',
                first_name: doctorData.first_name || '',
                last_name: doctorData.last_name || '',
                specialty: doctorData.specialty || '',
                experience_years: doctorData.experience_years || '',
                phone_number: doctorData.phone_number || '',
                email: doctorData.email || '',
                address: doctorData.address || '',
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                specialty: '',
                experience_years: '',
                phone_number: '',
                email: '',
                address: '',
            });
        }
    }, [doctorData, mode]);

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const isUpdateMode = mode === 'update';

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getSpecialtyLabel = (value) => {
        const found = SPECIALTY_CHOICES.find((item) => item.value === value);
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
                        ? 'Thông tin bác sĩ'
                        : isCreateMode
                            ? 'Thêm bác sĩ mới'
                            : 'Sửa thông tin bác sĩ'}
                </h2>

                {/* Họ */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Họ</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.last_name}</p>
                    ) : (
                        <input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Tên */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Tên</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.first_name}</p>
                    ) : (
                        <input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Chuyên khoa */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Chuyên khoa</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{getSpecialtyLabel(formData.specialty)}</p>
                    ) : (
                        <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {SPECIALTY_CHOICES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Kinh nghiệm */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Kinh nghiệm (năm)</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.experience_years}</p>
                    ) : (
                        <input
                            name="experience_years"
                            type="number"
                            min={0}
                            value={formData.experience_years}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Số điện thoại */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Số điện thoại</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.phone_number}</p>
                    ) : (
                        <input
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Email */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Email</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.email}</p>
                    ) : (
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Địa chỉ */}
                <div style={isViewMode ? styles.viewRow : styles.editGroup}>
                    <label style={styles.label}>Địa chỉ</label>
                    {isViewMode ? (
                        <p style={styles.viewValue}>{formData.address}</p>
                    ) : (
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}
                </div>

                {/* Nút đóng & lưu */}
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

export default DoctorModal;

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
        width: '400px',
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
