import { ModelBase } from "../Base/BaseModel";

export interface PromptModel extends ModelBase<number> {
    name: string;
    system_message: string;
    user_message: string;
    expected_result: string;
}