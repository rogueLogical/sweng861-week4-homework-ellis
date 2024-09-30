const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// connect to mongoDB Atlas
mongoose.connect('mongodb+srv://cbe5252:0RWiMkKKVIrjKG5s@w4-hw-cluster.eporg.mongodb.net/?retryWrites=true&w=majority&appName=w4-hw-cluster')

const userSchema = new mongoose.Schema({
    username:       { type: String, required: true, unique: true },
    password:       { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    dob:            { type: Date, required: true },
    organization:   { type: String, required: false },
    occupation:     { type: String, required: false },
    zodiac:         { type: String, required: false }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
