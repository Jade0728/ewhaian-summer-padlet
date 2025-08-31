//로그인했는지 검증하는 코드
export const checkAuthentication = (req, res, next) => {
    const userId = req.session?.userId; 
    const isAuthenticated = userId ? true : false;
    if(!isAuthenticated){
        return res.status(401).json({message : "로그인 후 이용해주세요!"});
    }
    req.userId = String(userId);
    next();
};

