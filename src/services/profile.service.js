const {Profile} = require("../model");

/**
 * Queries the database to fetch a profile by its ID
 *
 * @param {Number} id - The profile id
 * @returns {Contract} A profile entity
 */
const getProfileById = async (id) => {
    const profile = await Profile.findOne({where: {id}})

    return profile;
}

module.exports = { getProfileById };