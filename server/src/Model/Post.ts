import { ObjectType, InputType, Field, ID, Int, Float } from 'type-graphql';
import { mongoose, prop, Ref } from '@typegoose/typegoose';
import { User } from './User';

@ObjectType()
@InputType()
export class BuildMap {
	@Field()
	actionType: string;

	@Field(() => Int)
	index: number;
}

@InputType()
@ObjectType()
export class Post {
	@Field(() => ID, { nullable: true })
	_id?: string;

	@Field()
	@prop({ required: true })
	title!: string;

	@Field(() => [String])
	@prop({ type: [String], required: true })
	text!: string[];

	@Field(() => [BuildMap])
	@prop({ type: [BuildMap], required: false, default: [] })
	buildMap: BuildMap[];

	@Field(() => [String])
	@prop({ type: [String], required: false })
	images?: string[]; // urls corresponding to images in cloud storage

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
