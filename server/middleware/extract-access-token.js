const extractAccessToken = (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token part after 'Bearer '
        req.accessToken = authHeader.split(' ')[1];
        next(); // Call next to continue to the route handler
    } else {
        // Send a 401 Unauthorized response if token is missing or improperly formatted
        res.status(401).json({ message: 'Access token not provided or improperly formatted.' });
    }
};

module.exports = extractAccessToken;