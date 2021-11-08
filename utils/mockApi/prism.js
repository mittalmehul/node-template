const fs = require('fs');
const { swaggerSpec } = require('../apiDocs/swagger');

// swagerDoc.json for PRISM (Mock API Server)
fs.writeFileSync('utils/mockApi/swaggerDoc.json', JSON.stringify(swaggerSpec));
