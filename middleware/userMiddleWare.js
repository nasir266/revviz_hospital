export const setUserForViews = (req, res, next) => {
    const user = req.session ? req.session.user : null;
    res.locals.user = user || null; // safe fallback
    next();
};
