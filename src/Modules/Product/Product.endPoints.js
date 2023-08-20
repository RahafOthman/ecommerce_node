import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create : [roles.Admin],
    update: [roles.Admin],
    softDelete: [roles.Admin],
    forceDelete:[roles.Admin],
    restore:[roles.Admin],
    addProduct: [roles.User],
    removeProduct: [roles.User]
}