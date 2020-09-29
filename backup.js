

const { google } = require('googleapis')

const key = require('./google-auth.json')
const scopes = 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)
console.log(jwt);


jwt.authorize((err, tokerns)=>{
  if(err){
    console.log(err);
  }else{
    console.log(tokerns);
  }
})
//const xlsxFile = require('read-excel-file/node');
//account ID for Analytics account
//let account_id = '165896120';

//web_property_id for Analytics property ID like, COLA.
//let web_property_id = 'UA-165896120-4';

process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-auth.json'

//let test1 = getCustomDimensionList(account_id, web_property_id);
//console.log('Test1---');

const XLSX = require('xlsx');
const workbook = XLSX.readFile('./Copy of GA-API.xlsx');
const sheet_name_list = workbook.SheetNames;
const demographics_tab = sheet_name_list[0];
const demographics_info_JSON = XLSX.utils.sheet_to_json(workbook.Sheets[demographics_tab]);


var common_offset = [{
  offsetName : 'ua_client_id',
  scope: 'User'
},
{
  offsetName : 'ua_user_login_status',
  scope: 'Hit'
},
{
  offsetName : 'ua_user_login_method',
  scope: 'Hit'
},
{
  offsetName : 'ua_user_portal_id',
  scope: 'Session'
},
{
  offsetName : 'ua_tool_name',
  scope: 'Hit'
},
{
  offsetName : 'ua_tool_version',
  scope: 'Hit'
},
{
  offsetName : 'ua_is_admin',
  scope: 'Session'
}];

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
  }
  {
      return "don't know";
  }
}

function getAllKeys(jsonObject){
  var offsetObject = [];
  //var keys = [];
  if(whatIsIt(spreadSheetData) === 'Array'){
    var temp = Object.keys(jsonObject);
    for(var s in temp){
      //console.log(jsonObject[s]);
     // console.log(Object.keys(jsonObject[s]));
      var nestedJsonObject = jsonObject[s]; 
      //console.log("nestedJsonObject" + JSON.stringify(nestedJsonObject));
      extractFromJsonObject(offsetObject,nestedJsonObject);
    }
  } else{
   // console.log(Object.keys(jsonObject));
   
   extractFromJsonObject(offsetObject,jsonObject)
  }
  return offsetObject;

  function extractFromJsonObject(offsetObject,nestedJsonObject) {
    
    var keys = Object.keys(nestedJsonObject)
    // console.log('Keys--' + keys);
    var reportingDataLength = keys.length / 13 > 1 ? 13 : keys.length;
    for (var i = 0; i < reportingDataLength; i++) {
      // console.log(keys[i]);
      var jo = {};
      jo.offsetName = keys[i];
      jo.scope = "Session";
      offsetObject.push(jo);
    }
  }
}


for (var i=0; i < demographics_info_JSON.length; i++){
  var account_ID = demographics_info_JSON[i].AccountID;
  var webPropertyID = demographics_info_JSON[i].PropertyID;
  console.log('--ClientList--' + demographics_info_JSON[i].ClientCode);
  console.log('--AccountID--' + demographics_info_JSON[i].AccountID);
  console.log('--PropertyID:--' + demographics_info_JSON[i].PropertyID);
 console.log('--ReportingJSON--' + demographics_info_JSON[i].ReportingJSON);
 var spreadSheetData = JSON.parse(demographics_info_JSON[i].ReportingJSON);
  var spreadSheetList = getAllKeys(spreadSheetData);
 
  var allOffset = common_offset.concat(spreadSheetList);
  console.log(allOffset);
 var existingResult;
 jwt.authorize((err, tokerns)=>{
  if(err){
    console.log(err);
    return;
  }
  var alreadyCD =  getCustomDimensionList(account_ID, webPropertyID,allOffset).then(res=>{
    //existingResult = res;
    console.log(res);
    for(i = 0 ; i<res.length;i++){
    console.log('GA - ID ' + res[i].id);
    }
   /* 
    for(i = 0 ; i<res.length;i++){
      //console.log(res[i].id == undefined);
      if(res[i].id === undefined){
        setCustomDimension(res[i]);
      } else{
        updateCustomDimension(res[i]);
      }
    }
    */
    // var retirevalOffset= [];
    // for(i=0; i<existingResult.length; i++){
    //   retirevalOffset.push(existingResult[i].id);
    // }
  
  });
})
 // console.log(Promise.resolve(alreadyCD));
}



function setCustomDimension(req) {
    return google.analytics('v3').management.customDimensions.insert({
      //auth: jwt,
      "accountId": req.accountId,
      "webPropertyId": req.webPropertyId,
      "resource": {
        "name": req.offsetName,
        "scope": req.scope,
        "active": true
      }
    });
  
  

}

function updateCustomDimension(req) {
 
  return google.analytics('v3').management.customDimensions.update({
    //auth: jwt,
    "accountId": req.accountId,
    "webPropertyId": req.webPropertyId,
    "customDimensionId": req.id,
    "resource": {
      "name": req.offsetName,
      "scope": req.scope,
      "active": true
    }
  });

}

//https://stackoverflow.com/questions/49814647/google-analytics-reporting-authorize-service-account


 async function getCustomDimensionList(accountID, webPropertyID, allOffset) {
  const offsets = allOffset;
  const accountId = accountID;
  const webPropertyId = webPropertyID; 
  var output;
  
 const res = await google.analytics('v3').management.customDimensions.list({
    //auth: jwt,
    "accountId": accountId,
    "webPropertyId": webPropertyId
  });
  return new Promise((resolve, reject)=>{
    if(res.status === 200){
      for(i=0; i<res.data.items.length ; i++){
        var item = res.data.items[i];
        if(item.index <= offsets.length){
          offsets[item.index - 1]['id'] = item.id;
          offsets[item.index - 1]['accountId'] = item.accountId;
          offsets[item.index - 1]['webPropertyId'] = item.webPropertyId;
        }
      }
      if(offsets.length > res.data.items.length){
        for(i=res.data.items.length; i<offsets.length ; i++){
         // offsets[i]['id'] = item.id;
            offsets[i]['accountId'] = accountId;
            offsets[i]['webPropertyId'] = webPropertyId;
        }
      }
      resolve(allOffset);
    }else{
      reject(res.status);
    }
  })
  
    /*(err, result) => {
      console.log(result.data.items);
      return result.data.items;
      //return output= result.data.items;
      //console.log('Error in getCustomDimentionlist--' + err);
     /* return new Promise((resolve, reject) =>{
     
        resolve(output);
     
    });
    });*/
    

}



