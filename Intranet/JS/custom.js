jQuery("#carousel2").owlCarousel({
  autoplay: true,
  lazyLoad: true,
  loop: true,
  margin: 20,
  /*
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    */
  responsiveClass: true,
  autoHeight: true,
  autoplayTimeout: 7000,
  smartSpeed: 800,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },

    600: {
      items: 1,
    },

    1024: {
      items: 1,
    },

    1366: {
      items: 1,
    },
  },
});

var isHRTeamMaster = "";
$(document).ready(() => {
  if (window.location.href.indexOf("_layouts/15/viewlsts.aspx") > -1) {
    getCurrentUserGroup().then(() => {
      if (!isHRTeamMaster) {
        window.location.replace("https://200oksolutions.sharepoint.com/sites/Intranet");
      }
    });
  } else {
    getCurrentUserGroup().then(() => {
      if (!isHRTeamMaster) {
        if ($("span.menu-item-text").length > 0) {
          var length = $("span.menu-item-text").length;
          for (k = 0; k < length; k++) {
            if ($("span.menu-item-text")[k].textContent == "Administration") {
              $($("span.menu-item-text")[k]).parent().parent().parent().hide();
            }
          }
        }
      }
    });
  }
});

function getCurrentUserGroup() {
  var deferred = $.Deferred();
    var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/GetUserById(" + _spPageContextInfo.userId + ")/Groups";
    $.ajax({
      url: requestUri,
      type: "GET",
      async: false,
      headers: { ACCEPT: "application/json;odata=verbose" },
      success: (data) => {
        deferred.resolve();
        if (data.d.results.length > 0) {
          for (i = 0; i < data.d.results.length; i++) {
            //var groupName = 'Project Management Owners'
            var groupName = "HR Team";
            if (data.d.results[i].Title == groupName) {
              isHRTeamMaster = true;
            }
          }
        }
      },
    });
  return deferred.promise();
}
