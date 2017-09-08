function btnUpload(opt, action, data = {}, url, $=jQuery) {
    let btnID = opt.bId; //upload btn id
    let nonceID = opt.nId; //nonce box id
    let inputID = opt.iId; //input box id
    let triggerBtnID = opt.tbId; //choose file btn id
    let formID = opt.fId; //form id
    let nonceRemoteID = opt.nrId; // nonce remote id
    let processCB = opt.pCB; // process callback
    let successCB = opt.sCB; // success callback

    $('#' + triggerBtnID).off('click');
    $('#' + triggerBtnID).on('click', function() {
        $('#' + inputID).trigger('click');
    });

    if(btnID == '' || typeof btnID == 'undefined') {
        $('#' + inputID).off('change');
        $('#' + inputID).on('change', function() {
            $('#' + formID).submit(); 
        });
    } else {
        $('#' + btnID).off('click');
        $('#' + btnID).on('click', function() {
            $('#' + formID).submit(); 
        });
    }

    $('#' + formID).off('submit');
    $('#' + formID).on('submit', function(e){
        e.preventDefault();

        let nonce = $('#' + formID).find('#' + nonceID).val();

        if ( $('#' + inputID).val() == 0 ) {
            alert('Please select an fille to upload');
            return;
        }

        let formdata = false;

        if (window.FormData) {
            formdata = new FormData();
        }

        let files_data = jQuery('#' + inputID);

        jQuery.each(jQuery(files_data), function(i, obj) {
            jQuery.each(obj.files, function(j, file) {
                formdata.append('files[' + j + ']', file);
            })
        });

        formdata.append('action', action);
        formdata.append('nonce', nonce);
        formdata.append('nonce_id', nonceRemoteID);

        $.each(data, function(key, value) {
            formdata.append(key, value);
        }); 

        $.ajax({
            url: url,
            type: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            contentType: false,
            xhr: function() {
                var xhr = jQuery.ajaxSettings.xhr();
                if(xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        
                        if(processCB != null && typeof processCB != 'undefined') {
                            processCB(percent, position, total);
                        }

                    }, true);
                }
                return xhr;
            },
            success: function(data) {
                //console.log(data);
                if(successCB != null && typeof successCB != 'undefined') {
                    successCB(data);
                }
            }
        });
    });
}

(function($) {
    $.btnUpload = btnUpload;
})(jQuery);
