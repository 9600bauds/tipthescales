//This deletes the __v field (not needed for the client)
//and replaces the _id objectID with an "id" field that's just a string (which the client can use best)
const transformIdAndV = (obj) => {
    const transformedObj = { ...obj };
    transformedObj.id = transformedObj._id.toString();
    delete transformedObj._id;
    delete transformedObj.__v;
    return transformedObj;
};

module.exports = {
    transformIdAndV
};
