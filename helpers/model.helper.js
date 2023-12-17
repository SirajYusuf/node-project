const mongoose = require('mongoose');

class ModelHelper {
    checkIdInModel({
        model,
        contractor,
        customQuery
    }) {
        const availableModels = [
            'ContractorRegistration',
            'Service'
        ];

        if (!availableModels.includes(model)) {
            throw new Error('Model not found');
        }
        return async (value, {
            req
        }) => {
            const ModelName = mongoose.model(model);

            let query = {
                _id: value
            }

            if (contractor) {
                query.contractor = req.contractor._id
            }

            if (customQuery) {
                query = {
                    ...query,
                    ...customQuery
                }
            }

            const data = await ModelName.findOne(query);
            if (!data) {
                throw new Error(`${model} id not found`);
            }
            req[model] = data;
            return true;
        }
    }

}

module.exports = new ModelHelper();