import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/DoctorProfile.css";
import { DoctorContext } from "../../context/Doctorcontext";


const DoctorProfile = () => {
  const { token } = useContext(DoctorContext);
  const [activeView, setActiveView] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  
  // Modal state for editing items
  const [showModal, setShowModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editType, setEditType] = useState(""); // "qualification", "specialization", or "experience"

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
      current_address_line: ""
    },
    qualifications: [{
      id: Date.now(),
      degree: "",
      university: "",
      year: ""
    }],
    specializations: [{
      id: Date.now(),
      specialization_name: "",
      description: "",
      certificate: ""
    }],
    experiences: [{
      id: Date.now(),
      institution: "",
      position: "",
      start_year: "",
      end_year: ""
    }],
    registration: {
      registration_number: "",
      medical_council: "",
      registration_year: "",
    }
  });

  // Fetch initial data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/doctor/profile",
          {
            headers: { Authorization: Bearer ${token} },
          }
        );
        console.log(response.data);
        
        // Ensure each item has an ID
        const data = response.data;
        if (data.qualifications) {
          data.qualifications = data.qualifications.map(q => q.id ? q : {...q, id: Date.now() + Math.random()});
        }
        if (data.specializations) {
          data.specializations = data.specializations.map(s => s.id ? s : {...s, id: Date.now() + Math.random()});
        }
        if (data.experiences) {
          data.experiences = data.experiences.map(e => e.id ? e : {...e, id: Date.now() + Math.random()});
        }
        
        setDoctorData(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctorData();
  }, [token]);

  // Handle form submission for the whole profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const token = localStorage.getItem("doctor-token");
        const formData = new FormData();

        // Append all sections as JSON strings
        formData.append("personal", JSON.stringify(doctorData.personal));
        formData.append("qualifications", JSON.stringify(doctorData.qualifications));
        formData.append("specializations", JSON.stringify(doctorData.specializations));
        formData.append("experiences", JSON.stringify(doctorData.experiences));
        formData.append("registration", JSON.stringify(doctorData.registration));

        // If there's a new profile image
        if (doctorData.personal.profile_image instanceof File) {
          formData.append("profileImage", doctorData.personal.profile_image);
        }

        await axios.put('http://localhost:4000/api/doctor/update-doctor', formData, {
          headers: {
            Authorization: Bearer ${token},
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Successfully updated profile");

        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  // Handle input changes for personal info
  const handlePersonalChange = (field, value) => {
    setDoctorData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  // Handle file upload for profile image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDoctorData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          profile_image: file,
        },
      }));
    }
  };

  // Menu items
  const menuItems = [
    { id: "personal", label: "Personal Info" },
    { id: "qualifications", label: "Qualifications" },
    { id: "specializations", label: "Specializations" },
    { id: "experience", label: "Experience" },
    { id: "registration", label: "Medical Registration" },
  ];

  // Open edit modal for an item
  const openEditModal = (type, item) => {
    setEditType(type);
    setCurrentEditItem({...item});
    setShowModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowModal(false);
    setCurrentEditItem(null);
  };

  // Save edited item
  const saveEditedItem = () => {
    if (!currentEditItem) return;
    
    if (editType === "qualification") {
      setDoctorData(prev => ({
        ...prev,
        qualifications: prev.qualifications.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        )
      }));
    } else if (editType === "specialization") {
      setDoctorData(prev => ({
        ...prev,
        specializations: prev.specializations.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        )
      }));
    } else if (editType === "experience") {
      setDoctorData(prev => ({
        ...prev,
        experiences: prev.experiences.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        )
      }));
    }
    
    closeEditModal();
  };

  // Handle edit input changes
  const handleEditChange = (field, value) => {
    setCurrentEditItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new item functions
  const addQualification = () => {
    const newQualification = {
      id: Date.now(),
      degree: "",
      university: "",
      year: ""
    };
    setDoctorData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, newQualification]
    }));
    openEditModal("qualification", newQualification);
  };

  const addSpecialization = () => {
    const newSpecialization = {
      id: Date.now(),
      specialization_name: "",
      description: ""
    };
    setDoctorData(prev => ({
      ...prev,
      specializations: [...prev.specializations, newSpecialization]
    }));
    openEditModal("specialization", newSpecialization);
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      institution: "",
      position: "",
      start_year: "",
      end_year: ""
    };
    setDoctorData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
    openEditModal("experience", newExperience);
  };

  // Delete item functions
  const deleteQualification = (id) => {
    setDoctorData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(item => item.id !== id)
    }));
  };

  const deleteSpecialization = (id) => {
    setDoctorData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(item => item.id !== id)
    }));
  };

  const deleteExperience = (id) => {
    setDoctorData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(item => item.id !== id)
    }));
  };

  // Handle registration changes
  const handleRegistrationChange = (field, value) => {
    setDoctorData((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        [field]: value,
      },
    }));
  };

  // Render modal content based on edit type
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
            <div className="input-group">
              <label>Description</label>
              <textarea
                value={currentEditItem.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
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

  return (
    <>
      <div className="doctor_header">
        <img src="" alt="logo" />
        <h1>Aruna Cardiac Care</h1>
      </div>
      <div className="doctor_profile">
        <section className="doc_prof_sidebar">
          <div>
            <img src={doctorData.personal.profile_image} alt="Doctor_Image" />
            {isEditing && (
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
            )}
          </div>
          <h1>{${doctorData.personal.first_name} ${doctorData.personal.last_name}}</h1>
        </section>

        <form className="doc_up_form" onSubmit={handleSubmit}>
          <div className="update_doc_profile">
            <div className="update_button">
              {!isEditing ? (
                <button type="button" onClick={handleSubmit}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div className="profile_menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView(item.id);
                  }}
                  className={activeView === item.id ? "active" : ""}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="profile_content">
              
            {activeView === "personal" && (
                <div className="doc_details_con">
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
                          onChange={(e) =>
                            handlePersonalChange("first_name", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="simple_flex">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={doctorData.personal.last_name}
                          onChange={(e) =>
                            handlePersonalChange("last_name", e.target.value)
                          }
                          disabled={!isEditing}
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
                              onChange={(e) =>
                                handlePersonalChange("gender", e.target.value)
                              }
                              disabled={!isEditing}
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
                        value={doctorData.personal.dob.split("T")[0]}
                        onChange={(e) =>
                          handlePersonalChange("dob", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="blood_group">Blood Group</label>
                      <input
                        type="text"
                        id="blood_group"
                        value={doctorData.personal.blood_group}
                        onChange={(e) =>
                          handlePersonalChange("blood_group", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="aadhar_number">Aadhar Number</label>
                      <input
                        type="text"
                        id="aadhar_number"
                        value={doctorData.personal.aadhar_number}
                        onChange={(e) =>
                          handlePersonalChange("aadhar_number", e.target.value)
                        }
                        disabled={!isEditing}
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
                        value={doctorData.personal.phone_number}
                        onChange={(e) =>
                          handlePersonalChange("phone_number", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="emergency_phone">
                        Emergency Contact Number
                      </label>
                      <input
                        type="text"
                        id="emergency_phone"
                        value={doctorData.personal.emergency_phone}
                        onChange={(e) =>
                          handlePersonalChange("emergency_phone", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="personal_email">Personal Email Id</label>
                      <input
                        type="email"
                        id="personal_email"
                        value={doctorData.personal.personal_email}
                        onChange={(e) =>
                          handlePersonalChange("personal_email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="emergency_email">Official Email Id</label>
                      <input
                        type="email"
                        id="emergency_email"
                        value={doctorData.personal.emergency_email}
                        onChange={(e) =>
                          handlePersonalChange("emergency_email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Continue with Address sections similarly */}
                  {/* Permanent Address */}
                  <div className="details_section">
                    <h3>Permanent Address</h3>
                    <div className="simple_flex">
                      <label htmlFor="permanent_address_country">Country</label>
                      <select
                        id="permanent_address_country"
                        name="permanent_address_country"
                        value={doctorData.personal.permanent_address_country}
                        onChange={(e) =>
                          handlePersonalChange(
                            "permanent_address_country",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="permanent_address_state">State</label>
                      <select
                        id="permanent_address_state"
                        name="permanent_address_state"
                        value={doctorData.personal.permanent_address_state}
                        onChange={(e) =>
                          handlePersonalChange(
                            "permanent_address_state",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <option value="">Select State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="permanent_address_district">
                        District
                      </label>
                      <select
                        id="permanent_address_district"
                        name="permanent_address_district"
                        value={doctorData.personal.permanent_address_district}
                        onChange={(e) =>
                          handlePersonalChange(
                            "permanent_address_district",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
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
                        name="permanent_address_pincode"
                        value={doctorData.personal.permanent_address_pincode}
                        onChange={(e) =>
                          handlePersonalChange(
                            "permanent_address_pincode",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="permanent_address_line">Address</label>
                      <input
                        type="text"
                        id="permanent_address_line"
                        name="permanent_address_line"
                        value={doctorData.personal.permanent_address_line}
                        onChange={(e) =>
                          handlePersonalChange(
                            "permanent_address_line",
                            e.target.value
                          )
                        }
                        placeholder="Door No , Street Name , Town"
                        disabled={!isEditing}
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
                        name="current_address_country"
                        value={doctorData.personal.current_address_country}
                        onChange={(e) =>
                          handlePersonalChange(
                            "current_address_country",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="current_address_state">State</label>
                      <select
                        id="current_address_state"
                        name="current_address_state"
                        value={doctorData.personal.current_address_state}
                        onChange={(e) =>
                          handlePersonalChange(
                            "current_address_state",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <option value="">Select State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="current_address_district">District</label>
                      <select
                        id="current_address_district"
                        name="current_address_district"
                        value={doctorData.personal.current_address_district}
                        onChange={(e) =>
                          handlePersonalChange(
                            "current_address_district",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
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
                        name="current_address_pincode"
                        value={doctorData.personal.current_address_pincode}
                        onChange={(e) =>
                          handlePersonalChange(
                            "current_address_pincode",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="simple_flex">
                      <label htmlFor="current_address_line">Address</label>
                      <input
                        type="text"
                        id="current_address_line"
                        name="current_address_line"
                        value={doctorData.personal.current_address_line}
                        onChange={(e) =>
                          handlePersonalChange(
                            "current_address_line",
                            e.target.value
                          )
                        }
                        placeholder="Door No , Street Name , Town"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPDATED QUALIFICATIONS SECTION */}
              {activeView === "qualifications" && (
                <div className="table-container">
                  <div className="section-header">
                    <h2>Qualifications</h2>
                    <button
                      type="button"
                      onClick={addQualification}
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
                        <tr key={qual.id}>
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
                              onClick={() => deleteQualification(qual.id)}
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

              {/* UPDATED SPECIALIZATIONS SECTION */}
              {activeView === "specializations" && (
                <div className="table-container">
                  <div className="section-header">
                    <h2>Specializations</h2>
                    <button
                      type="button"
                      onClick={addSpecialization}
                      className="add-button"
                    >
                      + Add Specialization
                    </button>
                  </div>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Specialization</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorData.specializations.map((spec) => (
                        <tr key={spec.id}>
                          <td>{spec.specialization_name}</td>
                          <td>{spec.description}</td>
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
                              onClick={() => deleteSpecialization(spec.id)}
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

              {/* UPDATED EXPERIENCES SECTION */}
              {activeView === "experience" && (
                <div className="table-container">
                  <div className="section-header">
                    <h2>Experiences</h2>
                    <button
                      type="button"
                      onClick={addExperience}
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
                        <th>Start Year</th>
                        <th>End Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorData.experiences.map((exp) => (
                        <tr key={exp.id}>
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
                              onClick={() => deleteExperience(exp.id)}
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
                  </div>
                  <div className="cards-container">
                    <div className="form-card">
                      <div className="card-header">
                        <h3>Registration Details</h3>
                      </div>
                      <div className="card-content">
                        <div className="input-group">
                          <label>Registration Number</label>
                          <input
                            type="text"
                            value={
                              doctorData.registration.registration_number || ""
                            }
                            onChange={(e) =>
                              setDoctorData((prev) => ({
                                ...prev,
                                registration: {
                                  ...prev.registration,
                                  registration_number: e.target.value,
                                },
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="input-group">
                          <label>Medical Council</label>
                          <input
                            type="text"
                            value={
                              doctorData.registration.medical_council || ""
                            }
                            onChange={(e) =>
                              setDoctorData((prev) => ({
                                ...prev,
                                registration: {
                                  ...prev.registration,
                                  medical_council: e.target.value,
                                },
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="input-group">
                          <label>Registration Year</label>
                          <input
                            type="number"
                            value={
                              doctorData.registration.registration_year || ""
                            }
                            onChange={(e) =>
                              setDoctorData((prev) => ({
                                ...prev,
                                registration: {
                                  ...prev.registration,
                                  registration_year: e.target.value,
                                },
                              }))
                            }
                            disabled={!isEditing}
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

      {/* Modal for editing items */}
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