/**
 * Created by andyf on 4/14/2017.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String,
        admin: Boolean
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        admin: Boolean
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        admin: Boolean
    }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);