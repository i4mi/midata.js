/**
 * This file is used to 'register' all of the used coding systems, so that different
 * resources can access all codings
 */

/**
 * --------------------------------------------------------------------------------
 *                                  Handedness
 */
export const COD_HANDEDNESS = {
    coding: [{
        system: "http://snomed.info/sct",
        code: "57427004",
        display: "Handedness"
    }],
    text: "Handedness"
};
export const COD_LEFTHANDED = {
    coding: [{
        system: "http://snomed.info/sct",
        code: "87683000",
        display: "Left handed"
    }],
    text: "Left handed"
};
export const COD_RIGHTHANDED = {
    coding: [{
        system: "http://snomed.info/sct",
        code: "46669005",
        display: "Right handed"
    }],
    text: "Right handed"
};
export const COD_AMBIDEXTROUS = {
    coding: [{
        system: "http://snomed.info/sct",
        code: "23088002",
        display: "Ambidextrous"
    }],
    text: "Ambidextrous"
}

/**
 * --------------------------------------------------------------------------------
 *                                  Blood Pressure
 */
export const COD_BLOODPRESSURE = {
    coding: [{
        system: "http://loinc.org",
        code: "55417-0",
        display: "Blood Pressure"
    }],
    text: "Blood Pressure"
}; 

/**
 * --------------------------------------------------------------------------------
 *                                  Body height
 */
export const COD_BODYHEIGHT = {
    coding: [{
        system: "http://loinc.org",
        code: "8302-2",
        display: "Body height"
    }],
    text: "Body height"
};

/**
 * --------------------------------------------------------------------------------
 *                                  Body weight
 */
export const COD_BODYWEIGHT = {
    coding: [{
        system: "http://loinc.org",
        code: "29463-7",
        display: "Body weight"
    }],
    text: "Body weight"
};

/**
 * --------------------------------------------------------------------------------
 *                                  Heart Rate
 */
export const COD_HEARTRATE = {
    coding: [{
        system: "http://loinc.org",
        code: "8867-4",
        display: "Heart rate"
    }],
    text: "Heart rate"
};

/**
 * --------------------------------------------------------------------------------
 *                                  Hemoglobin [Mass/volume] in Blood
 */
export const COD_HEMOGLOBININBLOOD = {
    coding: [{
        system: "http://loinc.org",
        code: "718-7",
        display: "Hemoglobin [Mass/volume] in Blood"
    }],
    text: "Hemoglobin [Mass/volume] in Blood"
};

/**
 * --------------------------------------------------------------------------------
 *                                  Steps 24 hour measured
 */
export const COD_STEPSADAY = {
    coding: [{
        system: "http://loinc.org",
        code: "41950-7",
        display: "Steps [24 hour]"
    }],
    text: "Steps [24 hour]"
};

/**
 * --------------------------------------------------------------------------------
 *                                  Body Temperature
 */
export const COD_BODYTEMPERATURE = {
    coding: [
        {
            system: "http://acme.lab",
            code: "BT",
            display: "Body temperature"
        },
        // LOINC and SNOMED CT translations here - Note in the US the primary code
        // will be LOINC per meaningful use.  Further SNOMED CT  has acceeded
        // to LOINC being the primary coding system for vitals and
        // anthropromorphic measures.  SNOMED CT is required in some
        // countries such as the UK.
        {
            system: "http://loinc.org",
            code: "8310-5",
            display: "Body temperature"
        },
        {
            system: "http://snomed.info/sct",
            code: "56342008",
            display: "Temperature taking"
        }
    ],
    text: "Body temperature"
};