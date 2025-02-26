import React, { useState } from "react";
import AddDoctor from "./AddDoctor";


function AdminPage() {
    const [activeView, setActiveView] = useState(null);

    const menuItems = [
        { id: 'add_doctor', label: 'Add Doctor' },
        { id: 'view_appointments', label: 'View Appointments' },
        { id: 'view_doctors', label: 'View Doctors' }
    ];



    return (
        <div className="admin_page">
            <div className="admin_header">
                <img src="/path-to-your-logo.png" alt="logo" />
                <h1>Aruna Cardiac Care</h1>
                <button>Admin</button>
            </div>

            <div className="admin_page_container">
                <div className="admin_menu">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={activeView === item.id ? 'active' : ''}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="admin_page_container_view">
                    {activeView === 'add_doctor' && <AddDoctor />}
                    {activeView === 'view_appointments' && <div>Appointments View</div>}
                    {activeView === 'view_doctors' && <div>Doctors View</div>}
                    {!activeView && <div>Welcome to Admin Dashboard</div>}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;



