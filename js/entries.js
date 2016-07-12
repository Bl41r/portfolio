// Entry object
function entry(section, navImg, text) {
  this.section = section;
  this.navImg = 'img/' + navImg;
  this.text = text;
}

// Entries
var about = new entry('About Me', 'person.jpg', 'Hello, I am David, and this is my portfolio site.  Hopefully after browsing this site, you can get a sense of who I am and where I am going.  I began making this portfolio as a student at Code Fellows in July 2016.  At Code Fellows, I am studying to become a competitive developer, and plan on working as a data analyst.  I enjoy working with data in general, and find solving problems with it fun and rewarding.');

var edu = new entry('Education', 'edu.png', 'I graduated in 2015 with a B.S. in chemistry and a B.A. in biochemistry from the University of Washington.  My favorite subjects were chemical biology, quantitative analysis, and statistical mechanics.  I joined Code Fellows in the summer of 2016, and am currently on track to learn Python.');

var exp = new entry('Experience', 'work.jpg', 'This observation furnished the detective food for thought, and meanwhile the consul went away to his office. Fix, left alone, was more impatient than ever, having a presentiment that the robber was on board the Mongolia. If he had indeed left London intending to reach the New World, he would naturally take the route via India, which was less watched and more difficult to watch than that of the Atlantic.');

var int = new entry('Interests', 'interests.png', 'When I\'m not coding, I have several hobbies keeping me busy.  I enjoy taking vacations, with my most recent trip being to Iceland.  It was one of the most beautiful places I have ever seen.  I also enjoy brewing beer.  I am currently fermenting a ginger beer for the first time.  For video games, I have been playing Fallout 4 and dying a lot in Dark Souls III.  I am also in one of the most in-depth fantasy football leagues ever made.');

var entries = [about, edu, exp, int];