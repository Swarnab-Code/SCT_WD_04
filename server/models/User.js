import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	username: { type: String, required: true },
	password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(user.password, salt);
	user.password = hash;
	next();
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;