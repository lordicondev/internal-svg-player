import lottie from "../src";

/**
 * Icon data in JSON format. This package is optimized to handle icons from [Lordicon](https://lordicon.com/).
 */
type LottieData = any;

/**
 * Supported property types.
 */
type LottiePropertyType = 'color' | 'slider' | 'point' | 'checkbox' | 'feature';

/**
 * Interface for found property.
 */
interface LottieProperty {
    name: string;
    path: string;
    value: any;
    type: LottiePropertyType;
}

/**
 * Interface for the object that stores multiple colors.
 * 
 * Example:
 * ```js
 * {
 *     primary: 'red',
 *     secondary: '#ff0000', 
 * }
 * ```
 */
interface ColorsMap {
    [key: string]: string;
}

/**
 * Lottie color type.
 */
type RGBTuple = [number, number, number];

/**
 * Interface for colors parameters.
 */
interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Deep clone of value.
 * @param value
 */
export function deepClone(value: any) {
    return JSON.parse(JSON.stringify(value));
}

/**
 * Check value is null or undefined.
 * @param value 
 * @returns
 */
export function isNil(value: any) {
    return value === null || value === undefined;
}

/**
 * Checks if value is object-like. A value is object-like if it"s not null and has a typeof result of "object".
 * @param value
 */
export function isObjectLike(value: any): value is object {
    return value !== null && typeof value === "object";
}

/**
 * Checks if path is a direct property of object.
 * @param object
 * @param path
 */
export function has<T>(object: T, path: string | string[]): boolean {
    const newPath = Array.isArray(path) ? path : path.split(".");
    let current: any = object;

    for (const key of newPath) {
        if (!isObjectLike(current)) {
            return false;
        }

        if (!(key in current)) {
            return false;
        }

        current = (current as any)[key];
    }

    return true;
}

/**
 * Get object value from path. Otherwise return defaultValue.
 * @param object
 * @param path
 * @param defaultValue
 */
export function get<T>(object: T, path: string | string[], defaultValue?: any): any {
    const newPath = Array.isArray(path) ? path : path.split(".");
    let current: any = object;

    for (const key of newPath) {
        if (!isObjectLike(current)) {
            return defaultValue;
        }

        if (!(key in current)) {
            return defaultValue;
        }

        current = (current as any)[key];
    }

    return current === undefined ? defaultValue : current;
}

/**
 * Update object value on path.
 * @param object
 * @param path
 * @param value
 */
export function set(object: any, path: string | string[], value: any) {
    let current: any = object;

    const newPath = Array.isArray(path) ? path : path.split(".");

    for (let i = 0; i < newPath.length; ++i) {
        if (i === newPath.length - 1) {
            current[newPath[i]] = value;
        } else {
            current = current[newPath[i]];
        }
    }
}

/**
 * Convert to hexadecimal value.
 * @param c 
 * @returns 
 */
function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

/**
 * Convert from color object to hex value.
 * @param value 
 * @returns 
 */
function rgbToHex(value: RGBColor): string {
    return (
        '#' +
        componentToHex(value.r) +
        componentToHex(value.g) +
        componentToHex(value.b)
    );
}

/**
 * Conver from hex to color object.
 * @param hex 
 * @returns 
 */
function hexToRgb(hex: string): RGBColor {
    let data: number = parseInt(hex[0] != '#' ? hex : hex.substring(1), 16);
    return {
        r: (data >> 16) & 255,
        g: (data >> 8) & 255,
        b: data & 255,
    };
}

/**
 * Helper method for scale value.
 * @param n
 * @returns 
 */
function toUnitVector(n: number) {
    return Math.round((n / 255) * 1000) / 1000;
}

/**
 * Helper method for scale value.
 * @param n
 * @returns 
 */
function fromUnitVector(n: number) {
    return Math.round(n * 255);
}

/**
 * Convert hex color to lottie representation.
 * @param hex
 * @returns 
 */
export function hexToTupleColor(hex: string): RGBTuple {
    const {
        r,
        g,
        b
    } = hexToRgb(hex);
    return [toUnitVector(r), toUnitVector(g), toUnitVector(b)];
}

/**
 * Conver lottie color representation to hex.
 * @param value 
 * @returns 
 */
export function tupleColorToHex(value: RGBTuple): string {
    const color: RGBColor = {
        r: fromUnitVector(value[0]),
        g: fromUnitVector(value[1]),
        b: fromUnitVector(value[2]),
    };
    return rgbToHex(color);
}

/**
 * Return all supported customizable properties.
 * @param data Icon data.
 * @param options Options.
 * @returns 
 */
export function extractLottieProperties(
    data: LottieData,
    { lottieInstance }: { lottieInstance?: boolean } = {},
): LottieProperty[] {
    const result: any[] = [];

    if (!data || !data.layers) {
        return result;
    }

    data.layers.forEach((layer: any, layerIndex: number) => {
        if (!layer.nm || !layer.ef) {
            return;
        }

        layer.ef.forEach((field: any, fieldIndex: number) => {
            const value = field?.ef?.[0]?.v?.k;
            if (value === undefined) {
                return;
            }

            let path: string | undefined;

            if (lottieInstance) {
                path = `renderer.elements.${layerIndex}.effectsManager.effectElements.${fieldIndex}.effectElements.0.p.v`;
            } else {
                path = `layers.${layerIndex}.ef.${fieldIndex}.ef.0.v.k`;
            }

            let type: LottiePropertyType | undefined;

            if (field.mn === 'ADBE Color Control') {
                type = 'color';
            } else if (field.mn === 'ADBE Slider Control') {
                type = 'slider';
            } else if (field.mn === 'ADBE Point Control') {
                type = 'point';
            } else if (field.mn === 'ADBE Checkbox Control') {
                type = 'checkbox';
            } else if (field.mn.startsWith('Pseudo/')) {
                type = 'feature';
            }

            if (!type) {
                return;
            }

            const name = field.nm.toLowerCase();

            result.push({
                name,
                path,
                value,
                type,
            });
        });
    });

    return result;
}

/**
 * Reset data by indicated properties.
 * @param data 
 * @param properties 
 */
export function resetLottieProperties(
    data: LottieData,
    properties: LottieProperty[],
): any {
    for (const property of properties) {
        set(data, property.path, property.value);
    }
}

/**
 * Update data to value by indicated properties.
 * @param data 
 * @param properties 
 * @param value 
 */
export function updateLottieProperties(
    data: LottieData,
    properties: LottieProperty[],
    value: any,
): any {
    for (const property of properties) {
        if (property.type === 'color') {
            if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
                set(data, property.path, [toUnitVector(value.r), toUnitVector(value.g), toUnitVector(value.b)]);
            } else if (Array.isArray(value)) {
                set(data, property.path, value);
            } else if (typeof value === 'string') {
                set(data, property.path, hexToTupleColor(value));
            }
        } else if (property.type === 'point') {
            if (typeof value === 'object' && 'x' in value && 'y' in value) {
                set(data, property.path + '.0', value.x);
                set(data, property.path + '.1', value.y);
            } else if (Array.isArray(value)) {
                set(data, property.path + '.0', value[0]);
                set(data, property.path + '.1', value[1]);
            }
        } else {
            set(data, property.path, value);
        }
    }
}

/**
 * Generate a random hex color.
 * @returns A random hex color string.
 */
export function randomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Load icon and initialize lottie instance with customization options.
 * @param container Container ID.
 * @param iconName Icon name.
 * @param properties Icon properties.
 * @returns Icon instance and utility functions.
 */
export async function initIcon(
    container: string,
    iconName: string,
    properties: {
        colors?: { [key: string]: string },
        stroke?: number,
    } = {},
) {
    const lottieData = await fetch(`icons/${iconName}.json`)
        .then(response => response.json());

    const lottieInstance = lottie.loadAnimation({
        container: typeof container === 'string' ? document.getElementById(container)! : container,
        loop: true,
        autoplay: true,
        animationData: lottieData,
    });

    const lottieProperties = extractLottieProperties(lottieData, { lottieInstance: true });

    const setColor = (colorName: string, colorValue: string) => {
        updateLottieProperties(
            lottieInstance,
            lottieProperties.filter(c => c.name === colorName),
            hexToTupleColor(colorValue),
        );
    };

    const setStroke = (weight: number) => {
        updateLottieProperties(
            lottieInstance,
            lottieProperties.filter(c => c.name === 'stroke'),
            weight,
        );
    };

    if (properties.stroke) {
        setStroke(properties.stroke);
    }

    if (properties.colors) {
        for (const [colorName, colorValue] of Object.entries(properties.colors)) {
            setColor(colorName, colorValue);
        }
    }

    return {
        instance: lottieInstance,
        setColor,
        setStroke,
    };
}