$(document).ready(function() {
	//restoreTabs();

	updatePanel();

	//<input type="radio" name="" value=""><br>

	//saveTabs();
});

function deleteRecord(){

	//var toDelete = 'Description';

	var myRadio = $('input[name=stored]');

	var toDelete = myRadio.filter(':checked').val();

	// These are async functions - so be careful
	chrome.storage.local.get("saveMyTabs", function(rows){
		console.log(rows);

		var newData = {}
				
		$.each(JSON.parse(rows['saveMyTabs']), function(key, val){
			console.log(key);
	
		if(key != toDelete)
		{
			newData[key] = val;
		}

		});

		var obj = {};

		obj['saveMyTabs'] = JSON.stringify(newData);

		//myRadio.filter(':checked').remove();

		chrome.storage.local.set(obj, function(){console.log('saved data');});


		console.log(JSON.parse(obj['saveMyTabs']));

		updatePanel();

		//chrome.storage.local.set(obj, function(){console.log('saved data');});

	});
}

function updatePanel()
{
	chrome.storage.local.get("saveMyTabs", function(rows){
		console.log(rows);
				
		$('#panel ul').empty();

		$.each(JSON.parse(rows['saveMyTabs']), function(key, val){
			console.log(key);
	
		$('#panel ul').append('<li><input type="radio" name="stored" value="' + key + '">' + key + '</input></li>');
  
		});

		console.log(JSON.parse(rows['saveMyTabs']));
	});
}


function addToPanel(savedName)
{	
		$('#panel ul').append('<li><input type="radio" name="stored" value="' + savedName + '">' + savedName + '</input></li>'); 
}

/*
{
	"name1" : [
		{
			"0" : "url"		
		}	
	]

	"name2" : [
		{
			"0" : "url"		
		}	
	]

}
*/
function saveTabs()
{
	var i = 0;
	var tabList = {};
	
	chrome.tabs.getAllInWindow(null, function(tabs)
		 {
		tabs.forEach(function(tab)
			{
				//myFunction(tab.url);

				tabList[i]= tab.url;
	
				i = i + 1; 

			});
	
		var saveName = $('#saveName').val();

		var higherLevelJSON = {};
		
		chrome.storage.local.get("saveMyTabs", function(value){
	
		if(typeof value['saveMyTabs'] === 'undefined')
		{
			higherLevelJSON = {};
		}
		else
		{		
			higherLevelJSON = JSON.parse(value['saveMyTabs']);
			//higherLevelJSON = value['saveMyTabs'];
		}

		//higherLevelJSON[saveName] = tabList;


		higherLevelJSON[saveName] = tabList;

		var obj = {};

		obj['saveMyTabs'] = JSON.stringify(higherLevelJSON);
		//obj['saveMyTabs'] = higherLevelJSON;
	
		//alert('JSON to be stored' + JSON.stringify(higherLevelJSON));
		//alert('JSON to be stored' + higherLevelJSON);

		chrome.storage.local.set(obj, function(){console.log('saved data');});	

		addToPanel(saveName);

		
		});
		


		});

		


}


function restoreTabs()
{
	var myRadio = $('input[name=stored]');

	var checkedValue = myRadio.filter(':checked').val();

	debugger;

//	alert('Checked value' + checkedValue);
	
	// Now get the tabs for this and open them

	chrome.storage.local.get("saveMyTabs", function(rows){
		console.log(rows);
				
		$.each(JSON.parse(rows['saveMyTabs']), function(key, val){
			console.log(key);
//			alert(key);
		if(key == checkedValue)
		{
			var tabs = {};
			tabs = val;
//alert(tabs);
			$.each(tabs, function(index, url){
				//alert(url);
				chrome.tabs.create({url:url});
			});
		}
		});

	});


	chrome.storage.local.get("saveMyTabs", function(rows){
		console.log(JSON.parse(rows['saveMyTabs']));
	});

}


document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#saveButton').addEventListener('click', saveTabs);
	document.querySelector('#restoreButton').addEventListener('click', restoreTabs);
	document.querySelector('#deleteButton').addEventListener('click', deleteRecord);
});
