(function() {
  var getVenueFromResult, setMeetup, setMeetupHtml;

  getVenueFromResult = function(result) {
    var latLng, venue;
    venue = "";
    if (result.venue && result.venue.name) {
      venue = "Ort: " + result.venue.name;
      latLng = [result.lat, result.lon];
    }
    return venue;
  };

  setMeetupHtml = function(result) {
    $("#date span").html(new Date(result.time).toLocaleDateString());
    $("#next-meetup #title").html(result.name);
    $("#next-meetup #venue").html(getVenueFromResult(result));
    $("#next-meetup #description").html(result.description);
    return $("#next-meetup #rvsp").attr("href", result.eventUrl);
  };

  setMeetup = function() {
    var meetup_url;
    meetup_url = "https://api.meetup.com/2/events?callback=?&sign=true&status=upcoming&group_urlname=OK-Lab-Osnabruck&format=json&key=4b364c4c47f751d5df6e62335a5f75";
    return $.getJSON(meetup_url, function(data) {
      var result;
      if (data.results.length > 0) {
        result = data.results[0];
        setMeetupHtml(result);
      }
    });
  };

  $(document).ready(function() {
    var menuToggle;
    menuToggle = $("#js-mobile-menu").unbind();
    $("#js-navigation-menu").removeClass("show");
    menuToggle.on("click", function(e) {
      e.preventDefault();
      $("#js-navigation-menu").slideToggle(function() {
        if ($("#js-navigation-menu").is(":hidden")) {
          $("#js-navigation-menu").removeAttr("style");
        }
      });
    });
    if ($('#next-meetup').length > 0) {
      setMeetup();
      return;
    }
  });

}).call(this);
