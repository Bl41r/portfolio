// Main file for portfolio
// David Smith
//todo:
////////////////////////////////////////////////////////////////////
(function(module) {
  var clearLocalStorageOnStart = true;  //for debugging
  var numImages = 0;  //used to calc nav img sizes, ++ in Entry constructor

  // Entry object
  function Entry(info) {
    this.name = info.name;
    this.section = info.section;
    this.date = info.date;
    this.html = info.html;
    if (info.navImg) {
      this.navImg = info.navImg;
      numImages++;
    }
    if (info.projID) {
      this.projID = info.projID;
      this.created_at = info.created_at;
    }
  }

  Entry.entries = [];
  Entry.reposObj = {};
  Entry.reposObj.myRepos = [];

  Entry.reposObj.requestRepos = function(nextFunction1, nextFunction2) {
    $.ajax({
      url: 'https://api.github.com/users/Bl41r/repos' +
         '?per_page=0' +
         '&sort=update',
      type: 'GET',
      headers: {
        'Authorization': 'token ' + githubToken,
      },
      success: function(data, message, xhr) {
        Entry.reposObj.myRepos = data;
        console.log(data);
        localStorage.myPortProjectRepos = JSON.stringify(data);
        Entry.reposObj.myRepos = data;
        nextFunction1(nextFunction2);
      }
    });
  };

  Entry.reposObj.withTheAttribute = function(myAttr) {
    return Entry.reposObj.myRepos.filter(function(aRepo) {
      return aRepo[myAttr];
    });
  };

  function Img(name, url) {
    this.name = name;
    this.url = url;
    var t = this; //used to reference later inside a method

    this.clickEvent = function(img) {
      generateContent(img);
    };

    this.createListener = function(imgID) {
      var $images = $('.nav-menu img');
      var $thisImg;
      $images.each(function() {
        if ($(this).attr('id') === imgID) {
          $thisImg = $(this);
        }
      });
    };

    this.renderImg = function(navImg) {
      if (navImg) {
        var x = $('.nav-menu').append(Handlebars.compile($('#nav-img-template').html())(this));
        this.createListener(navImg.name);
      }
    };
  }

  function applyBackground(imgID) {
    //adds background highlight to selected nav image
    $('.nav-icon').removeClass('grey-bg');
    $('#' + imgID).addClass('grey-bg');
  }

  Entry.prototype.toHTML = function() {
    this.publishedOn = parseInt(Math.round((new Date() - new Date(this.date))/60/60/24/1000));
    this.html = marked(this.html);
    return Handlebars.compile($('#entry-template').html())(this);
  };

  function adjustNavImageSize() {
    var x = (450 / numImages).toString() + 'px';
    $('.nav-menu img').width(x);
    var m = (60 / numImages).toString() + 'px';
    $('.nav-menu img').css('margin-left', m);
  }

  function genNavImages(entries) {
    $('.nav-menu').html('');
    entries.forEach(function(e) {
      if (e.navImg) {
        e.navImg.renderImg(e.navImg);
      }
    });
  }

  function sortAndAppend(listEntries) {
    //handles repetitive content in generateContent method
    $('#main').hide();
    listEntries.sort(function(a,b) {
      return (new Date(b.date)) - (new Date(a.date));
    })
    .forEach(function(e) {
      $('#main').append(e.toHTML());
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
      if (e.navImg) {
        $('.nav-menu').append(e.navImg.renderImg()); //also, append the imgs now as looping thru
      }
    });

    genNavImages(Entry.entries);
    $('#main').fadeIn();
  }

  //removes current content and updates with information in entries, removes template, sets nav img sizes
  // img argument optional, if given, content updates with content selected
  function generateContent(img) {
    numImages = 0;  //reset and later images reconstructed in case of addition of new content
    var htmlEntries = [];  //array constructed to refresh content upon entries changes and append to page
    $('#main').html('');  //remove content

    if (img) {  //if img parameter was given by navImg event handler
      $('#main').hide();
      Entry.entries.forEach(function(e) {
        if (e.name === img) {
          htmlEntries.push(new Entry(e));
        }
      });
      sortAndAppend(htmlEntries);
      return;
    }
    //if no nav img clicked (generated at beginning)
    $('.nav-menu').html('');
    Entry.entries.forEach(function(e) {
      if (e.navImg) {
        e.navImg = new Img(e.navImg.name, e.navImg.url);
        page('/' + e.navImg.name, function() {
          e.navImg.clickEvent(e.navImg.name);
          applyBackground(e.navImg.name);
        });
      }
      htmlEntries.push(new Entry(e));
    });
    sortAndAppend(htmlEntries);
  }
// ex in terminal: window.Entry.addNewEntry('hello', 'test-header', 'content goes here', new Img('hello', 'fb.png'));
  Entry.addNewEntry = function(name1, section1, text1, navImg1) {
    var date1 = new Date();
    var entry = new Entry({name: name1, section: section1, date: date1, html: html1, navImg: navImg1});
    Entry.entries.push(entry);
    generateContent();
    adjustNavImageSize();
  };


  window.onresize = function() {
    var $mainID = $('#main');
    if (window.innerWidth <= 680) {
      $mainID.accordion(); // it must be initialized, destroyed, then re-initialized to work when resizing back and forth
      $mainID.accordion('destroy');
      $mainID.accordion({ heightStyle: 'content'});
      $('.nav-menu').hide();
    } else {
      $('.nav-menu').show();
      if ($mainID.hasClass('ui-accordion')) {
        $mainID.accordion('destroy');
      }
    }
  };

  function prepPage() {
    //repetitive content was in main()
    Entry.entries = JSON.parse(localStorage.myPortProject);
    Entry.reposObj.myRepos = JSON.parse(localStorage.myPortProjectRepos);
    linkRepos();
    generateContent();
    if (window.innerWidth <= 680) {
      $('.nav-menu').html('');
      $('#main').accordion({ heightStyle: 'content'});
    }
    hljs.initHighlightingOnLoad();
  }

  function linkRepos() {
    Entry.entries.forEach(function(e){
      if (e.projID) {
        Entry.reposObj.myRepos.forEach(function(r){
          if (e.projID === r.id) {
            e.created_at = r.created_at;
          }
        });
      }
    });
  }

  function getEntryData(nextFunction) {
    $.getJSON('../source/entries.json', function(responseData) {
      localStorage.myPortProject = JSON.stringify(responseData);
      nextFunction();
    });
  }

  function retrieveHeader(nextFunction) {
    $.ajax({
      type: 'HEAD',
      url: '../source/entries.json',
      success: function(data, message, xhr) {
        var eTag = xhr.getResponseHeader('eTag');
        if (!localStorage.eTag || eTag !== localStorage.eTag) {
          localStorage.eTag = eTag;
          Entry.reposObj.requestRepos(getEntryData, nextFunction);
        } else {
          nextFunction();
        }
      }
    });
  }

  function handleHome() {
    generateContent();
    if ($('#main').hasClass('ui-accordion')) {
      $('#main').accordion('destroy');
      $('#main').accordion({ heightStyle: 'content'});
    }
  }

  function main() {
    if (clearLocalStorageOnStart) {
      localStorage.clear();
    }
    retrieveHeader(prepPage);
    $('#home').on('click', handleHome);
  }

  module.Entry = Entry;
  page('/', handleHome);
  page();
  $(document).ready(main);
})(window);
