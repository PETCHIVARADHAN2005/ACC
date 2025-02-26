import createAuthTable from './authtable.js';
import createRegistrationTable from './DoctorRegistrationTable.js';
import createDoctorTable from './doctortable.js';
import createExperienceTable from './ExperienceTable.js';
import createQualificationTable from './Qualificationtable.js';
import createSpecializationTable from './SpecializationTable.js';

const initializeModels = () => {
  const models = [
    createDoctorTable,
    createAuthTable,
    createRegistrationTable,
    createExperienceTable,
    createQualificationTable,
    createSpecializationTable
  ];

  models.forEach(modelFunction => {
    modelFunction();
  });
};

export default initializeModels;