const { Profile } = require("../models")

class ProfileController {
    static async createProfile(req, res, next) {
        const { id } = req.user
        try {
            const { firstName, lastName, hacktivId, role } = req.body
            if (!firstName) {
                throw { name: "BADREQPROFILE", message: "First name is required!" }
            }
            const newProfile = await Profile.create({ firstName, lastName, hacktivId, role, UserId: id })
            res.status(201).json(newProfile)
        } catch (error) {
            next(error)
        }
    }

    static async getUserProfile(req, res, next) {
        const { id } = req.user
        try {
            const user = await Profile.findOne({ where: { UserId: id } })
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async patchMmr(req, res, next) {
        try {
            const { id: UserId } = req.user;
            const { input } = req.body;

            switch (input) {
                case "+20":
                    await Profile.increment({ mmr: 20 }, { where: { UserId } });
                    break;

                case "-10":
                    await Profile.increment({ mmr: -10 }, { where: { UserId } });
                    break;

                case "-20":
                    await Profile.increment({ mmr: -20 }, { where: { UserId } });
                    break;

                default:
                    throw { name: "BADREQUEST", message: "Invalid input" };
            }

            res.json({
                message: "MMR updated"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProfileController