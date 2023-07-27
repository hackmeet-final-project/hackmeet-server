const {Profile} = require("../models")

class ProfileController {
    static async createProfile(req, res, next) {
        const {id} = req.user
        try {
            const {firstName, lastName, hacktivId, role} = req.body
            if(!firstName) {
                throw {name: "BADREQPROFILE", message: "First name is required!"}
            }
            const newProfile = await Profile.create({firstName, lastName, hacktivId, role, UserId: id})
            res.status(201).json(newProfile)
        } catch (error) {
            next(error)
        }
    }

    static async getUserProfile(req, res, next) {
        const {id} = req.user
        try {
            const user = await Profile.findOne({where: {UserId:id}})
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProfileController