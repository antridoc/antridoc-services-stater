const router = require("express").Router();
const loggedMiddleware = require('./middleware/validate-token');
const roleMiddleware = require('./middleware/checkRole');

const authRoute = require('./auth');
const usersRoute = require('./users');

//Auth
router.post('/api/auth/login', authRoute.login);
router.post('/api/auth/register', authRoute.register);
router.get('/api/auth/verify-email', authRoute.verifyEmail);
router.get('/api/auth/resend-verify-email', loggedMiddleware, authRoute.resendVerifyEmail);
router.post('/api/auth/forgot-password', authRoute.forgotPassword);
router.post('/api/auth/reset-password', authRoute.resetPassword);

// Users
router.get('/api/user/', [
    loggedMiddleware, 
    roleMiddleware.level_7 // aalow roles {super_admin, admin, owner_hospital}
], usersRoute.getUsers);

module.exports = router;