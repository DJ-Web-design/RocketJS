function formatoFuente(sCmd, sValue) {
	document.execCommand(sCmd, false, sValue);
}

function processFiles(files) {
	var file = files[0];
	var reader = new FileReader();
	reader.onload = function (e) {
		// Cuando se dispara este evento, los datos están disponibles.
		// Los copiamos al <div> textBox de la página.
		var output = document.getElementById("textBox");
		output.innerHTML = e.target.result;
	};
	reader.readAsText(file);
}



// ---------------------------------------



var dropBox;
window.onload = function() {
	dropBox = document.getElementById("textBox");
	dropBox.ondragenter = ignoreDrag;
	dropBox.ondragover = ignoreDrag;
	dropBox.ondrop = drop;
}

function ignoreDrag(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
	var data = e.dataTransfer;
	var files = data.files;
	processFiles(files);
}



// ----------------------------------------



function saveData() {
	var localData = document.getElementById("textBox").innerHTML;
	localStorage["lData"] = localData;
	alert(localData);
}
function loadData() {
	var localData = localStorage["lData"]; 
	if (localData != null) {
	document.getElementById("textBox").innerHTML = localData;
	}
}


function enviar(){
	let dataToSend = document.getElementById("textBox").innerHTML;
	document.getElementById("dataToSend").value = dataToSend;
}