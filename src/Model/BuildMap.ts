import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class BuildMap {
	@Field()
	@prop()
	type: string;

	@Field()
	@prop()
	value: string;
}
