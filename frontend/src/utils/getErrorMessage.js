export const getErrorMessage = (error) => {
    //evil .data witchery
    return error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message;
};
