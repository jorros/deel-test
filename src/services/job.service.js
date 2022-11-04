const { Job, Contract, sequelize, Profile } = require('../model');
const { Op } = require('sequelize');
const { DeelError, ErrorCodes } = require('../errors');

/**
 * Returns all unpaid jobs that have an active contract for this profile
 *
 * @param {Number} profileId - The profile requesting this contract
 * @returns {Promise.<Job[]>} A list of all jobs
 */
const getUnpaidJobs = (profileId) => {
  return Job.findAll({
    where: {
      paid: false,
    },
    include: [
      {
        model: Contract,
        attributes: [],
        required: true,
        where: {
          [Op.or]: [
            {
              ClientId: profileId,
            },
            {
              ContractorId: profileId,
            },
          ],
          status: 'in_progress',
        },
      },
    ],
  });
};

/**
 * Submit payment to a job from client
 *
 * @param {Number} id - The job id
 * @param {Number} clientId - The client that pays
 * @returns {Promise.<Job[]>} A list of all jobs
 */
const payJob = async (id, clientId) => {
  const result = await sequelize.transaction(async (transaction) => {
    const job = await Job.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Contract,
          attributes: ['ContractorId'],
          required: true,
          where: {
            ClientId: clientId,
          },
        },
      ],
      transaction,
    });

    if (!job) {
      throw new DeelError(ErrorCodes.JOB_NOT_FOUND, 'Could not find job.');
    }
    if (job.paid) {
      throw new DeelError(ErrorCodes.JOB_ALREADY_PAID, 'Job already paid.');
    }

    const client = await Profile.findByPk(clientId, { transaction });

    if (client.balance < job.price) {
      throw new DeelError(
        ErrorCodes.CLIENT_NOT_ENOUGH_BALANCE,
        'Not enough balance.'
      );
    }

    const contractor = await Profile.findByPk(job.Contract.ContractorId, {
      transaction,
    });

    client.balance -= job.price;
    contractor.balance += job.price;
    job.paid = true;
    job.paymentDate = new Date().toISOString();

    await Promise.all([
      job.save({ transaction }),
      client.save({ transaction }),
      contractor.save({ transaction }),
    ]);

    return job;
  });

  return result;
};

module.exports = { getUnpaidJobs, payJob };
