// Main file for portfolio
// David Smith
//todo:  new nav icons, add code projects
////////////////////////////////////////////////////////////////
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
  }

  Entry.entries = [];

  function Img(name, url) {
    this.name = name;
    this.url = url;
    var t = this; //used to reference later inside a method

    this.clickEvent = function(img) {
      generateContent(img);
    };

    this.createListener = function(imgID) { //find <img> with id matching e, add listener to it
      var $images = $('.nav-menu img');
      var $thisImg;
      $images.each(function() {
        if ($(this).attr('id') === imgID) {
          $thisImg = $(this);
        }
      });
      $thisImg.on('click', function() { //todo: prevent clicking too fast?
        t.clickEvent(imgID);
      });
    };

    this.renderImg = function(navImg) {
      if (navImg) {
        $('.nav-menu').append('<img src=\"img/' + navImg.url + '\" class=\"nav-icon\" id="' + navImg.name + '" /></a></li>');
        navImg.createListener(navImg.name);
      }
    };
  }

  Entry.prototype.toHTML = function() {
    this.publishedOn = parseInt(Math.round((new Date() - new Date(this.date))/60/60/24/1000));
    this.html = marked(this.html);
    return Handlebars.compile($('#entry-template').html())(this);
  };

  function adjustNavImageSize() {
    // resizes nav images for when more populate
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
    listEntries.sort(function(a,b) {
      return (new Date(b.date)) - (new Date(a.date));
    })
    .forEach(function(e) {
      $('#main').append(e.toHTML());
    });

    genNavImages(Entry.entries);
    $('#main').fadeIn();
  }

  //removes current content and updates with information in entries, removes template, sets nav img sizes
  function generateContent(img) {
    numImages = 0;  //reset and later images reconstructed in case of addition of new content
    var htmlEntries = [];  //array constructed to refresh content upon entries changes and append to page
    $('#main').html('');

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

    //if no navImg given
    $('.nav-menu').html('');
    Entry.entries.forEach(function(e) {
      if (e.navImg) {
        e.navImg = new Img(e.navImg.name, e.navImg.url);
      }
      htmlEntries.push(new Entry(e));
    });
    sortAndAppend(htmlEntries);
  }
// ex: window.Entry.addNewEntry('hello', 'test-header', 'content goes here', new Img('hello', 'fb.png'));
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
      generateContent();
      $mainID.accordion(); // it must be initialized, destroyed, then re-initialized to work when resizing back and forth
      $mainID.accordion('destroy');
      $mainID.accordion();
      $('.nav-menu').html('');
    } else {
      genNavImages(Entry.entries);
      if ($mainID.hasClass('ui-accordion')) {
        $mainID.accordion('destroy');
      }
    }
  };

  function prepPage() {
    Entry.entries = JSON.parse(localStorage.myPortProject);
    generateContent();
    if (window.innerWidth <= 680) {
      $('.nav-menu').html('');
      $('#main').accordion();
    }
  }

  function main() {
    if (clearLocalStorageOnStart) {
      localStorage.clear();
    }

    if (!localStorage.myPortProject) {
      $.getJSON('../source/entries.json', function(data) {
        localStorage.myPortProject = JSON.stringify(data);
        prepPage();
      });
    } else {
      prepPage();
    }

    hljs.initHighlightingOnLoad();

    $('#home').on('click', function() {
      generateContent();
      if ($('#main').hasClass('ui-accordion')) {
        $('#main').accordion('destroy');
        $('#main').accordion();
      }
    });
  }

  module.Entry = Entry;
  $(document).ready(main);
})(window);
