// authenticates JWT
import { getModelForClass } from '@typegoose/typegoose';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../Model/User';
import { tokenize } from '../tokenize';

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if the header exists then we are authorized

	const tokenAccess = req.cookies['access']; // extract token
	const tokenRefresh = req.cookies['refresh'];

	if (!tokenAccess) return next();

	try {
		const data = verify(tokenAccess, 'licorice') as any;
		req.userId = data.userId;
		return next();
	} catch {
		console.log('Access token is expired. Checking if refresh is valid');
	}

	if (!tokenRefresh) return next();

	let data: any;

	try {
		data = verify(tokenRefresh, 'lollipop') as any;
	} catch {
		return next(); // if refresh is invalid then the user is NOT authenticated
	}

	// Find the user
	const UserModel = getModelForClass(User);
	const user = await UserModel.findOne({ _id: data.userId });

	if (!user) return next();

	const { access, refresh } = tokenize(user!);
	res.cookie('access', access);
	res.cookie('refresh', refresh);
	req.userId = user._id;

	return next();
};

module.exports = authenticate;
