"use strict";
exports.__esModule = true;
var js_combinatorics_1 = require("js-combinatorics");
var DICE_SIDE_COUNT = 6;
/**
 * Calculates the probability of rolling an exact sum r out of the set of n s-sided dice
 * @param {number} r sum
 * @param {number} n number of dice
 * @param {number} s number of sides of dice
 *
 * Credit:
 * - https://www.cantorsparadise.com/what-to-expect-when-throwing-dice-and-adding-them-up-5231f3831d7
 * - https://www.omnicalculator.com/statistics/dice#how-to-calculate-dice-roll-probability
 *
 * @returns object containing information on the probability of rolling an exact sum
 */
function probabilityOfRollingExactSum(r, n, s) {
    var possibleOutcomes = Math.pow(s, n);
    var favorableOutcomes = 0;
    var kLimit = Math.floor((r - n) / s);
    for (var k = 0; k <= kLimit; k++) {
        favorableOutcomes += Math.pow(-1, k) * (0, js_combinatorics_1.combination)(n, k) * (0, js_combinatorics_1.combination)(r - s * k - 1, n - 1);
    }
    return {
        favorableOutcomes: favorableOutcomes,
        possibleOutcomes: possibleOutcomes,
        fraction: "".concat(favorableOutcomes, "/").concat(possibleOutcomes),
        percentage: favorableOutcomes / possibleOutcomes
    };
}
/**
 * Calculates the probability of rolling a number with the given numberOfDices.
 * @param {*} number
 * @param {*} numberOfDices
 * @returns the probability of rolling a number with the given numberOfDices.
 */
function probabilityOfRollingNumber(number, numberOfDices) {
    return probabilityOfRollingExactSum(number, numberOfDices, DICE_SIDE_COUNT);
}
/**
 * Rolls dices.
 *
 * @returns an object containing information on the rolls
 */
function rollDice(numberOfDices) {
    var sumNumbers = 0;
    var diceNumbers = [];
    for (var i = 0; i < numberOfDices; i++) {
        var numberRolled = Math.floor(Math.random() * DICE_SIDE_COUNT) + 1;
        diceNumbers.push(numberRolled);
        sumNumbers += numberRolled;
    }
    var probabilityOfRollingSum = probabilityOfRollingNumber(sumNumbers, numberOfDices);
    return {
        diceNumbers: diceNumbers,
        sumNumbers: sumNumbers,
        numberOfDices: numberOfDices,
        probabilityOfRollingSum: probabilityOfRollingSum
    };
}
module.exports = function (database, data_ext) {
    return {
        rollDice: rollDice
    };
};
