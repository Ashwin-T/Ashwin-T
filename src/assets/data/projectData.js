
import mvx from '../images/logos/MVX.png';
import Hungry from '../images/logos/Hungry.PNG'
import todo from '../images/logos/todo19.PNG'
import pr from '../images/logos/prformance2.png'
import old from '../images/logos/Main.PNG'
import snowcones from '../images/logos/snowcones.png'
import SA from '../images/logos/SA.png'
import sm from '../images/logos/smartmirror.png'
import pt from '../images/logos/polltaker.png'
const projectData = [
    {
        "title": "MV Xperience",
        "about": "MV Xperience is a resource that provides students with reviews and advice from real current and previous MVHS students, giving students a better idea of the commitment level and course load of different classes and composite schedules based off real student experience.",
        "stack": "React.js, Node.js, Firebase",
        "inspiration": "With senior year apporaching I noticted how difficult is is to choose classes and how limited the information is about the difficulty and other aspects about a class.",
        "image": mvx,
        "css": 'bkwhite',
        "status" : "In Progress",
        "bkcolor": 'white',
        "github": "https://github.com/Ashwin-T/Xperiance",
        "link": "None"

    },
    {
        "title": "Spartan Assistant",
        "about": "A PWA created to help incoming freshmen orient themselves on campus by using an interactive map with GPS functionality and other tools.", 
        "stack": "React.js, Redux, Express, Firebase",
        "inspiration": "Due to how hard it is to adapt to a new school, MVHS Ambassadors asked to work with them to create a PWA to help incoming freshmen on campus",
        "css": 'bkwhite',
        "image": SA,
        "status" : "In Progress",
        "bkcolor": 'white',
        "github": "None",
        "link": "None"
    },
    {
        "title": "Hungry?",
        "about": "Hungry yet cant decide what to eat. 'Hungry?©' can help you out. With the vast amount of features it allows you to choose a random cuisine, go out, order in, or make it yourself with our large collection of recipes. Explore cuisine from different cultures and eat to your stomach's extent!",
        "stack": "React.js, Express, Firebase",
        "inspiration": "During dinner time my family often has the issue of choosing where to eat or what to cook. I decided it would be easier if there was an app that would choose for us, and so 'Hungry?' was born",
        "image" : Hungry,
        "css": 'bkwhite',
        "status" : "Revamp Coming Soon",
        "bkcolor": 'white',
        "github": "https://github.com/Ashwin-T/Hungry",
        "link": "https://hungry-yet.herokuapp.com/"


    },
    {
        "title": "Prformance",
        "about": "A social media PWA for athletes with an emphasis on self-confidence and building a strong community.",
        "stack": "React.js, Redux, Express, Firebase",
        "inspiration": "As an athlete myself, I understand how hard it is to motivate myself. This caused me to create Prformance, a platform where athletes can post accomplishments for others to boost them along their journey.",
        "image": pr,
        "css": 'bkblack',
        "status" : "Revamp Coming Soon",
        "bkcolor": 'black',
        "github": "https://github.com/Ashwin-T/PRformance",
        "link": "https://prformance.net"

    },
    {
        "title": "ToDo19",
        "about": "A To Do App linked to your google account to keep you organized! Easily add or delete To-Dos from any device.",
        "stack": "React.js, Node.js, Express, Firebase",
        "inspiration": "As I use multiple devices and often become unorganized, ToDo19 helps me stay on track. It was also a project to further my react and css skills",
        "image": todo,
        "css": 'bkblack',
        "status" : "Finished",
        "bkcolor": 'black',
        "github": "https://github.com/Ashwin-T/To-Do-19",
        "link": "https://to-do-19.herokuapp.com/"

    },
    {
        "title": "Old Personal Website",
        "about": "My old, very vanilla, website! View to see my how different my web dev skills were 6 months ago",
        "stack": "HTML, CSS, JavaScript",
        "image": old,
        "css": 'bkpurple',
        "status" : "Finished",
        "bkcolor": '#2d1493',
        "github": "https://github.com/Ashwin-T/Old-Website",
        "link": "https://ashwin-t.github.io/Old-Website/"   

    },
    {
        "title": "At Home Snow Cones",
        "about": "A website and online store for my younger brother`s snow cone business",
        "stack": "React.js, Firebase, Express",
        "inspiration": "With this being the second summer in a row for my younger brother's buisness \the asked me to create a way so that people can order ahead of time.",
        "image": snowcones,
        "css": 'bkwhite',
        "status" : "Finished",
        "bkcolor": 'white',
        "github": "https://github.com/Ashwin-T/Snow-Cones-At-Home",
        "link": "https://at-home-snow-cones.herokuapp.com/"
    },
    {
        "title": "Smart Mirror",
        "about": "A Computer Engineering project that I created using an old monitor, a Raspberry Pi, and a lot of cables",
        "stack": "React.js, Electron.js, Rest APIs, Firebase, Express, Node.js",
        "inspiration": "To stay organized and keep up with my busy mornings I created a Smart Mirror: the Smart Mirror is a mirror with a display behind it allowing it to show different components onto the screen. I wrote the code using React and numerous other JavaScript libraries incuding Moment.js and Electron.js, which allows the program to run as an application on a Linux operating system. I also used other node modules and APIs including the OpenWeather API to display real time data. I also used Firebase to hook up a to-do list which I an update on my phone via another app I created myself.",
        "image": sm,
        "css": 'bkwhite',
        "status" : "Finished",
        "bkcolor": 'white',
        "github": "https://github.com/Ashwin-T/SmartMirror",
        "link": "None"
    },
    {
        "title": "Poll Taker",
        "about": "A live poll taking session that allows for the presenter to get live feedback as they present",
        "stack": "React.js, Electron.js, Rest APIs, Firebase, Express, Node.js",
        "inspiration": "A simple live poll taking website created to be able to get live feedback from the Advanced Web Dev class that I teach",
        "image": pt,
        "css": 'bkwhite',
        "status" : "Finished",
        "bkcolor": 'white',
        "github": "https://github.com/Ashwin-T/Poll-Taker",
        "link": "https://ashwin-t.github.io/Poll-Taker/"
    },

]

export default projectData