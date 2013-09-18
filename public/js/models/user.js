OpenPath = window.OpenPath || {};

OpenPath.UserModel = Backbone.Model.extend({
  urlRoot: '/users',
  defaults: {
    name: {
      first : '',
      last : ''
    },
    email: '',
    grade: '',
    interests: [],
    homelocation:[0,0],
    locations : [{ location: [0, 0], atTime: 0 }],
    settings : {
      alertsColearnerJoin:true,
      alertsNearEvent:true,
      alertsAllEvents:true,
      profileAccess:'private'
    }
  },
  initialize: function(){
    console.log("new User initialized");
    this.on("change:settings", function(model){
        //var name = model.get("name"); // 'Stewie Griffin'
        //alert("Changed my name to " + name );
    });
  },
  idAttribute: "_id"
});


/*
//'Email':email,
					'Name': {'First' : firstName, 'Last' : lastName},
					'Grade': gradelevel,
					'Interests': interests.split(',').join(', ')//,TODO : too many spaces, fix split join
					//'HomeLocation': [lat, long],
					//'Locations': [],
					//'EventsInvitedTo': [],
					//'SessionsInvitedTo': [],
					//'EventsCreated': [],
					//'SessionsCreated': []
'settings' : {
						'alertsColearnerJoin':alertsColearnerJoin,
						'alertsNearEvent':alertsNearEvent,
						'alertsAllEvents':alertsAllEvents,
						'profileAccess':profileAccess
					}

Users: {
  Email: "ahmad@email.com",    // will actually be a GUID for ID which is referenced everywhere, email is a property
  Name: "ColdHeartedNinja",// update {first:"",last:""} -jg
  Grade: "6-8",
  Interests: ["robotics", "coding", "archaeology"],
  HomeLocation: [lat, long],    // maybe this will be replaced by address fields...  again to match users with events
  Locations: [    // this is to support tracking location if they're moving and want to see things nearby
    { location: [lat, long], atTime: "3/18/2013 13:00:00" },
    { location: [lat, long], atTime: "3/18/2013 14:00:00" }
  ],
  EventsInvitedTo: [1234567890, 0987654321]
  SessionsInvitedTo: [10003],
  EventsCreated: [],
  SessionsCreated: []
}



*/