"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var OpenApiValidator = __importStar(require("express-openapi-validator"));
var DEFAULT_NUMBER_OF_DICE = 2;
var DEFAULT_DICE_SIDE_COUNT = 6;
/**
 * Api builder.
 * @param services
 * @returns api router
 */
function default_1(services) {
    /**
     * Rolls dice.
     *
     * Query:
     * - Number of dice to roll
     * - Number of sides of the dice
     */
    function rollDice(req, res) {
        var numberOfDice = Number(req.query.numberOfDice) || DEFAULT_NUMBER_OF_DICE;
        var diceSideCount = Number(req.query.diceSideCount) || DEFAULT_DICE_SIDE_COUNT;
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
    function sumDistribution(req, res) {
        var numberOfDice = Number(req.query.numberOfDice) || DEFAULT_NUMBER_OF_DICE;
        var diceSideCount = Number(req.query.diceSideCount) || DEFAULT_DICE_SIDE_COUNT;
        var numberOfRolls = Number(req.query.numberOfRolls) || 1;
        res.send(services.sumDistribution(numberOfDice, diceSideCount, numberOfRolls));
    }
    var router = express_1["default"].Router();
    router.use(body_parser_1["default"].json());
    router.use(OpenApiValidator.middleware({
        apiSpec: 'docs/api-spec.yaml',
        validateRequests: true,
        validateResponses: false
    }));
    router.get("/roll", rollDice);
    router.get("/sumDistribution", sumDistribution);
    router.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
        });
        console.log(err);
    });
    return router;
}
exports["default"] = default_1;
;
