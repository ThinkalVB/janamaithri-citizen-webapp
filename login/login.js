userToken = get_token()
if(userToken != null && await token_is_valid(userToken)){
    window.location.replace("home.html");
}

function show_error(message){
    $("#error-message").show()
    $('#error-message').text(message);
}

$("#login-button").click(function() {
    const username = $("#username").val();
    if (username===""){ show_error('Provide a valid username'); return; }
    const password = $("#password").val();
    if (password===""){ show_error('Provide a valid password'); return; }

    $.ajax({
        type: "POST",
        url: BASE_URL + '/login',
        data: {"grant_type": "password","username": username,"password": password, "client_id": CLIENT_ID},
        beforeSend : function(xhr) { xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); },
        error : function(jqXHR) {
            if(jqXHR.status == 401){ show_error('Invalid username or password');}
        },
        success: function(data) {        
            console.log(data["access_token"]);    
            save_token_to_session(data["access_token"]);
            if($("#remember-me").is(":checked")){
                save_token_to_storage(data["access_token"]);
            }
            window.location.replace("home.html");
        }
    });
});