const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
}

module.exports = sanitizeInput;
