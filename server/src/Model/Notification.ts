import { prop } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Notification {
	@Field(() => ID, { nullable: true })
	@prop()
	_id: string;

	@Field()
	@prop()
	message?: string;

	@Field(() => Date)
	@prop({ type: Date, default: Date.now })
	date: Date;
}

export interface NotificationPayload {
	_id: string;
	message?: string;
	createdAt?: Date;
	name: string;
}
