OpenPath = window.OpenPath || {};

OpenPath.Router = Backbone.Router.extend({
    routes: {
        ":route/:action": "loadView",
        "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new OpenPath.Router,
	loadRoute = {};

app_router.on('route:loadView', function(route, action) {
    console.log('route:loadView',route,action);
    /**
     * user route
     */
    if(route === 'user'){
        if(action === 'profile'){
			loadRoute.user.profile();
        }
        if(action === 'edit-profile'){
			loadRoute.user.editProfile();
        }
        if(action === 'mypath'){
			loadRoute.user.mypath();
        }
        if(action === 'notifications'){
			loadRoute.user.notifications();
        }
        if(action === 'settings'){
			loadRoute.user.settings();
        }
    }

});
app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions,OpenPath);
	OpenPath.init();

    //hide other tabs
    $('.main-tab').each(function(){
        $(this).hide();
        //console.log('hide main tabs')
    });

    if(actions === 'main' || !actions ){
        OpenPath.main.headerAnimation.init();
        $('#videos').fadeIn();
		//console.log($(window).height(),$('#videos').height(),$('#video').height());
		
        //set section height to window height
        function resizePage(){
            $('#videos').height( $(window).height() );
            $('#main_videoplayer').height( $(window).height() );
            $('.userVideo').each(function(){
                $(this).height( $(window).height()  /  4 );
            });
        }
        //set page elements height
        window.onresize = function(e){
            resizePage();
        };
        resizePage();


    }
    if(actions === 'adduser'){
        loadRoute.adduser.init();
    }
    if(actions === 'events'){
        loadRoute.events.init();//TODO: on first load pick one
    }
    if(actions === 'user'){
        //start with profile
        loadRoute.user.profile();
    }
});


/**
 *  loadRoute obj
 */
//app routes
loadRoute.adduser = {
    init : function(){
        
        $('#addUser').fadeIn();

        //nav icon
        $('nav.main ul li').each(function(){
            $(this).removeClass('active');
        });
        $('.addUserIcon').addClass('active');

            // Validates and submits email inviting participant
        $('#adduserform').submit(function() {
            var email = $('#to').val();
            var isValid = OpenPath.utils.validateEmail(email);

            if(!isValid){
                $('#emailerror').modal();
            }else{
                var data = $('#adduserform').serialize(); // serialize all the data in the form 
                $.ajax({
                    url: '/email',
                    data: data,
                    dataType:'json',
                    type:'POST',
                    async:false,
                    success: function(data) {        
                        for (key in data.email) {
                            alert(data.email[key]);
                        }
                    },
                    error: function(data){}
                });
            };
            return false;
        });
    }
};
//events routes
loadRoute.events = {
    init : function(){
        $('#events').fadeIn();
        //nav icon
        $('nav.main ul li').each(function(){
            $(this).removeClass('active');
        });
        $('.eventsIcon').addClass('active');
        //clear
        $('#eventslist').html();
        var evCollection = new OpenPath.EventsView();
    },
    nearby : function(){
        //todo
    },
    upcoming : function(){
        //todo
    }
};

//user routes
loadRoute.user = {
	init : function(){
		$('#user').fadeIn();
        //nav icon
		$('nav.main ul li').each(function(){
			$(this).removeClass('active');
		});
		$('.profileIcon').addClass('active');
		//correct tab
        $('.user-tab').each(function(){
            $(this).hide();
        });
	},
	profile : function(){
		this.init();
		$('#profile').fadeIn();
        $('h1#profileUsername').show();

        var userProfile = new OpenPath.UserProfileView({
            model: OpenPath.user
        });

        $("#profile .usertab-single-col").html(userProfile.render().el);
	},
	editProfile : function(){
		this.init();
		$('#profile').fadeIn();
        $('h1#profileUsername').hide();
        var editUserProfile = new OpenPath.EditUserProfileView({
            model: OpenPath.user
        });
        $("#profile .usertab-single-col").html(editUserProfile.render().el);
	},
	mypath : function(){
		this.init();
		$('#mypath').fadeIn();
	},
	notifications : function(){
		this.init();
		$('#notifications').fadeIn();
	},
	settings : function(){
		this.init();
        $('#settings').fadeIn();
        $('h1#profileUsername').show();

		var userSettings = new OpenPath.UserSettingsView({
            model: OpenPath.user
        });
        $("#settings .usertab-single-col").html(userSettings.render().el);
	}
}  



// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();