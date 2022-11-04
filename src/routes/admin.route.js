const {
  getBestProfession,
  getBestClients,
} = require('../services/admin.service');
const admin = (app) => {
  app.get('/admin/best-profession', async (req, res) => {
    const { start, end } = req.query;

    const bestProfession = await getBestProfession(start, end);
    res.json(bestProfession);
  });

  app.get('/admin/best-clients', async (req, res, next) => {
    const { start, end, limit } = req.query;

    const bestClients = await getBestClients(start, end, limit);
    res.json(bestClients);
  });
};

module.exports = admin;
