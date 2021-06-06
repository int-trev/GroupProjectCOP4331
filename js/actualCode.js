var urlBase = 'http://192.241.153.6/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var displayJsonObject = null;
var contactID = -1;

// Method to perform log in operation
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// JQuery code to allow for button click reads on update and delete buttons in table (funnnnnnnn)
$(document).ready(function()
{
	$('#emptyThis').on('click','.update', function(e)
	{
		var rowNum = parseInt(e.target.id.substring(6));
		contactID = displayJsonObject.results[rowNum].ID;
		var selectComp = document.getElementById("selectComponent" + rowNum);
		var replacementComp = document.getElementById("replacementValue" + rowNum);
		if(replacementComp.value != "")
		{
			doUpdate(contactID, selectComp.value, replacementComp.value);
		}
	});

	$('#emptyThis').on('click','.delete', function(e)
	{
		var rowNum = parseInt(e.target.id.substring(6));
		contactID = displayJsonObject.results[rowNum].ID;
		doDeletion(contactID);
		//doDisplayAll();
	});

});

// Method that performs the sign up operation
function doSignUp()
{
	
	var newFirstName = document.getElementById("signUpFirstName").value;
	var newLastName = document.getElementById("signUpLastName").value;
	var newUsername = document.getElementById("signUpUsername").value;
	var newPassword = document.getElementById("signUpPassword").value;
	  
	var jsonPayload = '{"FirstName" : "'+ newFirstName +'" , "LastName" : "'+ newLastName + '" , "login" : "' + newUsername + '" , "password" : "'+ newPassword +'"}';
	
	var url = urlBase + '/AddNewUser.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("loginResult").innerHTML = "User has been successfully added";

				saveCookie();


			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

// On load function that allows for the reading of the cookie and the displayAll function to initalize the table
function onStartUp()
{
	readCookie();
	doDisplayAll();
}


function createTable(notParsedJson)
{
	displayJsonObject = JSON.parse(notParsedJson);
	document.getElementById("emptyThis").innerHTML = " ";
	var empty= document.getElementById("emptyThis");
	if(displayJsonObject.results == null || displayJsonObject.results.length == 0)
	{
		var emptyString = document.createTextNode("No Contacts for User. You should make some.");
		empty.appendChild(emptyString);
	}
	else
	{
		var table = document.createElement("TABLE");

		// table creation
		document.createElement("TABLE");
		
		table.setAttribute("id", "myTable");
		document.body.appendChild(table);

		// creates the table headers
		var tableRow = document.createElement("TR");
		tableRow.setAttribute("id", "myTr");
		document.getElementById("myTable").appendChild(tableRow);

		var th = document.createElement("TH");
		var text = document.createTextNode("First Name");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Last Name");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Email");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Phone Number");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Select Box");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Updated Entry Text Box");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Update Button");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);

		th = document.createElement("TH");
		text = document.createTextNode("Delete Button");
		th.appendChild(text);
		document.getElementById("myTr").appendChild(th);


		for(var i = 0; i < displayJsonObject.results.length;i++)
		{
			var tableRow = document.createElement("TR");
			var setter = "myTr" + i;
			tableRow.setAttribute("id", setter);
			document.getElementById("myTable").appendChild(tableRow);

			var th = document.createElement("TD");
			var text = document.createTextNode(displayJsonObject.results[i].FName);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createTextNode(displayJsonObject.results[i].LName);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createTextNode(displayJsonObject.results[i].Email);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createTextNode(displayJsonObject.results[i].phoneNumber);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createElement("SELECT");
			var newOption1 = new Option(displayJsonObject.results[i].FName, "FName");
			var newOption2 = new Option(displayJsonObject.results[i].LName, "LName");
			var newOption4 = new Option(displayJsonObject.results[i].postalCode, "postalCode");
			var newOption5 = new Option(displayJsonObject.results[i].Email, "Email");
			var newOption6 = new Option(displayJsonObject.results[i].phoneNumber, "phoneNumber");
			var newOption7 = new Option(displayJsonObject.results[i].country, "country");
			text.appendChild(newOption1);
			text.appendChild(newOption2);
			text.appendChild(newOption4);
			text.appendChild(newOption5);
			text.appendChild(newOption6);
			text.appendChild(newOption7);
			var selectID = "selectComponent" + i;
			text.setAttribute("id",selectID);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createElement("INPUT");
			text.setAttribute("type","text");
			text.setAttribute("placeholder", "Enter Replacement Value");
			text.setAttribute("id","replacementValue" + i);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createElement("INPUT");
			text.setAttribute("type","button");
			text.innerHTML = "UPDATE";
			text.setAttribute("class","update");
			text.setAttribute("id", "update" + i);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);

			th = document.createElement("TD");
			text = document.createElement("BUTTON");
			text.innerHTML = "DELETE";
			text.setAttribute("class","delete");
			text.setAttribute("id", "delete" + i);
			th.appendChild(text);
			document.getElementById(setter).appendChild(th);
		}

		empty.appendChild(table);
	}
}


function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
		//console.log("We good bruh");
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	readCookie();
	var newFirstName = document.getElementById("firstNameText").value;
	var newLastName = document.getElementById("lastNameText").value;
	var newEmail = document.getElementById("emailText").value;
	var newPhoneNumber = document.getElementById("phoneNumberText").value;
	var newPostalCode = document.getElementById("postalCodeText").value;
	var country = document.getElementById("countryText").value;

	//var jsonPayload = '{"Fname" : "' + newFirstName + '", "Lname" : ' + newLastName + ', "Email" : ' + newEmail + ' , "phoneNumber" : ' + newPhoneNumber +' , "country" : '+ country +', "postalCode" : '+ newPostalCode +', "userId" : '+ userId +'}';
	  
	var jsonPayload = '{"Fname" : "'+ newFirstName +'" , "Lname" : "'+ newLastName + '" , "country" : "' + country + '" , "postalCode" : "'+ newPostalCode +'" , "phoneNumber" : "' + newPhoneNumber +'" , "Email" : "' + newEmail + '" , "userId" : '+userId+'   }';

	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	setTimeout(function(){doDisplayAll()}, 500);
}


function doSearch()
{
	var srch = document.getElementById("firstNameSearchText").value;
	var srch1 = document.getElementById("lastNameSearchText").value;
    // Prepares a payload for the client that will be sent over using a HTTP Request.
    var jsonPayload = '{"FName" : "' + srch + '","LName" : "' + srch1 + '","userId" : ' + userId + '}';
    // Using variables established globally to create a var that holds the URL being accessed.
    var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Content headers
    try // Block of code that tries to establish a connection to the back-end.
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				text = JSON.parse(xhr.responseText);
				if(text.error == "")
				{
					createTable(xhr.responseText);
				}	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) // If the attempt for a connection results in a failure, display error to client.
	{
		//document.getElementById("deleteResult").innerHTML = err.message;
	}
}

// Runs when client makes a request to modify a specific contact's fields.
function doUpdate(contact, colName, replace)
{
    // Initializes required variables, and grabs the data found on the page (user's input).
    var columnName = colName; // document.getElementById("");
    var newString = replace;  // document.getElementById("");
    var contactId = contact;  // document.getElementById("");

    // Prepares a payload for the client that will be sent over using a HTTP Request.
    var jsonPayload = '{"columnName" : "' + columnName + '", "newString" : "' + 
                            newString + '", "contactId" : ' + contactId + '}';
    // Using variables established globally to create a var that holds the URL being accessed.
    var url = urlBase + '/UpdateContact.' + extension;

    // Creating a HTTP Request that will deliver the JSON payload to the back-end.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Content headers

    
    try // Block of code that tries to establish a connection to the back-end.
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                // Do we need to verify and/or parse the json object that is sent back?
                //document.getElementById("deleteResult").innerHTML = "Change applied to contact."; // Can include contact's name possibly?

				//doDisplayAll();
            }

        };
        xhr.send(jsonPayload);
    }
    catch(err) // If the attempt for a connection results in a failure, display error to client.
    {
        //document.getElementById("updateResult").innerHTML = err.message;
    }

	setTimeout(function(){doDisplayAll()}, 500);
}


function doDeletion(contactId)
{
    // Initializes a required variable, and grabs the data found on the page (user's input).
      // document.getElementById("");

    // Prepares a payload for the client that will be sent over using a HTTP Request.
    var jsonPayload = '{"id" : ' + contactId + '}';
    // Using variables established globally to create a var that holds the URL being accessed.
    var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Content headers


    try // Block of code that tries to establish a connection to the back-end.
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				/*var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
                // Statement that is satisfied when ID retrieved is not changed. Means that contact ID was invalid.
				if (userId < 1)
				{		
					//document.getElementById("deleteResult").innerHTML = "Contact could not be deleted.";
					return;
				}	*/	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) // If the attempt for a connection results in a failure, display error to client.
	{
		//document.getElementById("deleteResult").innerHTML = err.message;
	}

	setTimeout(function(){doDisplayAll()}, 500);

}

function doDisplayAll()
{
    // Prepares a payload for the client that will be sent over using a HTTP Request.
    var jsonPayload = '{"userId" : '+userId+'}';
    // Using variables established globally to create a var that holds the URL being accessed.
    var url = urlBase + '/displayAll.' + extension;

	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Content headers
    try // Block of code that tries to establish a connection to the back-end.
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				createTable(xhr.responseText);	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) // If the attempt for a connection results in a failure, display error to client.
	{
		//document.getElementById("deleteResult").innerHTML = err.message;
	}
}



