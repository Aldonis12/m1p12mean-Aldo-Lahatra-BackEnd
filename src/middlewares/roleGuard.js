const roleGuard = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role.name == role) {
            next();
        } else {
            res.status(403).json({message: "Insufficient permissions"});
        }
    }
}

module.exports = roleGuard;