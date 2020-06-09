"use strict";

const Lab = require("@hapi/lab");
const Hapi = require("@hapi/hapi");

const lab = (exports.lab = Lab.script());
const { it } = lab;
const { expect, fail } = Lab.assertions;

const HapiBlockIP = require("../lib");

lab.experiment("hapi-blockip: testing with invalid options", () => {
  it("with no options - SHOULD THROW ERROR", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    try {
      await server.register([
        {
          plugin: HapiBlockIP
        }
      ]);
    } catch (err) {
      expect(err).to.exist();
      expect(err.message).to.include('"blocklist" is required');
      return;
    }
  });
  it("with empty options - SHOULD THROW ERROR", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    try {
      await server.register([
        {
          plugin: HapiBlockIP,
          options: {}
        }
      ]);
    } catch (err) {
      expect(err).to.exist();
      expect(err.message).to.include('"blocklist" is required');
      return;
    }
  });
  it("with null blocklist - SHOULD THROW ERROR", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    try {
      await server.register([
        {
          plugin: HapiBlockIP,
          options: {
            blocklist: null
          }
        }
      ]);
    } catch (err) {
      expect(err).to.exist();
      expect(err.message).to.include('"blocklist" must be an array');
      return;
    }
  });
  it("with invalid ip - SHOULD THROW ERROR", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    try {
      await server.register([
        {
          plugin: HapiBlockIP,
          options: {
            blocklist: ["x"]
          }
        }
      ]);
    } catch (err) {
      expect(err).to.exist();
      expect(err.message).to.include(
        '"blocklist[0]" must be a valid ip address of one of the following versions [ipv4, ipv6] with a optional CIDR'
      );
      return;
    }
  });
  it("with wrong option - SHOULD THROW ERROR", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    try {
      await server.register([
        {
          plugin: HapiBlockIP,
          options: {
            x: []
          }
        }
      ]);
    } catch (err) {
      expect(err).to.exist();
      expect(err.message).to.include('"x" is not allowed');
      return;
    }
  });
});

lab.experiment("hapi-blockip: testing with valid options", () => {
  it("with empty blocklist", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    expect(async () => {
      await server.register({
        plugin: HapiBlockIP,
        options: {
          blocklist: []
        }
      });
    }).to.not.throw();
  });
  it("with valid blocklist", async () => {
    const server = Hapi.server();
    await server.register([
      {
        plugin: HapiBlockIP,
        options: {
          blocklist: [
            "127.0.0.1",
            "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
            "2001:0db8:85a3:0000:0000:8a2e:0370:7334/64"
          ]
        }
      }
    ]);
    expect(server.info).exist();
  });
});

lab.experiment("hapi-blockip: testing block", () => {
  it("with empty blocklist", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    await server.register({
      plugin: HapiBlockIP,
      options: {
        blocklist: []
      }
    });
    server.route({
      method: "GET",
      path: "/test",
      handler: function (request, h) {
        return h.response({}).code(204);
      }
    });
    const result = await server.inject("/test");
    expect(result.statusCode).to.equal(204);
  });
  it("with blocked local IP address", async () => {
    const server = Hapi.server({
      autoListen: false
    });
    await server.register({
      plugin: HapiBlockIP,
      options: {
        blocklist: ["127.0.0.1"]
      }
    });
    server.route({
      method: "GET",
      path: "/test",
      handler: function (request, h) {
        return h.response({}).code(204);
      }
    });
    const result = await server.inject("/test");
    expect(result.statusCode).to.equal(403);
  });
});
