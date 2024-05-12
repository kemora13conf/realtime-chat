
export const answerObject = (type, message, data=null) => {
    return {
        type: type,
        message: message,
        data: data,
    };
};

export const DeSerializeTextMessage = (data) => {
    return Buffer.from(data, "utf-8").toString();
};

export const ConvertFileToBase64 = (image) => {
    return Buffer.from(image).toString("base64");
};