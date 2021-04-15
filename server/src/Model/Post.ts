import { ObjectType, InputType, Field, ID, Int } from "type-graphql";
import { mongoose, prop, Ref } from "@typegoose/typegoose";
import { User } from "./User";
import { BuildMap } from "./BuildMap";

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
  desc!: string;

  @Field(() => [BuildMap])
  @prop({ type: [BuildMap], required: true })
  buildMap: BuildMap[];

  @Field(() => [String])
  @prop({ type: [String], required: false })
  images?: string[]; // urls corresponding to images in cloud storage

  @Field(() => Int)
  @prop({ required: true })
  likes!: number;

  @Field(() => User, { nullable: true })
  @prop({
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  poster?: Ref<User>;

  @Field({ nullable: true })
  @prop()
  author?: string;

  @Field(() => Date)
  @prop({ type: Date, default: Date.now })
  createdAt: Date;
}
