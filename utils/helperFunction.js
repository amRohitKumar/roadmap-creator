module.exports.alreadyDone = (subsection, userId) => {
    if(subsection.completed.includes(userId)){
        return true;
    }
    else return false;
};
