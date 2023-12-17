/* Libraries*/

/* End Libraries*/

/** Models */
const ServiceModel = require("../../models/service.model")
/** End Models */

/** Helpers */
const Helper = require("../../helpers/helper")
/** End Helpers */

class Service {
    async addServices(req, res) {
        try {
            const body = req.body
            await ServiceModel.insertMany(body)
            return Helper.successMessage(res, "Services Successfully Added")
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }

    async getServices(req, res) {
        try {
            const search = req.query.search
            const query = {}
            if (search) {
                query.$or = [[{
                    serviceId: {
                        $regex: search,
                        $options: "i",
                    },
                }, {
                    serviceName: {
                        $regex: search,
                        $options: "i",
                    },
                }]]
            }
            const services = await ServiceModel.find(query).select('serviceId serviceName')
            return Helper.successMessage(res, services)
        } catch (e) {
            console.log(e)
            return Helper.errorMessage(res, e.message)
        }
    }

}

module.exports = new Service()