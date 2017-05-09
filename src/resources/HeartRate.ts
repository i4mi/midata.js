//import { VitalSigns } from './VitalSigns';
import { VitalSigns} from './categories';
import { registerResource } from './registry';
import {ValueObservation, ValueQuantity} from "./Observation";


// @registerResource('8867-4')
// export class HeartRate extends VitalSigns {
//     constructor(beatsPerMinute: number, date: Date) {
//         let quanitity = {
//             value: beatsPerMinute,
//             unit: 'bpm'
//         };
//         super(quanitity, date, {
//             coding: [{
//                 system: 'http://loinc.org',
//                 code: '8867-4',
//                 display: 'Heart Rate'
//             }]
//         });
//     }
// };


@registerResource('8867-4')
export class HeartRate extends ValueObservation {
    constructor(beatsPerMinute: number, date: Date) {
        let quantity: ValueQuantity = {
            _quantity: {
                value: beatsPerMinute,
                unit: 'bpm'
            }
        };
        super(quantity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '8867-4',
                display: 'Heart Rate'
            }]
        }, VitalSigns);
    }
};