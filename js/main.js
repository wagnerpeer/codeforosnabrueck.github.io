function showContributor (contributor) {
    // console.log(contributor);
  $('#contributors').append('<div class="uk-width-1-4 uk-width-medium-1-6 uk-width-large-1-6">' +
        '<figure class="uk-overlay uk-overlay-hover contrib-gray">' + (contributor.avatar_url ? '<img width="150" src="' + contributor.avatar_url + '">'
                : '<img width="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO4/R8AArgB255xVG4AAAAASUVORK5CYII=">') +
           '<figcaption class="uk-overlay-panel uk-overlay-background uk-overlay-fade uk-flex uk-flex-center uk-flex-middle uk-text-center"><div>' + contributor.login + '<br />' + (contributor.contributions ? contributor.contributions + ' points' : '') + '</div>' +
            '</figcaption><a class="uk-position-cover" href="' + contributor.html_url + '"></a></figure></div>'
    )
}
$.getJSON('/json/members.json', function (data) {
  $.each(data, function (key, val) {
    showContributor(val)
  })
})

function showUser (user) {
  if (!user) return ''
  return '<div data-uk-tooltip title="' + user.name + '" style="float:left;width:50px;margin:5px 5px 0 0;overflow:hidden">'
    + '<a href="' + user.html_url + '" target="_blank"><img src="' + user.avatar_url + '" width="100%" /></a></div>'
}

function showFeatureIcon (icon) {
  var title = 'fertiggestelltes Projekt'
  var color = 'orange'
  if (icon == 'flash') {
    color = '#f33'
    title = 'derzeit kaputt'
  }
  if (icon == 'cloud-upload') {
    color = '#39f'
    title = '..work in progress..'
  }
  if (icon == 'gears') {
    color = '#88b'
    title = 'In der Planung'
  }
  return '<div style="width:1px;height:1px"><div data-uk-tooltip title="' + title + '" style="position:relative;left:5px;top:-25px;color:' + color + ';font-size:50px"><i class="uk-icon-' + icon + '"></i></div></div>'
}

function showProject (p, noimage) {
  var percent = p.closed_tasks / p.total_tasks * 100

  var featureIcon = ''
  featureIcon = ((p.status == 'done') || (p.status == 'ok')) ? 'star' : ''
  featureIcon = ((!featureIcon) && p.description.match(/\(down\)/i)) ? 'flash' : featureIcon
  featureIcon = ((!featureIcon) && p.description.match(/idee/i)) ? 'gears' : featureIcon
  featureIcon = ((!featureIcon) && p.description.match(/\(neu\)/i)) ? 'cloud-upload' : featureIcon

  $('#projects').append('<div class="uk-width-1-2 uk-width-medium-1-4 uk-width-large-1-4"><div class="projectTeaser">'

    + (featureIcon ? showFeatureIcon(featureIcon) : '')
        + '<div class="module-header uk-text-large"><a href="' + p.html_url + '">' + p.title + '</a></div>'
        + '<div class="projectInner">'
          + ((p.image && !noimage) ? '<div class="previewImage"><a href="' + p.url + '"><img src="' + p.image + '" width="100%" /></a></div>' : '<div class="previewImage"><div class="emptyimg"><i class="uk-icon-question-circle uk-icon-large"></i></div></div>')
      //  + '<div class="users">'+showUser( p.users[0] )+showUser( p.users[1] )+showUser( p.users[2] ) +showUser( p.users[3] )+'</div>'
          + '<div class="previewText">' + p.description + '</div>'
        + '</div>'
        + '<div class="icon-container-title">'
          + '<div class="progress-wrap progress"><div style="position:relative;left:100px;z-index:20;color:white">' + Math.round(percent) + '%</div>'
            + '<div style="background-color:#2ABD69;left:' + percent + '%;z-index:10" class="progress-bar progress"></div></div>'
          + '<p style="display:block;float:right">' + p.updated_at.substr(0, 10) + '</p>'
        + '<p><b>' + (p.total_tasks ? p.closed_tasks + '/' + p.total_tasks : '') + ' issues</b></p></div>'

        + '</div></div>'
    )
}

var featured_projects = [
  'openspending-osnabrueck',
  'codeforosnabrueck.github.io',
]

$.getJSON('/json/repos_meta.json', function (data) {
  var projectlist = {}
  $.each(data, function (key, val) {
    projectlist[val['name']] = key
  })

  console.log('projectlist', projectlist)

  $.each(featured_projects, function (key, projectname) {
    var p = data[projectlist[projectname]]
    if (!p) {
      console.log('DID NOT FIND FEATURED PROJECT', projectname)
    } else {
      showProject(p)
      data[projectlist[projectname]] = ''
    }
  })

  return
  $.each(data, function (key, val) {
    if (val) {
      showProject(val, 1)
    }
  })
})
