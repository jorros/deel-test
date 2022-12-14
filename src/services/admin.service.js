const { Job, Contract, Profile } = require('../model');
const { fn, col, Op } = require('sequelize');

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 *
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {Promise.<String>} The profession that earned the most
 */
const getBestProfession = async (startDate, endDate) => {
  const job = await Job.findOne({
    attributes: [[fn('sum', col('price')), 'totalPaid'], 'Contract.Contractor.profession'],
    order: [['totalPaid', 'DESC']],
    group: ['Contract.Contractor.profession'],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    raw: true,
    nest: true,
    includeIgnoreAttributes: false,
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            attributes: ['profession'],
            as: 'Contractor',
            where: {
              type: 'contractor',
            },
          },
        ],
      },
    ]
  });

  if (!job) {
    return null;
  }

  return {
    profession: job.profession,
  };
};

/**
 * Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 *
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @param {Number} limit - The maximum number of clients to be returned
 * @returns {Promise.<Object>} List of objects that contain client id, full name and amount paid
 */
const getBestClients = async (startDate, endDate, limit = 2) => {
  const result = await Job.findAll({
    limit: limit,
    attributes: [[fn('sum', col('price')), 'paid']],
    order: [['paid', 'DESC']],
    group: ['Contract.Client.id'],
    raw: true,
    nest: true,
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            attributes: ['firstName', 'lastName', 'id'],
            as: 'Client',
            where: {
              type: 'client',
            },
          },
        ],
      },
    ],
  });

  return result.map((job) => {
    return {
      id: job.Contract.Client.id,
      fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
      paid: job.paid,
    };
  });
};

module.exports = { getBestProfession, getBestClients };
