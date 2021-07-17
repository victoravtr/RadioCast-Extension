document.addEventListener("DOMContentLoaded", function () {
	const isChecked = localStorage.getItem('isChecked');
	switch (isChecked) {
		case null:
			localStorage.setItem('isChecked', 'false');
			break;
		case 'true':
			document.getElementById("switch-label").checked = true;
			break;
		case 'false':
			document.getElementById("switch-label").checked = false;
			break;
		default:
			break;
	}

	const isFirstTime = localStorage.getItem('isFirstTime');
	if (isFirstTime === null)  {
		localStorage.setItem('isFirstTime', 'false');
	} else {
		document.getElementById('warning').style.display = "none";
	}

	document.getElementById("switch-label").addEventListener("click", function () {
		switch (localStorage.getItem('isChecked')) {
			case 'false':
				localStorage.setItem('isChecked', 'true');
				chrome.tabs.executeScript({ code: "createLinkContainer()" });
				break;
			case 'true':
				localStorage.setItem('isChecked', 'false');
				chrome.tabs.executeScript({ code: "removeLinkContainer()" });
				chrome.tabs.executeScript({ code: "removeVideo()" });
			default:
				break;
		}
	});
});
