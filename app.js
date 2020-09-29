(async function () {
  // creating an async FILE to make use of async await
  const analytics = require("./analytics-management.js");

  //xlsx npm package to read the spreadsheet
  const XLSX = require('xlsx');
  const workbook = XLSX.readFile('./Copy of GA-API.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const demographics_tab = sheet_name_list[8];
  const demographics_info_JSON = XLSX.utils.sheet_to_json(workbook.Sheets[demographics_tab]);

  //storing common offset custom dimension value which will be fixed for all clients from 1-7.
  var common_offset = [{
      name: 'clientId',
      scope: 'User',
      active: true
    },
    {
      name: 'userLoginStatus',
      scope: 'Hit',
      active: true
    },
    {
      name: 'userLoginMethod',
      scope: 'Hit',
      active: true
    },
    {
      name: 'userPortalId',
      scope: 'Session',
      active: true
    },
    {
      name: 'toolName',
      scope: 'Hit',
      active: true
    },
    {
      name: 'toolVersion',
      scope: 'Hit',
      active: true
    },
    {
      name: 'isAdmin',
      scope: 'Session',
      active: true
    }
  ];

  //whatIsIt function checks the reporting string data types ...object, array...
  var stringConstructor = "test".constructor;
  var arrayConstructor = [].constructor;
  var objectConstructor = ({}).constructor;

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
    } {
      return "don't know";
    }
  }

  /*getAllKeys function creates offsetObject which returns the combine data from 
  spreadsheet(max 13 value) and common_offset.*/
  function getAllKeys(jsonObject) {
    var offsetObject = [];
    if (whatIsIt(spreadSheetData) === 'Array') {
      var temp = Object.keys(jsonObject);
      for (var s in temp) {
        var nestedJsonObject = jsonObject[s];
        extractFromJsonObject(offsetObject, nestedJsonObject);
      }
    } else {
      extractFromJsonObject(offsetObject, jsonObject)
    }
    return offsetObject;

    //recursive function to return max 13 values from spreadsheet
    function extractFromJsonObject(offsetObject, nestedJsonObject) {
      var keys = Object.keys(nestedJsonObject)
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

  //main for loop for all data to process
  for (let k = 0; k < demographics_info_JSON.length; k++) {
    console.log(demographics_info_JSON.length, k);
    var account_ID = demographics_info_JSON[k].AccountID;
    var webPropertyID = demographics_info_JSON[k].PropertyID;
    var spreadSheetData = JSON.parse(demographics_info_JSON[k].ReportingJSON);
    console.log(spreadSheetData);
    var spreadSheetList = getAllKeys(spreadSheetData);
    var offsets = common_offset.concat(spreadSheetList);
    var account = {
      accountId: account_ID,
      webPropertyId: webPropertyID
    };

    //checking for existing custom dimension for each property
    const { items: customDimensionCode } = await analytics.listCustomProperties(account);

    var duplicateData = [];
    for (i = 0; i < customDimensionCode.length; i++) {
      var item = customDimensionCode[i];
      if (item.index <= offsets.length) {
        if (offsets[item.index - 1]['name'] == item.name &&
          offsets[item.index - 1]['scope'].toLowerCase() == item.scope.toLowerCase()) {
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
    }
    //console.log("Already Custom Dimension ---" +duplicateData);
    duplicateData = duplicateData.reverse();
    for (var i = 0; i < duplicateData.length; i++) {
      offsets.splice(duplicateData[i], 1);
    }

    for (i = 0; i < offsets.length; i++) {
      //console.log(res[i].id == undefined);
      let currentOffset = offsets[i];
      const action = currentOffset.id === undefined ? "insert" : "update";
      console.log(currentOffset);
      await analytics.editCustomProperty(action, account, currentOffset.id, currentOffset).then((res) => {
        //console.log(res);

      }, (err) => {
        console.error("Execute error from code", err.errors);
      });
     // setTimeout(() => {
      //  
      //}, 5000);
    }
  }
})();