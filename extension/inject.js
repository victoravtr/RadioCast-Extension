console.log("RadioCast: inject.js Loaded");

const streams = {
    'Retransmisiones': '',
    'LPL': 'https://www.youtube.com/channel/UCaFMdq6QrAAEx5k2cLlZNPA',
    'LCS': 'https://www.youtube.com/channel/UCSF_aFGIIIoWY30GVV19TKA',
    'LEC': 'https://www.youtube.com/channel/UCWWZjhmokTbezUQr1kbbEYQ',
    'LCK': 'https://www.youtube.com/channel/UCKVlixycWmapnGQ_wht4cHQ'
}
let url = window.location.href;
let isPlaying = false;
let theaterModeVar = false;

addFontAwesomeCDN();
checkLocalStorage();

if (document.querySelectorAll('[data-target="persistent-player-content"]')[0]) {
    loadYoutubeIframe();
}

// Cada segundo se comprueba si la url ha cambiado ya que el script solo se
// esta ejecutando la primera vez que se accede a twitch y algunos elementos no se cargan de primeras
let intervalChecker = setInterval( function() {
    if (url !== window.location.href) {
        url = window.location.href;
        if (document.querySelectorAll('[data-target="persistent-player-content"]')[0]) {
            loadYoutubeIframe();
        } else {
            disabledStateHandler();
            if ( document.getElementsByClassName("fas fa-stop")[0]) {
                document.getElementsByClassName("fas fa-stop")[0].className = "fas fa-play";
                isPlaying = false;
            }
        }
    }
}, 1000);

// Me guardo esto just in case
// Si no esta en https://www.twitch.tv/ o https://www.twitch.tv/loquesea/loquesea la funcion para insertar el iframe se ejecuta
// Si estuviese no se deberia de ejecutar ya que el elemento "persistent-player-content" no existe 
// const twitch_pattern = /.*twitch\.tv\/.\w*(?<!\/)$/mg;
// if (twitch_pattern.test(window.location.href)) {
//     loadYoutubeIframe();
// }

function disabledStateHandler() {
    if (document.querySelectorAll('[data-target="persistent-player-content"]')[0]) {
        document.getElementById("selectContainer").disabled = false;
        document.getElementById("inputLink").disabled = false;
        document.getElementById("buttonLink").disabled = false;
        document.getElementById("selectContainer").style.cursor = "pointer";
        document.getElementById("inputLink").style.cursor = "pointer";
        document.getElementById("buttonLink").style.cursor = "pointer";
    } else {
        document.getElementById("selectContainer").disabled = true;
        document.getElementById("inputLink").disabled = true;
        document.getElementById("buttonLink").disabled = true;
        document.getElementById("selectContainer").style.cursor = "not-allowed";
        document.getElementById("inputLink").style.cursor = "not-allowed";
        document.getElementById("buttonLink").style.cursor = "not-allowed";
    }
}

// Inserta un div y un iframe donde estara el video de youtube
function loadYoutubeIframe() {
    if (document.getElementById('iframeDiv') == null) {
        let iframeDivContainer = document.querySelectorAll('[data-target="persistent-player-content"]')[0];
        let iframeDiv = document.createElement('div');
        iframeDiv.id = "iframeDiv";
        iframeDiv.style.height = "100%";
        let youtubeIframe = document.createElement('iframe');
        youtubeIframe.id = "player";
        youtubeIframe.style.display = "none";
        iframeDiv.appendChild(youtubeIframe);
        iframeDivContainer.appendChild(iframeDiv);
        disabledStateHandler();
    }
}

// Añade fontawesome para los iconos
function addFontAwesomeCDN() {
    let cssNode = document.createElement("link");
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.setAttribute("type", "text/css");
    cssNode.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
    document.getElementsByTagName("head")[0].appendChild(cssNode);
}

// Inserta el menu para seleccionar el stream y el input para el link
function createLinkContainer() {
    localStorage.setItem('isChecked', 'true');
    if (!document.getElementById("div-container")) {
        let divContainer = document.createElement('div');
        divContainer.id = "div-container";
        divContainer.className = document.querySelectorAll('[data-a-target="tray-search-input"]')[0].classList[1];
        // setear el width con un !important hace que falle por algun mecanismo arcano que no recuerdo, seteando el min
        //  y el max se puede conseguir lo mismo
        divContainer.style.maxWidth = "40rem";
        divContainer.style.minWidth = "40rem";
        document.getElementsByClassName("top-nav__search-container")[0].parentElement.appendChild(divContainer).before(document.getElementsByClassName("top-nav__search-container")[0]);
        let selectContainer = document.createElement('select');
        selectContainer.id = "selectContainer";
        for (let key in streams) {
            let option = document.createElement('option');
            option.text = key;
            option.value = streams[key];
            selectContainer.appendChild(option);
        }
        selectContainer.style.backgroundColor = "#464649";
        selectContainer.style.border = "none";
        selectContainer.style.color = "white";
        selectContainer.style.borderRightColor = "#29292c";
        selectContainer.style.borderRightStyle = "solid";
        selectContainer.style.borderTopLeftRadius = "0.6rem";
        selectContainer.style.borderBottomLeftRadius = "0.6rem";
        selectContainer.style.paddingTop = "0.5rem";
        selectContainer.style.paddingBottom = "0.5rem";
        selectContainer.style.paddingLeft = "1rem";
        selectContainer.style.paddingRight = "1rem";
        selectContainer.style.fontSize = "14px";
        selectContainer.addEventListener("change", handleSelect);
        document.getElementById("div-container").appendChild(selectContainer);

        let inputLink = document.createElement('input');
        inputLink.id = "inputLink";
        inputLink.className = document.querySelectorAll('[data-a-target="tw-input"]')[0].classList[2];
        inputLink.placeholder = "Link de Youtube";
        inputLink.style.borderRadius = "0px";
        inputLink.style.padding = "0.5rem 1rem";
        inputLink.style.fontSize = "14px";
        inputLink.style.pointerEvents = "auto";
        document.getElementById("div-container").appendChild(inputLink).before(document.getElementById('selectContainer'));
        document.getElementById("div-container").addEventListener("keyup", inputLinkCheck);
        let buttonLink = document.createElement("button");
        buttonLink.id = "buttonLink";
        buttonLink.style.padding = "0 5px";
        buttonLink.className = document.querySelectorAll('[icon="NavSearch"]')[0].classList[2];
        buttonLink.innerHTML = "<i class='fas fa-play'></i>";
        buttonLink.addEventListener("click", buttonLinkClick);
        document.getElementById("div-container").appendChild(buttonLink).before(document.getElementById("inputLink"));
        disabledStateHandler();
    }

}

// Borra el menu para seleccionar el stream y el input para el link
function removeLinkContainer() {
    localStorage.setItem('isChecked', 'false');
    let linkContainer = document.getElementById("div-container");
    if (linkContainer !== null) {
        linkContainer.remove();
    }
}

// Comprueba el valor de la variable 'isChecked' y dependiendo del valor inizializa los elementos
function checkLocalStorage() {
    const isChecked = localStorage.getItem('isChecked');
    switch (isChecked) {
        case null:
            localStorage.setItem('isChecked', 'false');
            break;
        case 'true':
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

// Maneja el boton, inserta o quita el video
function buttonLinkClick() {
    if (document.getElementById("player")) {
        if (isPlaying) {
            removeVideo();
            isPlaying = false;
        } else {
            loadVideo();
            isPlaying = true;
        }
    }
}

// Simula el click del boton si se pulsa la tecla 'Enter' dentro del input
function inputLinkCheck(e) {
    let keyCode = e.code || e.key;
    if (keyCode == 'Enter') {
        // document.getElementsByClassName("fas fa-play")[0].className = "fas fa-stop";
        // loadVideo();
        buttonLinkClick();
    }
}

// Añade la url del stream seleccionado al input
function handleSelect(event) {
    document.getElementById("inputLink").value = event.target.value;
}

// Quita el video
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
        document.getElementsByClassName("fas fa-stop")[0].className = "fas fa-play";
    }
}

// Añade el video
function loadVideo() {
    let regexResult = validateLink();
    if (!validateLink()) {
        document.getElementById("inputLink").value = "";
        alert("El link que has introducido no es válido");
    } else {
        if (document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].classList.contains("cdLbRd")) {
            document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].click();
        }
        document.querySelectorAll('[data-a-target="player-theatre-mode-button"]')[0].disabled = true;
        let youtubeIframe = document.getElementById("player");
        youtubeIframe.src = "https://www.youtube.com/embed/" + regexResult;
        youtubeIframe.style.width = "100%";
        youtubeIframe.style.maxHeight = "calc(100vh - 16rem)";
        youtubeIframe.style.height = "100%";
        youtubeIframe.style.display = "block";
        createControlsDiv();
        moveChatAndTwitchStream();
        document.getElementById("inputLink").value = "";
        document.getElementById("selectContainer").selectedIndex = 0;
        document.getElementsByClassName("fas fa-play")[0].className = "fas fa-stop";
    }
}

// Valida el link:
//  Primero comprueba si es un video valido de youtube y devuelve el id + "?autoplay=1".
//  Si no lo es, comprueba si es el link de un canal de youtube y devuelve el id + "&autoplay=1".
//  Si no lo es, devuelve false.
function validateLink() {
    // FIXME: esto es un poco chapuza, tengo que buscar una forma de meterlo todo en la misma pattern
    const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gm
    const channelPattern = /^(?:http|https):\/\/[a-zA-Z-]*\.{0,1}[a-zA-Z-]{3,}\.[a-z]{2,}\/channel\/([a-zA-Z0-9_\-]{3,24})/gm
    let link = document.getElementById("inputLink").value.replaceAll(" ", "");
    let result = pattern.exec(link);
    if (!result) {
        result = channelPattern.exec(link);
        if (!result) {
            return false;
        } else {
            return "live_stream?channel=" + result[1] + "&autoplay=1"
        }
    } else {
        return result[1] + "?autoplay=1";
    }
}

// Mueve el stream de twitch y el chat para hacerle sitio al video de Youtube
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

// Añade el boton para habilitar o deshabilitar el modo teatro
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
    theaterModeSVG.style.fill = "white";
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

// Muestran o esconden el boton de modo teatro
function showControls() {
    document.getElementById("controlsDiv").style.display = "flex";
}
function hideControls() {
    document.getElementById("controlsDiv").style.display = "none";
}

// Añade un efecto al hacer hover sobre el boton de modo teatro
function theaterHoverIn() {
    document.getElementById("theaterModeSVG").style.filter = "drop-shadow(2px 4px 6px white";
}

// Quita el efecto al dejar de hacer hover sobre el boton de modo teatro
function theaterHoverOut() {
    document.getElementById("theaterModeSVG").style.filter = "drop-shadow(0px 0px 0px white)";
}

// Habilita o deshabilita el modo teatro
function theaterMode() {
    const iframeDiv = document.getElementById("iframeDiv");
    const channelRootPlayer = document.getElementsByClassName("channel-root__player ")[0].children[1]
    const channelInfoPanel = document.getElementsByClassName("channel-root__info channel-root__info--with-chat")[0];
    if (!theaterModeVar) {
        theaterModeVar = true;
        if (document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].classList.contains("cdLbRd")) {
            document.querySelectorAll('[data-a-target="right-column__toggle-collapse-btn"]')[0].click();
            rightClick = false;
        }
        channelRootPlayer.firstElementChild.style.transform = "";
        channelRootPlayer.firstElementChild.firstElementChild.style.transform = "";
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
        channelRootPlayer.firstElementChild.style.transform = "scale(4)";
        channelRootPlayer.firstElementChild.firstElementChild.style.transform = "scale(0.25)";
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