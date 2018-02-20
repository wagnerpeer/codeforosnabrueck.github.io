---
---
// Script for fetching the next meetup event.

const getVenueFromResult = (result) => {
  venue = ""
  if (result.venue && result.venue.name) {
    venue = `Ort: ${result.venue.name}`
    latLng = [
      result.lat,
      result.lon
    ]
  }
  return venue
}

const setMeetupHtml = (result) => {
  $("#date span").html(new Date(result.time).toLocaleDateString('de-DE'))
  $("#next-meetup #title").html(result.name)
  $("#next-meetup #venue").html(getVenueFromResult(result))
  $("#next-meetup #description").html(result.description)
  $("#next-meetup #rvsp").attr("href", result.event_url)
}

const setMeetup = () => {
  const meetup_url = "{{ 'https://api.meetup.com/2/events?callback=?&sign=true&status=upcoming&group_urlname=' | append: site.meetup_group | append: '&format=json&key=' | append: site.meetup_api_key }}"
  $.getJSON(meetup_url, (data) => {
    if (data.results.length > 0) {
      const result = data.results[0]
      setMeetupHtml(result)
    }
  })
}

$(document).ready(() => {
  const $menuToggle = $("#js-mobile-menu").unbind()
  $("#js-navigation-menu").removeClass("show")
  $menuToggle.on("click", (e) => {
    e.preventDefault()
    $("#js-navigation-menu").slideToggle(() => {
      if ($("#js-navigation-menu").is(":hidden")) {
        $("#js-navigation-menu").removeAttr("style")
      }
    })
  })
  if ($('#next-meetup').length > 0) {
    setMeetup()
  }
})
