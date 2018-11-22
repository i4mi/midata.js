// All codes from system http://hl7.org/fhir/observation-category

export const CAT_VITALSIGNS: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'vital-signs',
        display: 'Vital Signs'
    }],
    text: 'Vital Signs'
};

export const CAT_LABORATORY: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'laboratory',
        display: 'Laboratory'
    }],
    text: 'Laboratory'
};

export const CAT_SURVEY: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'survey',
        display: 'Survey'
    }],
    text: 'Survey'

};

export const CAT_SOCIALHISTORY: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'social-history',
        display: 'Social History'
    }],
    text: 'Social History'

};

// All codes from system http://hl7.org/fhir/medication-statement-category

export const CAT_PATIENTSPECIFIED: fhir.CodeableConcept = {
    coding: [{
        system: 'http://hl7.org/fhir/medication-statement-category',
        code: 'patientspecified',
        display: 'Patient Specified'
    }],
    text: 'Patient Specified'

};