import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create : [roles.Admin],
    update: [roles.Admin],
    delete: [roles.Admin],

}