import { validationController } from "../provider/validation.provider";

export default [
    {
        method: 'POST',
        path: '/requestValidation',
        handler: (request, header) => validationController.postNewValidation(request, header)
    },
    {
        method: 'POST',
        path: '/message-signature/validate',
        handler: (request, header) => validationController.postValidate(request, header)
    }
]