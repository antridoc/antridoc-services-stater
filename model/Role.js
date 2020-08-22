const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  slug: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    unique: true,
  },
  level: {
    type: Number,
    default: 9,
    min: 1,
    max: 9,
  }
});

userRoleSchema.static('syncRoles', () => {
    const roles = [
        {name: "Patien", slug: "patien", level: 9},
        {name: "Admin Poli", slug: "admin-poli", level: 8},
        {name: "Admin Hospital", slug: "admin-hospital", level: 8},
        {name: "Owner Hospital", slug: "owner-hospital", level: 7},
        {name: "Admin", slug: "admin", level: 2},
        {name: "Super Admin", slug: "super_admin", level: 1},
    ];

    mongoose.model("UserRole").create(roles, (err) => {
        if (err) return console.error('sync user roles: existing');
        return console.log('sync user roles:', 'synchronized');
    });
});

module.exports = mongoose.model("UserRole", userRoleSchema);
