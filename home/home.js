var userToken   = null
var maxCallId   = 0
var minCallId   = 0
var maxTicketId = 0
var minTicketId = 0


init();
async function init(){
    userToken = getToken();
    if(userToken == null || (!(await tokenIsValid(userToken))))
    {   window.location.replace("login.html");  }

    const policeStations = await getTable(POLICE_STATION);
    for(const index in policeStations)
    {
        const policeStation = titleCase(`${policeStations[index].station_name}`);
        const policeStationId = `${policeStations[index].station_code}`;
        $("#police-station").append($("<option></option>").val(policeStationId).html(policeStation));
    }
    populateStationUsers();

    publicServices = await getTable(PUBLIC_SERVICE);
    for(const index in publicServices)
    {
        const publicService       = titleCase(`${publicServices[index].public_service_name}`);
        const publicServiceTypeId = `${publicServices[index].public_service_type_id}`;
        if(publicServiceTypeId == 1){
            $("#emergency-service").append($("<option></option>").val(publicServices[index].default_phone).html(publicService));
        } else if(publicServiceTypeId == 2){
            $("#social-service").append($("<option></option>").val(publicServices[index].default_phone).html(publicService));
        }
    }

    let ticketsMadeByMe  = (await getTicketsMadeForMe()).ticket_id;
    let ticketsMadeForMe = (await getTicketsMadeByMe()).ticket_id;
    const myTickets = new Set([...ticketsMadeForMe, ...ticketsMadeByMe]);
    console.log(myTickets);
}


$('#emergency-service-call').click(async function ()
{
    emergencyServiceNumber = $("#emergency-service").val();
    if(emergencyServiceNumber == null) {
        window.alert('No phone number assigned');
    } else {
        document.location.href="tel:" + emergencyServiceNumber;
    }
});

$("#social-service-call").click(async function ()
{
    socialServiceNumber = $("#social-service").val();
    if(socialServiceNumber == null) {
        window.alert('No phone number assigned');
    } else {
        document.location.href="tel:" + socialServiceNumber;
    }    
});

$('#ps-call').click(async function ()
{
    psUserNumber = $('#station-users').val();
    if(psUserNumber == null) {
        window.alert('No phone number assigned');
    } else {
        document.location.href="tel:" + psUserNumber;
    }   
});

$('#police-station').change(async function ()
{   
    populateStationUsers();
});

async function getTicketDetails(ticketID){

}


async function populateStationUsers(){
    stationUsers = await getStationUsers($('select').val());
    $('#station-users').empty();
    for(const index in stationUsers.users)
    {
        const userUUID    = stationUsers.users[index].user_uuid;
        const userDetails = await getUserDetails(userUUID);
        $('#station-users').append($("<option></option>").val(userDetails.user.public_phone).html(userDetails.user.full_name));
    }
}

async function getUserDetails(userUUID){
    userData = null;
    await $.ajax(await{
        type: "GET",
        url: BASE_URL + '/police_station/user/details?' + "user_uuid=" + userUUID,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); },
        success: function(data) {
            userData = data;
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
    return userData;
}

async function getStationUsers(stationCode){
    stationUsers = null;
    await $.ajax(await{
        type: "GET",
        url: BASE_URL + '/police_station/users?' + "station_code=" + stationCode,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); },
        success: function(data) {
            stationUsers = data;
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
    return stationUsers;
}

async function getTicketsMadeByMe(){
    myTickets = null;
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/ticket/created_by_me',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
            xhr.setRequestHeader('Authorization', 'Bearer '+ userToken); },
        success: function(data) {
            myTickets = data;
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
    return myTickets;
}

async function getTicketsMadeForMe(){
    myTickets = null;
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/ticket/created_for_me',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
            xhr.setRequestHeader('Authorization', 'Bearer '+ userToken); },
        success: function(data) {
            myTickets = data;
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
    return myTickets;
}


function addCallHistory(callId, duration, time, recipient){
    const callHistoryList = document.getElementById("call_history_list");
    const callHistory = `
        <div class="p-2 mt-2 bg-secondary border text-light rounded">
            <div class="row">
                <div class="col-3">
                    <b>ID<br>Duration<br>Time<br>Recipient</b>
                </div>
                <div class="col-7">
                    <i>${callId}<br>${duration} minutes<br>${time}<br>${recipient}</i>
                </div>
                <div class="col-2">
                    <button id="new-ticket-from-call" class="btn-primary fa fa-plus mb-1 btn-icon"></button><br>
                    <button id="download-call" class="btn-primary fa fa-download mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    callHistoryList.insertAdjacentHTML( 'beforeend', callHistory);
}

function addTicketHistory(ticketId, status, assignedTo, createdOn){
    const ticketHistoryList = document.getElementById("ticket_history_list");
    const ticketHistory = `
        <div class="p-2 mt-2 bg-secondary border text-light rounded">
            <div class="row">
                <div class="col-4">
                    <b>ID<br>Status<br>Assigned To<br>Created On</b>
                </div>
                <div class="col-6">
                    <i>${ticketId}<br>${status}<br>${assignedTo}<br>${createdOn}</i>
                </div>
                <div class="col-2">
                    <button id="follow-up-call" class=" btn-primary rounded fa fa-video-camera  mb-1 btn-icon" ></button><br>
                    <button id="ticket-details" class=" btn-primary rounded fa fa-bars  mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    ticketHistoryList.insertAdjacentHTML( 'beforeend', ticketHistory);
}