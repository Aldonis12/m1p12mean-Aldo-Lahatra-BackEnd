const express = require('express');
const router = express.Router();
const { createUser, getUser, getUserById, updateUser, deleteUser } = require("../controllers/UserController");

router.post("/", createUser);
router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
