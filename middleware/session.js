export const setUserForSession = (req, res, next) => {
    // If session exists, set user globally for all views
    res.locals.user = req.session ? req.session.user : null;
    next();
};