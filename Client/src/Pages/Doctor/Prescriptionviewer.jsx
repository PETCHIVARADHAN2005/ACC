import React, { useState, useContext } from 'react';
import { Container, Form, Button, Table, Alert, Spinner, Card, Modal, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import axios from 'axios';
import { DoctorContext } from '../../context/Doctorcontext';
import '../../styles/PrescriptionViewer.css';

const PatientPrescriptionViewer = () => {
  const { backendUrl, token } = useContext(DoctorContext);
  
  // States
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState('');
  const [patientInfo, setPatientInfo] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  
  // Medication detail modal states
  const [showMedicationsModal, setShowMedicationsModal] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);
  
  // Handle patient ID input change
  const handlePatientIdChange = (e) => {
    setPatientId(e.target.value);
  };
  
  // Search for patient prescriptions
  const handleSearch = async () => {
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSearchPerformed(true);
      
      // Fetch patient details
      const patientResponse = await axios.get(
        `${backendUrl}/api/doctor/get-patient-details/${patientId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (patientResponse.data) {
        setPatientInfo(patientResponse.data);
        
        // Fetch prescriptions directly from the Prescription table
        const prescriptionsResponse = await axios.get(
          `${backendUrl}/api/doctor/patients/${patientId}/prescriptions`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (prescriptionsResponse.data.success) {
          setPrescriptions(prescriptionsResponse.data.prescriptions);
        } else {
          setPrescriptions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError(error.response?.data?.message || 'An error occurred while searching');
      setPatientInfo(null);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // View prescription PDF - Now opens in a new tab
  // View prescription PDF - Opens in a new tab
const handleViewPrescription = async (prescription) => {
  try {
    // If the PDF is already in the prescription object
    if (prescription.pdf_file) {
      // Ensure the PDF data has the correct prefix
      const pdfDataString = prescription.pdf_file;
      const formattedPdfData = pdfDataString.startsWith('data:')
        ? pdfDataString
        : `data:application/pdf;base64,${pdfDataString}`;
      
      // Create a new window and write the PDF embed code
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${prescription.prescription_id}</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; }
              embed { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <embed src="${formattedPdfData}" type="application/pdf" />
          </body>
        </html>
      `);
      pdfWindow.document.close();
      return;
    }
    
    // If the PDF isn't already in the prescription object, fetch it
    const response = await axios.get(
      `${backendUrl}/api/doctor/prescriptions/${prescription.prescription_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success && response.data.prescription.pdf_file) {
      // Ensure the PDF data has the correct prefix
      const pdfDataString = response.data.prescription.pdf_file;
      const formattedPdfData = pdfDataString.startsWith('data:')
        ? pdfDataString
        : `data:application/pdf;base64,${pdfDataString}`;
      
      // Create a new window and write the PDF embed code
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${prescription.prescription_id}</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; }
              embed { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <embed src="${formattedPdfData}" type="application/pdf" />
          </body>
        </html>
      `);
      pdfWindow.document.close();
    } else {
      setError('No PDF available for this prescription');
    }
  } catch (error) {
    console.error('Error fetching prescription PDF:', error);
    setError(error.response?.data?.message || 'An error occurred while loading the PDF');
  }
};

  
  // View medications details
  const handleViewMedications = (prescription) => {
    try {
      // Safely parse medications
      let medications = [];
      if (prescription.medications) {
        if (typeof prescription.medications === 'string') {
          medications = JSON.parse(prescription.medications);
        } else {
          medications = prescription.medications;
        }
      }
      
      setSelectedMedications(medications);
      setShowMedicationsModal(true);
    } catch (error) {
      console.error('Error parsing medications:', error);
      setError('Failed to parse medication data');
    }
  };
  
  // Close medications modal
  const handleCloseMedicationsModal = () => {
    setShowMedicationsModal(false);
    setSelectedMedications([]);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Safely get medication count
  const getMedicationCount = (prescription) => {
    try {
      if (!prescription.medications) return 0;
      
      const meds = typeof prescription.medications === 'string'
        ? JSON.parse(prescription.medications)
        : prescription.medications;
      
      return Array.isArray(meds) ? meds.length : 0;
    } catch (error) {
      console.error('Error parsing medications:', error);
      return 0;
    }
  };
  
  // Clear search results
  const handleClearSearch = () => {
    setPatientId('');
    setPatientInfo(null);
    setPrescriptions([]);
    setSearchPerformed(false);
    setError('');
  };
  
  return (
    <Container className="prescription-viewer-container">
      <h2 className="page-title">Patient Prescription Viewer</h2>
      
      {/* Search Form */}
      <Card className="search-card">
        <Card.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Patient ID</Form.Label>
              <div className="search-form">
                <Form.Control
                  type="text"
                  placeholder="e.g., P12345"
                  value={patientId}
                  onChange={handlePatientIdChange}
                  disabled={loading}
                  className="search-input"
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="search-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Searching...</span>
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
                {searchPerformed && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearSearch}
                    className="clear-button ms-2"
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Error Message */}
      {error && <Alert variant="danger" className="alert-message">{error}</Alert>}
      
      {/* Patient Information */}
      {patientInfo && (
        <Card className="patient-card">
          <Card.Body>
            <h4 className="patient-name">{patientInfo.first_name} {patientInfo.last_name}</h4>
            <div className="patient-info">
              <div className="patient-info-left">
                <p className="mb-1">
                  <span className="info-label">Patient ID:</span> {patientInfo.patient_id}
                </p>
                <p className="mb-1">
                  <span className="info-label">Age/Gender:</span> {patientInfo.age || 'N/A'} / {patientInfo.gender || 'N/A'}
                </p>
              </div>
              <div className="patient-info-right">
                <p className="mb-1">
                  <span className="info-label">Phone:</span> {patientInfo.phone_number || 'N/A'}
                </p>
                <p className="mb-1">
                  <span className="info-label">Email:</span> {patientInfo.email || 'N/A'}
                </p>
              </div>
            </div>
            {prescriptions.length > 0 && (
              <div className="prescription-summary mt-3">
                <Badge bg="info" className="me-2">Total Prescriptions: {prescriptions.length}</Badge>
                <Badge bg="success">Latest: {formatDate(prescriptions[0].prescription_date)}</Badge>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      
      {/* Prescriptions Table */}
      {searchPerformed && !loading && (
        <>
          {prescriptions.length === 0 ? (
            <Alert variant="info" className="no-data-message">
              No prescriptions found for this patient.
            </Alert>
          ) : (
            <>
              <h4 className="section-title">Prescriptions</h4>
              <div className="table-responsive">
                <Table className="prescriptions-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Vitals</th>
                      <th>Medications</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription, index) => (
                      <tr key={prescription.prescription_id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(prescription.prescription_date)}</td>
                        <td>
                          {prescription.blood_pressure && (
                            <div><small>BP: {prescription.blood_pressure}</small></div>
                          )}
                          {prescription.pulse_rate && (
                            <div><small>Pulse: {prescription.pulse_rate}</small></div>
                          )}
                          {prescription.height && prescription.weight && (
                            <div><small>H/W: {prescription.height}/{prescription.weight}</small></div>
                          )}
                        </td>
                        <td>
                          {getMedicationCount(prescription) > 0 ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-decoration-none"
                              onClick={() => handleViewMedications(prescription)}
                            >
                              {getMedicationCount(prescription)} medications
                            </Button>
                          ) : (
                            <small>No medications</small>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            className="view-button"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            View PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </>
      )}
      
      {/* Medications Detail Modal */}
      <Modal
        show={showMedicationsModal}
        onHide={handleCloseMedicationsModal}
        centered
        className="medications-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Medication Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedications.length === 0 ? (
            <Alert variant="info">No medication details available</Alert>
          ) : (
            <div className="medications-list">
              {selectedMedications.map((med, index) => (
                <Card key={index} className="medication-card mb-3">
                  <Card.Body>
                    <Card.Title className="medication-name">
                      {med.drug || med.drug_name || 'Unnamed Medication'}
                    </Card.Title>
                    <div className="medication-details">
                      <p className="mb-1">
                        <span className="med-label">Dosage:</span> {med.dosage || 'N/A'} {med.unit || ''}
                      </p>
                      {med.duration && (
                        <p className="mb-1">
                          <span className="med-label">Duration:</span> {med.duration}
                        </p>
                      )}
                      <p className="mb-1">
                        <span className="med-label">Schedule:</span> {' '}
                        {[
                          med.morning && 'Morning',
                          med.afternoon && 'Afternoon',
                          med.evening && 'Evening',
                          med.night && 'Night'
                        ].filter(Boolean).join(', ') || 'Not specified'}
                      </p>
                      {med.foodRelation && (
                        <p className="mb-1">
                          <span className="med-label">Take:</span> {med.foodRelation}
                        </p>
                      )}
                      {med.specialInstructions && (
                        <p className="mb-1">
                          <span className="med-label">Instructions:</span> {med.specialInstructions}
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMedicationsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientPrescriptionViewer;
