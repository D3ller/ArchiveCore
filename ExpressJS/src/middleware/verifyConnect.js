export const middleware = async (req, res, next) => {
try {
    if (!req.session.loggedin) {
        return res.status(401).json({message: 'User is not logged in'});
    }
    next();

} catch (err) {
    return res.status(500).json({message: 'An error occurred while verifying the user'});
}

}