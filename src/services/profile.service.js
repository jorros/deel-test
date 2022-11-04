const {Profile, sequelize, Job, Contract} = require("../model");
const {DeelError, ErrorCodes} = require("../errors");

/**
 * Queries the database to fetch a profile by its ID
 *
 * @param {Number} id - The profile id
 * @returns {Contract} A profile entity
 */
const getProfileById = async (id) => {
    const profile = await Profile.findByPk(id);

    return profile;
}

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 *
 * @param {Number} id - The profile id of the client
 * @param {Number} amount - The amount to deposit
 * @returns {Contract} A profile entity
 */
const depositToClient = async (id, amount) => {
    const result = await sequelize.transaction(async transaction => {
        const client = await Profile.findOne({
            where: {
                id,
                type: 'client'
            },
            transaction
        });

        if (!client) {
            throw new DeelError(ErrorCodes.CLIENT_NOT_FOUND, 'The profile is not a valid client');
        }

        const sumOfUnpaidJobs = await Job.sum('price', {
            where: {
                paid: false
            },
            include: [
                {
                    model: Contract,
                    required: true,
                    where: {
                        status: 'in_progress',
                        ClientId: id
                    }
                }
            ],
            transaction
        }) || 0;
        const maxAllowed = sumOfUnpaidJobs * 0.25;

        if (amount > maxAllowed) {
            throw new DeelError(ErrorCodes.TOO_HIGH_AMOUNT, 'The amount to pay in is too high.')
        }

        client.balance += amount;

        await client.save({transaction});

        return client;
    });

    return result;
}


module.exports = {getProfileById, depositToClient};