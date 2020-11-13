import { ObjectType, InputType, Field, ID, Int } from 'type-graphql';
import { mongoose, prop, Ref } from '@typegoose/typegoose';
import { Post } from './Post';

@InputType()
@ObjectType()
export class User {
	@Field(() => ID, { nullable: true })
	_id?: string;

	@Field()
	@prop({ required: true })
	name!: string;

	@Field()
	@prop({ required: true })
	email!: string;

	@Field()
	@prop({ required: true })
	password!: string;

	@Field(() => Int)
	@prop({ required: true })
	supporters!: number;

	@Field(() => [User])
	@prop({
		ref: 'User',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		default: false,
	})
	supporting!: Ref<User>[];

	@Field(() => Boolean)
	@prop({ required: true, default: false })
	admin?: boolean;

	@Field(() => Boolean)
	@prop({ required: true, default: false })
	creator?: boolean;

	@Field(() => [Post])
	@prop({ ref: 'Post', required: true })
	posts: Ref<Post>[];
}
