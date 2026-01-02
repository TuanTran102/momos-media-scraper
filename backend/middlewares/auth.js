const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({ error: 'Authentication required' });
    }

    const [scheme, credentials] = authHeader.split(' ');

    if (scheme !== 'Basic' || !credentials) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({ error: 'Invalid authentication format' });
    }

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

    const VALID_USER = process.env.API_USER || 'admin';
    const VALID_PASS = process.env.API_PASS || 'admin';

    if (username === VALID_USER && password === VALID_PASS) {
        req.user = username;
        return next();
    }

    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Invalid credentials' });
};

module.exports = basicAuth;
