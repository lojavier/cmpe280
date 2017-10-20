document.addEventListener("DOMContentLoaded", function() {

	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	
	if (!window.indexedDB) {
		window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}
	var db;
	var request = window.indexedDB.open("newDatabase", 1);

	request.onerror = function(event) {
		console.log("error: ");
	};

	request.onsuccess = function(event) {
		db = request.result;
		console.log("success: "+ db);
	};

	request.onupgradeneeded = function(event) {
		var db = event.target.result;
		var objectStore = db.createObjectStore("users", {keyPath: "userid"});
		const defaultData = {
			userid: "admin",
			password: "password",
			email: "admin@localhost.com",
			sq1: "Sum of 1 + 1",
			sa1: "2",
			sq2: "Product of 2 x 2",
			sa2: "4",
			mobile: "8001234567",
			address: "123 Main St, Madeup, CA 98765"
		}
		objectStore.add(defaultData);
	};

	var userid = document.getElementById("userid");
	var pwd1 = document.getElementById("pwd1");
	var pwd2 = document.getElementById("pwd2");
	var email1 = document.getElementById("email1");
	var email2 = document.getElementById("email2");
	var sq1 = document.getElementById("sq1");
	var sa1 = document.getElementById("sa1");
	var sq2 = document.getElementById("sq2");
	var sa2 = document.getElementById("sa2");
	var mobile = document.getElementById("mobile");
	var address = document.getElementById("address");
	var register = document.getElementById("register");

	var checkID = function(id) {
		var count = 0;
		// Check if user id matches password
		if(id.value != pwd1.value) {
			$('#matchpwd').attr('class', 'valid');
		} else {
			$('#matchpwd').attr('class', 'invalid');
			count++;
		}

		// Check for spaces
		var spaces = /\s/g;
		if(id.value.match(spaces)) {
			id.value = id.value.substring(0, id.value.length - 1);
		}
		
		return count == 0 ? true : false;
	};

	userid.onclick = function() {
		checkID(this);
	};

	userid.onkeyup = function() {
		checkID(this);
	};

	userid.onfocus = function() {
		checkID(this);
	    $(this).popover('show');
	};

	userid.onblur = function() {
	    $(this).popover('hide');
	};

	var checkPassword = function(pwd) {
		var count = 0;

		// Check if password matches user id
		if(pwd.value != userid.value) {
			$('#matchid').attr('class', 'valid');
		} else {
			$('#matchid').attr('class', 'invalid');
			count++;
		}

		// Check for spaces
		var spaces = /\s/g;
		if(pwd.value.match(spaces)) {
			pwd.value = pwd.value.substring(0, pwd.value.length - 1);
		}

		// Validate lowercase letters
		var lowerCaseLetters = /[a-z]/g;
		if(pwd.value.match(lowerCaseLetters)) {
			$('#letter').attr('class', 'valid');
		} else {
			$('#letter').attr('class', 'invalid');
			count++;
		}

		// Validate capital letters
		var upperCaseLetters = /[A-Z]/g;
		if(pwd.value.match(upperCaseLetters)) {
			$('#capital').attr('class', 'valid');
		} else {
			$('#capital').attr('class', 'invalid');
			count++;
		}

		// Validate numbers
		var numbers = /[0-9]/g;
		if(pwd.value.match(numbers)) {
			$('#number').attr('class', 'valid');
		} else {
			$('#number').attr('class', 'invalid');
			count++;
		}

		// Validate special characters
		var characters = /[!#$%]/g;
		if(pwd.value.match(characters)) {
			$('#special').attr('class', 'valid');
		} else {
			$('#special').attr('class', 'invalid');
			count++;
		}

		// Validate length
		if(pwd.value.length >= 8) {
			$('#length').attr('class', 'valid');
		} else {
			$('#length').attr('class', 'invalid');
			count++;
		}

		return count == 0 ? true : false;
	};
	
	pwd1.onclick = function() {
		checkPassword(this);
	};

	pwd1.onkeyup = function() {
		checkPassword(this);
	};

	pwd1.onfocus = function() {
		checkPassword(this);
	    $(this).popover('show');
	};

	pwd1.onblur = function() {
	    $(this).popover('hide');
	};

	var verifyPassword = function(pwd) {
		var count = 0;

		// Validate password is correct
		if( (pwd.value == pwd1.value) && (pwd.value.length > 0) ) {
			$('#pwdverify').attr('class', 'valid');
		} else {
			$('#pwdverify').attr('class', 'invalid');
			count++;
		}

		return count == 0 ? true : false;
	};
	
	pwd2.onclick = function() {
		verifyPassword(this);
	};

	pwd2.onkeyup = function() {
		verifyPassword(this);
	};

	pwd2.onfocus = function() {
		verifyPassword(this);
	    $(this).popover('show');
	};

	pwd2.onblur = function() {
	    $(this).popover('hide');
	};

	var verifyEmail = function(email) {
		var count = 0;

		// Verify emails match
		if( (email.value == email1.value) && (email.value.length > 0) ) {
			$('#emailverify').attr('class', 'valid');
		} else {
			$('#emailverify').attr('class', 'invalid');
			count++;
		}

		return count == 0 ? true : false;
	};
	
	email2.onclick = function() {
		verifyEmail(this);
	};

	email2.onkeyup = function() {
		verifyEmail(this);
	};

	email2.onfocus = function() {
		verifyEmail(this);
	    $(this).popover('show');
	};

	email2.onblur = function() {
	    $(this).popover('hide');
	};

	var verifyInput = function() {
		if( !checkID(userid) ) {
			alert('User ID does not meet requirements');
			return false;
		}
		if( !checkPassword(pwd1) ) {
			alert('Password does not meet requirements');
			return false;
		}
		if( !verifyPassword(pwd2) ) {
			alert('Passwords do not match');
			return false;
		}
		if( !verifyEmail(email2) ) {
			alert('Emails do not match');
			return false;
		}

		return true;
	};

	var addUserData = function() {
		const userData = { 
			userid: userid.value,
			password: pwd1.value,
			email: email1.value,
			sq1: sq1.value,
			sa1: sa1.value,
			sq2: sq2.value,
			sa2: sa2.value,
			mobile: mobile.value,
			address: address.value
		}

		var request = db.transaction(["users"], "readwrite").objectStore("users").add(userData);
            
		request.onsuccess = function(event) {
			console.log("User has been added to the database.");
		};

		request.onerror = function(event) {
			alert("Unable to add data\r\nuser is already exists in the database!");
		};

		$.ajax({
			url: "127.0.0.1",
			type: "post",
			dataType: json,
			data: JSON.stringify(userData),
			success: function(JsonData) {
				var request = db.transaction(["users"], "readwrite").objectStore("users").delete(userData);
			    request.onsuccess = function(event) {
					console.log("User has been deleted from the database.");
				};

				request.onerror = function(event) {
					console.log("Unable to delete user from the database.");
				};
			},
			error: function() {
				$('.popup-heading').text('Some items didn\'t upload try again!');
			}
       	});
	};

	$('#form1').submit(function() {
	    if ( verifyInput() ) {
			addUserData();
		} else {
			return false;
		}
	    return true;
	});

	// Online connection check
	var status = document.getElementById("status");
	
	function updateOnlineStatus(event) {
		var condition = navigator.onLine ? "online" : "offline";
		status.className = condition;
		status.innerHTML = condition.toUpperCase();

		$("#status").show();
		if (condition == "online") {
			setTimeout(function(){$("#status").hide();}, 3000);
		}
	}

	window.addEventListener('online',  updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
	updateOnlineStatus();
});
