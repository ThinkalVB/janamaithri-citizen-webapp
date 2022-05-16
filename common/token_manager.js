function getTokenFromSession(){
    return window.sessionStorage.getItem('access_token');
}
function getTokenFromStorage(){
    return window.localStorage.getItem("access_token");
}
function getToken(){
    userToken = getTokenFromSession()
    if (userToken == null) {
        userToken = getTokenFromStorage()
    }
    return userToken
}

function saveTokenToStorage(access_token){
    window.localStorage.setItem("access_token", access_token);
}
function saveTokenToSession(access_token){
    window.sessionStorage.setItem('access_token', access_token);
}

async function tokenIsValid(access_token){
    let isValid = false;
    try {
        await $.ajax(await{
            type: "POST",
            url: BASE_URL + '/check',
            beforeSend : function(xhr) { 
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
                xhr.setRequestHeader('Authorization', 'Bearer '+ access_token); },
            success: function() {
                console.log('valid token')
                isValid = true;
            }, 
            error: function(jqXHR) {
                console.log(jqXHR.responseJSON["detail"]);
            },
        });
    }catch(e) {
        console.log(e);
    }
    return isValid;
}