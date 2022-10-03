module.exports = async (statusCode, result) => {
    console.log("Wrapper - statusCode: " + statusCode);
    console.log("Wrapper - response: " + JSON.stringify(result,null,4));
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: {
            code: statusCode,
            data: JSON.stringify(result)
        },
    };
}