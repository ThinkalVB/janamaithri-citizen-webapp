function removeFileSelection(elem){
    $(elem).parent('span').remove();
}

$("#file-selector").change(function(){
    const uploadPreview = document.getElementById("upload_preview");
    for (let i = 0; i < this.files.length; i++) {
        var fileSelection = `<span style="min-width: 350px; max-width:480px;" class="my-1">
                                <button type="button" class="btn btn-danger fa fa-close mx-1" onclick="removeFileSelection(this)"></button>
                                <b>${this.files[i].name}</b>
                             </span>`;  
        uploadPreview.insertAdjacentHTML( 'beforeend', fileSelection);
    }
});