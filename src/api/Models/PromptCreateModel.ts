export interface PromptCreateModel {
    scope_id?: number;
    name?: string;
    system_message?: string;
    user_message?: string;
    expected_result?: string;
}  