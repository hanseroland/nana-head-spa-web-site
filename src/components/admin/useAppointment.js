import { useState, useEffect } from 'react';
import { GetAllAppointmentsForAdmin } from '@/apiCalls/appointments';


export const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllAppointmentsForAdmin();
            if (response.success) {
                const formattedAppointments = response?.data.map(app => ({
                    ...app,
                    id: app._id,
                    clientName: app.client ? `${app.client.firstName} ${app.client.lastName}` : 'N/A',
                    formulaTitle: app.formula ? app.formula.title : 'N/A',
                    adminNotes: app.adminNotes || '',
                    processedBy: app.processedBy ? {
                        firstName: app.processedBy.firstName,
                        lastName: app.processedBy.lastName
                    } : null,
                }));
                setAppointments(formattedAppointments);
            } else {
                setError(response.message || "Erreur lors du chargement des rendez-vous.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des rendez-vous admin:", err);
            setError("Impossible de se connecter au serveur pour récupérer les rendez-vous.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateAppointmentInState = (updatedAppointment) => {
        setAppointments(prev =>
            prev.map(app => (app.id === updatedAppointment.id ? updatedAppointment : app))
        );
    };

    return { appointments, loading, setLoading, error, fetchAppointments, updateAppointmentInState };
};