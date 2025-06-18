import React, { useState, useEffect } from 'react';
import doctorService from '../../../services/doctorService';
import DoctorModal from './DoctorModal';

const SPECIALTY_CHOICES = [
    { value: 'ND', label: 'Nội khoa' },
    { value: 'NK', label: 'Nhi khoa' },
    { value: 'TM', label: 'Tim mạch' },
    { value: 'DL', label: 'Da liễu' },
    { value: 'DK', label: 'Đa khoa' },
    { value: 'CT', label: 'Chấn thương chỉnh hình' },
    { value: 'TT', label: 'Tâm thần' },
    { value: 'TK', label: 'Thần kinh aaaa' },
];

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Load danh sách bác sĩ từ backend
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await doctorService.getListDoctor();
            setDoctors(data);
        } catch (error) {
            alert(error.message || 'Không thể tải danh sách bác sĩ!');
        }
    };

    const getSpecialtyLabel = (value) => {
        const found = SPECIALTY_CHOICES.find((item) => item.value === value);
        return found ? found.label : value;
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa bác sĩ ID: ${id}?`)) {
            try {
                await doctorService.deleteDoctor(id);
                await fetchDoctors(); // reload lại danh sách
            } catch (error) {
                alert(error.message || 'Xóa bác sĩ thất bại!');
            }
        }
    };

    const handleAdd = () => {
        setSelectedDoctor(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleUpdate = (doctor) => {
        setSelectedDoctor(doctor);
        setModalMode('update');
        setModalOpen(true);
    };

    const handleView = (doctor) => {
        setSelectedDoctor(doctor);
        setModalMode('view');
        setModalOpen(true);
    };


    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleSaveCreateModal = async (doctorData) => {
        try {
            await doctorService.createDoctor(doctorData);
            await fetchDoctors();   // reload lại danh sách
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Tạo bác sĩ thất bại!');
        }
    };

    const handleSaveUpdateModal = async (doctorData) => {
        try {
            await doctorService.updateDoctor(doctorData.id, doctorData);
            await fetchDoctors();   // reload lại danh sách
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Cập nhật bác sĩ thất bại!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Danh sách bác sĩ</h2>
                <button style={styles.addButton} onClick={handleAdd}>Thêm bác sĩ</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Họ và tên</th>
                        <th style={styles.th}>Số điện thoại</th>
                        <th style={styles.th}>Chuyên khoa</th>
                        <th style={styles.th}>Kinh nghiệm (năm)</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id} style={styles.tr}>
                            <td style={styles.td}>{doctor.id}</td>
                            <td style={styles.td}>{doctor.last_name} {doctor.first_name}</td>
                            <td style={styles.td}>{doctor.phone_number}</td>
                            <td style={styles.td}>{getSpecialtyLabel(doctor.specialty)}</td>
                            <td style={styles.td}>{doctor.experience_years}</td>
                            <td style={styles.td}>
                                <button style={styles.viewButton} onClick={() => handleView(doctor)}>Xem</button>
                                <button style={styles.editButton} onClick={() => handleUpdate(doctor)}>Sửa</button>
                                <button style={{ ...styles.actionButton, ...styles.deleteButton }} onClick={() => handleDelete(doctor.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DoctorModal
                isOpen={modalOpen}
                mode={modalMode}
                doctorData={selectedDoctor}
                onClose={handleCloseModal}
                onSaveCreate={handleSaveCreateModal}
                onSaveUpdate={handleSaveUpdateModal}
            />
        </div>
    );
};

export default DoctorManagement;

const styles = {
    container: {
        width: '100%',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    title: {
        margin: 0,
        color: '#333',
    },
    addButton: {
        padding: '12px 24px',
        backgroundColor: '#27ae60',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '16px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        borderBottom: '2px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#f4f4f4',
    },
    tr: {
        borderBottom: '1px solid #eee',
    },
    td: {
        padding: '10px 12px',
    },
    actionButton: {
        marginRight: '6px',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
    },
    viewButton: {
        backgroundColor: '#27ae60', // xanh lá cho xem
        marginRight: '6px',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
    },
    editButton: {
        backgroundColor: '#3498db', // xanh dương cho sửa
        marginRight: '6px',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
};
