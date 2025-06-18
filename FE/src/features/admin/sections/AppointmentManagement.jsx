import React, { useState, useEffect } from 'react';
import appointmentService from '../../../services/appointmentService';
import doctorService from '../../../services/doctorService';
import patientService from '../../../services/patientService';

import AppointmentModal from './AppointmentModal.jsx';
import DoctorModal from './DoctorModal.jsx';
import PatientModal from './PatientModal.jsx';

const STATUS_LABELS = {
    Requested: 'Đã yêu cầu',
    Confirmed: 'Đã xác nhận',
    Completed: 'Đã hoàn thành',
    CanceledByPatient: 'Đã hủy bởi bệnh nhân',
    CanceledByDoctor: 'Đã hủy bởi bác sĩ',
};

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [modalDoctorOpen, setModaDoctorlOpen] = useState(false);
    const [modalDoctorMode, setModalDoctorMode] = useState('view');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [modalPatientOpen, setModaPatientlOpen] = useState(false);
    const [modalPatientMode, setModalPatientMode] = useState('view');
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getListAppointments();
            setAppointments(data);
        } catch (error) {
            alert(error.message || 'Không thể tải danh sách lịch hẹn!');
        }
    };

    const fetchDoctors = async () => {
        try {
            const doctors = await doctorService.getListDoctor();
            setDoctors(doctors);
        } catch (error) {
            alert(error.message || 'Không thể tải danh sách bác sĩ!');
        }
    };

    const fetchPatients = async () => {
        try {
            const patients = await patientService.getListPatient();
            setPatients(patients);
        } catch (error) {
            alert(error.message || 'Không thể tải danh sách bệnh nhân!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa lịch hẹn ID: ${id}?`)) {
            try {
                await appointmentService.deleteAppointment(id);
                await fetchAppointments();
            } catch (error) {
                alert(error.message || 'Xóa lịch hẹn thất bại!');
            }
        }
    };

    const handleAdd = () => {
        setSelectedAppointment(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleUpdate = (appointment) => {
        setSelectedAppointment(appointment);
        setModalMode('update');
        setModalOpen(true);
    };

    const handleView = (appointment) => {
        setSelectedAppointment(appointment);
        setModalMode('view');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAppointment(null);
        setModaDoctorlOpen(false);
        setSelectedDoctor(null);
        setModaPatientlOpen(false);
        setSelectedPatient(null);
    };

    const handleSaveCreateModal = async (appointmentData) => {
        try {
            await appointmentService.createAppointment(appointmentData);
            await fetchAppointments();
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Tạo lịch hẹn thất bại!');
        }
    };

    const handleSaveUpdateModal = async (appointmentData) => {
        try {
            await appointmentService.updateAppointment(appointmentData.id, appointmentData);
            await fetchAppointments();
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Cập nhật lịch hẹn thất bại!');
        }
    };

    // Format thời gian hiển thị
    const formatDateTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    };

    // Hiển thị tên bác sĩ
    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(d => d.id === doctorId);
        return doctor ? `${doctor.last_name} ${doctor.first_name}` : 'Không xác định';
    };

    // Mở modal xem thông tin bác sĩ
    const handleViewDoctor = (doctorId) => {
        const doctor = doctors.find(d => d.id === doctorId);
        if (doctor) {
            setSelectedDoctor(doctor);
            setModalDoctorMode('view');
            setModaDoctorlOpen(true);
        } else {
            alert('Bác sĩ không tồn tại!');
        }
    };

    // Hiển thị tên bệnh nhân
    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? `${patient.last_name} ${patient.first_name}` : 'Không xác định';
    };

    // Mở modal xem thông tin bệnh nhân
    const handleViewPatient = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            setSelectedPatient(patient);
            setModalPatientMode('view');
            setModaPatientlOpen(true);
        } else {
            alert('Bệnh nhân không tồn tại!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Danh sách lịch hẹn</h2>
                <button style={styles.addButton} onClick={handleAdd}>Thêm lịch hẹn</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Thời gian</th>
                        <th style={styles.th}>Thời lượng (phút)</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Bệnh nhân</th>
                        <th style={styles.th}>Bác sĩ</th>
                        <th style={styles.th}>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.id}</td>
                            <td style={styles.td}>{formatDateTime(a.scheduled_time)}</td>
                            <td style={styles.td}>{a.duration_minutes}</td>
                            <td style={styles.td}>{STATUS_LABELS[a.status] || a.status}</td>
                            <td style={styles.td} onClick={() => { handleViewPatient(a.patient) }}>{getPatientName(a.patient)}</td>
                            <td style={styles.td} onClick={() => { handleViewDoctor(a.doctor) }}>{getDoctorName(a.doctor)}</td>
                            <td style={styles.td}>
                                <button style={styles.viewButton} onClick={() => handleView(a)}>Xem</button>
                                <button style={styles.editButton} onClick={() => handleUpdate(a)}>Sửa</button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(a.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AppointmentModal
                isOpen={modalOpen}
                mode={modalMode}
                appointmentData={selectedAppointment}
                onClose={handleCloseModal}
                onSaveCreate={handleSaveCreateModal}
                onSaveUpdate={handleSaveUpdateModal}
            />

            <DoctorModal
                isOpen={modalDoctorOpen}
                mode={modalDoctorMode}
                doctorData={selectedDoctor}
                onClose={handleCloseModal}
                onSaveCreate={() => { }}
                onSaveUpdate={() => { }}
            />

            <PatientModal
                isOpen={modalPatientOpen}
                mode={modalPatientMode}
                patientData={selectedPatient}
                onClose={handleCloseModal}
                onSaveCreate={() => { }}
                onSaveUpdate={() => { }}
            />
        </div >
    );
};

export default AppointmentManagement;

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
