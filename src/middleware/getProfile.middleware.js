const {getProfileById} = require("../services/profile.service");

const getProfile = async (req, res, next) => {
    const profile = await getProfileById(req.get('profile_id') || 0);

    if (!profile) {
        return res.status(401).end()
    }

    req.profile = profile
    next()
};

module.exports = {getProfile};