import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export async function registerUser(req, res) {
	const { firstName, lastName, username, password } = req.body;
	try {
		const duplicate = await User.find({ username });
		if (duplicate && duplicate.length > 0) {
			return res.status(400).send({
				message: 'User already registered with this username',
			});
		}

		const user = new User({ firstName, lastName, username, password });
		const result = await user.save();
		console.log(result);
		res.status(201).send({ message: 'User registered successfully!' });
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

export async function loginUser(req, res) {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).send({ message: 'Authentication Failed!' });
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res
				.status(404)
				.send({ message: 'You Entered Wrong Password' });
		}

		const token = jwt.sign({ userId: user?._id }, secretKey, {
			expiresIn: '1h',
		});
		const finalData = {
			userId: user?._id,
			username: user?.username,
			firstName: user?.firstName,
			lastName: user?.lastName,
			token,
		};

		res.send(finalData);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}
