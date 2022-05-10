addCallHistory()
addCallHistory()
addTicketHistory()
addTicketHistory()

function addCallHistory() {
    const callHistoryList = document.getElementById("call_history_list");
    const callHistory = `
        <div class="p-2 mt-2 bg-secondary border text-light rounded">
            <div class="row">
                <div class="col-3">
                    <b>ID<br>Duration<br>Time<br>Recipient</b>
                </div>
                <div class="col-7">
                    <i>124578<br>25 minutes<br>02-12-1997 02:55 PM<br>Varkala PS - SHO</i>
                </div>
                <div class="col-2">
                    <button id="new-ticket-from-call" class="btn-primary fa fa-plus mb-1 btn-icon"></button><br>
                    <button id="download-call" class="btn-primary fa fa-download mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    callHistoryList.insertAdjacentHTML( 'beforeend', callHistory);
}

function addTicketHistory() {
    const ticketHistoryList = document.getElementById("ticket_history_list");
    const ticketHistory = `
        <div class="p-2 mt-2 bg-secondary border text-light rounded">
            <div class="row">
                <div class="col-4">
                    <b>ID<br>Status<br>Assigned To<br>Created On</b>
                </div>
                <div class="col-6">
                    <i>235689<br>OPEN<br>Varkala PS<br>02-12-1997 02:55 PM</i>
                </div>
                <div class="col-2">
                    <button id="follow-up-call" class=" btn-primary rounded fa fa-video-camera  mb-1 btn-icon" ></button><br>
                    <button id="ticket-details" class=" btn-primary rounded fa fa-bars  mb-1 btn-icon"></button>
                </div>
            </div>  
        </div>`;  
    ticketHistoryList.insertAdjacentHTML( 'beforeend', ticketHistory);
}