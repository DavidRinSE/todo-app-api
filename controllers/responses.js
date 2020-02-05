let Responses = {}
Responses.NotFound = (item) => {return {message: `No such ${item} with that name or id found`, statusCode: 404}}
Responses.BadRequest = (name, type) => {return {message: `Property '${name}' missing or incorrect type. Need ${type}`, statusCode: 400}}
Responses.AlreadyExists = (item) => {return {message: `That ${item} already exists`, statusCode:400}}
Responses.Unauthorized = {message: "Get off my lawn kid, you don't belong here!"}

module.exports = Responses