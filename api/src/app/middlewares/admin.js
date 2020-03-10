module.exports = async (req) => {
    
    const token = req.headers.app_key;
    if (!token) {
        return false   
    }
    if(token === process.env.APP_KEY_ADMIN) return true;
    return false;
};
