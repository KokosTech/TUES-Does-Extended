const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
/*         if(!req.header("Authorization"))
            throw new Error("No authorization header"); */
        
        /* const token = req.headers.authorization.split(" ")[1];
        const decodedToken = verify(token, process.env.JWT_SECRET);
        const { userId } = decodedToken; */
        //console.log(userId);
        //if(req.params.id === userId) 

        // req.session.user && req.session.user.username ? next() : res.status(401).json({ message: "You must be logged in to access this route" });
        next();
    } catch (err) {
        res.status(401).json({ 
            message: "You must be logged in to access this route" 
        });
    }
}