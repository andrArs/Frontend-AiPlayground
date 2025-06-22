import { ModelBase } from "../Base/BaseModel";
import { ModelModel } from "./ModelModel";

export interface PlatformModel extends ModelBase<number>{
    name?: string;
    image_url?: string;
    models: ModelModel[];
}