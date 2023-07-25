const errorHandler = (error, req, res, next) => {
    let message = 'Internal server error'
    let status = 500
    let name = error.name

    switch(name) {
        
    }

    res.status(status).json({message})
}

module.exports = errorHandler