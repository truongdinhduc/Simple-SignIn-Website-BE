import { ModelType } from "./ultils/index.d";

export const UserModel: ModelType = {
    name: "user",
    schema: {
        username: String,
        password: String,
        last_signed_in: Date
    }
};
