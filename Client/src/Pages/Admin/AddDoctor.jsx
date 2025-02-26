// AddDoctor.jsx
import { useState } from "react";
import '../../styles/adminaddDoctor.css';

function AddDoctor() {
    const [formData, setFormData] = useState({
        name: "",
        doctorId: "",
        dateOfBirth: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="add_doc_con">
            <form className="add_doc" onSubmit={handleSubmit}>
                <h1>Add Doctor</h1>
                
                <div>
                    <label htmlFor="name">Doctor Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="doctorId">Doctor ID</label>
                    <input 
                        type="text" 
                        id="doctorId" 
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input 
                        type="date" 
                        id="dateOfBirth" 
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Add Doctor</button>
            </form>
        </div>
    );
}

export default AddDoctor;