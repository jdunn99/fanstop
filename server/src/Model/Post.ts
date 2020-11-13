import { ObjectType, InputType, Field, ID, Int, Float } from 'type-graphql';
import { mongoose, prop, Ref } from '@typegoose/typegoose';
import { User } from './User';

@InputType()
@ObjectType()
export class Post {
	@Field(() => ID, { nullable: true })
	_id?: string;

	@Field()
	@prop({ required: true })
	title!: string;

	@Field()
	@prop({ required: true })
	text!: string;

	@Field(() => Int)
	@prop({ required: true })
	likes!: number;

	@Field(() => Float)
	@prop({ required: true, default: 0.0 })
	tips!: number;

	@Field(() => User, { nullable: true })
	@prop({
		ref: 'User',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		default: false,
	})
	poster?: Ref<User>;

	@Field()
	@prop({ required: true })
	posterId!: string;

	@Field()
	@prop({ type: Date, default: Date.now })
	createdAt?: Date;
}
