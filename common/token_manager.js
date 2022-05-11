function get_token_from_session(){
    return window.sessionStorage.getItem('access_token');
}
function get_token_from_storage(){
    return window.localStorage.getItem("access_token");
}
function get_token(){
    userToken = get_token_from_session()
    if (userToken == null) {
        userToken = get_token_from_storage()
    }
    return userToken
}

function save_token_to_storage(access_token){
    window.localStorage.setItem("access_token", access_token);
}
function save_token_to_session(access_token){
    window.sessionStorage.setItem('access_token', access_token);
}

async function token_is_valid(access_token){
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
            error : function() {
                console.log('invalid token')
            },
        });
    }catch(e) {
        console.log(e);
    }
    return isValid;
}