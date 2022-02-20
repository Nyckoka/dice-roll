"use strict";
exports.__esModule = true;
var js_combinatorics_1 = require("js-combinatorics");
/**
 * Services builder.
 * @param database
 * @param data_ext
 * @returns services
 */
function default_1(database, data_ext) {
    return {
        rollDice: rollDice,
        sumDistribution: sumDistribution
    };
}
exports["default"] = default_1;
/**
 * Rolls dice.
 *
 * @param numberOfDice number of dice
 * @param diceSideCount number of sides of the dice
 *
 * @returns an object containing information on the rolls
 */
function rollDice(numberOfDice, diceSideCount) {
    var sumNumbers = 0;
    var diceNumbers = [];
    for (var i = 0; i < numberOfDice; i++) {
        var numberRolled = Math.floor(Math.random() * diceSideCount) + 1;
        diceNumbers.push(numberRolled);
        sumNumbers += numberRolled;
    }
    var probabilityOfRollingSum = probabilityOfRollingExactSum(sumNumbers, numberOfDice, diceSideCount);
    return {
        diceNumbers: diceNumbers,
        diceSideCount: diceSideCount,
        sumNumbers: sumNumbers,
        numberOfDice: numberOfDice,
        probabilityOfRollingSum: probabilityOfRollingSum
    };
}
/**
 * Get the distribution of the sum of dice rolls.
 *
 * @param numberOfDice number of dice
 * @param diceSideCount number of sides of the dice
 * @param numberOfRolls number of dice rolls
 *
 * @returns distribution, a map between a number and the amount of times that number was rolled
 */
function sumDistribution(numberOfDice, diceSideCount, numberOfRolls) {
    var distribution = {};
    for (var i = 0; i < numberOfRolls; i++) {
        var roll = rollDice(numberOfDice, diceSideCount);
        if (distribution[roll.sumNumbers])
            distribution[roll.sumNumbers]++;
        else
            distribution[roll.sumNumbers] = 1;
    }
    return distribution;
}
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
        favorableOutcomes += Math.pow(-1, k) * Number((0, js_combinatorics_1.combination)(n, k)) * Number((0, js_combinatorics_1.combination)(r - s * k - 1, n - 1));
    }
    return {
        favorableOutcomes: favorableOutcomes,
        possibleOutcomes: possibleOutcomes,
        fraction: "".concat(favorableOutcomes, "/").concat(possibleOutcomes),
        percentage: favorableOutcomes / possibleOutcomes
    };
}
