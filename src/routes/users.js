const express = require('express');
const router = express.Router();
const { createUser, getUser, getUserById, updateUser, deleteUser, getLoyalUser,getUserByRole, getTeam } = require("../controllers/UserController");

router.post("/", createUser);
router.get("/loyal", getLoyalUser);
router.get('/team', getTeam);
router.get("/", getUser);
router.get("/:id", getUserById);
router.get("/role/:roleName", getUserByRole);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
