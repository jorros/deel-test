const {getProfile} = require("../middleware/getProfile.middleware");
const {getContractById} = require("../services/contract.service");

const contracts = (app) => {
    app.get('/contracts/:id', getProfile, async (req, res) => {
        const {id} = req.params
        const contract = await getContractById(id, req.profile.id);

        if (!contract) {
            return res.status(404).end()
        }

        res.json(contract)
    })
}

module.exports = contracts;