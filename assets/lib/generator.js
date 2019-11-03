function main() {
    var currentSelection,
        selectedRegex = 0, // 0 = false; 1 = true, regex; 2 = true, exact
        sidebarShown = false,
        userContents,
        popupActive = false,
        loading = false,
        loadStr = '<div id="processing_icon"><span id="abcbcd">A</span><img src="/assets/img/load.png" alt="loading"></div>',
        copied;

    var chatInfo = {
        generic : ["t", ":c", "oh", "nope", ":(", "l", "ez", ":o", ":D", ".", "yeah", "lol", "gg", "yes", "no", "omg", "lmao", "f", "&lt;3", ":)", "xd", "...", "k", "ok", "lmfao", "rofl", "yay", "why", "y", "yo", "hey", "hello", "hi", "haha", "meh", "^"],
        ranks : ["ULTRA", "HERO", "LEGEND", "TITAN", "ETERNAL", "MOD", "TRAINEE", "SR.MOD", "ADMIN", "DEV", "BUILDER", "BUILDLEAD", "OWNER", "LEADER", "YT", "YOUTUBE", "TWITCH"],

    };


    initial();
    updateSelection();
    updateRegexSelection();
    submissionHandler();
    copyPunishmentsHandler();
    sidebarCloser();
    loadCookies();


    // functions

    var ClipboardHelper = {

        copyElement: function ($element)
        {
           this.copyText($element.text())
        },
        copyText:function(text) // Linebreaks with \n
        {
            var $tempInput =  $("<textarea>");
            $("body").append($tempInput);
            $tempInput.val(text).select();
            document.execCommand("copy");
            $tempInput.remove();
        }
    };

    function initial() {
        var found;
        $(".selector_button").each(function() {
            if ($(this).hasClass('selected_button')) {
                found = $(this).attr('id');
                return;
            }
        });
        currentSelection = found;
    }

    function updateSelection() {
        $(".selector_button").on("click", function() {
            var id = $(this).attr("id");
            $("#" + currentSelection).removeClass("selected_button");
            $("#block_" + currentSelection.slice(7)).removeClass("block_selected");
            currentSelection = id;
            $("#block_" + currentSelection.slice(7)).addClass("block_selected");
            $(this).addClass("selected_button");
        });
    }

    function updateRegexSelection() {

        $("div#regex_select input").change(function() {
            var type = $(this).attr('value');
            var checked = $(this).is(':checked');

            if (checked) {
                if (type === 'regex') {
                    selectedRegex = 1;
                    $("#choice_exact").prop('checked', false);
                } else if  (type == 'exact') {
                    selectedRegex = 2;
                    $("#choice_regex").prop('checked', false);
                }

                $("#regex_textarea").prop("disabled", false);
                $("#only_regex_checkbox").prop("disabled", false);
            } else {
                selectedRegex = 0;
                $("#choice_exact").prop('checked', false);
                $("#choice_regex").prop('checked', false);
                $("#regex_textarea").prop("disabled", true);
                $("#only_regex_checkbox").prop("disabled", true);
            }
        });
    }

    function sidebarCloser() {
        $("div#output_closer").on("click", function() {
            hideSidebar();
        });
    }

    function copyPunishmentsHandler() {
        $("div#output_container ul").on("click", "li.output_item button.copy_button", function(){

            // handle copying
            var p = $(this).closest('li.output_item').data("punishment");
            ClipboardHelper.copyText(p);
            copied = p;

            // display last copied in box
            $("input#copied_text").val(copied);

            // update current button and other buttons
            $(this).addClass("copied_button");
            $(this).text("Copied");
            $('.copied_button').each(function(){
                $(this).removeClass('current_copied_button');
            });
            $(this).addClass("current_copied_button");

        });
    }

    function loadCookies() {
        // load punishment reasons from cookies if they are set
        if (document.cookie.indexOf('punish_reason') !== -1) {
            var cookies = document.cookie.split('; ');
            var pReason;

            cookies.forEach(function(cookie) {
                if (cookie.indexOf('punish_reason') !== -1) {
                    pReason = cookie.slice(cookie.indexOf('punish_reason') + 'punish_reason'.length + 1);
                }
            });
            $('#spambot_punish_reason_box').val(pReason);
            $('#punish_reason_box').val(pReason);
        }

    }

    function setPunishmentCookie(punishmentReason) {
        var date = new Date(),
            time = date.getTime(),
            expireTime = time + 1000*36000*7;
            date.setTime(expireTime);

        if (document.cookie === '') {
            document.cookie = 'punish_reason=' + punishmentReason + "; expires=" + date.toUTCString() + "; path=/";
        } else {
            var cookies = document.cookie.split('; ');

            // remove any old punishment cookie that may already exist
            for (var i = cookies.length-1; i >= 0; i--) {
                if (cookies[i].indexOf('punish_reason') !== -1) {
                    cookies.splice(i, 1);
                }
                else if (cookies[i].indexOf('expires') !== -1) {
                    cookies.splice(i, 1);
                }
                else if (cookies[i].indexOf('path') !== -1) {
                    cookies.splice(i, 1);
                }
            }

            // add new punishment cookie
            cookies.push('punish_reason=' + punishmentReason);
            cookies.push('expires=' + date.toUTCString());
            cookies.push('path=/');

            cookies = cookies.join('; ');
            document.cookie = cookies;
        }

    }


    // main handler
    function submissionHandler() {
        $("#submitter").on("click", function() {
            if (!loading) {
                loading = true;
                if (currentSelection === 'select_spambot') {
                    processSpamBot();

                } else if (currentSelection === 'select_alts') {
                    processAlts();

                } else if (currentSelection === 'select_counter') {

                    processCounter();

                } else {
                    showPopup("Something went wrong :(", 4000);
                }
                loading = false;
            }
        });

    }


    // ============ general ============

    function generateNotesList(notes) {
        var output = '<ul>';

        notes.forEach(function(note) {
            output += '<li>' + note + "</li>";
        });

        output += "</ul>";
        return output;
    }

    function generatePunishmentOutput(data, type, punishment, return_count=false, minmax=[]) {
        // html string

        var html = '',
            count = 0;

        if (type !== 'count') {

            Object.keys(data).forEach(function(key, index) {
                // <li class="output_item" data-punishment="/p Wanderer_ Compromised Account">
                //     <span class="match_type match_type_spam">Spam</span>
                //     <div class="plist_item">Wanderer_</div>
                //     <div class="plist_item_buttons">

                //         <button class="plist_item_info">

                //             <div class="plist_item_explain">
                //                 <div class="plist_item_explain_title">Matched Messages:</div>
                //                 <div class="plist_item_explain_list">
                //                 <ul>
                //                     <li>lol what even is this looooool exks deswda</li>
                //                     <li>lol what even is this looooool exks deswda</li>
                //                 </ul>
                //                 </div>
                //             </div>

                //             What?</button>
                //         <button class="copy_button">Copy</button>
                //     </div>
                // </li>
                //console.log("key: " + key + " item: " + data[key]);

                var item = data[key];
                var htmlItem = '<li class="output_item" data-punishment="/p ' +  key + ' ' + punishment + '">';

                if (type !== 'alts') {
                    htmlItem += '<span class="match_type match_type_' + item.type + '">' + item.type + '</span>';
                }

                htmlItem += '<div class="plist_item">' + key + '</div>' + '<div class="plist_item_buttons">';

                if (type === 'spambot') {
                    htmlItem += '<button class="plist_item_info"><div class="plist_item_explain">' +
                        '<div class="plist_item_explain_title">Matched Messages:</div>' +
                        '<div class="plist_item_explain_list"><ul>';

                    item.messages_matched.forEach(function(msg) {
                        htmlItem += '<li>' + msg + "</li>"
                    });

                    htmlItem += '</ul></div></div>What?</button>';
                }

                htmlItem += '<button class="copy_button">Copy</button>';
                htmlItem += '</div></li>';

                //now append item to html string
                html += htmlItem;
                count++;

                }, data);

            if (!return_count) {
                return html;
            }
        }
        else {
            // specifically for count generation since we want to sort by highest to lowest
            var min = minmax[1];
            var max = minmax[0];

            for (var i = max; i > min-1; i--) {
                // i is key
                if (data[i] !== undefined) { // if key exists going from highest key to lowest key, key is always an integer as generated by sortCountBased()
                    for (var j = 0; j < data[i].length; j++) {
                        var htmlItem = '<li class="output_item">';
                        htmlItem += '<span class="match_type">' + i + '</span>';
                        htmlItem += '<div class="plist_item">' + data[i][j] + '</div>' + '<div class="plist_item_buttons">';
                        htmlItem += '</div></li>';

                        //now append item to html string
                        html += htmlItem;
                        count++;
                    }
                }
            }
        }

        return [html,count];
    }

    function setSidebarTitle(title, num_generated) {
        $("#sidebar_title").text(title);
        $("#num_generated").text(num_generated);
    }


    function setOutput(title, count, output, notes) {
        setSidebarTitle(title, count);

        $("div#output_container ul").html(output);
        if (notes !== '') {
            $('#generation_notes').html(generateNotesList(notes));
        } else {
            $('#generation_notes').html('');
        }
    }


    // ============ Spambot processor ============
    function getSpamBotInfo() {
        var tmp = {
            chatSnippet : $("#spambot_UserInput").val(),
            spamCount : parseInt($("#spambot_count").val()),
            exclude : $("#spambot_excludeMsg").val(),
            regex : selectedRegex,
            regexString : $("#regex_textarea").val(),
            onlyRegex : $("#only_regex_checkbox").is(':checked'),
            punishReason: $("#spambot_punish_reason_box").val(),
            excludeGeneric : $("#spambot_excludeGeneric").is(':checked'),
            regexObj : false,
            notes: []
        };

        if (tmp.spamCount < 1) {
            showPopup("Generating with default value...", 1000);
            tmp.notes.push("Generated with default message count value of 5 because negative value was provided.");
            tmp.spamCount = 5;
        }

        if (tmp.regex == 1) {
            tmp.regexObj = new RegExp(tmp.regexString);
        }

        if (tmp.exclude !== '') {
            tmp.exclude = tmp.exclude.split("\n");
        } else {
            tmp.exclude = false;
        }

        if (tmp.punishReason === '') {
            tmp.punishReason = 'Compromised Account';
            tmp.notes.push("Generated with default punishment message 'Compromised Account' as no message was provided.");

        }

        return tmp;
    }

    function firstLineSpamFormattedCorrectly(indx_0) {
        return indx_0.match(/^\[.*?\]\s\[.*?\]:\s.*?\s.*?\s.*?\s.*?\s.*?$/);
    }

    function clearOfProfiler(string) {
        return string.replace(/(.+) §7§l\[§a§l \? §7§l\] §7§l\[§c§l \? §7§l]/, '$1');
    }

    function getChatMessageClean(string) {
        var msg = clearOfProfiler(string);

        msg = msg.replace(/(\[\d+:\d+:\d+] \[(?:main|Client thread)\/INFO]: \[CHAT](?: §8§lSHADOW)? §\d+ (?:§3\? )?)((?:[\w\.]+ )?[a-zA-Z0-9_]+ .+)$/, '$2'); // get chat message portion
        msg = msg.split(' ');
        // get rid of rank
        if (chatInfo.ranks.includes(msg[0])) {
            msg.splice(0,1);
        }

        // now we have the username and the message
        var username = msg[0];
        msg.splice(0,1);
        var msg = msg.join(' ');

        return [username, msg];

    }

    function generateSpamMatchesArrayItem(m_array, uname, type_string=false, curr_msg=false) {

        m_array[uname] = m_array[uname] || {
            type: type_string,
            messages_matched: []
        };
        if (curr_msg) {
            if (!(m_array[uname].messages_matched.includes(curr_msg))) {
                m_array[uname].messages_matched.push(curr_msg); // push it if it's not already in there
            }
        }
    }

    // main handler
    function processSpamBot() {
        showProcessing(true);

        userContents = getSpamBotInfo();

        if (userContents.chatSnippet === '') {
            showPopup("No Chat log snippet provided", 3000);
            showProcessing(false);
            return;
        }

        var splitInput = userContents.chatSnippet.split("\n"),
            message_counter = [],
            matches = [];

        if (firstLineSpamFormattedCorrectly(splitInput[0])) { // first line formatted correctly
            for (var i = splitInput.length-1; i > 0; i--) {
                if (!(splitInput[i].match(/\[\d+:\d+:\d+] \[(?:main|Client thread)\/INFO]: \[CHAT]( §8§lSHADOW)? §\d+( .+)? [\w_]+ .+/))) { // if not format of chat message
                    splitInput.splice(i, 1); // remove non-chat related lines
                } else {

                    var [username, msg] = getChatMessageClean(splitInput[i]); // clean off message
                    var lowerMsg = msg.toLowerCase();

                    if (((userContents.exclude && !userContents.exclude.includes(lowerMsg)) || !(userContents.exclude))  &&
                        (!userContents.excludeGeneric  || (userContents.excludeGeneric && !(chatInfo.generic.includes(lowerMsg))))) {
                        // exclude generic messages if selected for that
                        // exclude specified messages if selected for that

                        //check regex right away
                        if (userContents.regex) {
                            if (userContents.regex === 1){
                                // regex
                                if (msg.match(userContents.regexObj)) {
                                    generateSpamMatchesArrayItem(matches, username, 'regex', msg);
                                }

                            } else {
                                // exact match
                                if (msg === userContents.regexString) {
                                    generateSpamMatchesArrayItem(matches, username, 'exact', msg);
                                }
                            }
                        }

                        if (!(userContents.onlyRegex)) { // don't do this regular processing if we only want regex matches.
                            message_counter[username] = message_counter[username] || [];
                            message_counter[username].push(lowerMsg);
                        }
                    }
                }
            }

            if (!(userContents.onlyRegex)) { // don't do this processing if we only want regex matches.
                // process spam matches
                Object.keys(message_counter).forEach(function(key, index) {
                    var inner_counter = {};

                    this[key].forEach(function(i) {

                        inner_counter[i] = (inner_counter[i] || 0) + 1; // count number of times the user said the specific message

                        if (inner_counter[i] >= userContents.spamCount) { // matched spam counter
                            generateSpamMatchesArrayItem(matches, key, 'spam', i); // add to final results list
                        }
                    });

                   }, message_counter);
            }

            // Now we can write out the sidebar...

            var [htmlOutput,count] = generatePunishmentOutput(matches, 'spambot', userContents.punishReason, true);
            setPunishmentCookie(userContents.punishReason);

            setOutput("Output Spambots", count, htmlOutput, userContents.notes);

            showSidebar();


        } else {
            showPopup("The log provided didn't look like a valid MC chat log", 3000);
        }

        showProcessing(false);
    }


    // ============ alts processor ============

    function getAltsInfo() {
        var tmp = {
            ipSnippet : $("#alts_ip_log").val(),
            punishReason: $("#punish_reason_box").val(),
            notes: []
        };

        if (tmp.punishReason === '') {
            tmp.punishReason = 'Compromised Account';
            tmp.notes.push("Generated with default punishment message 'Compromised Account' as no message was provided.");
        }

        return tmp;
    }


    function processAlts() {
        showProcessing(true);

        userContents = getAltsInfo();

        if (userContents.ipSnippet === '') {
            showPopup("No IP log snippet provided", 3000);
            showProcessing(false);
            return;
        }

        var ipLog = userContents.ipSnippet.split('\n');

        if (ipLog.length > 1) {
            var names = [];

            ipLog.forEach(function(string) {
                // get name from ip log string and push into names array
                var name = string.replace(/([a-zA-Z0-9_]+)\s\(Check Alts\)\s\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\s\(Check Alts\)\s\w+\s\d+,\s\d+/, '$1');
                generateSpamMatchesArrayItem(names, name);
            });


            // Now we can write out the sidebar...

            var [htmlOutput,count] = generatePunishmentOutput(names, 'alts', userContents.punishReason,true);
            setPunishmentCookie(userContents.punishReason);

            setOutput("Output Alts", count, htmlOutput, userContents.notes);

            showSidebar();

        } else {
            showPopup("The provided text snippet doesn't look valid", 3000);
        }

        showProcessing(false);

    }


    // ============ counter processor ============

    function sortCountBased(spamMatchesArray) {
        var count_arr = {};
        var largest_key = false;
        var smallest_key = false;

        Object.keys(spamMatchesArray).forEach(function(key,i) {
            let count = spamMatchesArray[key]['type'];
            largest_key = (largest_key === false || count > largest_key) ? count : largest_key;
            smallest_key = (smallest_key === false || count < smallest_key) ? count : smallest_key;
            count_arr[count] = count_arr[count] || [];
            count_arr[count].push(key);
        });

        return [count_arr, [largest_key, smallest_key]];
    }


    function processCounter() {
        // count number of times a name occured

        showProcessing(true);
        var snippet = $("#counter_ip_log").val();

        if (snippet !== '') {
            snippet = snippet.split('\n');

            var names = [],
                final = [];

            snippet.forEach(function(string) {
                var name =  string.replace(/^([a-zA-Z0-9_]{1,16}).*$/, '$1');
                names[name] = (names[name] || 0) + 1;
            });

            Object.keys(names).forEach(function(key, index) {
                generateSpamMatchesArrayItem(final, key, names[key]); // add to final results list
            }, names);

            var [sorted, minmax] = sortCountBased(final);

            // Now we can write out the sidebar...

            var [htmlOutput,count] = generatePunishmentOutput(sorted, 'count', false, true, minmax);

            setOutput("Output Counter", count, htmlOutput, '');

            showSidebar();

        } else {
            showPopup("No IP log snippet provided", 3000);
        }
        showProcessing(false);
    }



    // ============ sidebar ============

    function showSidebar() {
        if (!sidebarShown) {
            sidebarShown = true;
            $(".input_block").css("width", "50%");
            setTimeout(function() {
                $(".output_block").removeClass("output_invisible");
                setTimeout(function() {
                    $(".output_block").css("width", "49%");
                    setTimeout(function() {
                        $(".output_innercontent").removeClass("output_innercontent_hidden");
                    }, 100);
                }, 100);
            }, 200);
        }
    }

    function hideSidebar() {
        if (sidebarShown) {
            sidebarShown = false;
            $(".output_innercontent").addClass("output_innercontent_hidden");
            setTimeout(function() {
                $(".output_block").css("width", "");
                setTimeout(function() {
                    $(".output_block").addClass("output_invisible");
                    setTimeout(function() {
                        $(".input_block").css("width", "");
                    }, 200);
                }, 100);
            }, 100);
        }
    }


    // ============ popup handler ============
    function showPopup(text, time) {
        if (!popupActive) {
            popupActive = true
            var p = $(".popup");
            $(p).text(text);
            $(p).css("display", "");
            setTimeout(function() {
                $(p).removeClass("popup_hidden");
            }, 100);
            setTimeout(function() {
                $(p).addClass("popup_hidden");
                setTimeout(function() {
                    $(p).css("display", "none");
                    popupActive = false;
                }, 100);
            }, time);
        }
    }

    function showProcessing(visible) {
        if (visible) {
            $('button#submitter').html(loadStr);
        } else {
            $('button#submitter').html('Submit');
        }
    }

}




$(document).ready( function(){
    main();
});