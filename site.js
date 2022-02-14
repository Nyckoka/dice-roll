


module.exports = function(services){

    const router = express.Router();

	router.use(bodyParser.json());


	router.get("/roll", rollDice);

	router.use((err, req, res, next) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
	});

	return router;

}

