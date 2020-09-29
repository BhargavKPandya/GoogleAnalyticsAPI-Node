"use strict";

var _require = require("googleapis"),
    google = _require.google;

var key = require("./google-auth.json");

var scopes = ["https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/analytics.edit"];
var jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
var analytics = google.analytics({
  version: "v3",
  auth: jwt
});
module.exports = {
  // analytics methods
  checkStatus: function checkStatus(res) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          reject(res.status);
        }
      }, 10000);
    });
  },
  listCustomProperties: function listCustomProperties(account) {
    var accountId, webPropertyId, res;
    return regeneratorRuntime.async(function listCustomProperties$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accountId = account.accountId, webPropertyId = account.webPropertyId;
            _context.next = 3;
            return regeneratorRuntime.awrap(analytics.management.customDimensions.list({
              accountId: accountId,
              webPropertyId: webPropertyId
            }));

          case 3:
            res = _context.sent;
            return _context.abrupt("return", this.checkStatus(res));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  },
  editCustomProperty: function editCustomProperty(action, account, customDimensionId, requestBody) {
    var accountId, webPropertyId, actionPara, res;
    return regeneratorRuntime.async(function editCustomProperty$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accountId = account.accountId, webPropertyId = account.webPropertyId;

            if (action === 'insert') {
              actionPara = {
                accountId: accountId,
                webPropertyId: webPropertyId,
                requestBody: requestBody
              };
            } else {
              actionPara = {
                accountId: accountId,
                customDimensionId: customDimensionId,
                webPropertyId: webPropertyId,
                requestBody: requestBody
              };
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(analytics.management.customDimensions[action](actionPara));

          case 4:
            res = _context2.sent;
            return _context2.abrupt("return", this.checkStatus(res));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this);
  }
};