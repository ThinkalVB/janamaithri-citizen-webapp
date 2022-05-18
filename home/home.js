var userToken        = null
var orderBy          = 'asc'
var startingTicketId = 0
var maxTicketPerPage = 5


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

    populateStationUsers();
    populateTicketHistory();
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


async function populateTicketHistory(){
    $('#ticket_history_list').empty();
    
    const ticketsMadeByMe  = (await getTicketsMadeForMe(startingTicketId, maxTicketPerPage+1, orderBy)).ticket_id;
    const ticketsMadeForMe = (await getTicketsMadeByMe (startingTicketId, maxTicketPerPage+1, orderBy)).ticket_id;
    
    let myTickets        = new Set([...ticketsMadeForMe, ...ticketsMadeByMe]);
    let myTicketsInOrder = [...myTickets].sort(function(a, b){return a - b});

    noOfTicketsToDisplay = (myTicketsInOrder.length<maxTicketPerPage)? myTicketsInOrder.length : maxTicketPerPage;
    for (var i = 0; i < noOfTicketsToDisplay; i++)
    { 
        const ticketDetails = await getTicketDetails(myTicketsInOrder[i]);
        const options      = {year: 'numeric', month: 'numeric', day: 'numeric',  hour: '2-digit', minute: '2-digit', hour12: true};
        const stationName  = await getStationName(ticketDetails.ticket.assigned_station_code);
        const createdOn    = new Date(ticketDetails.ticket.ticket_created_on);
        const createdOnStr = createdOn.toLocaleDateString('en-GB', options);
        
        addTicketHistory(myTicketsInOrder[i], ticketDetails.ticket.ticket_status_id, stationName, createdOnStr);
        startingTicketId = myTicketsInOrder[i];
    }
}

async function getTicketDetails(ticketId){
    ticketDetail = null;
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/ticket/details?' + "ticket_id=" + ticketId,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
            xhr.setRequestHeader('Authorization', 'Bearer '+ userToken); },
        success: function(data) {
            ticketDetail = data;
        }, 
        error : function(jqXHR) {
            console.log(jqXHR.responseJSON["detail"]);
        },
    });
    return ticketDetail;
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

async function getTicketsMadeByMe(startingTicketId=0, limit=11, order='asc'){
    myTickets = null;
    paramData = "starting_ticket_id=" + startingTicketId;
    paramData += "&limit=" + limit + "&order=" + order;
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/ticket/created_by_me?'+ paramData,
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

async function getTicketsMadeForMe(startingTicketId=0, limit=11, order='asc'){
    myTickets = null;
    paramData = "starting_ticket_id=" + startingTicketId;
    paramData += "&limit=" + limit + "&order=" + order;
    await $.ajax(await{
        type: "POST",
        url: BASE_URL + '/ticket/created_for_me?'+ paramData,
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


async function addCallHistory(callId, duration, time, recipient){
    const callHistoryList = document.getElementById("call_history_list");
    const callHistory = `
        <div class="p-2 mt-2 border text-light rounded" style="background-color: #36454F;">
            <div class="row">
                <div class="col-3">
                    <p class="m-0 p-0"><b>ID</b></p>
                    <p class="m-0 p-0"><b>Duration</b></p>
                    <p class="m-0 p-0"><b>Time</b></p>
                    <p class="m-0 p-0"><b>Recipient</b></p>
                </div>
                <div class="col-7">
                    <p class="m-0 p-0">${callId}</p>
                    <p class="m-0 p-0">${duration} minutes</p>
                    <p class="m-0 p-0">${time}</p>
                    <p class="m-0 p-0">${recipient}</p>
                </div>
                <div class="col-2">
                    <button id="new-ticket-from-call" class="btn-primary fa fa-plus mb-1 btn-icon"></button><br>
                    <button id="download-call" class="btn-primary fa fa-download mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    callHistoryList.insertAdjacentHTML( 'beforeend', callHistory);
}

async function addTicketHistory(ticketId, status, assignedTo, createdOn){
    const ticketHistoryList = document.getElementById("ticket_history_list");
    
    const ticketStatusType = await getTicketStatus(status);
    if(ticketStatusType == "CREATED" || ticketStatusType == "OPEN"){
        var styledStatus = `<p class="m-0 p-0 text-success"><b>${ticketStatusType}</b></p>`;
    } else if(ticketStatusType == "ClOSED"){
        var styledStatus = `<p class="m-0 p-0 text-warning"><b>${ticketStatusType}</b></p>`;
    } else if (ticketStatusType == "DISPOSED" || ticketStatusType == "REMOVED"){
        var styledStatus = `<p class="m-0 p-0 text-danger"><b>${ticketStatusType}</b></p>`;
    }

    const ticketHistory = `
        <div class="p-2 mt-2 border text-light rounded" style="background-color: #36454F;">
            <div class="row">
                <div class="col-4">
                    <p class="m-0 p-0"><b>ID</b></p>
                    <p class="m-0 p-0"><b>Status</b></p>
                    <p class="m-0 p-0"><b>Assigned To</b></p>
                    <p class="m-0 p-0"><b>Created On</b></p>
                </div>
                <div class="col-6">
                    <p class="m-0 p-0">${ticketId}</p>
                    ${styledStatus}
                    <p class="m-0 p-0">${assignedTo}</p>
                    <p class="m-0 p-0">${createdOn}</p>
                </div>
                <div class="col-2">
                    <button id="follow-up-call" class=" btn-primary rounded fa fa-video-camera  mb-1 btn-icon" ></button><br>
                    <button id="ticket-details" class=" btn-primary rounded fa fa-bars  mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    ticketHistoryList.insertAdjacentHTML( 'beforeend', ticketHistory);
}