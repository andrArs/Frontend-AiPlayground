import { ModelBase } from "../Base/BaseModel";

export interface ModelModel extends ModelBase<number>{
    name?: string;
    rating: number;
    user_rating: number;
}