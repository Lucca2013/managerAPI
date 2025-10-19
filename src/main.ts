import express from 'express';

// Express config
const app = express();
app.use(express.json());

// Verify if a var is a dictionary   
function IsDictionary(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

//interfacing the things that will be send at the HTTP
interface UserData {
    skills: string[];
    availability: 'low' | 'medium' | 'high';
    receivedTasks: string[];
}

//listen to localhost:3000
app.listen('3000', () => {
    console.log(`Express app listening at http://localhost:3000`);
});

//simple .HTML just for tests
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src/' });
});

// Listen for the users and tasks at /allocate-tasks
app.post('/allocate-tasks', (req, res) => {
    // Create vars for users and tasks
    const { users, tasks } = req.body;

    // Verify the types
    if (!IsDictionary(users) || !IsDictionary(tasks)) {
        return res.status(400).json({
            error: 'Invalid input types',
            details: `users should be object, tasks should be array. Received: users=${typeof users}, tasks=${typeof tasks}`
        });
    }

    //Will return it to front-end
    let tasksAndWhoWillDo: { [task: string]: string } = {};


    for (const [task, importance] of Object.entries(tasks)) {
        console.log(`\nTask: ${task} \nImportance: ${importance}`);

        //initialize the var usersAndPoints and make the type
        const usersAndPoints: { [userName: string]: number } = {};

        //verify the type and return HTTP 400 if it is invalid
        for (const [userName, userData] of Object.entries(users)) {
            if (!userData || typeof userData !== 'object' || !Array.isArray((userData as UserData).skills)) {
                return res.status(400).json({
                    error: 'Invalid user data structure',
                    details: `User ${userName} has invalid data structure`
                });
            }
            usersAndPoints[userName] = 0;
        }

        //make the task var lower
        const taskLower = task.toLowerCase();

        //get the categories (ex: "frontend") and the skills (ex: ["HTML", "CSS", "JS", "React"]) of the var Probabilities
        for (const [category, skills] of Object.entries(Probabilities)) {
            //make the category var lower
            const categoryLower = category.toLowerCase();

            //verify if there is in the tasklower the category
            if (taskLower.includes(categoryLower)) {
                //get the userName (ex: Lucca) and the userData (ex: "skills": [HTML, CSS, JS, React], "availability": "medium", "receivedTasks": []) of the var users
                for (const [userName, userData] of Object.entries(users)) {
                    //Type the userData
                    const typedUserData = userData as UserData;

                    //initialize the var userPoints, which will storage the points of a user that will determinate if he will do the task or no
                    let userPoints = 0;

                    //get the skills (ex: "HTML") at the var skills
                    for (const skill of skills) {
                        //verify if have the skill in the the skills part of the user
                        if (typedUserData.skills.includes(skill)) {
                            userPoints++;
                        }
                    }

                    //initilize the var adjustedPoints, that will be changed by criterias avaliability and receivedTasks 
                    let adjustedPoints = userPoints;

                    //if/else about the avaliability and importance
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

                    //verify if the users already have a task
                    if (typedUserData.receivedTasks !== undefined) {
                        adjustedPoints = adjustedPoints * 0.5;
                    }

                    usersAndPoints[userName] = (usersAndPoints[userName] ?? 0) + adjustedPoints;
                }
            }

        }

        console.table(usersAndPoints);

        //take the person with the most points and save at tasksAndWhoWillDo
        const values = Object.values(usersAndPoints);
        const highestScore = Math.max(...values);
        tasksAndWhoWillDo[task] = Object.keys(usersAndPoints).find(key => usersAndPoints[key] === highestScore) ?? '';

    }

    console.table(tasksAndWhoWillDo);

    //return 200 and the var tasksAndWhoWillDo
    res.json(tasksAndWhoWillDo);
});