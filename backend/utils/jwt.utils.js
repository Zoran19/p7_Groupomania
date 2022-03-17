var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'yga5aigcv7zr655a8h3qqgm1swkoe1msenb09qca4852wb2ze1lgm5fwk3zkcndc18unrkrroan5w6mv6m1h2jbrcqk9jmhxh5w2';

// Exported functions
module.exports = {
    generateTokenForUser: function (userData) {
        return jwt.sign({
                userId: userData.id,
                isAdmin: userData.isAdmin
            },
            JWT_SIGN_SECRET,
            {
                expiresIn: '1h'
            })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null)
                    userId = jwtToken.userId;
            } catch(err) { }
        }
        return userId;
    }
}