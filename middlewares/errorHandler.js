const errorHandler = (error, req, res, next) => {
    console.log(error)
    let message = 'Internal server error'
    let status = 500
    let name = error.name

    switch(name) {
        case "BADREQUEST":
            status = 401
            message = error.message
            break
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            status = 400
            message = error[0].errors.message
            break
        case "FAILEDLOGIN":
            status = 401
            message = "Invalid email/password"
            break
        case "INVALIDTOKEN":
        case "JsonWebTokenError":
            status = 403
            message = "Unauthorized"
            break
    }

    res.status(status).json({message})
}

module.exports = errorHandler