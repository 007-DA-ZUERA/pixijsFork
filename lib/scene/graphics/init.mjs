import { extensions } from '../../extensions/Extensions.mjs';
import { GraphicsContextSystem } from './shared/GraphicsContextSystem.mjs';
import { GraphicsPipe } from './shared/GraphicsPipe.mjs';
import { initTriangleWasm } from './shared/utils/triangleInstance.mjs';

"use strict";
extensions.add(GraphicsPipe);
extensions.add(GraphicsContextSystem);
initTriangleWasm();
//# sourceMappingURL=init.mjs.map
