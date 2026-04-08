import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(401).json({ message: 'Token is missing' });
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token is invalid' });
        req.user = user;
        next();
    });
};
//# sourceMappingURL=auth.middleware.js.map