import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { mongoose, prop, Ref } from '@typegoose/typegoose';
import { Post } from './Post';
import { Notification } from './Notification';

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

	@Field({ nullable: true })
	@prop({ required: false })
	bio?: string;

	@Field({ nullable: true })
	@prop({ required: false })
	links?: string;

	@Field()
	@prop({ required: true })
	password!: string;

	@Field(() => [User])
	@prop({
		ref: 'User',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		default: undefined,
	})
	supporters!: Ref<User>[];

	@Field(() => [User])
	@prop({
		ref: 'User',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		default: undefined,
	})
	supporting!: Ref<User>[];

	@Field(() => Boolean)
	@prop({ required: true, default: false })
	admin?: boolean;

	@Field(() => [Post])
	@prop({
		ref: 'Post',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		default: undefined,
	})
	posts?: Ref<Post>[];

	@Field(() => [Post])
	@prop({
		ref: 'Post',
		required: true,
		type: mongoose.Types.ObjectId,
		default: undefined,
	})
	feed?: Ref<Post>[];

	@Field(() => [Notification])
	@prop({ type: [Notification], required: true })
	notifications?: Ref<Notification>[];
}
