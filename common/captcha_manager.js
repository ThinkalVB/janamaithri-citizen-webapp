async function make_signup_captcha(){
    let captchaId = null;
    try {
        await $.ajax(await{
            type: "GET",
            url: BASE_URL + '/citizen/signup/captcha',
            success: function(data) {    
                captchaId = data["captcha_id"];
            }
        });
    }catch(e) {
        console.log(e);
    }
    return captchaId;
}