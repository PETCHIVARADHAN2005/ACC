import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/DoctorProfile.css";
import { use } from "react";
import { DoctorContext } from "../../context/Doctorcontext";

const DoctorProfile = () => {
  const{token}=useContext(DoctorContext);
  const [activeView, setActiveView] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
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
      permanent_address_country:"",
      permanent_address_state:"",
      permanent_address_district:"",
      permanent_address_pincode:"",
      permanent_address_line:"",
      current_address_country:"",
      current_address_state:"", 
      current_address_district:"",
      current_address_pincode:"",
      current_address_line:""
    },
    qualifications: [{
      degree: "",
    university: "",
    year: ""
    }],
    specializations: [{
      specialization_name: "", 
    description: "",
    certificate: ""
    }],
    experiences: [{
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
        //const token = localStorage.getItem("doctor-token");
        
        const response = await axios.get(
          "http://localhost:4000/api/doctor/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          } 
        );
        console.log(response.data);
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctorData();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isEditing){
        try {
          const token = localStorage.getItem("doctor-token");
          const formData = new FormData();

          // Append all sections as JSON strings
          formData.append("personal", JSON.stringify(doctorData.personal));
          formData.append(
            "qualifications",
            JSON.stringify(doctorData.qualifications)
          );
          formData.append(
            "specializations",
            JSON.stringify(doctorData.specializations)
          );
          formData.append("experiences", JSON.stringify(doctorData.experiences));
          formData.append("registration", JSON.stringify(doctorData.registration));

          // If there's a new profile image
          if (doctorData.personal.profile_image instanceof File) {
            formData.append("profileImage", doctorData.personal.profile_image);
          }
          console.log(formData);
          console.log(token);
          await axios.put('http://localhost:4000/api/doctor/update-doctor', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("successfully updated");

          setIsEditing(false);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
    }
    else{
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
  const menuItems = [
    { id: "personal", label: "Personal Info" },
    { id: "qualifications", label: "Qualifications" },
    { id: "specializations", label: "Specializations" },
    { id: "experience", label: "Experience" },
    { id: "registration", label: "Medical Registration" },
  ];

  // Handle qualification changes
  const handleQualificationChange = (id, field, value) => {
    setDoctorData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((qual) =>
        qual.id === id ? { ...qual, [field]: value } : qual
      ),
    }));
  };

  // Add new qualification
  const addQualification = () => {
    setDoctorData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        {
          id: Date.now(),
          qualification: "",
          institution: "",
          completion_year: "",
        },
      ],
    }));
  };

  // Handle specialization changes
  const handleSpecializationChange = (id, field, value) => {
    setDoctorData((prev) => ({
      ...prev,
      specializations: prev.specializations.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  // Add new specialization
  const addSpecialization = () => {
    setDoctorData((prev) => ({
      ...prev,
      specializations: [
        ...prev.specializations,
        { id: Date.now(), specialization_name: "" },
      ],
    }));
  };

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    setDoctorData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };
  // Add new experience
  const addExperience = () => {
    setDoctorData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now(),
          institution: "",
          position: "",
          start_year: "",
          end_year: ""
        }
      ]
    }));
  };
  function convertDateFormat(dob) {
    console.log(personal)
    console.log("Converting date:", dob);
    if (!dob) return ""; // Handle empty value safely
    const parts = dob.split("-"); // Split by '-'
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to yyyy-mm-dd
    }
    console.log("Invalid date format:", dob);
    return ""; // Return empty if format is incorrect
  }
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
  
  // Your existing view rendering code remains the same, but update the input values and handlers
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
          <h1>{`${doctorData.personal.first_name} ${doctorData.personal.last_name}`}</h1>
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
                  <button type="submit" >Save Changes</button>
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
              {/* Qualifications Section */}
              {activeView === "qualifications" && (
                <div className="qualification-container">
                  <div className="section-header">
                    <h2>Qualifications</h2>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          setDoctorData((prev) => ({
                            ...prev,
                            qualifications: [
                              ...prev.qualifications,
                              {
                                id: Date.now(),
                                qualification: "",
                                institution: "",
                                completion_year: "",
                              },
                            ],
                          }))
                        }
                        className="add-button"
                      >
                        + Add Qualification
                      </button>
                    )}
                  </div>

                  <div className="cards-container">
                    {doctorData.qualifications.map((qual, index) => (
                      <div key={qual.id} className="form-card">
                        <div className="card-header">
                          <h3>Qualification {index + 1}</h3>
                        </div>
                        <div className="card-content">
                          <div className="input-group">
                            <label>Qualification</label>
                            <input
                              type="text"
                              value={qual.qualification}
                              onChange={(e) => {
                                const updatedQuals =
                                  doctorData.qualifications.map((q) =>
                                    q.id === qual.id
                                      ? { ...q, qualification: e.target.value }
                                      : q
                                  );
                                setDoctorData((prev) => ({
                                  ...prev,
                                  qualifications: updatedQuals,
                                }));
                              }}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="input-group">
                            <label>Institution</label>
                            <input
                              type="text"
                              value={qual.institution}
                              onChange={(e) => {
                                const updatedQuals =
                                  doctorData.qualifications.map((q) =>
                                    q.id === qual.id
                                      ? { ...q, institution: e.target.value }
                                      : q
                                  );
                                setDoctorData((prev) => ({
                                  ...prev,
                                  qualifications: updatedQuals,
                                }));
                              }}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="input-group">
                            <label>Year of Completion</label>
                            <input
                              type="number"
                              value={qual.completion_year}
                              onChange={(e) => {
                                const updatedQuals =
                                  doctorData.qualifications.map((q) =>
                                    q.id === qual.id
                                      ? {
                                          ...q,
                                          completion_year: e.target.value,
                                        }
                                      : q
                                  );
                                setDoctorData((prev) => ({
                                  ...prev,
                                  qualifications: updatedQuals,
                                }));
                              }}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specializations Section */}
              {activeView === "specializations" && (
                <div className="specialization-container">
                  <div className="section-header">
                    <h2>Specializations</h2>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          setDoctorData((prev) => ({
                            ...prev,
                            specializations: [
                              ...prev.specializations,
                              { id: Date.now(), specialization_name: "" },
                            ],
                          }))
                        }
                        className="add-button"
                      >
                        + Add Specialization
                      </button>
                    )}
                  </div>

                  <div className="cards-container">
                    {doctorData.specializations.map((spec, index) => (
                      <div key={spec.id} className="form-card">
                        <div className="card-header">
                          <h3>Specialization {index + 1}</h3>
                        </div>
                        <div className="card-content">
                          <div className="input-group">
                            <label>Specialization</label>
                            <input
                              type="text"
                              value={spec.specialization_name}
                              onChange={(e) => {
                                const updatedSpecs =
                                  doctorData.specializations.map((s) =>
                                    s.id === spec.id
                                      ? {
                                          ...s,
                                          specialization_name: e.target.value,
                                        }
                                      : s
                                  );
                                setDoctorData((prev) => ({
                                  ...prev,
                                  specializations: updatedSpecs,
                                }));
                              }}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeView === "experience" && (
  <div className="experience-container">
    <div className="section-header">
      <h2>Experience</h2>
      {isEditing && (
        <button
          type="button"
          onClick={addExperience}
          className="add-button"
        >
          + Add Experience
        </button>
      )}
    </div>

    <div className="cards-container">
      {doctorData.experiences.map((exp, index) => (
        <div key={exp.id || index} className="form-card">
          <div className="card-header">
            <h3>Experience {index + 1}</h3>
          </div>
          <div className="card-content">
            <div className="input-group">
              <label>Institution</label>
              <input
                type="text"
                value={exp.institution || ''}
                onChange={(e) => handleExperienceChange(index, "institution", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="input-group">
              <label>Position</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="input-group">
              <label>Start Year</label>
              <input
                type="number"
                value={exp.start_year || ''}
                onChange={(e) => handleExperienceChange(index, "start_year", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="input-group">
              <label>End Year</label>
              <input
                type="number"
                value={exp.end_year || ''}
                onChange={(e) => handleExperienceChange(index, "end_year", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
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
    </>
  );
};

export default DoctorProfile;
