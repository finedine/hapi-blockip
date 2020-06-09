"use strict";

const Joi = require("@hapi/joi");
const Pkg = require("../package.json");

const internals = Joi.object({
  blocklist: Joi.array().items(
    Joi.string().ip({
      version: ["ipv4", "ipv6"],
      cidr: "optional"
    })
  )
}).required();

module.exports = {
  register: (server, options) => {
    // Validate options
    const settings = Joi.attempt(Object.assign({}, options), internals);
    // Listen each request
    server.ext("onRequest", async (request, h) => {
      // Get client IP Address
      const ip = request.info.remoteAddress;
      // Check if it's blocked
      const blocked = settings.blocklist.includes(ip);
      // Return 403 if it's blocked
      if (blocked) return h.response({}).code(403).takeover();
      // Otherwise, continue
      return h.continue;
    });
  },
  pkg: Pkg
};
