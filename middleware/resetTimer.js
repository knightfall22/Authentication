const EMAIL_LIMIT_MAX_CALLS = 2; // Maximum number of calls allowed per email address
const emailUsage = {};

const resetTimer = async (req, res, next) => {
    console.log(req.body);
    const { email } = req.body;
  
    if (!emailUsage[email]) {
        emailUsage[email] = 1
        console.log(EMAIL_LIMIT_MAX_CALLS)
    } else {
        if (emailUsage[email] >= EMAIL_LIMIT_MAX_CALLS) {
            emailUsage[email]++
            return res.status(429).json({
                error: 'Too many calls to this email address'
            })
        }
    }

    next()

}

module.exports = resetTimer