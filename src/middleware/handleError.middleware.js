const {DeelError} = require("../errors");

const handleError = (err, req, res, next) => {
    console.error(err);

    if (err instanceof DeelError) {
        res.status(400).json(err);

        return;
    }

    res.status(500).json(new DeelError("SERVER_ERROR", 'A server error has occurred.'));
};

module.exports = {handleError};