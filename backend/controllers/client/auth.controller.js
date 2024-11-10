const bcrypt = require('bcrypt')
const Reader = require('../../models/reader.model');
const ApiError = require('../../helpers/api-error');

//  [POST] /auth/login
module.exports.loginPost = async (req, resizeBy, next) => {
    try {
        const enteredEmail = req.body.email
        const enteredPassword = req.body.password

        const user = await Reader.findOne({ email: enteredEmail });

        if (!user) {
            res.json('wrong info')
            return
        }

        if (!enteredEmail) {
            res.json('wrong info')
            return
        }

        if (enteredPassword != user.password) {
            res.json('wrong info')
            return
        }

        res.cookie("token", user.token)
        res.json('success')
    } catch (error) {
        console.log('error:', error);
        return next(new ApiError(500, error));
    }
}

// [GET] /auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookeie("tokenUser");
    res.send({
        success: true
    })
}