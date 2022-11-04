const {getProfile} = require("../middleware/getProfile.middleware");
const {getUnpaidJobs} = require("../services/job.service");

const jobs = (app) => {
    app.get('/jobs/unpaid', getProfile, async (req, res) => {
        const jobs = await getUnpaidJobs(req.profile.id);

        res.json(jobs);
    });
}

module.exports = jobs;