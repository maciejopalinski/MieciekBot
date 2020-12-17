/** @param {Response<any, number>} res */
module.exports.unauthorized = function unauthorized(res) {
    return res.status(401).send({ message: "Unauthorized" });
};

/** @param {Response<any, number>} res */
module.exports.not_found = function not_found(res) {
    return res.status(404).send({ message: "Not found" });
};