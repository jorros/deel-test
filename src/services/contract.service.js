const {Contract} = require('../model');
const {Op} = require("sequelize");

/**
 * Queries the database to fetch a contract by its ID
 *
 * @param {Number} id - The contract id
 * @param {Number} profileId - The profile requesting this contract
 * @returns {Contract} A Contract entity
 */
const getContractById = async (id, profileId) => {
    const contract = await Contract.findOne({
        where: {
            id,
            [Op.or]: [
                {
                    ClientId: profileId
                },
                {
                    ContractorId: profileId
                }
            ]
        }
    })

    return contract;
}

module.exports = {getContractById};