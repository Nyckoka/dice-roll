
export interface DataBase {

}

export interface DataExt {

}



/*
 Services
*/
export interface Services {
	rollDice: RollDice,
	sumDistribution: (numberOfDice: number, diceSideCount: number, numberOfRolls: number) => Object
}


/**
 * Rolls dice.
 * @param numberOfDice number of dice
 * @param diceSideCount number of sides of the dice
 * 
 * @returns an object containing information on the rolls
 */
interface RollDice {
	(numberOfDice: number, diceSideCount: number): {
		diceNumbers: number[],
		diceSideCount: number,
		sumNumbers: number,
		numberOfDice: number,
		probabilityOfRollingSum: ProbabilityOfRollingExactSum
	}
}


export interface ProbabilityOfRollingExactSum {
	favorableOutcomes: number;
	possibleOutcomes: number;
	fraction: string;
	percentage: number;
}
