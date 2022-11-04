const {getProfile} = require("../middleware/getProfile.middleware");
const {getUnpaidJobs, payJob} = require("../services/job.service");

const jobs = (app) => {
    app.get('/jobs/unpaid', getProfile, async (req, res) => {
        const jobs = await getUnpaidJobs(req.profile.id);

        res.json(jobs);
    });

    app.post('/jobs/:job_id/pay', getProfile, async(req, res, next) => {
        const {job_id} = req.params;
        const {id} = req.profile;

        try {
            const job = await payJob(job_id, id);

            res.json(job);
        }
        catch(error)
        {
            next(error);
        }
    });
}

module.exports = jobs;