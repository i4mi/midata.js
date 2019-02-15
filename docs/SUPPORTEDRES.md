This page should list all the supported resources and types. But why do we implement these, when there is an existing fhir types library?

We do not just copy paste these types. We have implemented them because of
* app side validation
* easier resource handling
* possibility to directly create specific resources (like heart rate, body weight, ...) --> we call them extended resources
* nicer code structure (no json directly in source)
* additional functionality (like search inside of a bundle or composition resource)

## HL7 FHIR Resources
* [Bundle](https://www.hl7.org/fhir/bundle.html)
* [Composition](https://www.hl7.org/fhir/composition.html)
* [Media](https://www.hl7.org/fhir/media.html)
* [MedicationStatement](https://www.hl7.org/fhir/medicationstatement.html)
* [Observation](https://www.hl7.org/fhir/observation.html)
* [Patient](https://www.hl7.org/fhir/patient.html)
* [Questionnaire](https://www.hl7.org/fhir/questionnaire.html)
* [QuestionnaireResponse](https://www.hl7.org/fhir/questionnaireresponse.html)

## Extended Resources

We provide also some specified/extended resources. These resources all have their codings already implemented. Sometimes you can use the given code systems, sometimes not. It depends on your use case and the LOINC, SNOMED Code definition. Following table shows the extended resources implemented in this library and shows the used code systems and value units.

| Resource        | Code System           | Value Units  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

***

[<img align="left" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108325.svg">](https://github.com/i4mi/midata.js/wiki/4.-Create-custom-resources-(IONIC-2-&-3))
