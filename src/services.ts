
import { combination } from "js-combinatorics";
import { DataBase, DataExt, ProbabilityOfRollingExactSum, Services } from "./interfaces";


/**
 * Services builder.
 * @param database 
 * @param data_ext 
 * @returns services
 */
export default function (database: DataBase, data_ext: DataExt): Services {

	return {
		rollDice,
		sumDistribution
	}
}


/**
 * Rolls dice.
 * 
 * @param numberOfDice number of dice
 * @param diceSideCount number of sides of the dice
 * 
 * @returns an object containing information on the rolls
 */
function rollDice(numberOfDice: number, diceSideCount: number) {
	let sumNumbers = 0;

	const diceNumbers: number[] = [];

	for (let i = 0; i < numberOfDice; i++) {
		const numberRolled = Math.floor(Math.random() * diceSideCount) + 1;

		diceNumbers.push(numberRolled);

		sumNumbers += numberRolled;
	}

	const probabilityOfRollingSum = probabilityOfRollingExactSum(sumNumbers, numberOfDice, diceSideCount);

	return {
		diceNumbers,
		diceSideCount,
		sumNumbers,
		numberOfDice,
		probabilityOfRollingSum
	}
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
function sumDistribution(numberOfDice: number, diceSideCount: number, numberOfRolls: number) {
	const distribution = {};

	for(let i = 0; i < numberOfRolls; i++){
		const roll = rollDice(numberOfDice, diceSideCount);

		if(distribution[roll.sumNumbers]) distribution[roll.sumNumbers]++
		else distribution[roll.sumNumbers] = 1;
	}

	return distribution
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
function probabilityOfRollingExactSum(r: number, n: number, s: number): ProbabilityOfRollingExactSum {
	const possibleOutcomes = Math.pow(s, n);

	let favorableOutcomes = 0;

	const kLimit = Math.floor((r - n) / s);

	for (let k = 0; k <= kLimit; k++) {
		favorableOutcomes += Math.pow(-1, k) * Number(combination(n, k)) * Number(combination(r - s * k - 1, n - 1));
	}

	return {
		favorableOutcomes,
		possibleOutcomes,
		fraction: `${favorableOutcomes}/${possibleOutcomes}`,
		percentage: favorableOutcomes / possibleOutcomes
	};
}
