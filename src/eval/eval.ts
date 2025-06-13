const REGEX_IF = /thisComp.layer\('([^']+)'\).effect\('([^']+)'\)\('Menu'\)\s*==\s*([0-9]+)\)[\s\S]*?\$bm_rt\s*=\s*([0-9]+);[\s\S]*?\$bm_rt\s*=\s*([0-9]+)/;

const REGEX_COLOR = /comp\('([^']+)'\)\.layer\('([^']+)'\)\.effect\('([^']+)'\)\('Color'\)/;

const REGEX_STROKE = /\$bm_mul\(\$bm_div\(value,\s*([0-9]+(?:\.[0-9]+)?)\),\s*comp\('([^']+)'\)\.layer\('([^']+)'\)\.effect\('([^']+)'\)\('([^']+)'\)\)/;

const REGEX_LEGACY_LAYER = /\$bm_mul\(thisComp\.layer\('([^']+)'\)\.effect\(([^)]+)\)\('([^']+)'\),\s*([0-9]+(?:\.[0-9]+)?)\)/;

const REGEX_LEGACY_SCALE = /thisComp\.layer\('([^']+)'\)\.effect\('Scale'\)\('Slider'\)/;

const REGEX_LEGACY_AXIS = /thisComp\.layer\('([^']+)'\)\.effect\('Axis'\)\('Point'\)/;

const REGEX_LEGACY_COLOR = /thisComp\.layer\('([^']+)'\)\.effect\('([^']+)'\)\('Color'\)/;

const REGEX_LEGACY_WATERMARK = /thisComp\.layer\('02092020'\)\.effect\('([^']+)'\)\('([^']+)'\)/;

export function prepareExpression(
    expr: string,
): any {

    // Handle color expressions.
    const matchColor = expr.match(REGEX_COLOR);
    if (matchColor) {
        const args = matchColor.slice(1);
        return (ctx?: any) => {
            const { comp } = ctx!;
            return comp(args[0]).layer(args[1]).effect(args[2])?.('Color');
        };
    }

    // Handle stroke expressions.
    const matchStroke = expr.match(REGEX_STROKE);
    if (matchStroke) {
        const args = matchStroke.slice(1);
        return (ctx?: any) => {
            const { comp, $bm_div, $bm_mul, value } = ctx!;
            return $bm_mul(
                $bm_div(value, +args[0]),
                comp(args[1]).layer(args[2]).effect(args[3])?.(args[4])
            );
        };
    }

    // Handle if expressions.
    const matchIf = expr.match(REGEX_IF);
    if (matchIf) {
        const args = matchIf.slice(1);
        return (ctx?: any) => {
            const { thisComp } = ctx;
            if (thisComp.layer(args[0]).effect(args[1])('Menu') == +args[2]) {
                return +args[3];
            } else {
                return +args[4];
            }
        };
    }

    // Handle legacy layer expressions.
    const matchLegacyLayer = expr.match(REGEX_LEGACY_LAYER);
    if (matchLegacyLayer) {
        const args = matchLegacyLayer.slice(1);
        return (ctx?: any) => {
            const { thisComp, $bm_mul } = ctx!;
            return $bm_mul(
                thisComp.layer(args[0]).effect(+args[1])(args[2]),
                +args[3]
            );
        };
    }

    // Handle legacy scale expressions.
    const matchLegacyScale = expr.match(REGEX_LEGACY_SCALE);
    if (matchLegacyScale) {
        const args = matchLegacyScale.slice(1);
        return (ctx?: any) => {
            const { thisComp } = ctx!;
            const value = thisComp.layer(args[0]).effect('Scale')('Slider');
            return [value, value];
        };
    }

    // Handle legacy axis expressions.
    const matchLegacyAxis = expr.match(REGEX_LEGACY_AXIS);
    if (matchLegacyAxis) {
        const args = matchLegacyAxis.slice(1);
        return (ctx?: any) => {
            const { thisComp } = ctx!;
            return thisComp.layer(args[0]).effect('Axis')('Point');
        };
    }

    // Handle legacy color expressions.
    const matchLegacyColor = expr.match(REGEX_LEGACY_COLOR);
    if (matchLegacyColor) {
        const args = matchLegacyColor.slice(1);
        return (ctx?: any) => {
            const { thisComp } = ctx!;
            return thisComp.layer(args[0]).effect(args[1])('Color');
        };
    }

    // Handle legacy watermark expressions.
    const matchLegacyWatermark = expr.match(REGEX_LEGACY_WATERMARK);
    if (matchLegacyWatermark) {
        return (ctx?: any) => {
            return 0;
        };
    }

    return null;
}