var wfaApp = {

    /* JSON database dump file */
    json_db: '',

    init: function(json_db_file) {
        wfaApp.json_db = json_db_file;
    },

    stripParagraph: function(html) {
        return html.replace('<p>', '').replace('</p>', '');
    },

    populateProtocols: function() {
        $.getJSON(wfaApp.json_db, function(data) {
            var protocol_list_items = '';
            $.each(data.protocols, function (i, item) {
                var protocol = wfaApp.stripParagraph(item.name);
                protocol_list_items += '<li><a href="#protocol-page" id="protocol-' + item.id + '" data-transition="none" class="protocol-link">' + protocol + '</a></li>';
            });
            $('#protocols-content-list').append(protocol_list_items);
            $('#protocols-content-list').listview('refresh');
            $('a.protocol-link').click( function(event) {
                var protocol_id = event.target.id.split('protocol-')[1];
                wfaApp.populateProtocolPage(protocol_id);
            });
        });
    },

    populateProtocolPage: function(protocol_id) {
        $.getJSON(wfaApp.json_db, function(data) {
            $.each(data.protocols, function (i, item) {
                if (item.id == protocol_id) {
                    var protocol_name = wfaApp.stripParagraph(item.name);
                    $('#protocol-header-title').html(protocol_name);

                    $('#protocol-content-name').html(item.name);
                    $('#protocol-content-comments').html(item.comments);
                    $('#protocol-content-comments img').each(function(image) {
                        $(this).click(function() {

                        });
                    });

                    var symptoms_list_items = '';
                    $.each(item.symptoms, function(j, symptom) {
                        var chief_symptom = wfaApp.stripParagraph(symptom.chief);
                        if (item.symptoms.length == 1) {
                            symptoms_list_items += '<div class="symptom-item" data-role="collapsible" data-collapsed="false" data-inset="false" data-theme="c" data-content-theme="d"><h1>' + chief_symptom + '</h1><p>';
                        } else {
                            symptoms_list_items += '<div class="symptom-item" data-role="collapsible" data-inset="false" data-theme="c" data-content-theme="d"><h1>' + chief_symptom + '</h1><p>';
                        }
                        symptoms_list_items += symptom.chief;
                        symptoms_list_items += symptom.symptoms;
                        symptoms_list_items += symptom.redflag;
                        symptoms_list_items += symptom.treatment;
                        symptoms_list_items += '</p></div>';
                    });
                    $('#protocol-content-symptomslist').html(symptoms_list_items);
                    $('.symptom-item').each(function(i) {
                        $(this).collapsible();
                    });

                    $('#protocol-content-evacuate').html(item.evacuate);
                }
            });
        });
    },

    populateWildernessKit: function() {
        $.getJSON(wfaApp.json_db, function(data) {

            /* Medications */
            var medication_information_title = wfaApp.stripParagraph(data.medication_information.title);
            $('#wildernesskit-medications-information').append('<h3>' + medication_information_title + '</h3>');
            $('#wildernesskit-medications-information').append(data.medication_information.comments);

            var medication_list_items = '';
            var current_medication_class = '';
            $.each(data.medications, function (i, item) {
                var medication_class = wfaApp.stripParagraph(item.medication_class);
                if (current_medication_class != medication_class) {
                    current_medication_class = medication_class;
                    medication_list_items += '<li data-role="list-divider">' + current_medication_class + '</li>';
                }
                var medication_name = wfaApp.stripParagraph(item.name);
                medication_list_items += '<li><a href="#wildernesskit-medication-page" id="medication-' + item.id + '" data-transition="none" class="medication-link">' + medication_name + '</a></li>';
            });
            $('#wildernesskit-medications-list').append(medication_list_items);
            $('a.medication-link').click( function(event) {
                var medication_id = event.target.id.split('medication-')[1];
                wfaApp.populateMedicationPage(medication_id);
            });

            /* First Aid */
            $.each(data.first_aid_kit, function(i, item) {
                var firstaid_item = wfaApp.stripParagraph(item.name);
                $('#wildernesskit-firstaid-checklist').append('<label><input type="checkbox" name="firstaid-' +  item.id + '" />' + firstaid_item + '</label>');
            });

            /* Survival */
            $.each(data.survival_kit, function(i, item) {
                var survival_item = wfaApp.stripParagraph(item.name);
                $('#wildernesskit-survival-checklist').append('<label><input type="checkbox" name="survival-' +  item.id + '" />' + survival_item + '</label>');
            });

        });
    },

    populateMedicationPage: function(medication_id) {
        $.getJSON(wfaApp.json_db, function(data) {
            $.each(data.medications, function (i, item) {
                if (item.id == medication_id) {
                    var medication_name = wfaApp.stripParagraph(item.name);
                    $('#wildernesskit-medication-header-title').html(medication_name);
                    $('#wildernesskit-medication-content-class').html(item.medication_class);
                    $('#wildernesskit-medication-content-name').html(item.name);
                    $('#wildernesskit-medication-content-classification').html(item.classification);
                    $('#wildernesskit-medication-content-indication').html(item.indication);
                    $('#wildernesskit-medication-content-contraindication').html(item.contraindication);
                    $('#wildernesskit-medication-content-sideeffect').html(item.side_effect);
                    $('#wildernesskit-medication-content-dose').html(item.dose);
                    $('#wildernesskit-medication-content-brandnames').html(item.brand_names);
                }
            });
        });
    }

};

