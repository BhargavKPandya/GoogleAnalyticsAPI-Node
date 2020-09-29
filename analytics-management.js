const { google } = require("googleapis");
const key = require("./google-auth.json");
const scopes = [
  "https://www.googleapis.com/auth/analytics",
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/analytics.edit"
];
const jwt = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes
);
const analytics = google.analytics({
  version: "v3",
  auth: jwt
});


module.exports = {
  // analytics methods
  checkStatus: function(res) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
        if (res.status === 200) {
        resolve(res.data);
      } else {
        reject(res.status);
      }
    },10000);
    });
  },
  listCustomProperties: async function(account) {
    const { accountId, webPropertyId } = account;
    
    const res = await analytics.management.customDimensions.list({
      accountId,
      webPropertyId
    });
    //console.log(res);
    return this.checkStatus(res);
  },
  editCustomProperty: async function(
    action,
    account,
    customDimensionId,
    requestBody
  ) {
    const { accountId, webPropertyId } = account;
    let actionPara;
    if(action === 'insert'){
        actionPara = {accountId, webPropertyId, requestBody};
    }else {
        actionPara = {accountId, customDimensionId, webPropertyId, requestBody};
    }
    const res = await analytics.management.customDimensions[action](actionPara);

    return this.checkStatus(res);
  },
};