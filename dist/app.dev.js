"use strict";

(function _callee() {
  var analytics, XLSX, workbook, sheet_name_list, demographics_tab, demographics_info_JSON, common_offset, stringConstructor, arrayConstructor, objectConstructor, whatIsIt, getAllKeys, k, account_ID, webPropertyID, spreadSheetData, spreadSheetList, offsets, account, _ref, customDimensionCode, duplicateData, item, i, currentOffset, action;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          getAllKeys = function _ref3(jsonObject) {
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

            return offsetObject; //recursive function to return max 13 values from spreadsheet

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
          };

          whatIsIt = function _ref2(object) {
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
          };

          // creating an async FILE to make use of async await
          analytics = require("./analytics-management.js"); //xlsx npm package to read the spreadsheet

          XLSX = require('xlsx');
          workbook = XLSX.readFile('./Copy of GA-API.xlsx');
          sheet_name_list = workbook.SheetNames;
          demographics_tab = sheet_name_list[8];
          demographics_info_JSON = XLSX.utils.sheet_to_json(workbook.Sheets[demographics_tab]); //storing common offset custom dimension value which will be fixed for all clients from 1-7.

          common_offset = [{
            name: 'clientId',
            scope: 'User',
            active: true
          }, {
            name: 'userLoginStatus',
            scope: 'Hit',
            active: true
          }, {
            name: 'userLoginMethod',
            scope: 'Hit',
            active: true
          }, {
            name: 'userPortalId',
            scope: 'Session',
            active: true
          }, {
            name: 'toolName',
            scope: 'Hit',
            active: true
          }, {
            name: 'toolVersion',
            scope: 'Hit',
            active: true
          }, {
            name: 'isAdmin',
            scope: 'Session',
            active: true
          }]; //whatIsIt function checks the reporting string data types ...object, array...

          stringConstructor = "test".constructor;
          arrayConstructor = [].constructor;
          objectConstructor = {}.constructor;
          k = 0;

        case 13:
          if (!(k < demographics_info_JSON.length)) {
            _context.next = 44;
            break;
          }

          console.log(demographics_info_JSON.length, k);
          account_ID = demographics_info_JSON[k].AccountID;
          webPropertyID = demographics_info_JSON[k].PropertyID;
          spreadSheetData = JSON.parse(demographics_info_JSON[k].ReportingJSON);
          console.log(spreadSheetData);
          spreadSheetList = getAllKeys(spreadSheetData);
          offsets = common_offset.concat(spreadSheetList);
          account = {
            accountId: account_ID,
            webPropertyId: webPropertyID
          }; //checking for existing custom dimension for each property

          _context.next = 24;
          return regeneratorRuntime.awrap(analytics.listCustomProperties(account));

        case 24:
          _ref = _context.sent;
          customDimensionCode = _ref.items;
          duplicateData = [];

          for (i = 0; i < customDimensionCode.length; i++) {
            item = customDimensionCode[i];

            if (item.index <= offsets.length) {
              if (offsets[item.index - 1]['name'] == item.name && offsets[item.index - 1]['scope'].toLowerCase() == item.scope.toLowerCase()) {
                duplicateData.push(item.index - 1);
              } else {
                offsets[item.index - 1]['id'] = item.id;
                offsets[item.index - 1]['index'] = item.index;
              }
            }
          }

          if (offsets.length > customDimensionCode.length) {
            for (i = customDimensionCode.length; i < offsets.length; i++) {
              offsets[i]['index'] = i + 1;
            }
          } //console.log("Already Custom Dimension ---" +duplicateData);


          duplicateData = duplicateData.reverse();

          for (i = 0; i < duplicateData.length; i++) {
            offsets.splice(duplicateData[i], 1);
          }

          i = 0;

        case 32:
          if (!(i < offsets.length)) {
            _context.next = 41;
            break;
          }

          //console.log(res[i].id == undefined);
          currentOffset = offsets[i];
          action = currentOffset.id === undefined ? "insert" : "update";
          console.log(currentOffset);
          _context.next = 38;
          return regeneratorRuntime.awrap(analytics.editCustomProperty(action, account, currentOffset.id, currentOffset).then(function (res) {//console.log(res);
          }, function (err) {
            console.error("Execute error from code", err.errors);
          }));

        case 38:
          i++;
          _context.next = 32;
          break;

        case 41:
          k++;
          _context.next = 13;
          break;

        case 44:
        case "end":
          return _context.stop();
      }
    }
  });
})();