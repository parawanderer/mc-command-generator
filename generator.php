<?php
// originally last edited: Nov 3, 2019, 10:45 AM
    header("Cache-Control: public, max-age=864000");
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Generator</title>
    <link rel="shortcut icon" href="/assets/icon/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300i,700|Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">
    <link rel="stylesheet" type="text/css" media="screen" href="/assets/css/generator.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
<body>
    <div class="input_block">
        <div class="main_title">
            <h2> Dumb Comp Gen v2.0</h2>
            <h4>(now in jAvAsCriPt and about 100% less annoying to use!!)</h4>
        </div>

        <div class="inner_block_container">
            <div class="selector" id="selector">
                <button class="selector_button selected_button" id="select_spambot">Spambots</button>
                <button class="selector_button" id="select_alts">Alts</button>
                <button class="selector_button" id="select_counter">Counter</button>
            </div>

            <div class="block_option block_selected" id="block_spambot">
                <div class="title_block">
                    <h2>Spambot Generator</h2>
                </div>

                <div class="block_section">
                    <label>Enter Chat Snippet</label>
                    <div class="textarea_container">
                        <textarea id="spambot_UserInput" name="UserInput" rows="1" cols="40" placeholder="Minecraft chat log"></textarea>
                    </div>
                    <span class="error_container" id="err_chatsnippet"></span>
                </div>

                <div class="block_section">
                    <label>Enter Punishment Reason</label>
                    <input id="spambot_punish_reason_box" class="punish_reason_box" type="text" name="punish_reason" value="Compromised Account" placeholder="Punishment Reason">
                    <span class="error_container" id="err_spambot_reason"></span>
                </div>


                <div class="block_section">
                    <label>How many messages to count as spam?</label>
                    <input id="spambot_count" type="number" name="SpamDetector" value="5">
                    <span class="warning_container" id="warn_msg_num"></span>
                </div>

                <div class="block_section">
                    <label>Exclude</label>
                    <div class="textarea_container">
                        <textarea id="spambot_excludeMsg" name="ExcludeMsgs" rows="1" cols="40" placeholder="Any message(s) to potentially exclude"></textarea>
                    </div>
                    <span class="info_comment">Separate with linebreaks</span>
                </div>

                <div class="block_section regex_block">
                    <label><a href="https://regexr.com/">Regular Expression</a> Matcher</label>
                    <div class="regex_selector" id="regex_select">
                        <input id="choice_regex" type="checkbox" name="matcherChoice" value="regex"><label style="display: inline-block;">Regex Matcher</label>
                        <input id="choice_exact" type="checkbox" name="matcherChoice" value="exact"><label style="display: inline-block;">Exact Matcher</label>
                    </div>
                    <div class="textarea_container">
                        <textarea id="regex_textarea" name="regexExpr" rows="1" cols="40" placeholder="Regex Expression" disabled></textarea>
                    </div>

                    <input type="checkbox" id="only_regex_checkbox" name="onlyRegex" value="Yes" disabled><label style="display: inline-block;">Only use Regex Matcher</label>
                    <br><span class="info_comment">Enabling this will exclude any matches that don't match the provided expression</span>
                </div>

                <div class="block_section">
                    <input type="checkbox" id="spambot_excludeGeneric" name="excludeGeneric" value="Yes"><label style="display: inline-block;">Exclude Generic</label>
                </div>

            </div>



            <div class="block_option" id="block_alts">
                <div class="title_block">
                    <h2>Alts Generator</h2>
                </div>

                <div class="block_section">
                    <label>Enter IP Log Snippet</label>
                    <div class="textarea_container">
                        <textarea id="alts_ip_log" name="UserInput" rows="1" cols="40" placeholder="IP Log Snippet"></textarea>
                    </div>
                    <span class="error_container" id="err_iplog"></span>
                </div>

                <div class="block_section">
                    <label>Enter Punishment Reason</label>
                    <input id="punish_reason_box"  class="punish_reason_box" type="text" name="punish_reason" value="Compromised Account" placeholder="Punishment Reason">
                    <span class="error_container" id="err_iplog"></span>
                </div>


            </div>


            <div class="block_option" id="block_counter">
                <div class="title_block">
                    <h2>Occurence IP Log Counter</h2>
                </div>

                <div class="block_section">
                    <label>Enter IP Log Snippet</label>
                    <div class="textarea_container">
                        <textarea id="counter_ip_log" name="UserInput" rows="1" cols="40" placeholder="IP Log Snippet"></textarea>
                    </div>
                    <span class="error_container" id="err_iplog_occurence"></span>
                </div>

            </div>

            <div class="global_submit">

                <button id="submitter">Submit</button>
            </div>
        </div>
    </div>

    <div class="output_block output_invisible" id="output">
        <div class="output_container">
        <div id="output_closer">X</div>
            <div class="output_innercontent output_innercontent_hidden">
                <div class="output_innercontainer">

                    <div class="output_top">
                        <div id="copy_info">
                            <div class="copy_info_text">Now copied: </div>
                            <input id="copied_text" type="text" name="punish_reason" value="" placeholder="Nothing Copied" disabled>
                        </div>

                        <div class="sidebar_title_container">
                            <h2 id="sidebar_title">Output Spambots</h2>
                            <div class="number_generated_container">Generated <span id="num_generated">0</span></div>
                        </div>
                        <div id="generation_notes"></div>
                    </div>

                    <div id="output_container">
                        <ul>

                            <li class="output_item" data-punishment="/p Wanderer_ Compromised Account">
                                <span class="match_type match_type_spam">Spam</span>
                                <div class="plist_item">Wanderer_</div>
                                <div class="plist_item_buttons">

                                    <button class="plist_item_info">

                                        <div class="plist_item_explain">
                                            <div class="plist_item_explain_title">Matched Messages:</div>
                                            <div class="plist_item_explain_list">
                                            <ul>
                                                <li>lol what even is this looooool exks deswda</li>
                                                <li>lol what even is this looooool exks deswda</li>
                                            </ul>
                                            </div>
                                        </div>

                                        What?</button>
                                    <button class="copy_button">Copy</button>
                                </div>
                            </li>


                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="popup popup_hidden" style='display:none;'>
        Hello world
    </div>

    <script src="/assets/lib/generator.js"></script>
</body>
</html>