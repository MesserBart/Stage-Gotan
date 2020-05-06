var jQuery = $ = require("jquery");
var moment = require("moment");

var fullpage = require("fullpage.js/dist/fullpage.extensions.min");
require("fullpage.js/vendors/scrolloverflow");

var popper = require("popper.js");
var bootstrap = require("bootstrap");

// var slick = require('slick-carousel');
// var Lightpick = require('lightpick');

// var FullCalendar = require('FullCalendar');


$(document).ready(function() {

	/** FULLPAGE */
	var fullpageInstance = new fullpage("#fullpage", {
		anchors:  ['home', 'house', 'loft', 'around', 'services', "booking", 'contact'],
		autoScrolling: true,
		scrollHorizontally: true,
		lockAnchors: false,
		animateAnchor: true,
		navigation: true,
		menu: "#menu",
		scrollbar: true,
		loopHorizontal: true,
		easing: 'easeInOutCubic',
		easingcss3: 'ease',
		scrollingSpeed: 700,
		autoScrolling: true,
		scrollOverflow: true,
		scrollOverflowReset: true,
		dragAndMove: true,
		fitToSection: true,
		fadingEffect: true,
		licenseKey: 'C79E9BAB-E43D40A8-8DAF447D-5B35C47A',
		lazyLoading: true, 
		afterLoad: function(origin, destination, direction){
			// Load Youtube video
			if (typeof ytplayers != "object"){
				console.error("No ytplayers defined");
				return;
			}
			$("iframe.youtube").each(function(index,item){
				// Pause all videos
				var id = $(item).attr("id");
				var player = ytplayers[id];
				if (typeof player == "undefined"){
					console.error("No youtube player defined with id " + id);
					return
				}
				player.pauseVideo();
			});
			$(destination.item).find("iframe.youtube").each(function(index,item){
				// Play visible video
				var id = $(item).attr("id");
				var player = ytplayers[id];
				if (typeof player == "undefined"){
					console.error("No youtube player defined with id " + id);
					return
				}
				player.playVideo();
			});

			// Google Analytics tuning
			gtag('event', 'screen_view', {
				'app_name': 'Bourgogne Détente', 
				"screen_name": destination.item.anchor
			});
		}
	});
	// scroll pictogram
	$("#fullpage .section").each(function(index, item) {
		var nextSlide = $(item).next();
		if ($(nextSlide).hasClass("section")) {
			$(item).append("<a class='after' target='#'></a>");
		}
	});
	$("#fullpage .section .after").click(function() {
		fullpageInstance.moveSectionDown();
	});

	/** Popover */
	$('.around .details .item, .booking .conditions .details .item').popover({
		container: 'body',
		trigger: "focus hover click",
		placement: "bottom",
		animation: true
	});
});


/** Youtube */
var ytplayers = {};
function loadVideos() {
	if (typeof YT != "object"){
		setTimeout(loadVideos, 1000);
	} else {
		console.log("Loading all videos player");
		try{
			$(".youtube").each(function() {
				var id = $(this).attr("id");
				ytplayers[id] = new YT.Player(id, {
					height: $(this).data("height") == null ? '400' : $(this).data("height"),
					width: $(this).data("width") == null ? '720' : $(this).data("width"),
					videoId: $(this).data("videoid"),
					playerVars:{
						autoplay: 0, 
						controls: 0,
						disablekb: 1, 
						enablejsapi: 1, 
						fs: 1, 
						iv_load_policy: 3,
						loop:1, 
						modestbranding: 1, 
						rel: 0, 
						showinfo: 0,
					},
					events: {
						// 'onReady': onPlayerReady,
						'onStateChange': function(event){
							if (event.data == YT.PlayerState.ENDED) {
					          event.target.playVideo();
					        }
						}
					}
				});
			});
		} catch (exception){
			console.error("Unable to load youtube player. Retry in 1s");
			setTimeout(loadVideos, 1000);
		}
	}
}

/******** YOUTUBE **********/
var loadYoutube = function() {
	if (typeof loadVideos == "function") {
		console.log("Load youtube script");
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		loadVideos();
	} else {
		console.log("waiting for loadVideos function");
		setTimeout(loadYoutube, 1000);
	}
}
loadYoutube();

// // Date Picker
// var picker = new Lightpick({
//     field: document.getElementById('booking-fromdate'),
//     secondField: document.getElementById('booking-todate'),
//     singleDate: false,
//     lang: "fr", 
//     minDays: 2,
//     minDate: moment(), 
//     format: "DD/MM/YYYY", 
//     onSelect: function(start, end){
//         var str = 'Du ';
//         str += start ? start.format('Do MMMM YYYY') + ' soir au ' : '';
//         str += end ? end.format('Do MMMM YYYY') + ' matin' : '...';
//         document.getElementById('booking-date-result').innerHTML = str;
//     }
// });


// document.addEventListener('DOMContentLoaded', function() {
// 	var calendarEl = $('#bookingCalendar');

// 	var calendar = new FullCalendar.Calendar(calendarEl, {
// 	  plugins: [ 'googleCalendar' ], 
// 	  defaultView: "dayGridMonth", 
// 	  header: {
//           left: 'prev,next',
//           center: 'title',
//           right: 'year, dayGridMonth'
//       },
// 	  googleCalendarApiKey: 'c124d5369f1df25ea81da5dd99407c07500ded56',
// 	  eventSources: [
// 	  	// Maison
// 	    {
// 	      googleCalendarId: 'kr794jitcnl71ue9i2hjgvglf8@group.calendar.google.com'
// 	    },
// 	    // Jours fériés
// 	    {
// 	      googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
// 	      className: 'nice-event'
// 	    }
// 	  ]
// 	});

// 	calendar.render();
// });
