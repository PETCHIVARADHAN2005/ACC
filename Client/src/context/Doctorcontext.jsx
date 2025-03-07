import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('doctor-token') || null);

    const logout = () => {
        localStorage.removeItem('doctor-token');
        setToken(null);
    };

    const value = {
        token,
        setToken,
        backendUrl,
        logout
    };


    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
