// import {BaseGen, BaseGenConfig} from './gen';

// type LetterCaseOption = 'upper' | 'lower' | 'both';

// export interface PasswordGenConfig extends BaseGenConfig {
//     case?: LetterCaseOption;
//     letters?: boolean;
//     numbers?: boolean;
//     symbols?: boolean;
//     maxLength?: number;
// }

// const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
// const SYMBOLS = '`~!@#$%^&*()-_=+[{}]\\|;:\'",<.>/?';
// const NUMBERS = '0123456789';

// export class PasswordGen extends BaseGen {
//     private items: string[];
//     private minLength: number;
//     private maxLength: number;

//     constructor(config: PasswordGenConfig) {
//         super(config);
//         let all = '';
//         if (config.letters) {
//             switch (config.case) {
//             case 'upper':
//                 all += LETTERS.toUpperCase();
//                 break;
//             case 'lower':
//                 all += LETTERS.toUpperCase();
//                 break;
//             default:
//                 all += LETTERS.toUpperCase() + LETTERS.toLowerCase();
//                 break;
//             }
//         }
//         if (config.numbers) {
//             all += NUMBERS;
//         }
//         if (config.symbols) {
//             all += SYMBOLS;
//         }
//         this.items = all.split('');
//         this.maxLength = typeof config.maxLength != 'undefined' ? config.maxLength : 12;
//     }

//     next(): string {

//     }
// }