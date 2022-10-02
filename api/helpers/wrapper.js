module.exports.wrapper = async (event,context,callback) => {
    const result = await callback(event,context);
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}