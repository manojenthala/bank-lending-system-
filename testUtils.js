const {
  caesarEncode,
  caesarDecode,
  formatIndianCurrency,
  combineLists,
  minimizeLoss
} = require('./utils');

console.log('--- Caesar Cipher ---');
const message = 'HELLO WORLD';
const shift = 3;
const encoded = caesarEncode(message, shift);
console.log('Encoded:', encoded); // EBIIL TLOIA
const decoded = caesarDecode(encoded, shift);
console.log('Decoded:', decoded); // HELLO WORLD

console.log('\n--- Indian Currency Formatter ---');
const number = 123456.7891;
const formatted = formatIndianCurrency(number);
console.log('Formatted:', formatted); // 1,23,456.7891

console.log('\n--- Combine Two Lists ---');
const list1 = [{ positions: [0, 5], values: [1] }];
const list2 = [{ positions: [3, 8], values: [2] }];
const combined = combineLists(list1, list2);
console.log('Combined:', JSON.stringify(combined));
// Output: [{ positions: [0, 5], values: [1, 2] }]

console.log('\n--- Minimize Loss ---');
const prices = [20, 15, 7, 2, 13];
const minLossResult = minimizeLoss(prices);
console.log('Minimize Loss:', minLossResult);
// Output: { buyYear: 2, sellYear: 5, loss: 2 } 