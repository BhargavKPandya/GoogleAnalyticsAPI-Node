"use strict";

var _require = require('googleapis'),
    google = _require.google;

var q = require('q');

var key = require('./google-auth.json');

var scopes = 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit';
var jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes); //process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-auth.json'

var XLSX = require('xlsx');

var workbook = XLSX.readFile('./Copy of GA-API.xlsx');
var sheet_name_list = workbook.SheetNames;
var demographics_tab = sheet_name_list[0];
var demographics_info_JSON = XLSX.utils.sheet_to_json(workbook.Sheets[demographics_tab]);
var common_offset = [{
  name: 'ua_client_id',
  scope: 'User',
  active: true
}, {
  name: 'ua_user_login_status',
  scope: 'Hit',
  active: true
}, {
  name: 'ua_user_login_method',
  scope: 'Hit',
  active: true
}, {
  name: 'ua_user_portal_id',
  scope: 'Session',
  active: true
}, {
  name: 'ua_tool_name',
  scope: 'Hit',
  active: true
}, {
  name: 'ua_tool_version',
  scope: 'Hit',
  active: true
}, {
  name: 'ua_is_admin',
  scope: 'Session',
  active: true
}];
var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;

function whatIsIt(object) {
  if (object === null) {
    return "null";
  }

  if (object === undefined) {
    return "undefined";
  }

  if (object.constructor === stringConstructor) {
    return "String";
  }

  if (object.constructor === arrayConstructor) {
    return "Array";
  }

  if (object.constructor === objectConstructor) {
    return "Object";
  }

  {
    return "don't know";
  }
}

function getAllKeys(jsonObject) {
  var offsetObject = [];

  if (whatIsIt(spreadSheetData) === 'Array') {
    var temp = Object.keys(jsonObject);

    for (var s in temp) {
      var nestedJsonObject = jsonObject[s];
      extractFromJsonObject(offsetObject, nestedJsonObject);
    }
  } else {
    extractFromJsonObject(offsetObject, jsonObject);
  }

  return offsetObject;

  function extractFromJsonObject(offsetObject, nestedJsonObject) {
    var keys = Object.keys(nestedJsonObject);
    var reportingDataLength = keys.length / 13 > 1 ? 13 : keys.length;

    for (var i = 0; i < reportingDataLength; i++) {
      var jo = {};
      jo.name = keys[i];
      jo.scope = "Session";
      jo.active = true;
      offsetObject.push(jo);
    }
  }
}

for (var i = 0; i < demographics_info_JSON.length; i++) {
  var account_ID = demographics_info_JSON[i].AccountID;
  var webPropertyID = demographics_info_JSON[i].PropertyID; //console.log('--ClientList--' + demographics_info_JSON[i].ClientCode);
  //console.log('--AccountID--' + demographics_info_JSON[i].AccountID);
  //console.log('--PropertyID:--' + demographics_info_JSON[i].PropertyID);
  //console.log('--ReportingJSON--' + demographics_info_JSON[i].ReportingJSON);

  var spreadSheetData = JSON.parse(demographics_info_JSON[i].ReportingJSON);
  var spreadSheetList = getAllKeys(spreadSheetData);
  var allOffset = common_offset.concat(spreadSheetList); //var existingResult;

  var alreadyCD = getCustomDimensionList(account_ID, webPropertyID, allOffset).then(function (res) {//console.log(res);
  }, function (err) {
    console.error("Execute error from code", err.errors);
  });
}

function setCustomDimension(req) {
  var def = q.defer();
  jwt.authorize(function (err, tokens) {
    if (err) {
      console.log("err is: " + err);
      return;
    }

    google.analytics('v3').management.customDimensions.insert({
      auth: jwt,
      "accountId": req.accountId,
      "webPropertyId": req.webPropertyId,
      "resource": {
        "name": req.offsetName,
        "scope": req.scope,
        // "index": req.index,
        "active": true
      }
    }, function (err, res) {
      if (err) {
        console.log(err.errors);
        def.reject(err);
      } else {
        def.resolve(res);
      }
    });
  });
  return def.promise;
}

function updateCustomDimension(req) {
  var def = q.defer();
  jwt.authorize(function (err, tokens) {
    if (err) {
      console.log("err is: " + err);
      return;
    }

    google.analytics('v3').management.customDimensions.update({
      auth: jwt,
      "accountId": req.accountId,
      "webPropertyId": req.webPropertyId,
      "customDimensionId": req.id,
      "resource": {
        "name": req.offsetName,
        "scope": req.scope,
        // "index": req.index,
        "active": true
      }
    }, function (err, res) {
      if (err) {
        console.log(err.errors);
        def.reject(err);
      } else {
        def.resolve(res);
      }
    });
  });
  return def.promise;
}

function getCustomDimensionList(accountID, webPropertyID, allOffset) {
  var def, offsets, accountId, webPropertyId, res;
  return regeneratorRuntime.async(function getCustomDimensionList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          def = q.defer();
          offsets = allOffset;
          accountId = accountID;
          webPropertyId = webPropertyID;
          _context.next = 6;
          return regeneratorRuntime.awrap(jwt.authorize(function (err, tokens) {
            if (err) {
              console.log("err is: " + err);
              return;
            }

            google.analytics('v3').management.customDimensions.list({
              "auth": jwt,
              "accountId": accountId,
              "webPropertyId": webPropertyId
            }, function (err, res) {
              if (err) {
                def.reject(err);
              } else {
                var duplicateData = []; //console.log("Res from GA ---" +res.data.items.length);
                //console.log("Res from Code ---" +offsets.length);

                for (i = 0; i < res.data.items.length; i++) {
                  var item = res.data.items[i];

                  if (item.index <= offsets.length) {
                    if (offsets[item.index - 1]['offsetName'] == item.name && offsets[item.index - 1]['scope'].toLowerCase() == item.scope.toLowerCase()) {
                      duplicateData.push(item.index - 1);
                    } else {
                      offsets[item.index - 1]['id'] = item.id;
                      offsets[item.index - 1]['accountId'] = item.accountId;
                      offsets[item.index - 1]['webPropertyId'] = item.webPropertyId;
                      offsets[item.index - 1]['index'] = item.index;
                    }
                  }
                }

                if (offsets.length > res.data.items.length) {
                  for (i = res.data.items.length; i < offsets.length; i++) {
                    offsets[i]['accountId'] = accountId;
                    offsets[i]['webPropertyId'] = webPropertyId;
                    offsets[i]['index'] = i + 1;
                  }
                } //console.log("Already Custom Dimension ---" +duplicateData);


                duplicateData = duplicateData.reverse();

                for (var i = 0; i < duplicateData.length; i++) {
                  offsets.splice(duplicateData[i], 1);
                } // console.log("After Duplication removing---" +JSON.stringify(offsets));


                var _loop = function _loop() {
                  //console.log(res[i].id == undefined);
                  var currentOffset = offsets[i];
                  setTimeout(function () {
                    console.log(currentOffset);

                    if (currentOffset.id === undefined) {
                      //Promise.allSettled(setCustomDimension(currentOffset))
                      setCustomDimension(currentOffset).then(function (res) {//console.log(res);
                      }, function (err) {//console.error("Error in Insert CD Function"); 
                      });
                    } else {
                      //Promise.allSettled(updateCustomDimension(currentOffset))
                      updateCustomDimension(currentOffset).then(function (res) {//console.log(res);
                      }, function (err) {//console.log("Error in Update CD Function"); 
                      });
                    }
                  }, 20000);
                };

                for (i = 0; i < offsets.length; i++) {
                  _loop();
                }

                def.resolve(offsets);
              }
            });
          }));

        case 6:
          res = _context.sent;
          return _context.abrupt("return", def.promise);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}