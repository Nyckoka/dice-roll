
const express = require("express");
const bodyParser = require('body-parser');

const OpenApiValidator = require('express-openapi-validator');

const { combination } = require("js-combinatorics");

const DICE_SIDE_COUNT = 6;


/**
 * Calculates the probability of rolling an exact sum r out of the set of n s-sided dice
 * @param {Number} r sum
 * @param {Number} n number of dices
 * @param {Number} s number of sides of dice
 * 
 * Credit:
 * - https://www.cantorsparadise.com/what-to-expect-when-throwing-dice-and-adding-them-up-5231f3831d7
 * - https://www.omnicalculator.com/statistics/dice#how-to-calculate-dice-roll-probability
 * 
 * @returns object containing information on the probability of rolling an exact sum
 */
function probabilityOfRollingExactSum(r, n, s) {
	const possibleOutcomes = Math.pow(s, n);

	let favorableOutcomes = 0;

	const kLimit = Math.floor((r - n) / s);

	for (let k = 0; k <= kLimit; k++) {
		favorableOutcomes += Math.pow(-1, k) * combination(n, k) * combination(r - s * k - 1, n - 1)
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
function probabilityOfRollingNumber(number, numberOfDices) {
	return probabilityOfRollingExactSum(number, numberOfDices, DICE_SIDE_COUNT);
}


module.exports = function (services) {

	/**
	 * Rolls dices.
	 * 
	 * Query:
	 * - Number of dices to roll
	 */
	function rollDice(req, res) {
		const numberOfDices = req.query.numberOfDices;

		let numberRolled = 0;

		for (let i = 0; i < numberOfDices; i++) {
			numberRolled += Math.floor(Math.random() * DICE_SIDE_COUNT) + 1;
		}

		const probabilityOfRolling = probabilityOfRollingNumber(numberRolled, numberOfDices);

		res.send({
			numberRolled,
			numberOfDices,
			probabilityOfRolling
		})
	}

	const router = express.Router();

	router.use(bodyParser.json());

	router.use(
		OpenApiValidator.middleware({
			apiSpec: 'docs/api-spec.yaml',
			validateRequests: true,
			validateResponses: false
		}),
	);


	router.get("/roll", rollDice);


	router.use((err, req, res, next) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
	});

	return router;
};
