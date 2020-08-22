const User = require('./../../model/User');
const UserRole = require('./../../model/Role');

module.exports = {
    level_7: async (req, res, next) => {
        if (!req.currentUser) 
            return res.status(401).json({ error: "Access denied" });

        try {
          const currentUser = await User.findOne({_id: req.currentUser.id}).populate('role');
          
          if (currentUser.role.level > 7)
            return res.status(405).json({ error: "Not allow"});
          
          next();
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
    }
}