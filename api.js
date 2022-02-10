
const express = require("express");
const bodyParser = require('body-parser');

const OpenApiValidator = require('express-openapi-validator');


module.exports = function (services) {

	/**
	 * Rolls a dice.
	 */
	function rollDice(req, res){
		const numberRolled = Math.floor(Math.random() * 6) + 1;

		res.send({
			numberRolled
		})
	}

	const router = express.Router();

	router.use(bodyParser.json());

	/*router.use(
		OpenApiValidator.middleware({
			apiSpec: 'docs/api-spec.yaml',
			validateRequests: true,
			validateResponses: false
		}),
	);*/


	router.get("/roll", rollDice);


	router.use((err, req, res, next) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
	});

	return router;
};
