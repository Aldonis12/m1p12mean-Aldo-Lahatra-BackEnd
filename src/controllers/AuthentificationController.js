const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { mail, pswd } = req.body;

    const user = await User.findOne({ mail: mail }).populate("role");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(pswd, user.pswd);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

module.exports = { login };