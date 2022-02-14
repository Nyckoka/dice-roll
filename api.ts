
import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import OpenApiValidator from 'express-openapi-validator';

import { services } from "./interfaces";


module.exports = function (services: services) {

	/**
	 * Rolls dice.
	 * 
	 * Query:
	 * - Number of dices to roll
	 */
	function rollDice(req: Request, res: Response) {
		const numberOfDices = req.query.numberOfDices;

		res.send(services.rollDice(numberOfDices))
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


	router.use((err: { status: number, message: string, errors: Object }, req: Request, res: Response, next: {}) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
	});

	return router;
};
