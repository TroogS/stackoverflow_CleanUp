// ==UserScript==
// @name         stackoverflow CleanUp
// @namespace    http://tampermonkey.net/
// @version      0.4
// @updateURL    https://github.com/TroogS/stackoverflow_CleanUp/raw/master/stackoverflow_CleanUp.user.js
// @downloadURL  https://github.com/TroogS/stackoverflow_CleanUp/raw/master/stackoverflow_CleanUp.user.js
// @description  Use stackoverflow full width, optional night mode
// @author       A. Beging
// @match        https://stackoverflow.com*
// @match        https://stackoverflow.com/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

function GM_addStyle (cssStr) {
    var newNode = document.createElement ('style');
    newNode.textContent = cssStr;
    document.head.append(newNode);
}

// Stackoverflow page manipulation
GM_addStyle ( `

body {
  padding-top: 0;
}

#left-sidebar,
#sidebar,
header,
footer,
#post-form,
.bottom-notice,
.post-taglist,
.mb0,
.js-favorite-btn,
.js-post-issue,
[id^='comments-link-']
{
  display: none;
}

.container {
  margin-left: 0 !important;
  margin-right: 0 !important;
  max-width: unset !important;
}

#content {
  margin-left: 0;
  margin-right: 0;
  max-width: unset;
  width: 100%;
  border: none;
}

#mainbar {
  width: 100%;
}
` );

GM_addStyle (`
.control-div {
  margin-left: 24px;
  margin-top: 10px;
}
`);

// Toggle Button
GM_addStyle (`
button.toggle {
  padding: 0;
  border: 1px solid transparent;
  visibility: hidden;
  padding-top: .8em;
  padding-bottom: .8em;
}

button.toggle::after {
  visibility: visible;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #FFF;
  background-color: #0095ff;
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4);
  padding: .8em;
  content: attr(data-text) " OFF";
}

button.toggle:hover:after {
  background-color: #0077cc;
  border-color: #0078D7;
}

button.toggle.active::after {
  content: attr(data-text) " ON";
}
`);

GM_addStyle (`
body.nightmode {
  background-color: #2e2e30;
  color: #F1F1F1;
}

body.nightmode #content {
  background-color: #2e2e30;
}

body.nightmode blockquote {
  background-color: #69696a;
  border-color: #d0d0d0;
}

body.nightmode #question-header .question-hyperlink {
  color: #F1F1F1 !important;
}

body.nightmode .post-layout .post-text pre {
  background-color: #1F1F1F;
}

body.nightmode code {
  color: #c7254e;
  padding: 2px 5px;
  background-color: #dcdcdc;
}

body.nightmode .post-layout .post-text pre code {
  background-color: transparent;
}

body.nightmode .post-layout .post-text code .kwd {
  color: #468fb7;
}

body.nightmode .post-layout .post-text code .typ {
  color: #4EC9B0;
}

body.nightmode .post-layout .post-text code .pln,
body.nightmode .post-layout .post-text code .pun {
  color: #dcdcdc;
}

body.nightmode .post-layout .post-text code .str {
  color: #d99c87;
}

body.nightmode .post-layout .post-text code .com {
  color: #3d8831;
}
`);

(function() {
  'use strict';
  CreateControlDiv();
  EnableToggleButtons();
  RestoreValues();
})();

function RestoreValues() {
    let elements = document.querySelectorAll('[data-storeid]');

    for(let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let storeId = element.getAttribute("data-storeid");
        let storeValue = GM_getValue(storeId, "");

        let classList = Object.values(storeValue);

        element.className = "";
        for(let c = 0; c < classList.length; c++) {
            if(!classList[c]) continue;
            element.classList.add(classList[c]);
        }

        SetMode(storeId, element.classList.contains('active'));
    }
}

function CreateControlDiv() {
    var nmButton = document.createElement("button");
    nmButton.classList.add("toggle");
    nmButton.setAttribute("data-text", "Nightmode");
    nmButton.setAttribute("data-storeid", "togglebtnnightmode");

    var controlDiv = document.createElement("div");
    controlDiv.classList.add("control-div")
    controlDiv.append(nmButton);

    var body = document.getElementsByTagName("body")[0];
    body.prepend(controlDiv);
}

function SetMode(functionCode, mode) {
    if(!functionCode) return;

    if(functionCode === "togglebtnnightmode") {
        if(mode === true) {
            document.body.classList.add("nightmode");
        } else {
            document.body.classList.remove("nightmode");
        }
    }
}

function EnableToggleButtons() {
    let buttons = document.querySelectorAll("button.toggle");
    for(let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        let storeId = button.getAttribute("data-storeid");
        button.addEventListener('click', function (e) {
            if(button.classList.contains('active')) {
                button.classList.remove("active");
                SetMode(e.srcElement.attributes["data-storeid"].value, false);
            } else {
                button.classList.add("active");
                SetMode(e.srcElement.attributes["data-storeid"].value, true);
            }
            GM_setValue(storeId, button.classList);
        });
    }
}