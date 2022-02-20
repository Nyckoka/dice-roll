
import express, { Request, Response, Router } from "express";
import bodyParser from 'body-parser';
import * as OpenApiValidator from 'express-openapi-validator';

import { Services } from "./interfaces";


const DEFAULT_NUMBER_OF_DICE = 2;
const DEFAULT_DICE_SIDE_COUNT = 6;


/**
 * Api builder.
 * @param services 
 * @returns api router
 */
export default function (services: Services): Router {

	/**
	 * Rolls dice.
	 * 
	 * Query:
	 * - Number of dice to roll
	 * - Number of sides of the dice
	 */
	function rollDice(req: Request, res: Response) {
		const numberOfDice: number = Number(req.query.numberOfDice) || DEFAULT_NUMBER_OF_DICE;
		const diceSideCount: number = Number(req.query.diceSideCount) || DEFAULT_DICE_SIDE_COUNT;

		res.send(services.rollDice(numberOfDice, diceSideCount));
	}


	/**
	 * Get the distribution of the sum of dice rolls.
	 * 
	 * Query:
	 * - Number of dice to roll
	 * - Number of sides of the dice
	 * - Number of rolls
	 */
	function sumDistribution(req: Request, res: Response) {
		const numberOfDice: number = Number(req.query.numberOfDice) || DEFAULT_NUMBER_OF_DICE;
		const diceSideCount: number = Number(req.query.diceSideCount) || DEFAULT_DICE_SIDE_COUNT;
		const numberOfRolls: number = Number(req.query.numberOfRolls) || 1;

		res.send(services.sumDistribution(numberOfDice, diceSideCount, numberOfRolls));
	}


	const router = express.Router();

	router.use(bodyParser.json());

	router.use(
		OpenApiValidator.middleware({
			apiSpec: 'docs/api-spec.yaml',
			validateRequests: true,
			validateResponses: false
		})
	);


	router.get("/roll", rollDice);
	router.get("/sumDistribution", sumDistribution);



	router.use((err, req: Request, res: Response, next: {}) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
		console.log(err)
	});

	return router;
};
