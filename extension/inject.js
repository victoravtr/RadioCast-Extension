console.log("inject.s Loaded");

loadYoutubeIframe();
addFontAwesomeCDN();
checkLocalStorage();

function loadYoutubeIframe() {
    let iframeDivContainer = document.querySelectorAll('[data-target="persistent-player-content"]')[0];
    let iframeDiv = document.createElement('div');
    iframeDiv.id = "iframeDiv";
    iframeDiv.style.height = "100%";
    let youtubeIframe = document.createElement('iframe');
    youtubeIframe.id = "player";
    youtubeIframe.style.display = "none";
    iframeDiv.appendChild(youtubeIframe);
    iframeDivContainer.appendChild(iframeDiv);
}

function addFontAwesomeCDN() {
    let cssNode = document.createElement("link");
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.setAttribute("type", "text/css");
    cssNode.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
    document.getElementsByTagName("head")[0].appendChild(cssNode);
}

function createLinkContainer() {
    localStorage.setItem('isChecked', 'true');
    if (!document.getElementById("div-container")) {
        let divContainer = document.createElement('div');
        divContainer.id = "div-container";
        divContainer.className = "llTyOO";
        document.getElementsByClassName("hwDLDQ")[0].appendChild(divContainer).before(document.getElementsByClassName("top-nav__search-container")[0]);
        let inputLink = document.createElement('input');
        inputLink.id = "inputLink";
        inputLink.className = "giJyex oEfZI";
        inputLink.placeholder = "Link de Youtube";
        inputLink.style.borderTopLeftRadius = "0.8rem";
        inputLink.style.borderBottomLeftRadius = "0.8rem";
        document.getElementById("div-container").appendChild(inputLink);
        document.getElementById("div-container").addEventListener("keyup", inputLinkCheck);
        let buttonLink = document.createElement("button");
        buttonLink.id = "buttonLink";
        buttonLink.className = "fMfcuC fhlhUI";
        buttonLink.innerHTML = "<i class='fas fa-play'></i>";
        buttonLink.addEventListener("click", buttonLinkClick);
        document.getElementById("div-container").appendChild(buttonLink).before(document.getElementById("inputLink"));
    }

}

function removeLinkContainer() {
    localStorage.setItem('isChecked', 'false');
    let linkContainer = document.getElementById("div-container");
    if (linkContainer !== null) {
        linkContainer.remove();
    }
}

function checkLocalStorage() {
    const isChecked = localStorage.getItem('isChecked');
    switch (isChecked) {
        case null:
            localStorage.setItem('isChecked', 'false');
            break;
        case 'true':
            loadYoutubeIframe();
            addFontAwesomeCDN();
            createLinkContainer();
            localStorage.setItem('isChecked', 'true');
            break;
        case 'false':
            removeLinkContainer();
            localStorage.setItem('isChecked', 'false');
            break;
        default:
            break;
    }
}

function buttonLinkClick() {
    if (document.getElementsByClassName("fas fa-play")[0] === undefined) {
        document.getElementsByClassName("fas fa-stop")[0].className = "fas fa-play";
        removeVideo();
    } else {
        document.getElementsByClassName("fas fa-play")[0].className = "fas fa-stop";
        loadVideo();
    }
}

function inputLinkCheck(e) {
    let keyCode = e.code || e.key;
    if (keyCode == 'Enter') {
        loadVideo();
    }
}

function removeVideo() {
    document.querySelectorAll('[data-a-target="player-theatre-mode-button"]')[0].disabled = false;
    if (document.getElementById("player") != null) {
        document.getElementById("player").style.display = "none";
        document.getElementById("player").src = "";
        document.getElementsByClassName("persistent-player")[0].style.top = "0px";
        document.getElementsByClassName("persistent-player")[0].style.position = "absolute";
        document.getElementsByClassName("persistent-player")[0].style.left = "0px";
        document.getElementsByClassName("persistent-player")[0].style.width = "";
        document.getElementsByClassName("persistent-player")[0].style.right = "";
        document.getElementsByClassName("right-column")[0].parentElement.style.position = "";
        document.getElementsByClassName("right-column")[0].parentElement.style.right = "";
        document.getElementsByClassName("right-column")[0].parentElement.style.top = "";
        document.getElementsByClassName("right-column")[0].parentElement.style.height = "";
    }
}

function loadVideo() {
    let regexResult = validateLink();
    if (!validateLink()) {
        alert("El link que has introducido no es válido");
    } else {
        if (document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].classList.contains("cdLbRd")) {
            document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].click();
        }
        document.querySelectorAll('[data-a-target="player-theatre-mode-button"]')[0].disabled = true;
        let youtubeIframe = document.getElementById("player");
        youtubeIframe.src = "https://www.youtube.com/embed/" + regexResult[1] + "?showinfo=0&enablejsapi=1&origin=https://www.twitch.tv&autoplay=1";
        youtubeIframe.style.width = "100%";
        youtubeIframe.style.maxHeight = "calc(100vh - 16rem)";
        youtubeIframe.style.height = "100%";
        youtubeIframe.style.display = "block";
        createControlsDiv();
        moveChatAndTwitchStream();
        document.getElementById("inputLink").value = "";
    }
}

function validateLink() {
    const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gm
    let link = document.getElementById("inputLink").value.replaceAll(" ", "");
    return pattern.exec(link);
}

function moveChatAndTwitchStream() {
    let chat = document.getElementsByClassName("right-column")[0].parentElement;
    let chat_width = window.getComputedStyle(document.getElementsByClassName("stream-chat")[0]).width;

    document.getElementsByClassName("persistent-player")[0].style.position = "fixed";
    document.getElementsByClassName("persistent-player")[0].style.width = chat_width;
    document.getElementsByClassName("persistent-player")[0].style.top = "5rem";
    document.getElementsByClassName("persistent-player")[0].style.left = "";
    document.getElementsByClassName("persistent-player")[0].style.right = "0%";

    let player_height = window.getComputedStyle(document.getElementsByClassName("persistent-player")[0]).height;

    chat.style.position = "absolute";
    chat.style.right = "0%";
    chat.style.top = player_height;
    chat.style.height = 'calc(100% - ' + player_height + ')';
}

function createControlsDiv() {
    let controlsDiv = document.createElement('div');
    controlsDiv.id = "controlsDiv";
    controlsDiv.style.width = "5rem";
    controlsDiv.style.height = "75%";
    controlsDiv.style.position = "absolute";
    controlsDiv.style.top = "0px";
    controlsDiv.style.left = "0px";
    controlsDiv.style.zIndex = "3000";
    controlsDiv.style.display = "none";
    controlsDiv.style.alignItems = "center";


    let theaterModeSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    theaterModeSVG.id = "theaterModeSVG";
    theaterModeSVG.setAttribute('width', '100%');
    theaterModeSVG.setAttribute('height', '100%');
    theaterModeSVG.setAttribute('title', 'Modo teatro');
    theaterModeSVG.setAttribute('version', '1.1');
    theaterModeSVG.setAttribute('viewBox', '0 0 20 20');
    theaterModeSVG.setAttribute('x', '0px');
    theaterModeSVG.setAttribute('y', '0px');
    theaterModeSVG.setAttribute('class', 'ScIconSVG-sc-1bgeryd-1 cMQeyU');

    let theaterModeTitle = document.createElementNS("http://www.w3.org/2000/svg", 'title');
    theaterModeTitle.innerHTML = "Modo Teatro";

    let theaterModePATH = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    theaterModePATH.setAttribute('fill-rule', 'evenodd');
    theaterModePATH.setAttribute('d', "M2 15V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2zm2 0V5h7v10H4zm9 0h3V5h-3v10z");
    theaterModePATH.setAttribute('clip-rule', 'evenodd');

    document.getElementById("player").parentNode.appendChild(controlsDiv);
    controlsDiv.appendChild(theaterModeSVG);
    theaterModeSVG.appendChild(theaterModePATH);
    theaterModePATH.appendChild(theaterModeTitle);

    document.getElementById("player").addEventListener("mouseover", showControls);
    document.getElementById("player").addEventListener("mouseout", hideControls);
    controlsDiv.addEventListener("mouseover", showControls);
    controlsDiv.addEventListener("mouseout", hideControls);

    theaterModeSVG.addEventListener("click", theaterMode);
    theaterModeSVG.addEventListener("mouseover", theaterHoverIn);
    theaterModeSVG.addEventListener("mouseout", theaterHoverOut);
}

function showControls() {
    document.getElementById("controlsDiv").style.display = "flex";
}

function hideControls() {
    document.getElementById("controlsDiv").style.display = "none";
}

function theaterHoverIn() {
    document.getElementById("theaterModeSVG").setAttribute('style', 'filter: drop-shadow(2px 4px 6px white)');
}

function theaterHoverOut() {
    document.getElementById("theaterModeSVG").setAttribute('style', 'filter: drop-shadow(0px 0px 0px white)');
}

let theaterModeVar = false;
function theaterMode() {
    const iframeDiv = document.getElementById("iframeDiv");
    const channelInfoPanel = document.getElementsByClassName("channel-root__info channel-root__info--with-chat")[0];
    if (!theaterModeVar) {
        theaterModeVar = true;
        if (document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].classList.contains("cdLbRd")) {
            document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].click();
            rightClick = false;
        }
        document.getElementsByClassName("sc-AxjAm hrmWYa")[0].firstElementChild.style.transform = "";
        document.getElementsByClassName("sc-AxjAm hrmWYa")[0].firstElementChild.firstElementChild.style.transform = "";
        document.getElementsByClassName("top-nav")[0].style.display = "none";
        document.getElementsByClassName("persistent-player")[0].style.top = 0;
        document.getElementById("player").style.maxHeight = "";
        iframeDiv.style.position = "fixed";
        iframeDiv.style.top = 0;
        iframeDiv.style.left = 0;
        iframeDiv.style.width = 'calc(100% - ' + window.getComputedStyle(document.getElementsByClassName("stream-chat")[0]).width + ')';
        document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].setAttribute('style', 'display: none !important');
        channelInfoPanel.style.display = "none";
        channelInfoPanel.style.marginTop = "100%";
    } else {
        theaterModeVar = false;
        channelInfoPanel.style.marginTop = window.getComputedStyle(document.querySelectorAll('[data-target="persistent-player-content"]')[0]).height;
        channelInfoPanel.style.display = "block";
        document.getElementsByClassName("sc-AxjAm hrmWYa")[0].firstElementChild.style.transform = "scale(4)";
        document.getElementsByClassName("sc-AxjAm hrmWYa")[0].firstElementChild.firstElementChild.style.transform = "scale(0.25)";
        document.getElementsByClassName("top-nav")[0].style.display = "block";
        document.getElementsByClassName("persistent-player")[0].style.top = "5rem";
        document.getElementById("player").style.maxHeight = "calc(100vh - 16rem)";
        document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].setAttribute('style', 'display: block');
        document.getElementsByClassName("channel-root__info")[0].style.display = "block";
        iframeDiv.style.width = "100%";
        iframeDiv.style.top = "";
        iframeDiv.style.left = "";
        iframeDiv.style.position = "relative";
    }
}