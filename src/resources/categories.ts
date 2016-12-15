export const VitalSigns: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'vital-signs',
        display: 'Vital Signs'
    }],
    text: 'Vital Signs'
};

export const Laboratory: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'laboratory',
        display: 'Laboratory'
    }],
    text: 'Laboratory'
};
