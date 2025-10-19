'use strict';

var Extensions = require('../../extensions/Extensions.js');
var GraphicsContextSystem = require('./shared/GraphicsContextSystem.js');
var GraphicsPipe = require('./shared/GraphicsPipe.js');
var triangleInstance = require('./shared/utils/triangleInstance.js');

"use strict";
Extensions.extensions.add(GraphicsPipe.GraphicsPipe);
Extensions.extensions.add(GraphicsContextSystem.GraphicsContextSystem);
triangleInstance.initTriangleWasm();
//# sourceMappingURL=init.js.map
