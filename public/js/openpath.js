OpenPath = window.OpenPath || {};


OpenPath = {
	user : null, //TODO: get rid of next two vars
	username : null,
	email : null,
	sessionID : null,
	room : null,
	init : function(){
		//init persona
		OpenPath.navigator.init();
		
		//set room number
		this.setRoomNumber();


		//check status
		//this.checkIfLoggedIn(); //why?? navigator does this no?

		//checks for scripts
		if(this.home){
			// Persona login button
			$('#loginbtn').mouseup(function() {
				navigator.id.request();
			});
		}
		if(this.main){
			this.main.init();
		}
	},
	setRoomNumber : function(){
		// retreives room number based on query string
		if (OpenPath.utils.getParameterByName('room') != null && OpenPath.utils.getParameterByName('room') != "") {
			OpenPath.room = OpenPath.utils.getParameterByName('room');
			console.log("Room Number: " + OpenPath.room);
		}else{
			//OpenPath.room = 1; //??
		}
	},
	/*deprecated
	checkIfLoggedIn : function(){
		var self = this;
		// call auth/status when page first loads to see if user is logged in already
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/auth/status", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.addEventListener("loadend", function(e) {
			var data = JSON.parse(this.responseText);
			if (data && data.status === "okay") {
				self.handleLogin(data.email);
			}
		}, false);

		xhr.send(JSON.stringify({
			//assertion: assertion
		}));

		
	},
	*/
	/**
	* Determines actions after login based on URL path.
	*/
	handleLogin : function( user ){
		var path = window.location.pathname;
		//console.log('handleLogin path = ' , path,user);
		if(path == '/'){
			// ON LOGIN: do homepage handling
			console.log('ON LOGIN: do homepage handling',this.room);
	
			//window.location = "/main" +'#'+getHash();
			if(this.room != ""){
				this.room = "?room=" + this.room;
			}
			var hash = OpenPath.utils.getHash();
			if(hash != ""){
				hash = "/#/" + hash;
			}
			
			window.location = "/main" + hash + this.room;  //TODO - room?
			
		}else if(path == '/main'){
			// ON LOGIN: do main handling
			this.getSessionIdHash(user.email);
			//set user
			this.setUser(user);
			
		}
	},
	//sets new backbone user model
	setUser : function(user){
		var self = this;
		//console.log('set user',user)
		//set user
		//this.user = new OpenPath.UserModel({id: user._id});
        this.user = new OpenPath.UserModel({_id: user._id});//good
        // The fetch below will perform GET /user/1
        // The server should return the id, name and email from the database
        this.user.fetch({
            success: function (user) {
                //console.log('fetched user',user.toJSON());
            }
        });
        //this.user.save({id: user._id, name:{first:'crap',last:'face'}})
	},
	/**
	* Checks /sessions/ for hash containing session id.
	* @param email - email of user to pass to username.
	*/
	getSessionIdHash : function(email){
		var self = this,
			id = OpenPath.utils.getHash();
		if (id != '') {	
			// call API and check for id in database
			$.ajax({
				url: '/sessions/' + id,
				dataType:'json',
				type:'GET',
				async:false,
				success: function() {
					// session id found, proceed to display username
					console.log('session id found');
					self.showUsername(email, id);
				},
				error: function(){
					// no id found, create new session
					self.createNewSession(email);
				}
			});
		}else{
			// no hash present, create new session
			self.createNewSession(email);
		}
	},
	/**
	* Creates new session in database.
	*/
	createNewSession : function(email){
		console.log('create new session', email)
		var self = this,
			sessionObj = { 
				/*
				'id': #, // id is auto-generated 
				*/
				'creator': email,
				'EventId': null,
				'startTime': OpenPath.utils.getDateTimeStamp(), 
				'privacy': "public",
				'type': "default",
				'invitedUsers': [],
				'users': [
					{ 'userId': email, 'startTime': OpenPath.utils.getDateTimeStamp(), 'endTime': "5/18/2014 18:00:00" }
				]
			};
		// call API and insert session
		//self.showUsername(email, '');

		$.ajax({
			url: '/sessions',
			dataType:'json',
			data: sessionObj,
			type:'POST',
			async:false,
			success: function(data) {
				console.log('new session created and session id = ' + data._id);
				self.showUsername(email, data._id);
			},
			error: function(data){
				console.log('there was an error creating a new session' + data);
			}
		});
	},
	/**
	* Display username in interface
	*/
	showUsername : function(email, idHash){
		 this.email = email;
		 //alert("showUsername email = " + email);
		 if(email != "guest"){
			// pull username from front of email address and display in interface
			// will allow user to change in future version; will store in user data along w prefs
			this.username = email.match(/^([^@]*)@/)[1];		
		}else{
			this.username =email;
		};
		document.querySelector("#username1").textContent = this.username;
		document.querySelector("#profileUsername").textContent = this.username;	

		// change invitation message
		var msg = document.querySelector("#text").value;
		msg = msg.replace("USERNAME", this.username);
		msg = msg.replace("LINK", "http://www.openpath.me#" + idHash);
		document.querySelector("#text").value = msg;
	}
};

$(document).ready(function(){
	//OpenPath.init();
});

