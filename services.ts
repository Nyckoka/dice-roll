
import { combination } from "js-combinatorics";
import { services } from "./interfaces";

const DICE_SIDE_COUNT = 6;


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
function probabilityOfRollingExactSum(r: number, n: number, s: number) {
	const possibleOutcomes = Math.pow(s, n);

	let favorableOutcomes = 0;

	const kLimit = Math.floor((r - n) / s);

	for (let k = 0; k <= kLimit; k++) {
		favorableOutcomes += Math.pow(-1, k) * combination(n, k) * combination(r - s * k - 1, n - 1);
	}

	return {
		favorableOutcomes,
		possibleOutcomes,
		fraction: `${favorableOutcomes}/${possibleOutcomes}`,
		percentage: favorableOutcomes / possibleOutcomes
	};
}

/**
 * Calculates the probability of rolling a number with the given numberOfDices.
 * @param {*} number 
 * @param {*} numberOfDices 
 * @returns the probability of rolling a number with the given numberOfDices.
 */
function probabilityOfRollingNumber(number: number, numberOfDices: number) {
	return probabilityOfRollingExactSum(number, numberOfDices, DICE_SIDE_COUNT);
}


/**
 * Rolls dices.
 * 
 * @returns an object containing information on the rolls
 */
function rollDice(numberOfDices: number) {
	let sumNumbers = 0;

	const diceNumbers = [];

	for (let i = 0; i < numberOfDices; i++) {
		const numberRolled = Math.floor(Math.random() * DICE_SIDE_COUNT) + 1;

		diceNumbers.push(numberRolled);

		sumNumbers += numberRolled;
	}

	const probabilityOfRollingSum = probabilityOfRollingNumber(sumNumbers, numberOfDices);

	return {
		diceNumbers,
		sumNumbers,
		numberOfDices,
		probabilityOfRollingSum
	}
}


module.exports = function (database: any, data_ext: any): services {


	return {
		rollDice
	}
}
