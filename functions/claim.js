exports.handler = function(event, context, callback) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World"})
    }
}