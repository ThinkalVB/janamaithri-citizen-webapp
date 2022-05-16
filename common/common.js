//const BASE_URL  = 'http://192.168.10.238:8000'
const BASE_URL  = 'http://127.0.0.1:8000' 
const MAX_LIMIT = 50;
const CLIENT_ID = 'webapp.citizen';

const API_RESPONSE   = "api_response";
const ACCOUNT_STATUS = "account_status";
const GENDER_TYPE    = "gender_type";
const POLICE_STATION = "police_station";
const PUBLIC_SERVICE = "public_service";

function titleCase(str) {
    return str.split(' ').map(item => 
           item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(' ');
}

function getResponseMessage(receivedResponse, apiResponses){
    for (const index in apiResponses) {
        const response     = `${apiResponses[index].response}`;
        const responseDesc = `${apiResponses[index].response_description}`;
        if(response == receivedResponse){
            return responseDesc;
        }
    }
    return null;
}

async function logout(){
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/logout',
        beforeSend : function(xhr) { 
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
            xhr.setRequestHeader('Authorization', 'Bearer '+ userToken); },
        success: function() {
            window.location.replace("login.html");
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
}
