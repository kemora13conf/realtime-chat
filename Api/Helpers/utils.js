
const answerObject = (type, message, data=null) => {
    return {
        type: type,
        message: message,
        data: data,
    };
};

export { answerObject };