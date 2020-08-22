const User = require("../model/User");
const UserRole = require("../model/Role");

module.exports = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find(req.query, 'id name email').populate('role', 'name slug');
            res.json({error: null, data: users});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    } 
}