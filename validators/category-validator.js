const yup = require('yup');

const categoryValidator = yup.object({
    name : yup.string().required().trim().max(50),
    icon : yup.string().required().trim()
});

module.exports = categoryValidator;