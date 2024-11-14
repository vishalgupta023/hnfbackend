 const rolesConst = {
    "user" : "USER",
    "admin" : "ADMIN"
}

 const accessFor ={
    All : ["USER", "ADMIN"],
    USER : ["USER"],
    ADMIN : ["ADMIN"]
}

module.exports ={
    rolesConst:rolesConst,
    accessFor : accessFor
}