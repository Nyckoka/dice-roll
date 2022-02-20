"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
/**
 * Site builder.
 * @param services
 * @returns site router
 */
function default_1(services) {
    function rollDice(req, res) {
        services.rollDice(2, 6);
    }
    function sumDistribution(req, res) {
        var numberOfDice = Number(req.query.numberOfDice);
        var diceSideCount = Number(req.query.diceSideCount);
        var numberOfRolls = Number(req.query.numberOfRolls);
        var distribution = (numberOfDice && diceSideCount && numberOfRolls) ?
            services.sumDistribution(numberOfDice, diceSideCount, numberOfRolls)
            :
                undefined;
        res.render('sumDistribution', { numberOfDice: numberOfDice, diceSideCount: diceSideCount, numberOfRolls: numberOfRolls, distribution: distribution });
    }
    var router = express_1["default"].Router();
    router.get("/roll", rollDice);
    router.get("/sumDistribution", sumDistribution);
    router.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
        });
    });
    return router;
}
exports["default"] = default_1;
