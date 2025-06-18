import React, { useState, useEffect } from 'react';
import patientService from '../../../services/patientService';
import PatientModal from './PatientModal';

const GENDER_LABELS = {
    M: 'Nam',
    F: 'Nữ',
    O: 'Khác'
};

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await patientService.getListPatient();
            setPatients(data);
        } catch (error) {
            alert(error.message || 'Không thể tải danh sách bệnh nhân!');
        }
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa bệnh nhân ID: ${id}?`)) {
            try {
                await patientService.deletePatient(id);
                await fetchPatients();
            } catch (error) {
                alert(error.message || 'Xóa bệnh nhân thất bại!');
            }
        }
    };

    const handleAdd = () => {
        setSelectedPatient(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleUpdate = (patient) => {
        setSelectedPatient(patient);
        setModalMode('update');
        setModalOpen(true);
    };

    const handleView = (patient) => {
        setSelectedPatient(patient);
        setModalMode('view');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPatient(null);
    };

    const handleSaveCreateModal = async (patientData) => {
        try {
            await patientService.createPatient(patientData);
            await fetchPatients();
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Tạo bệnh nhân thất bại!');
        }
    };

    const handleSaveUpdateModal = async (patientData) => {
        try {
            await patientService.updatePatient(patientData.id, patientData);
            await fetchPatients();
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Cập nhật bệnh nhân thất bại!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Danh sách bệnh nhân</h2>
                <button style={styles.addButton} onClick={handleAdd}>Thêm bệnh nhân</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Họ và tên</th>
                        <th style={styles.th}>Tuổi</th>
                        <th style={styles.th}>Ngày sinh</th>
                        <th style={styles.th}>Giới tính</th>
                        <th style={styles.th}>SĐT</th>
                        <th style={styles.th}>Địa chỉ</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((p) => (
                        <tr key={p.id} style={styles.tr}>
                            <td style={styles.td}>{p.id}</td>
                            <td style={styles.td}>{p.last_name} {p.first_name}</td>
                            <td style={styles.td}>{calculateAge(p.dob)}</td>
                            <td style={styles.td}>{p.dob}</td>
                            <td style={styles.td}>{GENDER_LABELS[p.gender] || p.gender}</td>
                            <td style={styles.td}>{p.phone_number}</td>
                            <td style={styles.td}>{p.address}</td>
                            <td style={styles.td}>
                                <button style={styles.viewButton} onClick={() => handleView(p)}>Xem</button>
                                <button style={styles.editButton} onClick={() => handleUpdate(p)}>Sửa</button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(p.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PatientModal
                isOpen={modalOpen}
                mode={modalMode}
                patientData={selectedPatient}
                onClose={handleCloseModal}
                onSaveCreate={handleSaveCreateModal}
                onSaveUpdate={handleSaveUpdateModal}
            />
        </div>
    );
};

export default PatientManagement;

const baseActionButton = {
    marginRight: '6px',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
};

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
    viewButton: {
        ...baseActionButton,
        backgroundColor: '#27ae60',
    },
    editButton: {
        ...baseActionButton,
        backgroundColor: '#3498db',
    },
    deleteButton: {
        ...baseActionButton,
        backgroundColor: '#e74c3c',
    },
};