const {Contract} = require('../model');
const {Op} = require("sequelize");

/**
 * Queries the database to fetch a contract by its ID
 *
 * @param {Number} id - The contract id
 * @param {Number} profileId - The profile requesting this contract
 * @returns {Promise.<Contract>} A Contract entity
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
    });

    return contract;
}

/**
 * Queries the database to fetch all non terminated contracts connected to the profile
 *
 * @param {Number} profileId - The profile requesting the contracts
 * @returns {Promise.<Contract[]>} All contracts
 */
const getContracts = async (profileId) => {
    const contracts = await Contract.findAll({
        where: {
            status: {
                [Op.ne]: 'terminated'
            },
            [Op.or]: [
                {
                    ClientId: profileId
                },
                {
                    ContractorId: profileId
                }
            ]
        }
    });

    return contracts;
}

module.exports = {getContractById, getContracts};