import { validationController } from "../provider/validation.provider";

export default [
    {
        method: "POST",
        path: "/requestValidation",
        handler: (request, h) => validationController.postNewValidation(request, h)
    },
    {
        method: "POST",
        path: "/message-signature/validate",
        handler: (request, h) => validationController.postValidate(request, h)
    }
]