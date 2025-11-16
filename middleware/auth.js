export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        console.log('ggg');
        return res.redirect("/login");
    }
};
