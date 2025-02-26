import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('doctor-token') || null);
    // const [doctorData, setDoctorData] = useState(null);

    // const loadDoctorProfile = async () => {
    //     try {
    //         const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
            
    //         if (data.success) {
    //             setDoctorData(data.doctor);
    //         } else {
    //             toast.error(data.error);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.response?.data?.error || 'Failed to load profile');
    //     }
    // };

    const logout = () => {
        localStorage.removeItem('doctor-token');
        setToken(null);
        // setDoctorData(null);
    };

    const value = {
        token,
        setToken,
        //doctorData,
        //setDoctorData,
        backendUrl,
        //loadDoctorProfile,
        logout
    };

    // useEffect(() => {
    //     if (token) {
    //         loadDoctorProfile();
    //     } else {
    //         setDoctorData(null);
    //     }
    // }, [token]);

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
