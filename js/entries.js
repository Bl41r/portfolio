// Entry object
var entries = [];

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

// Entries
// var entries = [
//   {
//     name: 'about',
//     section: 'About Me',
//     date: '2016-07-12',
//     navImg: new Img('about', 'person.jpg'),
//     html: '<p>Hello, I am David, and this is my portfolio site.  Hopefully after browsing this site, you can get a sense of who I am and where I am going.  I began making this portfolio as a student at Code Fellows in July 2016.  At Code Fellows, I am studying to become a competitive developer, and plan on working as a data analyst.  I enjoy working with data in general, and find solving problems with it fun and rewarding.</p>'
//   },
//   {
//     name: 'edu',
//     section: 'Education',
//     date: '2016-07-12',
//     navImg: new Img('edu', 'edu.png'),
//     html: '<p>I graduated in 2015 with a B.S. in chemistry and a B.A. in biochemistry from the University of Washington.  My favorite subjects were chemical biology, quantitative analysis, and statistical mechanics.  I joined Code Fellows in the summer of 2016, and am currently on track to learn Python.  If you click on my GitHub link at the top of the page, you can see some of the projects that I have been working on.</p>'
//   },
//   {
//     name: 'exp',
//     section: 'Experience',
//     date: '2016-07-12',
//     navImg: new Img('exp', 'work.jpg'),
//     html: '<p>Throughout my experience as a working member of society, I have worked as a cashier, a QA technician at a tire factory, and a server at many restaurants.  I am in the process of taking what I have learned and changing my career to the technology field, incorporating my education and experiences.</p>'
//   },
//   {
//     name: 'int',
//     section: 'Interests',
//     date: '2016-07-12',
//     navImg: new Img('int', 'interests.png'),
//     html: '<p>When I\'m not coding, I have several hobbies keeping me busy.  I enjoy taking vacations, with my most recent trip being to Iceland.  It was one of the most beautiful places I have ever seen.  I also enjoy brewing beer.  I am currently fermenting a ginger beer for the first time.  For video games, I have been playing Fallout 4 and dying a lot in Dark Souls III.  I am also in one of the most in-depth fantasy football leagues ever made.</p>'
//   },
//   {
//     name: 'code',
//     section: 'Code ex 1',
//     date: '2016-07-18',
//     navImg: new Img('code', 'fb.png'),
//     html: '<p>This will need to be changed to be html to show the code markup.</p>'
//   },
//   {
//     name: 'code',
//     section: 'Code ex 2',
//     date: '2016-07-18',
//     html: '<p>This will need to be changed to be html to show the code markup.<pre><code>def helloWorld():  print("Hello, World!")</code></pre></p>'
//   },
//   {
//     name: 'code',
//     section: 'Code ex 3',
//     date: '2016-07-18',
//     html: '<p>This will need to be changed to be html to show the code markup.</p>'
//   }
// ];
