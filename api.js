"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var express_openapi_validator_1 = require("express-openapi-validator");
module.exports = function (services) {
    /**
     * Rolls dice.
     *
     * Query:
     * - Number of dices to roll
     */
    function rollDice(req, res) {
        var numberOfDices = req.query.numberOfDices;
        res.send(services.rollDice(numberOfDices));
    }
    var router = express_1["default"].Router();
    router.use(body_parser_1["default"].json());
    router.use(express_openapi_validator_1["default"].middleware({
        apiSpec: 'docs/api-spec.yaml',
        validateRequests: true,
        validateResponses: false
    }));
    router.get("/roll", rollDice);
    router.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
        });
    });
    return router;
};
