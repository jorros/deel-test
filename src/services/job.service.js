const {Job, Contract} = require("../model");
const {Op} = require("sequelize");

/**
 * Returns all unpaid jobs that have an active contract for this profile
 *
 * @param {Number} profileId - The profile requesting this contract
 * @returns {Promise.<Job[]>} A list of all jobs
 */
const getUnpaidJobs = (profileId) => {
    return Job.findAll({
        where: {
            paid: false
        },
        include: [
            {
                model: Contract,
                attributes: [],
                required: true,
                where: {
                    [Op.or]: [
                        {
                            ClientId: profileId
                        },
                        {
                            ContractorId: profileId
                        }
                    ],
                    status: 'in_progress'
                }
            }
        ]
    })
}

module.exports = {getUnpaidJobs}