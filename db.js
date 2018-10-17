const sqlite3 = require('sqlite3') 
const db = new sqlite3.Database('database.db')

/*-------------------------------------------------------------*/

db.run("CREATE TABLE IF NOT EXISTS BlogPosts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Content TEXT, Image STRING)", function(error){
    if(error){
        console.log("DB" +error.message)
    }
})

db.run("CREATE TABLE IF NOT EXISTS Projects (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Content TEXT, Image TEXT)", function(error){
    if(error){
        console.log("DB" +error.message)
    }
})

db.run("CREATE TABLE IF NOT EXISTS Comments (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Comment TEXT, BlogPostId INTEGER, FOREIGN KEY(BlogPostId) REFERENCES BlogPosts(Id) ON DELETE CASCADE)", function(error){
    if(error){
        console.log("DB" +error.message)
    }
})

/*-------------------------------------------------------------*/

exports.newBlogPost = function(title, image, content, callback){

    const query = "INSERT INTO BlogPosts(Title, Image, Content) VALUES(?,?,?)"

    db.run(query, [title, image, content], function(error){
        callback(error)
    })

}

exports.updateBlogPost = function(title, image, content, id, callback){

    const query = "UPDATE BlogPosts SET Title = ?, Image = ?, Content = ? WHERE Id = ?"

    db.run(query, [title, image, content, id], function(error){
        callback(error)
    })
}

exports.deleteBlogPost = function(id, callback){

    const query = "DELETE FROM BlogPosts WHERE Id = ?"

    db.run(query, [id], function(error){
        callback(error)
    })

}

exports.getImageFromBlogPosts = function(id, callback){

    const query = "SELECT Image FROM BlogPosts WHERE Id = ?"

    db.get(query, [id], function(error, image){
        callback(error, image)
    })
}

exports.newProject = function(title, image, projectDescription, callback){

    const query = "INSERT INTO Projects(Title, Image, Content) VALUES(?,?,?)"

    db.run(query, [title, image, projectDescription], function(error){
        callback(error)
    })

}

exports.updateProject = function(title, image, projectDescription, id, callback){

    const query = "UPDATE Projects SET Title = ?, Image = ?, Content = ? WHERE Id = ?"

    db.run(query, [title, image, projectDescription, id], function(error){
        callback(error)
    })

}

exports.deleteProject = function(id, callback){

    const query = "DELETE FROM Projects WHERE Id = ?"

    db.run(query, [id], function(error){
        callback(error)
    })

}

exports.getImageFromProjects = function(id, callback){

    const query = "SELECT Image FROM Projects WHERE Id = ?"

    db.get(query, [id], function(error, image){
        callback(error, image)
    })

}

exports.newComment = function(comment, blogPostId, callback){

    const query = "INSERT INTO Comments(Comment, BlogPostId) VALUES(?,?)"

    db.run(query, [comment, blogPostId], function(error){
        if(error) console.log("DB" +error.message)
        callback(error)
    })

}

exports.deleteComment = function(id, callback){

    const query = "DELETE FROM Comments WHERE Id = ?"

    db.run(query, [id], function(error){
        callback(error)
    })
}

exports.updateComment = function(comment, id, callback){
    
    const query = "UPDATE Comments SET Comment = ? WHERE Id = ?"

    db.run(query, [comment, id], function(error){
        if(error){
            console.log("DB" +error.message)
        }else{
            console.log("succesfully inserted to tabel")
            callback(error)
        }
    })
}

exports.getCommentToUpdate = function(id, callback){

    const query = "SELECT * FROM Comments WHERE Id = ?"

    db.get(query, [id], function(error, comment){
        callback(error, comment)
    })
}

exports.getAllBlogPosts = function(callback){
    const query = "SELECT * FROM BlogPosts ORDER BY Id DESC"
    db.all(query, function(error, blogPosts){
        callback(error,blogPosts)
    })
}

exports.getSpecificBlogPosts = function(id, callback){

    const query = "SELECT * FROM BlogPosts WHERE Id = ?"

    db.get(query, [id], function(error, blogPost){
        callback(error, blogPost)
    })
}


exports.getPostToUpdate = function(id, callback){

    const query = "SELECT * FROM BlogPosts WHERE Id = ?"

    db.get(query, [id], function(error, bPost){
        callback(error,bPost)
    })

}

exports.getProjectToUpdate = function(id, callback){

    const query = "SELECT * FROM Projects WHERE Id = ?"

    db.get(query, [id], function(error, project){
        callback(error, project)
    })

}


exports.getAllProjects = function(callback){

    const query = "SELECT * FROM Projects ORDER BY Id DESC"
    db.all(query, function(error, projects){
        callback(error, projects)
    })
}

exports.getSpecificProject = function(id, callback){

    const query = "SELECT * FROM Projects WHERE Id = ?"

    db.get(query, [id], function(error, project){
        callback(error, project)
    })
}


exports.getAllComments = function(id, callback){

    const query = "SELECT * FROM Comments WHERE BlogPostId = ? ORDER BY Id DESC"

    db.all(query, [id], function(error, comments){
        callback(error, comments)
    })
}

