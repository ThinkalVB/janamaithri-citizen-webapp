let userToken = null

init();
async function init(){
    userToken = getToken();
    if(userToken != null && await tokenIsValid(userToken)){
        window.location.replace("home.html");
    }
}

function showError(message){
    $("#error-message").show()
    $('#error-message').text(message);
}

$("#login-button").click(function() {
    const username = $("#username").val();
    if (username===""){ showError('Provide a valid username'); return; }
    const password = $("#password").val();
    if (password===""){ showError('Provide a valid password'); return; }

    $.ajax({
        type: "POST",
        url: BASE_URL + '/login',
        data: {"grant_type": "password","username": username,"password": password, "client_id": CLIENT_ID},
        beforeSend : function(xhr) { xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); },
        error : function(jqXHR) {
            if(jqXHR.status == 401){ showError('Invalid username or password');}
        },
        success: function(data) {        
            console.log(data["access_token"]);    
            saveTokenToSession(data["access_token"]);
            if($("#remember-me").is(":checked")){
                saveTokenToStorage(data["access_token"]);
            }
            window.location.replace("home.html");
        }
    });
});