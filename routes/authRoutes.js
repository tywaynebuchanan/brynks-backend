const { register, login,getUserInfo,
	getUsers,
	updateUserStatus,
	changePassword,
	ResetPasswordByEmail,
	changePasswordByAdmin, } = require("../controllers/authControllers");
const { checkUser,authorizedRoles } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", checkUser); 
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/user", checkUser, getUserInfo)

router.post("/auth/password",checkUser, changePassword)
router.post("/auth/email-forgot-password", ResetPasswordByEmail)

router.get("/auth/admin/users", getUsers)
router.post("/auth/admin/verify-user",authorizedRoles("admin"),updateUserStatus)
router.post("/auth/admin/reset-user-password",authorizedRoles("admin"),changePasswordByAdmin)

module.exports = router;
