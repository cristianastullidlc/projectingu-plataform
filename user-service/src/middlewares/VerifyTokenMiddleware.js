export const verifyTokenMiddleware = (tokenService) => {

    return (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Unauthorized - token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = tokenService.verify(token);

            // 🔥 inyectamos usuario en request
            req.user = {
                userId: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                providerId: decoded.providerId
            };

            next();
        } catch (error) {
            return res.status(401).json({
                error: "Unauthorized - invalid or expired token"
            });
        }
    };
};