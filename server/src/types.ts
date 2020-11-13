import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './Model/User';
import { Request, Response } from 'express';
import { Post } from './Model/Post';

export interface Context {
	UserModel: ReturnModelType<typeof User, {}>;
	PostModel: ReturnModelType<typeof Post, {}>;
	req: Request;
	res: Response;
}
