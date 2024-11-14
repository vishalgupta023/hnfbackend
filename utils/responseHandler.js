let generateError = function (res, message, responseObject)
{
	res.status(400).send({
		"message": message,
		"data": responseObject,
		"status": 400
	});
	res.end();
};

let generateSuccess = function (res, message, responseObject)
{
	res.status(200).send({
		"message": message,
		"data": responseObject,
		"status": 200
	});
	res.end();
};

let generateForbiddenError = function (res)
{
	res.status(403).send({
		"message": 'Access is forbidden',
		"data": null,
		"status": 403
	});
	res.end();
};

module.exports = {
	generateError: generateError,
	generateSuccess: generateSuccess,
	generateForbiddenError: generateForbiddenError
}