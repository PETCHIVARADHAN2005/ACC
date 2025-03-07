import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button, Container } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "../../styles/DigitalPrescription.css";


const DigitalPrescription = () => {
  const [prescription, setPrescription] = useState(() => {
    return JSON.parse(localStorage.getItem("prescription")) || {
      patientId: "",
      date: "",
      guardian: "",
      dob: "",
      age: "",
      sex: "Male",
      occupation: "",
      healthInsuranceNo: "",
      healthCareProvider: "",
      healthCardNo: "",
      patientName: "Asir",
      address: "",
      cellNo: "",
      diagnosedWith: "",
      bloodPressure: "",
      pulseRate: "",
      height: "",
      weight: "",
      allergies: "",
      disabilities: "",
      history: "",
      diet: "",
      followUpPhysician: "",
      medications: Array(7).fill(null).map(() => ({ 
        drug: "", 
        unit: "Tablet", 
        dosage: "",
        morning: false,
        afternoon: false,
        night: false
      })),
      signature: "",
    };
  });

  const sigCanvas = useRef(null);

  useEffect(() => {
    localStorage.setItem("prescription", JSON.stringify(prescription));
  }, [prescription]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescription((prev) => {
      const updatedMedications = [...prev.medications];
      if (field === "morning" || field === "afternoon" || field === "night") {
        updatedMedications[index] = {
          ...updatedMedications[index],
          [field]: !updatedMedications[index][field]
        };
      } else {
        updatedMedications[index] = {
          ...updatedMedications[index],
          [field]: value
        };
      }
      return { ...prev, medications: updatedMedications };
    });
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setPrescription((prev) => ({ ...prev, signature: "" }));
  };

  const handleSubmit = () => {
    localStorage.removeItem("prescription");
    setPrescription({
      patientId: "",
      date: "",
      guardian: "",
      dob: "",
      age: "",
      sex: "Male",
      occupation: "",
      healthInsuranceNo: "",
      healthCareProvider: "",
      healthCardNo: "",
      patientName: "Asir",
      address: "",
      cellNo: "",
      diagnosedWith: "",
      bloodPressure: "",
      pulseRate: "",
      height: "",
      weight: "",
      allergies: "",
      disabilities: "",
      history: "",
      diet: "",
      followUpPhysician: "",
      medications: Array(7).fill(null).map(() => ({ 
        drug: "", 
        unit: "Tablet", 
        dosage: "",
        morning: false,
        afternoon: false,
        night: false
      })),
      signature: "",
    });
    sigCanvas.current.clear();
  };

  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
    const doc = new jsPDF();
    
    // Add hospital logo/header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text("ARUNA CARDIAC CARE", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text("3B, Trivandrum Rd, Kailash Nagar, Vannarpettai, Tirunelveli", 105, 22, { align: "center" });
    doc.text("Phone: +91 9487 66 55 77 • Email: md@arunacardiaccare.in", 105, 27, { align: "center" });
    
    // Add horizontal lines
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
    doc.line(20, 31, 190, 31);
    
    // Rx Symbol
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text("ACC", 20, 45);
    
    // Patient details section
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text("PATIENT INFORMATION", 40, 45);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${prescription.patientName}`, 40, 52);
    doc.text(`Date: ${prescription.date}`, 140, 52);
    
    // Vitals in a styled box
    doc.setDrawColor(189, 195, 199);
    doc.setFillColor(236, 240, 241);
    doc.roundedRect(20, 58, 170, 25, 3, 3, 'FD');
    
    doc.setFont(undefined, 'bold');
    doc.text("VITAL SIGNS:", 25, 65);
    doc.setFont(undefined, 'normal');
    doc.text(`Blood Pressure: ${prescription.bloodPressure}`, 25, 72);
    doc.text(`Pulse Rate: ${prescription.pulseRate} bpm`, 85, 72);
    doc.text(`Height: ${prescription.height} cm`, 25, 79);
    doc.text(`Weight: ${prescription.weight} kg`, 85, 79);
    
    // Medications section
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text("PRESCRIBED MEDICATIONS", 20, 95);
    
    // Medication table
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, 100, 170, 8, 'F');
    
    // Table headers
    doc.setFontSize(9);
    doc.text("Medication", 25, 105);
    doc.text("Unit", 70, 105);
    doc.text("Dosage", 95, 105);
    doc.text("Timing", 150, 105);
    
    // Table content
    doc.setTextColor(44, 62, 80);
    let yPos = 113;
    prescription.medications.forEach((med, index) => {
      if (med.drug) {
        // Add alternating row background
        if (index % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(20, yPos - 4, 170, 7, 'F');
        }
        
        doc.setFont(undefined, 'normal');
        doc.text(med.drug, 25, yPos);
        doc.text(med.unit, 70, yPos);
        doc.text(med.dosage, 95, yPos);
        
        const timing = [
          med.morning ? "✓ Morning" : "",
          med.afternoon ? "✓ Afternoon" : "",
          med.night ? "✓ Night" : ""
        ].filter(Boolean).join(", ");
        
        doc.text(timing, 150, yPos);
        yPos += 7;
      }
    });
    
    // Add footer with signature
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(20, 250, 190, 250);
    
    // Add signature
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      doc.addImage(signatureData, 'PNG', 120, 255, 60, 25);
    }
    
    doc.setFont(undefined, 'bold');
    doc.text("Doctor's Signature", 120, 287);
    
    // Add footer text
    doc.setFont(undefined, 'italic');
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    doc.text("This prescription is valid for 30 days from the date of issue.", 105, 295, { align: "center" });
    
    doc.save("prescription.pdf");
  };

  return (
    <Container className="prescription-container">
      <h2 className="title">Doctor's Medical Prescription</h2>
      <Form>
        <div className="form-grid">
          <Form.Group className="form-field">
            <Form.Label>Patient's Id:</Form.Label>
            <Form.Control 
              name="patientId" 
              value={prescription.patientId} 
              onChange={handleInputChange}
              placeholder="Enter patient's id"
            />
          </Form.Group>
          
          <Form.Group className="form-field">
            <Form.Label>Date:</Form.Label>
            <Form.Control 
              type="date" 
              name="date" 
              value={prescription.date} 
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="form-field">
            <Form.Label>Blood Pressure:</Form.Label>
            <Form.Control 
              name="bloodPressure" 
              value={prescription.bloodPressure} 
              onChange={handleInputChange}
              placeholder="e.g., 120/80"
            />
          </Form.Group>
          
          <Form.Group className="form-field">
            <Form.Label>Pulse Rate:</Form.Label>
            <Form.Control 
              name="pulseRate" 
              value={prescription.pulseRate} 
              onChange={handleInputChange}
              placeholder="e.g., 72 bpm"
            />
          </Form.Group>
          
          <Form.Group className="form-field">
            <Form.Label>Height:</Form.Label>
            <div className="input-with-unit">
              <Form.Control 
                name="height" 
                value={prescription.height} 
                onChange={handleInputChange}
                placeholder="Enter height"
              />
              <span className="unit">cm</span>
            </div>
          </Form.Group>
          
          <Form.Group className="form-field">
            <Form.Label>Weight:</Form.Label>
            <div className="input-with-unit">
              <Form.Control 
                name="weight" 
                value={prescription.weight} 
                onChange={handleInputChange}
                placeholder="Enter weight"
              />
              <span className="unit">kg</span>
            </div>
          </Form.Group>
        </div>

        <div className="medications-section">
          <h3 className="section-title">Medications</h3>
          <Table className="medications-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th className="col-drug">Drug Name</th>
                <th className="col-unit">Unit</th>
                <th className="col-dosage">Dosage</th>
                <th className="col-timing">Morning</th>
                <th className="col-timing">Afternoon</th>
                <th className="col-timing">Night</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medications.map((med, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <Form.Control 
                      value={med.drug} 
                      onChange={(e) => handleMedicationChange(i, "drug", e.target.value)}
                      placeholder="Enter drug name"
                    />
                  </td>
                  <td>
                    <Form.Select 
                      value={med.unit} 
                      onChange={(e) => handleMedicationChange(i, "unit", e.target.value)}
                    >
                      <option>Tablet</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                      <option>Capsule</option>
                      <option>Drops</option>
                      <option>Inhaler</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control 
                      value={med.dosage} 
                      onChange={(e) => handleMedicationChange(i, "dosage", e.target.value)}
                      placeholder="Enter dosage"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.morning}
                      onChange={() => handleMedicationChange(i, "morning")}
                      className="timing-checkbox"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.afternoon}
                      onChange={() => handleMedicationChange(i, "afternoon")}
                      className="timing-checkbox"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.night}
                      onChange={() => handleMedicationChange(i, "night")}
                      className="timing-checkbox"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="signature-section">
          <Form.Label>Doctor's Signature:</Form.Label>
          <div className="signature-pad">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "signature-canvas"
              }}
            />
          </div>
        </div>

        <div className="action-buttons">
          <Button 
            variant="success" 
            onClick={handleGeneratePDF}
            className="btn-action"
          >
            Generate PDF
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            className="btn-action"
          >
            Submit
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={handleClearSignature}
            className="btn-action"
          >
            Clear Signature
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default DigitalPrescription;