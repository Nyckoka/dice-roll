
import express, { Request, Response, Router } from "express";
import bodyParser from 'body-parser';

import { Services } from "./interfaces";


/**
 * Site builder.
 * @param services 
 * @returns site router
 */
export default function (services: Services): Router {

    function rollDice(req: Request, res: Response) {
        services.rollDice(2, 6);
    }

    function sumDistribution(req: Request, res: Response) {
        const numberOfDice: number = Number(req.query.numberOfDice);
        const diceSideCount: number = Number(req.query.diceSideCount);
        const numberOfRolls: number = Number(req.query.numberOfRolls);

        const distribution = (numberOfDice && diceSideCount && numberOfRolls) ?
            services.sumDistribution(numberOfDice, diceSideCount, numberOfRolls)
            :
            undefined;

        res.render('sumDistribution', { numberOfDice, diceSideCount, numberOfRolls, distribution });
    }


    const router = express.Router();
    
    router.get("/roll", rollDice);
    router.get("/sumDistribution", sumDistribution);

    router.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return router;
}
