/** @param {Response<any, number>} res */
module.exports.unauthorized = function unauthorized(res) {
    return res.status(401).send({ message: "Unauthorized" });
};

/** @param {Response<any, number>} res */
module.exports.not_found = function not_found(res) {
    return res.status(404).send({ message: "Not found" });
};

module.exports.too_many_requests = function too_many_requests(res) {
    return res.status(429).send({ message: "Too many requests" });
}