const {getProfile} = require("../middleware/getProfile.middleware");
const {getUnpaidJobs, payJob} = require("../services/job.service");
const {DeelError} = require("../errors");

const jobs = (app) => {
    app.get('/jobs/unpaid', getProfile, async (req, res) => {
        const jobs = await getUnpaidJobs(req.profile.id);

        res.json(jobs);
    });

    app.post('/jobs/:job_id/pay', getProfile, async(req, res) => {
        const {job_id} = req.params;
        const {id} = req.profile;

        try {
            const job = await payJob(job_id, id);

            res.json(job);
        }
        catch(error)
        {
            if(error instanceof DeelError) {
                res.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
        }
    });
}

module.exports = jobs;