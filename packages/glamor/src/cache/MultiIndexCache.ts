// import { nullRule } from '../utils/index';

// export function multiIndexCache<T>(fn: T): T {
//   let inputCaches = typeof WeakMap !== 'undefined' ?
//     [nullRule, new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap()] :
//     [nullRule];

//   let warnedWeakMapError = false;

//   return function (...args: Array<any>) {
//     if (inputCaches[args.length]) {
//       let coi = inputCaches[args.length];
//       let ctr = 0;

//       while (ctr < args.length - 1) {
//         if (!coi.has(args[ctr])) {
//           coi.set(args[ctr], new WeakMap());
//         }
//         coi = coi.get(args[ctr]);
//         ctr++;
//       }

//       if (coi.has(args[args.length - 1])) {
//         let ret = coi.get(args[ctr]);

//         if (registered[ret.toString().substring(4)]) { // make sure it hasn't been flushed
//           return ret;
//         }
//       }
//     }

//     let value = fn(args);
//     if (inputCaches[args.length]) {
//       let ctr = 0, coi = inputCaches[args.length];

//       while (ctr < args.length - 1) {
//         coi = coi.get(args[ctr]);
//         ctr++;
//       }

//       try {
//         coi.set(args[ctr], value);
//       } catch (err) {
//         if (isDev && !warnedWeakMapError) {
//           warnedWeakMapError = true;
//           console.warn('failed setting the WeakMap cache for args:', ...args); // eslint-disable-line no-console
//           console.warn('this should NOT happen, please file a bug on the github repo.'); // eslint-disable-line no-console
//         }
//       }
//     }

//     return value;
//   };
// }
