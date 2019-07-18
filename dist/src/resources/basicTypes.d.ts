/**
 * This file contains all types used in the fhir resource.
 * For each type should always the 'definition-link' be given
 */
/// <reference types="fhir" />
/**
 * --------------------------------------------------------------------------------
 *                                  MOST BASIC
 */
export declare enum PUBLICATIONSTATUS {
    "draft" = "draft",
    "active" = "active",
    "retired" = "retired",
    "unknown" = "unknown"
}
export declare type PublicationStatus = keyof typeof PUBLICATIONSTATUS;
export declare enum ADMINISTRATIVEGENDER {
    "male" = "male",
    "female" = "female",
    "other" = "other",
    "unknown" = "unknown"
}
export declare type AdministrativeGender = keyof typeof ADMINISTRATIVEGENDER;
export interface ValueString {
    valueString: string;
}
export interface ValueBoolean {
    valueBoolean: boolean;
}
export interface ValueDecimal {
    valueDecimal: number;
}
export interface ValueInteger {
    valueInteger: number;
}
export interface ValueUri {
    valueUri: string;
}
export interface ValueQuantity {
    valueQuantity: fhir.Quantity;
}
export interface ValueDateTime {
    valueDateTime: fhir.dateTime;
}
export interface ValueTime {
    valueTime: fhir.time;
}
export interface ValueDate {
    valueDate: fhir.date;
}
export interface ValueAttachment {
    valueAttachment: fhir.Attachment;
}
export interface ValueCodeableConcept {
    valueCodeableConcept: fhir.CodeableConcept;
}
export interface ValueRange {
    valueRange: fhir.Range;
}
export interface ValueRatio {
    valueRatio: fhir.Ratio;
}
export interface ValueSampledData {
    valueSampledData: fhir.SampledData;
}
export interface ValuePeriod {
    valuePeriod: fhir.Period;
}
export interface ValueCoding {
    valueCoding: fhir.Coding;
}
export interface ValueReference {
    valueReference: fhir.Reference;
}
/**
 * --------------------------------------------------------------------------------
 *                                  Observation
 */
export declare type ObservationValue = ValueQuantity | ValueDateTime | ValueTime | ValueString | ValueAttachment | ValueCodeableConcept | ValueRange | ValueRatio | ValueSampledData | ValuePeriod;
export interface EffectiveDateTime {
    effectiveDateTime: fhir.dateTime;
}
export interface EffectivePeriod {
    effectivePeriod: fhir.Period;
}
export declare type ObservationEffective = EffectiveDateTime | EffectivePeriod;
export declare enum OBSERVATIONSTATUS {
    "registered" = "registered",
    "preliminary" = "preliminary",
    "final" = "final",
    "amended" = "amended",
    "corrected" = "corrected",
    "cancelled" = "cancelled",
    "entered-in-error" = "entered-in-error",
    "unknown" = "unknown"
}
export declare type ObservationStatus = keyof typeof OBSERVATIONSTATUS;
/**
 * --------------------------------------------------------------------------------
 *                                  QuestionnaireResponse
 */
export declare enum QUESTIONNAIRERESPONSESTATUS {
    "in-progress" = "in-progress",
    "completed" = "completed",
    "amended" = "amended",
    "entered-in-error" = "entered-in-error",
    "stopped" = "stopped"
}
export declare type QuestionnaireResponseStatus = keyof typeof QUESTIONNAIRERESPONSESTATUS;
export declare type QuestionnaireResponseValue = ValueQuantity | ValueDateTime | ValueTime | ValueString | ValueAttachment | ValueBoolean | ValueDecimal | ValueInteger | ValueDate | ValueUri | ValueCoding | ValueReference;
/**
 * --------------------------------------------------------------------------------
 *                                  Questionnaire
 */
export declare enum QUESTIONNAIREITEMTYPE {
    "group" = "group",
    "display" = "display",
    "boolean" = "boolean",
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
export declare type QuestionnaireItemType = keyof typeof QUESTIONNAIREITEMTYPE;
/**
 * --------------------------------------------------------------------------------
 *                                  Medication
 */
export declare enum MEDICATIONSTATEMENTSTATUS {
    "active" = "active",
    "completed" = "completed",
    "entered-in-error" = "entered-in-error",
    "intended" = "intended",
    "stopped" = "stopped",
    "on-hold" = "on-hold"
}
export declare type MedicationStatementStatus = keyof typeof MEDICATIONSTATEMENTSTATUS;
export declare enum MEDICATIONSTATEMENTTAKEN {
    "y" = "y",
    "n" = "n",
    "unk" = "unk",
    "na" = "na"
}
export declare type MedicationStatementTaken = keyof typeof MEDICATIONSTATEMENTTAKEN;
/**
 * --------------------------------------------------------------------------------
 *                                  Media
 */
export declare enum DIGITALMEDIATYPE {
    photo = "photo",
    video = "video",
    audio = "audio"
}
export declare type DigitalMediaType = keyof typeof DIGITALMEDIATYPE;
/**
 * --------------------------------------------------------------------------------
 *                                  Bundle
 */
export declare enum BUNDLETYPE {
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
export declare type BundleType = keyof typeof BUNDLETYPE;
export declare enum HTTPVERB {
    "GET" = "GET",
    "POST" = "POST",
    "PUT" = "PUT",
    "DELETE" = "DELETE"
}
export declare type HTTPVerb = keyof typeof HTTPVERB;
/**
 * --------------------------------------------------------------------------------
 *                                  Composition
 */
export declare enum COMPOSITIONSTATUS {
    "preliminary" = "preliminary",
    "final" = "final",
    "amended" = "amended",
    "entered-in-error" = "entered-in-error"
}
export declare type CompositionStatus = keyof typeof COMPOSITIONSTATUS;
export declare type CompositionSection = CompositionSectionText | CompositionSectionEntry | CompositionSectionSection;
export interface CompositionSectionBasic {
    title?: string;
    code?: fhir.CodeableConcept;
    mode?: fhir.code;
    orderedBy?: fhir.CodeableConcept;
    emptyReason?: fhir.CodeableConcept;
}
export interface CompositionSectionText extends CompositionSectionBasic {
    text: string;
    entry?: fhir.Reference;
    section?: CompositionSection;
}
export interface CompositionSectionEntry extends CompositionSectionBasic {
    text?: string;
    entry: fhir.Reference;
    section?: CompositionSection;
}
export interface CompositionSectionSection extends CompositionSectionBasic {
    text?: string;
    entry?: fhir.Reference;
    section: CompositionSection;
}
