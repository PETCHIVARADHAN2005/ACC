import createAppointmentTable from './AppointmentTable.js';
import createAuthTable from './authtable.js';
import createRegistrationTable from './DoctorRegistrationTable.js';
import createDoctorSlotsTable from './DoctorSlots.js';
import createDoctorTable from './Doctortable.js';
import createExperienceTable from './ExperienceTable.js';
import createPatientTable from './PatientTable.js';
import createQualificationTable from './Qualificationtable.js';
import createSpecializationTable from './SpecializationTable.js';

const initializeModels = () => {
  const models = [
    createDoctorTable,
    createAuthTable,
    createRegistrationTable,
    createExperienceTable,
    createQualificationTable,
    createSpecializationTable,
    createDoctorSlotsTable,
    createPatientTable,
    createAppointmentTable
  ];

  models.forEach(modelFunction => {
    modelFunction();
  });
};

export default initializeModels;