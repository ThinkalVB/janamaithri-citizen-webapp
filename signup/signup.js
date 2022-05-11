var captchaId    = null;
var genderTypes  = null;
var apiResponses = null;


init_page();
async function init_page() {
    captchaId = await make_signup_captcha();
    if(captchaId != null) {
        $("#captcha_pic").attr('src', BASE_URL+ '/citizen/signup/captcha_pic/' + captchaId +'.png');
    }

    genderTypes  = await getTable(GENDER_TYPE);
    apiResponses = await getTable(API_RESPONSE);

    console.log(genderTypes);


    for (const index in genderTypes) {
        const genderType   = titleCase(`${genderTypes[index].gender_type}`);
        const genderTypeId = `${genderTypes[index].gender_type_id}`;
        $("#gender").append($("<option></option>").val(genderTypeId).html(genderType));
    }
}

function show_error(message){
    $("#error-message").show()
    $('#error-message').text(message);
}

$("#captcha_refresh").click(async function(){
    captchaId = await make_signup_captcha();
    if(captchaId != null) {
        $("#captcha_pic").attr('src', BASE_URL + '/citizen/signup/captcha_pic/'+ captchaId +'.png');
    }
});

$("#signup-button").click(function(){
    let username = $("#username").val();
    if (!username.match(/^([a-z0-9_]{5,64})$/)){ 
        show_error('Provide a valid username, only characters, digits and underscores is allowed. Username must have at least 5 to 64 characters.');
        return; 
    }
    let password = $("#password").val();
    if (!password.match(/^[a-zA-Z0-9!@#$%^&*]{8,64}$/)){ 
        show_error('Provide a valid password, only characters, digits and (!@#$%^&*) is allowed. Password must have at least 8 to 64 characters.'); 
        return; }
    let rePassword = $("#re-password").val();
    if (password != rePassword){ show_error('Passwords do not match.'); return; }
    let phone = $("#phone").val();
    if (phone != "" && (!phone.match(/^([0-9]{4,15})$/))){ 
        show_error('Provide a valid phone number, No need of country codes or spaces. Phone number must have at least 4 to 15 characters.');
        return; 
    }
    let emailID = $("#email_id").val();
    if (emailID != "" && (!emailID.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))){ 
        show_error('Provide a valid Email ID.');
        return; 
    }
    let genderTypeId = $("#gender").val();
    let captchaCode = $("#captcha_code").val();
    if (captchaCode == ""){
        show_error('Captcha code must be given.');
        return;
    }

    paramData = "username=" + username + "&password=" + password;
    paramData += "&captcha_id=" + captchaId + "&captcha_code=" + captchaCode;
    paramData += "&email_id=" + emailID + "&phone=" + phone + "&gender_type_id=" + genderTypeId;

    $.ajax({
        type: "POST",
        url: BASE_URL + '/signup?' + paramData,
        beforeSend : function(xhr) { 
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); },
        success: function(data) {
            console.log('signup success');
            set_token(data["access_token"]);
            window.location.replace("home.html");
        }, 
        error: function(jqXHR) {
            console.log('signup failed');
            if(jqXHR.status == 409){
                console.log(jqXHR.responseJSON["detail"]);
                const errorDesc = getResponseMessage(jqXHR.responseJSON["detail"], apiResponses);
                show_error(errorDesc);
            }
        },
    });
});