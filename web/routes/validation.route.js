import { validationController } from "../provider/validation.provider";

export default [
    {
        method: 'POST',
        path: '/requestValidation',
        handler: (request, header) => validationController.postValidation(request, header)
    }
]