async function getTableVersion(tableName){
    let latestVersion = null;
    try{
        await $.ajax(await{
            type:"GET",
            url: BASE_URL +'/' + tableName +'/last_update_on',
            error:function(data){
                console.log(data.status + ':' + data.statusText,data.responseText);},
            success: function(data){
                latestVersion = data.last_update_on;
            }
        });
    }catch(e){ 
        console.log(e);
    }
    return latestVersion;
}

async function getTable(tableName){
    let latestTableVersion = await getTableVersion(tableName);
    let storedTableVersion = window.localStorage.getItem(tableName + '__last_update_on');
    let storedTableData    = window.localStorage.getItem(tableName);

    if((latestTableVersion != storedTableVersion) || (storedTableData ==null)){
        await $.ajax(await{
            type: "GET",
            url: BASE_URL + '/' +tableName,
            success: function(data) {
                window.localStorage.setItem(tableName, JSON.stringify(data[tableName]));
                window.localStorage.setItem(tableName + '__last_update_on', latestTableVersion);
                storedTableData = data[tableName];
            }
        });
        return storedTableData;
    }else{
        return JSON.parse(storedTableData);
    }
}

async function getStationName(stationCode){
    const policeStations = await getTable(POLICE_STATION);
    for(const index in policeStations)
    {
        if(policeStations[index].station_code == stationCode){
            return policeStations[index].station_name;
        }
    }
    return null;
}

async function getTicketStatus(ticketStatusId){
    const ticketStatusTypes = await getTable(TICKET_STATUS);
    for(const index in ticketStatusTypes)
    {
        if(ticketStatusTypes[index].ticket_status_id == ticketStatusId){
            return ticketStatusTypes[index].ticket_status;
        }
    }
    return null;
}