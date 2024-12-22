

const apiResponse = (status, data = null, message = '', error = null) => {
    return {
        status,
        data,
        message,
        error
    };
};

export default apiResponse;
