const express = require("express");
const router = express.Router();
const uuid = require("node-uuid");
const tasksData = require("../data/tasks");
let reqMap = new Map();

router.use("*", function(req, res, next){
    console.log("===============1st Filter==================");
    console.log("Request Body: " + JSON.stringify(req.body, null, 4));
    console.log("URL Path: " + req.baseUrl);
    console.log("HTTP Type: " + req.c);
    console.log("===============1st Filter==================");

    next();
});

router.use("*", function(req, res, next){
    let url = req.baseUrl;

    console.log("===============2nd Filter==================");

    if(reqMap.get(url))
    {
        let count = reqMap.get(url);
        count++;
        reqMap.set(url, count);
    }
    else
    {
        reqMap.set(url, 1);
    }

    for(let entry of reqMap.entries())
    {
        console.log("URL: " + entry[0] + " Count: " + entry[1]);
    }

    console.log("===============2nd Filter==================");

    next();
});

router.get("/", async (req, res) => {
    try 
    {
        let skip = req.query.skip;
        let take = req.query.take;

        let error = [];

        if(skip && isNaN(skip))
        {
            error.push("Skip is not a number");
        }

        if(take && isNaN(take))
        {
            error.push("Take is not a number");
        }

        if(error.length > 0)
        {
            res.status(500).json(error);
            return;
        }

        let tasks;

        if(skip)
        {
            if(take && take <= 100 && take > 0)
            {
                tasks = await tasksData.skipTasks(Number(skip), Number(take));
            }
            else if(take && (take > 100 || take < 0))
            {
                res.status(500).json({ error : "Incorrect take number" });
            }
            else
            {
                tasks = await tasksData.skipTasks(Number(skip), 20);
            }
        }
        else
        {
            if(take && take <= 100 && take > 0)
            {
                tasks = await tasksData.getNumberOfTasks(Number(take));
            }
            else
            {
                tasks = await tasksData.getNumberOfTasks(20);
            }
        }

        res.status(200).json(tasks);
    } 
    catch (e) 
    {
        res.status(500).json({ error: e });
    }
  });

router.get("/:id", async (req, res) => {
    try 
    {
      let task = await tasksData.getTask(req.params.id);

      if(task === null)
      {
        res.status(404).json({ error : "No task found" });
      }
      else
      {
        res.status(200).json(task);
      }
    } 
    catch (e) 
    {
      res.status(500).json({ error: e });
    }
  });


router.post("/", async (req, res) => {
    const taskData = req.body;

    try
    {
        const { title, description, hoursEstimated, completed } = taskData;
        let errors = validateData(title, description, hoursEstimated, completed);

        if(errors.length > 0)
        {
            res.status(500).json(errors);
        }
        else
        {
            let task = {
                _id : uuid.v4(),
                title : title,
                description : description,
                hoursEstimated : hoursEstimated,
                completed : completed,
                comments : []
            }

            let newTask = await tasksData.addTask(task);

            res.status(200).json(newTask);
        }
    }
    catch(e)
    {
        res.status(500).json({ error : e });
    }

});

router.put("/:id", async(req, res) => {
    const updatedTask = req.body;
    
    try
    {
        const { title, description, hoursEstimated, completed } = updatedTask;

        let errors = validateData(title, description, hoursEstimated, completed);

        if(errors.length > 0)
        {
            res.status(500).json(errors);
        }
        else
        {
            let task = {
                title : title,
                description : description,
                hoursEstimated : hoursEstimated,
                completed : completed,
            }

            let newTask = await tasksData.updateTask(req.params.id, task);

            res.status(200).json(newTask);
        }
    }
    catch(e)
    {
        res.status(500).json({ "error" : e });
    }
});

router.patch("/:id", async(req, res) => {
    const update = req.body;
    let errors = [];
    
    try
    {
        let updatedTask = {};

        if(update.title)
        {
            if(typeof update.title === "string" )
            {
                updatedTask.title = update.title;
            }
            else
            {
                errors.push("Title is not of correct type");
            }
        }

        if(update.description)
        {
            if(typeof update.description === "string")
            {
                updatedTask.description = update.description;
            }
            else
            {
                errors.push("Description is not of the correct type");
            }
        }

        if(update.hoursEstimated)
        {
            if(!isNaN(update.hoursEstimated))
            {
                updatedTask.hoursEstimated = update.hoursEstimated;
            }
            else
            {
                errors.push("Hours estimated is not in correct format");
            }
        }

        if(update.completed)
        {
            if(typeof update.completed === "boolean")
            {
                updatedTask.completed = update.completed;
            }
            else
            {
                errors.push("Completed is not in correct format");
            }
        }

        if(errors.length > 0)
        {
            res.status(500).json(errors);
        }
        else
        {
            let newTask = await tasksData.updateTask(req.params.id, updatedTask);

            res.status(200).json(newTask);
        }
    }
    catch(e)
    {
        res.status(500).json({ "error" : e });
    }
});

router.post("/:id/comments", async(req, res) => {
    let id = req.params.id;
    let comments = req.body;
    let errors = [];

    try
    {
        let task = await tasksData.getTask(id);

        if(!task)
        {
            res.status(404).json({error : "No such id found"});
            return;
        }

        const { name, comment } = comments;

        if(!name || typeof name !== "string")
        {
            errors.push("Name is not in the correct format");
        }

        if(!comment || typeof comment !== "string")
        {
            errors.push("Comment is not in the correct format");
        } 

        if(errors.length > 0)
        {
            res.status(500).json(errors);
        }
        else
        {
            let newComment = {
               commentId : uuid.v4(),
               name : name,
               comment : comment
            }

            let task = await tasksData.addComment(req.params.id, newComment);

            res.status(200).json(task);
        }
    }
    catch(e)
    {
        res.status(500).json({ "error" : e });
    }
});

router.delete("/:id/:commentId", async(req, res) => {
    let id = req.params.id;
    let commentId = req.params.commentId;

    try
    {
        let task = await tasksData.getComment(id, commentId);

        if(!task)
        {
            res.status(404).json({ error : "Task or comment does not exist" });
        }

        let updatedTask = await tasksData.deleteComment(id, commentId);

        res.status(200).json(updatedTask);
    }
    catch(e)
    {
        res.status(500).json({ "error" : e });
    }

});

function validateData(title, description, hoursEstimated, completed)
{
    let errors = [];

    if(!title || typeof title !== "string")
    {
        errors.push("Title not present or in the wrong format");
    }

    if(!description || typeof description !== "string")
    {
        errors.push("Description not present or in the wrong format");
    }

    if(!hoursEstimated || isNaN(hoursEstimated))
    {
        errors.push("Hours estimated not present or in the wrong format");
    }

    if(typeof completed === "undefined"  || typeof completed !== "boolean")
    {
        errors.push("Completed is not present or in the wrong format");
    }

    return errors;
}



module.exports = router;
