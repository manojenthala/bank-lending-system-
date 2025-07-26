// Utility Functions for Assignment

/**
 * Caesar Cipher Encode
 * @param {string} message - The message to encode
 * @param {number} shift - The shift length (left shift)
 * @returns {string}
 */
function caesarEncode(message, shift) {
    return message.replace(/[a-z]/gi, (char) => {
        const base = char >= 'a' && char <= 'z' ? 97 : 65;
        return String.fromCharCode(
            ((char.charCodeAt(0) - base - shift + 26) % 26) + base
        );
    });
}

/**
 * Caesar Cipher Decode
 * @param {string} message - The message to decode
 * @param {number} shift - The shift length (left shift)
 * @returns {string}
 */
function caesarDecode(message, shift) {
    // Decoding is encoding with negative shift
    return caesarEncode(message, -shift);
}

/**
 * Format number as Indian currency string
 * @param {number|string} num
 * @returns {string}
 */
function formatIndianCurrency(num) {
    let [intPart, decPart] = num.toString().split('.');
    let lastThree = intPart.slice(-3);
    let other = intPart.slice(0, -3);
    if (other !== '') {
        lastThree = ',' + lastThree;
    }
    let formatted =
        other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return decPart ? formatted + '.' + decPart : formatted;
}

/**
 * Combine two lists of elements with positions and values
 * @param {Array} list1
 * @param {Array} list2
 * @returns {Array}
 */
function combineLists(list1, list2) {
    const merged = [...list1, ...list2];
    merged.sort((a, b) => a.positions[0] - b.positions[0]);
    const result = [];
    for (let i = 0; i < merged.length; i++) {
        let curr = merged[i];
        let mergedFlag = false;
        for (let j = 0; j < result.length; j++) {
            let prev = result[j];
            let [l1, r1] = prev.positions;
            let [l2, r2] = curr.positions;
            let overlap = Math.max(0, Math.min(r1, r2) - Math.max(l1, l2));
            let len1 = r1 - l1;
            let len2 = r2 - l2;
            if (
                (overlap > len1 / 2) ||
                (overlap > len2 / 2)
            ) {
                // Merge values, keep earlier position
                prev.values = prev.values.concat(curr.values);
                mergedFlag = true;
                break;
            }
        }
        if (!mergedFlag) {
            result.push({ ...curr });
        }
    }
    return result;
}

/**
 * Minimize Loss: Find buy/sell years for minimum loss
 * @param {number[]} prices
 * @returns {{buyYear: number, sellYear: number, loss: number}}
 */
function minimizeLoss(prices) {
    let minLoss = Infinity;
    let buy = -1, sell = -1;
    for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            if (prices[j] < prices[i]) {
                let loss = prices[i] - prices[j];
                if (loss < minLoss) {
                    minLoss = loss;
                    buy = i + 1;
                    sell = j + 1;
                }
            }
        }
    }
    return { buyYear: buy, sellYear: sell, loss: minLoss };
}

// Sample usage:
// console.log(caesarEncode('HELLO', 3));
// console.log(caesarDecode('EBIIL', 3));
// console.log(formatIndianCurrency(123456.7891));
// console.log(combineLists([{positions: [0, 5], values: [1]}], [{positions: [3, 8], values: [2]}]));
// console.log(minimizeLoss([20, 15, 7, 2, 13]));

module.exports = {
    caesarEncode,
    caesarDecode,
    formatIndianCurrency,
    combineLists,
    minimizeLoss
}; 