if(process.env.NODE_ENV === 'production'){
    module.exports ={ mongoURI: 'mongodb+srv://danny:P@55w0rd55@passwordmanager1-xfw49.mongodb.net/test?retryWrites=true&w=majority'
    
    }

}else{
    module.exports = {mongoURI :'mongodb://localhost/password-manager'}

}