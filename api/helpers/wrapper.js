module.exports = async (statusCode, result) => {
    console.log("Wrapper - result: " + JSON.stringify(result, null, 4));
    const response = {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            code: statusCode,
            data: result
        }),
    };
    console.log("Wrapper - response: " + JSON.stringify(response,null,4));
    return response;
}