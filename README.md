# managerAPI
<img src='https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square'><img src='https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat'><br>
managerAPI is a API who was made in TypeScript and have the role of manage tasks sended via endpoint '/allocate-tasks', it send back a list of tasks and who will do it

## Framework used

The express.js framework that was used to develop the API.<br>
I choosed it because it easy way to manipulate endpoints

## How to run
install nodeJs
```bash
//clone
git clone https://github.com/Lucca2013/managerAPI.git

//enter the folder
cd managerAPI

//install express
npm i express

//run
npm run dev
```

## Line-by-line / Code in src/main.ts
express importation and config

```js
import express from 'express';

// Express config
const app = express();
app.use(express.json());
```
Function to verify if a var is a Dictionary (Will be used to verify req.body)
```js
// Verify if a var is a dictionary   
function IsDictionary(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
```
This dictionry serves to put keywords and the skills that is required.<br>
It is necessary to identify what skills are needed for a task.
```js
// Probabilities to choose who will do the task based on skills
// can be modified according to needs
const Probabilities: Record<string, string[]> = {
    // UI, Client-side 
    "frontend": ["HTML", "CSS", "JS", "React", "Angular", "Vue.js", "TypeScript", "jQuery"],
    "UI": ["HTML", "CSS", "JS", "React", "Angular", "Vue.js", "TypeScript", "jQuery"],
    "Client-side": ["HTML", "CSS", "JS", "React", "Angular", "Vue.js", "TypeScript", "jQuery"],

    // Server-side, Back-end 
    "backend": ["JS", "Node.js", "C#", "C", "Python", "Java", "PHP", "Go", "Ruby", "Kotlin", "TypeScript"],
    "Server-side": ["JS", "Node.js", "C#", "C", "Python", "Java", "PHP", "Go", "Ruby", "Kotlin", "TypeScript"],
    "Backend": ["JS", "Node.js", "C#", "C", "Python", "Java", "PHP", "Go", "Ruby", "Kotlin", "TypeScript"],

    // Database, DBMS 
    "database": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "NoSQL", "Redis"],
    "Database": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "NoSQL", "Redis"],
    "SGBD": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "NoSQL", "Redis"],

    // SQL
    "SQL": ["SQL", "PostgreSQL", "MySQL"],
    "SQL Language": ["SQL", "PostgreSQL", "MySQL"],

    // ML, Machine Learning, Deep Learning
    "AI": ["Python", "R", "Julia", "Java", "C++", "Scala"],
    "Artificial Intelligence": ["Python", "R", "Julia", "Java", "C++", "Scala"],
    "ML": ["Python", "R", "Julia", "Java", "C++", "Scala"],
    "Machine Learning": ["Python", "R", "Julia", "Java", "C++", "Scala"],
    "Deep Learning": ["Python", "R", "Julia", "Java", "C++", "Scala"],

    // Operating Systems, Kernel
    "OS": ["C", "C++", "Assembly", "Rust"],
    "Operating System": ["C", "C++", "Assembly", "Rust"],
    "Systems Operational": ["C", "C++", "Assembly", "Rust"],
    "Kernel": ["C", "C++", "Assembly", "Rust"]
};
```
This is a interface for things that have in a user description
```js
//interfacing the things that will be send at the HTTP
interface UserData {
    skills: string[];
    availability: 'low' | 'medium' | 'high';
    receivedTasks: string[];
}
```
Run the server at port 3000
```js
//listen to localhost:3000
app.listen('3000', () => {
    console.log(`Express app listening at http://localhost:3000`);
});
```
Render a test html who have only a <script> on it who do the fetch
```js
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src/' });
});
```
Listen POST at '/allocate-tasks'
```js
// Listen for the users and tasks at /allocate-tasks
app.post('/allocate-tasks', (req, res) => {
```
Put the information of req.body in vars users and tasks
```js
// Create vars for users and tasks
const { users, tasks } = req.body;
```
verify if users and tasks are a dictionary, if not, return HTTP 400 and a message
```js
// Verify the types
    if (!IsDictionary(users) || !IsDictionary(tasks)) {
        return res.status(400).json({
            error: 'Invalid input types',
            details: `users should be object, tasks should be array. Received: users=${typeof users}, tasks=${typeof tasks}`
        });
    }
```
initialize a var who will be returned to frontend
```js
//Will return it to front-end
let tasksAndWhoWillDo: { [task: string]: string } = {};
```
runs through of tasks getting the task and importance
```js
for (const [task, importance] of Object.entries(tasks)) {
```
initialize the var usersAndPoints who will storage all the users with them points
```js
//initialize the var usersAndPoints and make the type
const usersAndPoints: { [userName: string]: number } = {};
```
make the category var lower
```js
const categoryLower = category.toLowerCase();
```
verify if there is in the tasklower the category
```js
//verify if there is in the tasklower the category
if (taskLower.includes(categoryLower)) {
```
get the userName (ex: Lucca) and the userData (ex: "skills": [HTML, CSS, JS, React], "availability": "medium", "receivedTasks": []) of the var users
```js
for (const [userName, userData] of Object.entries(users)) {
```
Type the userData
```js
const typedUserData = userData as UserData;
```
initialize the var userPoints, which will storage the points of a user that will determinate if he will do the task or no
```js
let userPoints = 0;
```
get the skills (ex: "HTML") at the var skills
```js
for (const skill of skills) {
```
verify if have the skill in the the skills part of the user, if there is, userPoints + 1
```js
if (typedUserData.skills.includes(skill)) {
  userPoints++;
}
```
initilize the var adjustedPoints, that will be changed by criterias avaliability and receivedTasks 
```js
let adjustedPoints = userPoints;
```
If/Else to calculate task importance and user availability
```js
if (importance == "low" && userData.availability == "medium") {
    adjustedPoints = adjustedPoints * 0.8;
} else if (importance == "low" && userData.availability == "high") {
    adjustedPoints = adjustedPoints * 0.7;
} else if (importance == "medium" && userData.availability == "low") {
    adjustedPoints = adjustedPoints * 0.6;
} else if (importance == "medium" && userData.availability == "high") {
    adjustedPoints = adjustedPoints * 0.8;
} else if (importance == "high" && userData.availability == "medium") {
    adjustedPoints = adjustedPoints * 0.6;
} else if (importance == "high" && userData.availability == "low") {
    adjustedPoints = adjustedPoints * 0.5;
}
```
verify if the users already have a task, if have, points / 2
```js
if (typedUserData.receivedTasks !== undefined) {
    adjustedPoints = adjustedPoints * 0.5;
}
```
storage in usersAndPoints the user and him points
```js
usersAndPoints[userName] = (usersAndPoints[userName] ?? 0) + adjustedPoints;
```
take the person with the most points and save at tasksAndWhoWillDo
```js
const values = Object.values(usersAndPoints);
const highestScore = Math.max(...values);
tasksAndWhoWillDo[task] = Object.keys(usersAndPoints).find(key => usersAndPoints[key] === highestScore) ?? '';
```
return the var tasksAndWhoWillDo
```js
res.json(tasksAndWhoWillDo);
```

## Console && Terminal
Console:
<img width="1150" height="90" alt="image" src="https://github.com/user-attachments/assets/8f25dd1d-7759-4372-aad0-2d001885734d" />
Terminal: <br>
<img width="487" height="116" alt="image" src="https://github.com/user-attachments/assets/1b0ff73c-7489-4945-96ec-103d93ea3501" />

