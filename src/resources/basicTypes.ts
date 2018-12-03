/**
 * This file contains all types used in the fhir resource.
 * For each type should always the 'definition-link' be given
 */

/**
 * --------------------------------------------------------------------------------
 *                                  MOST BASIC
 */

//https://www.hl7.org/fhir/valueset-publication-status.html 
// This Status is used in following resources
    // --> MessageDefinition.status (Required)
    // --> CapabilityStatement.status (Required)
    // --> Measure.status (Required)
    // --> GraphDefinition.status (Required)
    // --> ExpansionProfile.status (Required)
    // --> ImplementationGuide.status (Required)
    // --> SearchParameter.status (Required)
    // --> ServiceDefinition.status (Required)
    // --> ActivityDefinition.status (Required)
    // --> Questionnaire.status (Required)
    // --> StructureDefinition.status (Required)
    // --> ConceptMap.status (Required)
    // --> ValueSet.status (Required)
    // --> StructureDefinition ShareableValueSet: ValueSet.status ((Required))
    // --> OperationDefinition.status (Required)
    // --> CodeSystem.status (Required)
    // --> StructureDefinition ShareableCodeSystem: CodeSystem.status ((Required))
    // --> StructureMap.status (Required)
    // --> Library.status (Required)
    // --> TestScript.status (Required)
    // --> DataElement.status (Required)
    // --> CompartmentDefinition.status (Required)
    // --> NamingSystem.status (Required)
    // --> PlanDefinition.status (Required)
export enum PUBLICATIONSTATUS {
    "draft" = "draft", 
    "active" = "active",
    "retired" = "retired",
    "unknown" = "unknown"
};
export type PublicationStatus = keyof typeof PUBLICATIONSTATUS;

//https://www.hl7.org/fhir/valueset-narrative-status.html
export enum NARRATIVESTATUS {
    "generated" = "generated",
    "extensions" = "extensions",
    "additional" = "additional",
    "empty" = "empty"
};
export type NarrativeStatus = keyof typeof NARRATIVESTATUS;


//https://www.hl7.org/fhir/valueset-administrative-gender.html
// This status is used in the following resources
    // --> RelatedPerson.gender (Required)
    // --> Practitioner.gender (Required)
    // --> Person.gender (Required)
    // --> FamilyMemberHistory.gender (Required)
    // --> StructureDefinition FamilyMemberHistory-Genetic: FamilyMemberHistory.gender ((Required))
    // --> Patient.gender (Required)
    // --> Patient.contact.gender (Required)
export enum ADMINISTRATIVEGENDER {
    "male" = "male",
    "female" = "female",
    "other" = "other",
    "unknown" = "unknown"
}
export type AdministrativeGender = keyof typeof ADMINISTRATIVEGENDER;


//'self-made' base interfaces for value[x] types
// --> according Observation and QuestionnaireResponse
export interface ValueString {
    valueString: string;
}; 
export interface ValueBoolean {
    valueBoolean: boolean;
};
export interface ValueDecimal {
    valueDecimal: number;
};
export interface ValueInteger {
    valueInteger: number;
};
export interface ValueUri {
    valueUri: string;
};
export interface ValueQuantity {
    valueQuantity: fhir.Quantity;
}; 
export interface ValueDateTime {
    valueDateTime: fhir.dateTime;
}; 
export interface ValueTime {
    valueTime: fhir.time;
}; 
export interface ValueDate {
    valueDate: fhir.date;
};
export interface ValueAttachment {
    valueAttachment: fhir.Attachment;
};
export interface ValueCodeableConcept {
    valueCodeableConcept: fhir.CodeableConcept;
};
export interface ValueRange {
    valueRange: fhir.Range;
};
export interface ValueRatio {
    valueRatio: fhir.Ratio;
};
export interface ValueSampledData {
    valueSampledData: fhir.SampledData;
};
export interface ValuePeriod {
    valuePeriod: fhir.Period;
};
export interface ValueCoding {
    valueCoding: fhir.Coding;
};
export interface ValueReference {
    valueReference: fhir.Reference
};

/**
 * --------------------------------------------------------------------------------
 *                                  Observation
 */

//https://www.hl7.org/fhir/observation-definitions.html#Observation.component.value_x_
//Observation.component.value[x]
export type ObservationValue = 
    ValueQuantity        |
    ValueDateTime        |
    ValueTime            |
    ValueString          |
    ValueAttachment      |
    ValueCodeableConcept |
    ValueRange           |
    ValueRatio           |
    ValueSampledData     |
    ValuePeriod;

//https://www.hl7.org/fhir/observation-definitions.html#Observation.effective_x_
//interfaces for effective[x]
export interface EffectiveDateTime {
    effectiveDateTime: fhir.dateTime;
}
export interface EffectivePeriod {
    effectivePeriod: fhir.Period;
}
//type for effective[x]
export type ObservationEffective =
    EffectiveDateTime |
    EffectivePeriod;

//https://www.hl7.org/fhir/valueset-observation-status.html
export enum OBSERVATIONSTATUS {
    "registered" = "registered",
    "preliminary" = "preliminary",
    "final" = "final",
    "amended" = "amended",
    "corrected" = "corrected",
    "cancelled" = "cancelled",
    "entered-in-error" = "entered-in-error",
    "unknown" = "unknown"
}
export type ObservationStatus = keyof typeof OBSERVATIONSTATUS;

/**
 * --------------------------------------------------------------------------------
 *                                  QuestionnaireResponse
 */

//https://www.hl7.org/fhir/valueset-questionnaire-answers-status.html
export enum QUESTIONNAIRERESPONSESTATUS {
    "in-progress" = "in-progress",
    "completed" = "completed",
    "amended" = "amended",
    "entered-in-error" = "entered-in-error",
    "stopped" = "stopped"
}
export type QuestionnaireResponseStatus = keyof typeof QUESTIONNAIRERESPONSESTATUS;

//https://www.hl7.org/fhir/questionnaireresponse.html
//QuestionnaireResponse.item.answer.value[x]
export type QuestionnaireResponseValue = 
    ValueQuantity       |
    ValueDateTime       |
    ValueTime           |
    ValueString         |
    ValueAttachment     |
    ValueBoolean        |
    ValueDecimal        |
    ValueInteger        |
    ValueDate           |
    ValueUri            |
    ValueCoding         |
    ValueReference;

/**
 * --------------------------------------------------------------------------------
 *                                  Questionnaire
 */

//https://www.hl7.org/fhir/valueset-item-type.html
//check if the lvl1 codes are ok as strings or need to be implemented like fhir.Group and so on
export enum QUESTIONNAIREITEMTYPE {
    "group" = "group", //lvl1
    "display" = "display", //lvl1
    "boolean" = "boolean", //from here on lvl2
    "decimal" = "decimal",
    "integer" = "integer",
    "date" = "date",
    "dateTime" = "dateTime",
    "time" = "time",
    "string" = "string",
    "text" = "text",
    "url" = "url",
    "choise" = "choise",
    "open-choise" = "open-choise",
    "attachement" = "attachement",
    "reference" = "reference",
    "quantity" = "quantity"
}
export type QuestionnaireItemType = keyof typeof QUESTIONNAIREITEMTYPE;

/**
 * --------------------------------------------------------------------------------
 *                                  Medication
 */

// https://www.hl7.org/fhir/codesystem-medication-statement-status.html
export enum MEDICATIONSTATEMENTSTATUS {
    "active" = "active",
    "completed" = "completed",
    "entered-in-error" = "entered-in-error",
    "intended" = "intended",
    "stopped" = "stopped",
    "on-hold" = "on-hold"
}
export type MedicationStatementStatus = keyof typeof MEDICATIONSTATEMENTSTATUS;

// http://hl7.org/fhir/medication-statement-taken
export enum MEDICATIONSTATEMENTTAKEN {
    "y" = "y",
    "n" = "n",
    "unk" = "unk",
    "na" = "na"
}
export type MedicationStatementTaken = keyof typeof MEDICATIONSTATEMENTTAKEN;

/**
 * --------------------------------------------------------------------------------
 *                                  Media
 */

//https://www.hl7.org/fhir/valueset-digital-media-type.html
export enum DIGITALMEDIATYPE {
    photo = "photo",
    video = "video",
    audio = "audio"
}
export type DigitalMediaType = keyof typeof DIGITALMEDIATYPE;

/**
 * --------------------------------------------------------------------------------
 *                                  Bundle
 */

//http://www.hl7.org/fhir/bundle-type
export enum BUNDLETYPE {
    "document" = "document",
    "message" = "message",
    "transaction" = "transaction",
    "transaction-response" = "transaction-response",
    "batch" = "batch",
    "batch-response" = "batch-response",
    "history" = "history",
    "searchset" = "searchset",
    "collection" = "collection"
}
export type BundleType = keyof typeof BUNDLETYPE;

//http://hl7.org/fhir/http-verb
export enum HTTPVERB {
    "GET" = "GET", 
    "POST" = "POST",
    "PUT" = "PUT",
    "DELETE" = "DELETE"
}
export type HTTPVerb = keyof typeof HTTPVERB;
 
/**
 * --------------------------------------------------------------------------------
 *                                  Composition
 */

//https://www.hl7.org/fhir/valueset-composition-status.html
export enum COMPOSITIONSTATUS {
    "preliminary" = "preliminary",
    "final" = "final",
    "amended" = "amended",
    "entered-in-error" = "entered-in-error"
}
export type CompositionStatus = keyof typeof COMPOSITIONSTATUS; 

//https://www.hl7.org/fhir/composition-definitions.html#Composition.section
export type CompositionSection = CompositionSectionText | 
                                 CompositionSectionEntry | 
                                 CompositionSectionSection;

export interface CompositionSectionBasic {
    title?: string,
    code?: fhir.CodeableConcept,
    mode?: fhir.code,
    orderedBy?: fhir.CodeableConcept,
    emptyReason?: fhir.CodeableConcept
};

export interface CompositionSectionText extends CompositionSectionBasic {
    text: fhir.Narrative,
    entry?: Array<fhir.Reference>,
    section?: CompositionSection
};

export interface CompositionSectionEntry extends CompositionSectionBasic {
    text?: fhir.Narrative,
    entry: Array<fhir.Reference>,
    section?: CompositionSection
};

export interface CompositionSectionSection extends CompositionSectionBasic {
    text?: fhir.Narrative,
    entry?: Array<fhir.Reference>,
    section: CompositionSection
};
