import { Observation } from '../resourceTypes/observation';
import { registerResource } from '../registry';
import { ObservationEffective, OBSERVATIONSTATUS, ValueCodeableConcept } from '../basicTypes';
import { CAT_SURVEY } from '../categories';
import { COD_HANDEDNESS, COD_LEFTHANDED, COD_RIGHTHANDED, COD_AMBIDEXTROUS } from '../codings';

/**
 * Handedness of a patient
 */

 @registerResource('code', '57427004')
export class Handedness extends Observation {
    constructor(handSide: string, date: string, withPeriodEndDate? : string) {
        let effectiveType : ObservationEffective;
                if(withPeriodEndDate){
                   effectiveType = {
                        effectivePeriod : {
                            start: date,
                            end: withPeriodEndDate
                        }
                    }
                } else {
                    effectiveType  = {
                        effectiveDateTime : date
                    }
                }

        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_SURVEY, COD_HANDEDNESS);
        
        this.setHandedness(handSide);

    }

    setHandedness(handSide: string) {
        let val = this.resolveValueCodeableConcept(handSide);
        super.addProperty('valueCodeableConcept', val.valueCodeableConcept);
    }

    getHandedness(): ValueCodeableConcept {
        return super.getProperty('valueCodeableConcept');
    }

    changeHandedness(handSide: string) {
        super.removeProperty('valueCodeableConcept');
        let val = this.resolveValueCodeableConcept(handSide);
        super.addProperty('valueCodeableConcept', val.valueCodeableConcept);
    }

    resolveValueCodeableConcept(handSide: string): ValueCodeableConcept {
        let value: ValueCodeableConcept;

        if (handSide === COD_LEFTHANDED.coding[0].code) {
            value = {
                valueCodeableConcept: COD_LEFTHANDED
            };
        } else if (handSide === COD_RIGHTHANDED.coding[0].code) {
            value = {
                valueCodeableConcept: COD_RIGHTHANDED
            };
        } else {
            value = {
                valueCodeableConcept: COD_AMBIDEXTROUS
            };  
        }

        return value;
    }
}
