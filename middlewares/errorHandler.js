const errorHandler = (error, req, res, next) => {
    let message = 'Internal server error'
    let status = 500
    let name = error.name
    console.log(error)
    switch(name) {
        case "BADREQUEST":
            status = 401
            message = error.message
            break
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            status = 400
            message = error.errors[0].message
            break
        case "FAILEDLOGIN":
        case "INVALIDTOKEN":
        case "JsonWebTokenError":
            status = 401
            message = "Invalid email/password"
            break
    }
    res.status(status).json({message})
}

module.exports = errorHandler