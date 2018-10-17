const bcrypt = require('bcryptjs');
const express = require('express') 
const expressHandlebars = require('express-handlebars') 
const bp = require('body-parser') 
const db = require('./db') 
const expressSession = require('express-session')
const connectSqlite3 = require('connect-sqlite3') 
const SQLiteStore = connectSqlite3(expressSession) 
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true})  //obs
const cookieParser = require('cookie-parser') 
const app = express() 
const fileUpload = require('express-fileupload')
const fs = require('fs')

app.use(cookieParser('ajdhrgsja'))
app.use(expressSession({ 
    store: new SQLiteStore({db: "session-db.db"}),
     secret: 'ajdhrgsja',
     cookie: {maxAge: null},
      saveUninitialized: false,
       resave: false
}))
app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
       extname: '.hbs' 
})) 

app.use(bp.urlencoded({   extended: false }))

app.use(express.static("public"))
app.use(fileUpload())


/**---------------------------------------------------------------------------------- */



app.get('/home', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn
    const model = {
        csrfToken: request.csrfToken(),
        isLoggedIn: isLoggedIn
    }

        response.render("home.hbs", model)
}) 

app.get('/about', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn
    const model = {
        csrfToken: request.csrfToken(),
        isLoggedIn: isLoggedIn
    }

    response.render("about.hbs", model)
}) 

app.get('/contact', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn
    const model = {
        csrfToken: request.csrfToken(),
        isLoggedIn: isLoggedIn
    }

    response.render("contact.hbs", model)
}) 

app.get('/blog',  csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn

    db.getAllBlogPosts(function(error, blogPosts){
        const model = {
            csrfToken: request.csrfToken(),
            blogPosts: blogPosts,
            error:error,
            isLoggedIn: isLoggedIn
        } 
        if(!error){
            response.render("blog.hbs", model)
        } else{
            response.redirect('../errorPage/500')
        }
        
    })
}) 

app.get("/blogPage/:id", csrfProtection, function(request,response){

    const id = request.params.id 
    const isLoggedIn = request.session.isLoggedIn

    var model = {
        csrfToken: null,
        blogPost: null,
        comments: null,
        isLoggedIn: null
    }

    db.getSpecificBlogPosts(id, function(error, blogPost){
        model = {
            csrfToken: request.csrfToken(),
            blogPost: blogPost,
            error:error,
            isLoggedIn: isLoggedIn
        }
        if(!model.blogPost){
            response.redirect('../errorPage/404')
        }else if (!error) {
            db.getAllComments(id, function(error, comments){
                model.comments= comments
                response.render("blogPage.hbs", model)
            })        
        }else{
            response.redirect('../errorPage/500')
        } 
    })
}) 

app.get('/portfolio', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn

    db.getAllProjects(function(error, projects){
        const model = {
            csrfToken: request.csrfToken(),
            projects: projects,
            isLoggedIn: isLoggedIn
        }
        if(!error){
            response.render("portfolio.hbs", model)
        } else{
            response.redirect('../errorPage/500')
        }
        
    })
}) 

app.get("/projectPage/:id", csrfProtection, function(request,response){

    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn

    db.getSpecificProject(id, function(error, project){
        const model = {
            csrfToken: request.csrfToken(),
            project: project,
            isLoggedIn: isLoggedIn
        }
        if(!model.project){
            response.redirect('../errorPage/404')
        } else if(!error) {
            response.render("projectPage.hbs", model)
        } else{
            response.render('../errorPage/500')
        }
    })
})

app.get('/welcomeHome', csrfProtection, function(request,response){
    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){
        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn
        }
        response.render("welcomeHome.hbs", model)
    } else{
        response.redirect('../home')
    }

}) 

app.get('/addNewBlogPost', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){
        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn
        }
    
        response.render("addNewBlogPost.hbs", model)

    } else{
        response.redirect('../home')
    }
}) 

app.get('/updateBlogPost', csrfProtection, function(request, response){

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){
        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn
        }
        response.render("updateBlogPost.hbs", model)
    } else{
        response.redirect('../home')
    }

})

app.get('/updateBP/:id', csrfProtection, function(request, response){
    const id = request.params.id

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){

        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn,
            bPost: null
        }
    
        db.getPostToUpdate(id, function(error, bPost){
            model.bPost= bPost

            if(!model.bPost){
                response.redirect('../errorPage/404')
            } else if(!error){
                response.render("updateBlogPost.hbs", model)
            } else{
                response.redirect('../errorPage/500')
            }

        })

    } else{
        response.redirect('../home')
    }
})

app.get('/deleteBlogPost/:id', csrfProtection, function(request, response){

    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){

        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn,
            id
        }
        response.render("deleteBlogPost.hbs", model)

    } else{
        response.redirect('../home')
    }


})

app.get('/updateC/:id', csrfProtection, function(request, response){

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){

        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn,
            comment: null
        }
    
        id = request.params.id
    
        db.getCommentToUpdate(id, function(error, comment){
            model.comment = comment

            if(!model.comment){
                response.redirect('../errorPage/404')
            } else if(!error){
                response.render("updateComment.hbs", model)
            }else{
                response.redirect('../errorPage/500')
            }
        }) 

    } else{
        response.redirect('../home')
    }

})

app.get('/addNewProject', csrfProtection, function(request,response){

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){
        
    const model = {
        csrfToken: request.csrfToken(),
        isLoggedIn: isLoggedIn
    }

    response.render("addNewProject.hbs", model)

    } else{
        response.redirect('../home')
    }

}) 

app.get('/updatePortfolio', csrfProtection, function(request, response){
    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){
        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn
        }
        response.render("updatePortfolio.hbs", model)

    } else{
        response.redirect('../home')
    }

})

app.get('/updatePro/:id', csrfProtection, function(request, response){

    const id = request.params.id

    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){

        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn,
            project: null
        }
    
        db.getProjectToUpdate(id, function(error, project){
            model.project = project

            if(!model.project){
                response.redirect('../errorPage/404')
            } else if(!error){
                response.render("updatePortfolio.hbs", model)
            } else {
                response.redirect('../errorPage/500')
            }
            
        })

    } else{
        response.redirect('../home')
    }



})

app.get('/deleteInPortfolio/:id', csrfProtection, function(request, response){
    const id = request.params.id
    const isLoggedIn = request.session.isLoggedIn

    if(isLoggedIn){

        const model = {
            csrfToken: request.csrfToken(),
            isLoggedIn: isLoggedIn,
            id
        }
        response.render("deleteInPortfolio.hbs", model)

    } else{
        response.redirect('../home')
    }


})


app.get('/errorPage/404', csrfProtection, function(request, response){
    
    const code = "404"
    const message = "Resource Not Found"
    const model = {
        csrfToken: request.csrfToken(),
        statusCode: code,
        message: message
    }
    response.render('errorPage.hbs', model)
})

app.get('/errorPage/301', csrfProtection, function(request,response){
    const code = "301"
    const message = "Resouce Moved Permanently"
    const model = {
        csrfToken: request.csrfToken(),
        statusCode: code,
        message: message
    }

    response.render('errorPage.hbs', model)
})

app.get('/errorPage/500', csrfProtection, function(request, response){

    const code = "500"
    const message = "Internal Server Error"
    const model = {
        csrfToken: request.csrfToken(),
        statusCode: code,
        message: message
    }

    response.render('errorPage.hbs', model)

})

app.get('/errorPage/failedLogin', csrfProtection, function(request, response){

    const message = "wrong username/password"
        const model = {
            csrfToken: request.csrfToken(),
            message: message
        }
        response.render("errorPage.hbs", model)

})


/**--------------------------POST------------------------------------------ */

app.post('/postOnBlog', csrfProtection, function(request,response){

    const title = request.body.title
    const content = request.body.content
    const image = request.files.image
    const imageName = request.files.image.name

    image.mv('./public/'+imageName, function(error){
        if(error){
            response.redirect('../errorPage/500')
        } else{
            db.newBlogPost(title, imageName, content, function(error) {
                if(error){
                    response.redirect('../errorPage/500')
                }
            })
            response.redirect('../welcomeHome')
        }
    })
})

app.post('/updateBlog/:id', csrfProtection, function(request, response){

    const id = request.params.id
    const title = request.body.title
    const image = request.files.image
    const imageName = request.files.image.name
    const content = request.body.content

    db.getImageFromBlogPosts(id, function(error, image){
        if(!error){
            fs.unlinkSync('public/'+image.Image)
        }
    })

    image.mv('./public/'+imageName, function(error){
        if(error){
            response.redirect('../errorPage/500')
        } else{
            db.updateBlogPost(title, imageName, content, id, function(error){
                if(error){
                    response.redirect('../errorPage/500')
                }
            })
            response.redirect('../welcomeHome')
        }
    })
})

app.post('/deletePost/:id', csrfProtection, function(request, response){

    const id = request.params.id

    db.getImageFromBlogPosts(id, function(error, image){

        if(!image){
            response.redirect('../errorPage/404')
        }else if(!error){
            fs.unlinkSync('public/'+image.Image)
        } else{
            response.redirect('../errorPage/500')
        }
    })

    db.deleteBlogPost(id, function(error){
        if(!error){
            response.redirect('../welcomeHome')
        }else {
            response.redirect('../errorPage/500')
        }
    })

    
})

app.post('/updateCommentById/:id', csrfProtection, function(request, response){

    const id = request.params.id
    const comment = request.body.comment

    db.updateComment(comment, id, function(error){
        if(!error){
            response.redirect('../welcomeHome')
        }else{
            response.redirect('../errorPage/500')
        }
    })

    
})

app.post('/deleteComment/:id/:id2', csrfProtection, function(request, response){

    const id = request.params.id
    const id2 = request.params.id2

    db.deleteComment(id, function(error){
        if(!error){
            response.redirect('/blogPage/'+id2)
        } else {
            response.redirect('../errorPage/500')
        }
    })
    

})

app.post('/newComment/:id', csrfProtection, function(request, response){

    const blogPostId = request.params.id
    const comment = request.body.comment

    db.newComment(comment, blogPostId, function(error){
        if(! error){ 
            response.redirect('../blogPage/'+blogPostId)
        } else{
            response.redirect('../errorPage/500')
        }
    })
    
})

app.post('/addToPortfolio', csrfProtection, function(request,response){

    const title = request.body.title
    const projectDescription = request.body.projectDescription
    const image = request.files.image
    const imageName = request.files.image.name
    
    image.mv('./public/'+imageName, function(error){
        if(error){
            response.redirect('../errorPage/500')
        } else{
            db.newProject(title, imageName, projectDescription, function(){
                if(error){
                    response.redirect('../errorPage/500')
                }
            })
            response.redirect('../welcomeHome')
        }
    })


})

app.post('/updateProject/:id', csrfProtection, function(request, response){

    const id = request.params.id
    const title = request.body.title
    const image = request.files.image
    const imageName = request.files.image.name
    const projectDescription = request.body.projectDescription

    db.getImageFromProjects(id, function(error, image){
        if(!error){
            fs.unlinkSync('public/'+image.Image)
        }
        else{
            response.redirect('../errorPage/500')
        }
    })

    image.mv('./public/'+imageName, function(error){
        if(error){
            response.redirect('../errorPage/500')
        } else{
            db.updateProject(title, imageName, projectDescription, id, function(error){
                if(error){
                    response.redirect('../errorPage/500')
                }
            })
            response.redirect('../welcomeHome')
        }
    })  
})

app.post('/deleteProject/:id', csrfProtection, function(request, response){

    const id = request.params.id

    db.getImageFromProjects(id, function(error, image){
        if(!image){
            response.redirect('../errorPage/404')
        }else if(!error){
            fs.unlinkSync('public/'+image.Image)
        } else{
            response.redirect('../errorPage/500')
        }
    })

    db.deleteProject(id, function(error){
        if(!error){
            response.redirect('../welcomeHome')
        }else {
            response.redirect('../errorPage/500')
        }
    })
})

/*--------------------------login/logout------------------------------------------------*/

app.post('/logout', csrfProtection, function(request, response){

    request.session.isLoggedIn = false

    response.redirect('/home')
})

app.post('/login',  csrfProtection, function(request, response){
	
	const username = request.body.un
	const password = request.body.pw

	if(username == "jonna"){
        if(checkPasword(password)){

            request.session.isLoggedIn = true
            
            response.redirect('../welcomeHome')

        }else{
            response.redirect('../errorPage/failedLogin')
        }
               
	}else{
        response.redirect('../errorPage/failedLogin')
	}

})

app.use('/', function(request, response){
    response.redirect('../errorPage/404')
})

/**------------------------------------------------------------------------------------ */

function hashPasword(){

    const password = "lennartsson"

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Store hash in your password DB.
    return hash

}

function checkPasword(pW){

    // Load hash from your password DB.
    const hash = hashPasword()

     return bcrypt.compareSync(pW, hash)

}



app.listen(8080) 