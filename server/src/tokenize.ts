import { sign } from 'jsonwebtoken';
import { User } from './Model/User';

export const tokenize = (user: User) => {
	const refresh = sign({ userId: user._id }, 'lollipop', { expiresIn: '7d' });
	const access = sign({ userId: user._id }, 'licorice', {
		expiresIn: '15min',
	});

	return { refresh, access };
};
