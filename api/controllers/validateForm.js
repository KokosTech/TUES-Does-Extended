validateForm = (req, res, next) => {
    const { username, password } = req.body;
    console.log("nl");
    if (!username || !password) {
        console.log("TESRING");
        res.json({ message: 'Please enter all fields' });
    } else {
        console.log("TESRING 2");
        //res.json({ message: 'Form validated' });
        next();
    }
}
module.exports = validateForm;