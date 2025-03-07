
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/DoctorProfile.css";
import { DoctorContext } from "../../context/Doctorcontext";
import { useNavigate} from "react-router-dom";

const DoctorProfile = () => {
  const { token } = useContext(DoctorContext);
  const [activeView, setActiveView] = useState("personal");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editType, setEditType] = useState("");
  const navigate = useNavigate();
    // Menu items
    const menuItems = [
      { id: "personal", label: "Personal Info" },
      { id: "qualifications", label: "Qualifications" },
      { id: "specializations", label: "Specializations" },
      { id: "experience", label: "Experience" },
      { id: "registration", label: "Medical Registration" },
    ];
  const [doctorData, setDoctorData] = useState({
    personal: {
      first_name: "",
      last_name: "",
      gender: "",
      dob: "",
      blood_group: "",
      aadhar_number: "",
      phone_number: "",
      emergency_phone: "",
      personal_email: "",
      emergency_email: "",
      profile_image: "",
      permanent_address_country: "",
      permanent_address_state: "",
      permanent_address_district: "",
      permanent_address_pincode: "",
      permanent_address_line: "",
      current_address_country: "",
      current_address_state: "",
      current_address_district: "",
      current_address_pincode: "",
      current_address_line: "",
    },
    qualifications: [],
    specializations: [],
    experiences: [],
    registration: {
      registration_number: "",
      medical_council: "",
      registration_year: "",
    },
  });

  // Fetch initial data
  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/doctor/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(response.data.success){
        response.data.registration.flag=1;
      }
      setDoctorData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error in get profile", error);
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [token]);

  // Personal Info Handlers
  const handlePersonalSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(doctorData.personal).forEach(key => {
        if (key === 'profile_image' && doctorData.personal[key] instanceof File) {
          formData.append('profileImage', doctorData.personal[key]);
        } else {
          formData.append(key, doctorData.personal[key]);
        }
      });

      const response = await axios.put(
        "http://localhost:4000/api/doctor/update-personal",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setEditingPersonal(false);
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
  };

  // Qualification Handlers
  const handleQualificationSubmit = async (qualificationData, qid) => {
    try {
      const response= qid
        ? await axios.put("http://localhost:4000/api/doctor/update-qualification", qualificationData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        : await axios.post("http://localhost:4000/api/doctor/add-qualification", qualificationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        closeEditModal();
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error with qualification:", error);
    }
  };

  // Specialization Handlers
  const handleSpecializationSubmit = async (specializationData, sid) => {
    try {
      const response= sid
        ? await axios.put("http://localhost:4000/api/doctor/update-specialization", specializationData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        : await axios.post("http://localhost:4000/api/doctor/add-specialization", specializationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
     

      if (response.data.success) {
        closeEditModal();
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error with specialization:", error);
    }
  };

  // Experience Handlers
  const handleExperienceSubmit = async (experienceData, eid) => {
    try {
      const response= eid 
      ? await axios.put("http://localhost:4000/api/doctor/update-experience", experienceData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      : await axios.post("http://localhost:4000/api/doctor/add-experience", experienceData, {
      headers: { Authorization: `Bearer ${token}` }
    });

      if (response.data.success) {
        closeEditModal();
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error with experience:", error);
    }
  };

  // Registration Handlers
  const handleRegistrationSubmit = async () => {
    try {
      
      const response = doctorData.registration.registration_id==null ? await axios.post("http://localhost:4000/api/doctor/add-registration", {
        registration: doctorData.registration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }):
      await axios.put("http://localhost:4000/api/doctor/update-registration", {
        registration: doctorData.registration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setEditingRegistration(false);
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error with registration:", error);
    }
  };

  // Delete Handlers
  const handleDeleteQualification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/doctor/delete-qualification/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error deleting qualification:", error);
    }
  };

  const handleDeleteSpecialization = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/doctor/delete-specialization/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error deleting specialization:", error);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/doctor/delete-experience/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  // Modal Handlers
  const openEditModal = (type, item) => {
    setEditType(type);
    setCurrentEditItem({ ...item });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setCurrentEditItem(null);
  };

  const handleEditChange = (field, value) => {
    setCurrentEditItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add New Item Handlers
  const addNewQualification = () => {
    const newQualification = {
      degree: "",
      university: "",
      year: ""
    };
    openEditModal("qualification", newQualification);
  };

  const addNewSpecialization = () => {
    const newSpecialization = {
      specialization_name: ""
    };
    openEditModal("specialization", newSpecialization);
  };

  const addNewExperience = () => {
    const newExperience = {
     institution: "",
      position: "",
      start_year: "",
      end_year: ""
    };
    openEditModal("experience", newExperience);
  };

  // Save Modal Changes
  const saveEditedItem = async () => {
    if (!currentEditItem) return;

    try {
      switch (editType) {
        case "qualification":
          await handleQualificationSubmit(currentEditItem,currentEditItem.qualification_id ? true : false);
          break;
        case "specialization":
          await handleSpecializationSubmit(currentEditItem, currentEditItem.specialization_id ? true : false);
          break;
        case "experience":
          await handleExperienceSubmit(currentEditItem, currentEditItem.experience_id ? true : false);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };
  // const saveEditedItem = async () => {
  //   if (!currentEditItem) return;
  //   try {
  //     switch (editType) {
  //       case "qualification":
  //         await handleQualificationSubmit(currentEditItem, currentEditItem.id ? true : false);
  //         break;
  //       case "specialization":
  //         await handleSpecializationSubmit(currentEditItem, currentEditItem.id ? true : false);
  //         break;
  //       case "experience":
  //         await handleExperienceSubmit(currentEditItem, currentEditItem.id ? true : false);
  //         break;
  //     }
  //   } catch (error) {
  //     console.error("Error saving item:", error);
  //   }
  // };
  // For editing existing items
// const saveEditedItem = async () => {
//   if (!currentEditItem) return;
//   try {
//     const method = currentEditItem.id ? 'put' : 'post';
//     const endpoint = `http://localhost:4000/api/doctor/${method === 'put' ? 'update' : 'add'}-${editType}`;
    
//     const response = await axios[method](endpoint, currentEditItem, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (response.data.success) {
//       closeEditModal();
//       fetchDoctorProfile();
//     }
//   } catch (error) {
//     console.error(`Error saving ${editType}:`, error);
//   }
// };
  
  // Add these before return statement

const handlePersonalDataChange = (field, value) => {
  setDoctorData(prev => ({
    ...prev,
    personal: {
      ...prev.personal,
      [field]: value
    }
  }));
};

const handleRegistrationDataChange = (field, value) => {
  setDoctorData(prev => ({
    ...prev,
    registration: {
      ...prev.registration,
      [field]: value
    }
  }));
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setDoctorData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        profile_image: file
      }
    }));
  }
};


const renderModalContent = () => {
  if (!currentEditItem) return null;

  switch (editType) {
    case "qualification":
      return (
        <div className="modal-content">
          <h2>Edit Qualification</h2>
          <div className="input-group">
            <label>Degree</label>
            <input
              type="text"
              value={currentEditItem.degree || ""}
              onChange={(e) => handleEditChange("degree", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>University</label>
            <input
              type="text"
              value={currentEditItem.university || ""}
              onChange={(e) => handleEditChange("university", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Year</label>
            <input
              type="number"
              value={currentEditItem.year || ""}
              onChange={(e) => handleEditChange("year", e.target.value)}
            />
          </div>
        </div>
      );
    case "specialization":
      return (
        <div className="modal-content">
          <h2>Edit Specialization</h2>
          <div className="input-group">
            <label>Specialization Name</label>
            <input
              type="text"
              value={currentEditItem.specialization_name || ""}
              onChange={(e) => handleEditChange("specialization_name", e.target.value)}
            />
          </div>
          
        </div>
      );
    case "experience":
      return (
        <div className="modal-content">
          <h2>Edit Experience</h2>
          <div className="input-group">
            <label>Institution</label>
            <input
              type="text"
              value={currentEditItem.institution || ""}
              onChange={(e) => handleEditChange("institution", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Position</label>
            <input
              type="text"
              value={currentEditItem.position || ""}
              onChange={(e) => handleEditChange("position", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Start Year</label>
            <input
              type="number"
              value={currentEditItem.start_year || ""}
              onChange={(e) => handleEditChange("start_year", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>End Year</label>
            <input
              type="number"
              value={currentEditItem.end_year || ""}
              onChange={(e) => handleEditChange("end_year", e.target.value)}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const handleViewChange = (view) => {
  setActiveView(view);
  setEditingPersonal(false);
  setEditingRegistration(false);
  setShowModal(false);
};
const backtohome=()=>{
  navigate('/Home')
}
return (
  <>
    <div className="doctor_header">
      <img src="../../../public/images/logo.png" alt="logo" />
      <h1>Aruna Cardiac Care</h1>
      <button onClick={backtohome} className="home-button">Home</button>
    </div>
    <div className="doctor_profile">
      <section className="doc_prof_sidebar">
        <div>
          <img 
            src={doctorData.personal.profile_image} 
            alt="Doctor_Image" 
          />
          {editingPersonal && (
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          )}
        </div>
        <h1>{`${doctorData.personal.first_name} ${doctorData.personal.last_name}`}</h1>
      </section>

      <form className="doc_up_form">
        <div className="update_doc_profile">
          <div className="profile_menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleViewChange(item.id);
                }}
                className={activeView === item.id ? "active" : ""}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="profile_content">
            {/* Personal Information Section */}
            {activeView === "personal" && (
              <div className="doc_details_con">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <div className="section-controls">
                    {!editingPersonal ? (
                      <button
                        type="button"
                        onClick={() => setEditingPersonal(true)}
                        className="edit-button"
                      >
                        Edit Personal Info
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handlePersonalSubmit}
                          className="save-button"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPersonal(false)}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Basic Details */}
                <div className="details_section">
                  <h3>Basic Details</h3>
                  <div className="flex_input">
                    <div className="simple_flex">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={doctorData.personal.first_name}
                        onChange={(e) => handlePersonalDataChange("first_name", e.target.value)}
                        disabled={!editingPersonal}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={doctorData.personal.last_name}
                        onChange={(e) => handlePersonalDataChange("last_name", e.target.value)}
                        disabled={!editingPersonal}
                      />
                    </div>
                  </div>
                  <div className="radio_flex">
                    <label>Gender</label>
                    <div className="radio_flex-in">
                      {["male", "female", "other"].map((gender) => (
                        <div key={gender}>
                          <input
                            type="radio"
                            id={gender}
                            name="gender"
                            value={gender}
                            checked={doctorData.personal.gender === gender}
                            onChange={(e) => handlePersonalDataChange("gender", e.target.value)}
                            disabled={!editingPersonal}
                          />
                          <label htmlFor={gender}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="DOB">Date of Birth</label>
                    <input
                      type="date"
                      id="DOB"
                      value={doctorData.personal.dob && doctorData.personal.dob.split("T")[0] || " "}
                      onChange={(e) => handlePersonalDataChange("dob", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="blood_group">Blood Group</label>
                    <input
                      type="text"
                      id="blood_group"
                      value={doctorData.personal.blood_group|| " "}
                      onChange={(e) => handlePersonalDataChange("blood_group", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="aadhar_number">Aadhar Number</label>
                    <input
                      type="text"
                      id="aadhar_number"
                      value={doctorData.personal.aadhar_number||" "}
                      onChange={(e) => handlePersonalDataChange("aadhar_number", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="details_section">
                  <h3>Contact Information</h3>
                  <div className="simple_flex">
                    <label htmlFor="phone_number">Contact Number</label>
                    <input
                      type="text"
                      id="phone_number"
                      value={doctorData.personal.phone_number||" "}
                      onChange={(e) => handlePersonalDataChange("phone_number", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="emergency_phone">Emergency Contact Number</label>
                    <input
                      type="text"
                      id="emergency_phone"
                      value={doctorData.personal.emergency_phone||" "}
                      onChange={(e) => handlePersonalDataChange("emergency_phone", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="personal_email">Personal Email Id</label>
                    <input
                      type="email"
                      id="personal_email"
                      value={doctorData.personal.personal_email||" "}
                      onChange={(e) => handlePersonalDataChange("personal_email", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="emergency_email">Official Email Id</label>
                    <input
                      type="email"
                      id="emergency_email"
                      value={doctorData.personal.emergency_email||" "}
                      onChange={(e) => handlePersonalDataChange("emergency_email", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="details_section">
                  <h3>Permanent Address</h3>
                  <div className="simple_flex">
                    <label htmlFor="permanent_address_country">Country</label>
                    <select
                      id="permanent_address_country"
                      value={doctorData.personal.permanent_address_country||" "}
                      onChange={(e) => handlePersonalDataChange("permanent_address_country", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="permanent_address_state">State</label>
                    <select
                      id="permanent_address_state"
                      value={doctorData.personal.permanent_address_state||" "}
                      onChange={(e) => handlePersonalDataChange("permanent_address_state", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select State</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="permanent_address_district">District</label>
                    <select
                      id="permanent_address_district"
                      value={doctorData.personal.permanent_address_district||" "}
                      onChange={(e) => handlePersonalDataChange("permanent_address_district", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select District</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="permanent_address_pincode">Pincode</label>
                    <input
                      type="text"
                      id="permanent_address_pincode"
                      value={doctorData.personal.permanent_address_pincode||" "}
                      onChange={(e) => handlePersonalDataChange("permanent_address_pincode", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="permanent_address_line">Address</label>
                    <input
                      type="text"
                      id="permanent_address_line"
                      value={doctorData.personal.permanent_address_line||" "}
                      onChange={(e) => handlePersonalDataChange("permanent_address_line", e.target.value)}
                      placeholder="Door No , Street Name , Town"
                      disabled={!editingPersonal}
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="details_section">
                  <h3>Current Address</h3>
                  <div className="simple_flex">
                    <label htmlFor="current_address_country">Country</label>
                    <select
                      id="current_address_country"
                      value={doctorData.personal.current_address_country||" "}
                      onChange={(e) => handlePersonalDataChange("current_address_country", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="current_address_state">State</label>
                    <select
                      id="current_address_state"
                      value={doctorData.personal.current_address_state||" "}
                      onChange={(e) => handlePersonalDataChange("current_address_state", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select State</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="current_address_district">District</label>
                    <select
                      id="current_address_district"
                      value={doctorData.personal.current_address_district||" "}
                      onChange={(e) => handlePersonalDataChange("current_address_district", e.target.value)}
                      disabled={!editingPersonal}
                    >
                      <option value="">Select District</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="current_address_pincode">Pincode</label>
                    <input
                      type="text"
                      id="current_address_pincode"
                      value={doctorData.personal.current_address_pincode||" "}
                      onChange={(e) => handlePersonalDataChange("current_address_pincode", e.target.value)}
                      disabled={!editingPersonal}
                    />
                  </div>
                  <div className="simple_flex">
                    <label htmlFor="current_address_line">Address</label>
                    <input
                      type="text"
                      id="current_address_line"
                      value={doctorData.personal.current_address_line||" "}
                      onChange={(e) => handlePersonalDataChange("current_address_line", e.target.value)}
                      placeholder="Door No , Street Name , Town"
                      disabled={!editingPersonal}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Qualifications Section */}
            {activeView === "qualifications" && (
              <div className="table-container">
                <div className="section-header">
                  <h2>Qualifications</h2>
                  <button
                    type="button"
                    onClick={addNewQualification}
                    className="add-button"
                  >
                    + Add Qualification
                  </button>
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Degree</th>
                      <th>University</th>
                      <th>Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorData.qualifications.map((qual) => (
                      <tr key={qual.qualification_id}>
                        <td>{qual.degree}</td>
                        <td>{qual.university}</td>
                        <td>{qual.year}</td>
                        <td className="action-buttons">
                          <button
                            type="button"
                            onClick={() => openEditModal("qualification", qual)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQualification(qual.qualification_id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Specializations Section */}
            {activeView === "specializations" && (
              <div className="table-container">
                <div className="section-header">
                  <h2>Specializations</h2>
                  <button
                    type="button"
                    onClick={addNewSpecialization}
                    className="add-button"
                  >
                    + Add Specialization
                  </button>
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Specialization</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorData.specializations.map((spec) => (
                      <tr key={spec.specialization_id}>
                        <td>{spec.specialization_name}</td>
                        <td className="action-buttons">
                            <button
                              type="button"
                              onClick={() => openEditModal("specialization", spec)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSpecialization(spec.specialization_id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Experiences Section */}
              {activeView === "experience" && (
                <div className="table-container">
                  <div className="section-header">
                    <h2>Experiences</h2>
                    <button
                      type="button"
                      onClick={addNewExperience}
                      className="add-button"
                    >
                      + Add Experience
                    </button>
                  </div>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Institution</th>
                        <th>Position</th>
                        <th>Start </th>
                        <th>End</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorData.experiences.map((exp) => (
                        <tr key={exp.experience_id}>
                          <td>{exp.institution}</td>
                          <td>{exp.position}</td>
                          <td>{exp.start_year}</td>
                          <td>{exp.end_year}</td>
                          <td className="action-buttons">
                            <button
                              type="button"
                              onClick={() => openEditModal("experience", exp)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.experience_id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Registration Section */}
              {activeView === "registration" && (
                <div className="registration-container">
                  <div className="section-header">
                    <h2>Medical Registration</h2>
                    <div className="section-controls">
                      {!editingRegistration ? (
                        <button
                          type="button"
                          onClick={() => setEditingRegistration(true)}
                          className="edit-button"
                        >
                          Edit Registration
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleRegistrationSubmit}
                            className="save-button"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRegistration(false)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="cards-container">
                    <div className="form-card">
                      <div className="card-content">
                        <div className="input-group">
                          <label>Registration Number</label>
                          <input
                            type="text"
                            value={doctorData.registration.registration_number || ""}
                            onChange={(e) => handleRegistrationDataChange("registration_number", e.target.value)}
                            disabled={!editingRegistration}
                          />
                        </div>
                        <div className="input-group">
                          <label>Medical Council</label>
                          <input
                            type="text"
                            value={doctorData.registration.medical_council || ""}
                            onChange={(e) => handleRegistrationDataChange("medical_council", e.target.value)}
                            disabled={!editingRegistration}
                          />
                        </div>
                        <div className="input-group">
                          <label>Registration Year</label>
                          <input
                            type="number"
                            value={doctorData.registration.registration_year || ""}
                            onChange={(e) => handleRegistrationDataChange("registration_year", e.target.value)}
                            disabled={!editingRegistration}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {renderModalContent()}
            <div className="modal-buttons">
              <button
                type="button"
                onClick={saveEditedItem}
                className="save-btn"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
};

export default DoctorProfile;
