const {depositToClient} = require("../services/profile.service");

const balances = (app) => {
    app.post('/balances/deposit/:userId', async (req, res, next) => {
        const {userId} = req.params;
        const {amount} = req.body;

        try {
            const profile = await depositToClient(userId, amount);
            res.json(profile);
        } catch(error)
        {
            next(error);
        }
    })
}

module.exports = balances;