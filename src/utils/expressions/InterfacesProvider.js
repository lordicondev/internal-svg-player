import LayerExpressionInterface from './LayerInterface';
import EffectsExpressionInterface from './EffectInterface';
import CompExpressionInterface from './CompInterface';
import ShapeExpressionInterface from './ShapeInterface';
import FootageInterface from './FootageInterface';

var interfaces = {
    layer: LayerExpressionInterface,
    effects: EffectsExpressionInterface,
    comp: CompExpressionInterface,
    shape: ShapeExpressionInterface,
    footage: FootageInterface,
};

function getInterface(type) {
    return interfaces[type] || null;
}

export default getInterface;
