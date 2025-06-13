import lottie from '../src';
import { extractLottieProperties, hexToTupleColor, updateLottieProperties } from './utils';

async function loadIcon(name) {
    return await fetch(`icons/${name}.json`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error loading icon ${name}:`, error);
            return null;
        });
}

async function insertRawIcon(id, animationData) {
    return lottie.loadAnimation({
        container: document.getElementById(id)!,
        loop: true,
        autoplay: true,
        animationData,
    });
}

function setStroke(instance, icon, weight) {
    const properties = extractLottieProperties(icon, { lottieInstance: instance });

    updateLottieProperties(
        instance,
        properties.filter(c => c.name === 'stroke'),
        weight,
    );
}

function setColor(instance, icon, colorName, colorValue) {
    const properties = extractLottieProperties(icon, { lottieInstance: instance });

    updateLottieProperties(
        instance,
        properties.filter(c => c.name === colorName),
        hexToTupleColor(colorValue),
    );
}

const icon1 = await loadIcon('wired-outline-1-cloud-hover-pinch');
await insertRawIcon('icon-1', icon1);

const instance2 = await insertRawIcon('icon-2', icon1);
setStroke(instance2, icon1, 3);

const icon3 = await loadIcon('wired-outline-489-rocket-space-hover-flying');
const instance3 = await insertRawIcon('icon-3', icon3);
setColor(instance3, icon3, 'primary', '#ff0000');
setColor(instance3, icon3, 'secondary', '#0000ff');

setInterval(() => {
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(instance3, icon3, 'primary', randomColor1);
    setColor(instance3, icon3, 'secondary', randomColor2);
}, 3000);


const icon4 = await loadIcon('wired-gradient-3094-marketing-letter-hover-pinch');
const instance4 = await insertRawIcon('icon-4', icon4);
setColor(instance4, icon4, 'primary', '#ff0000');
setColor(instance4, icon4, 'secondary', '#0000ff');
setStroke(instance4, icon4, 1);

const icon5 = await loadIcon('wired-flat-24-approved-checked-hover-pinch');
const instance5 = await insertRawIcon('icon-5', icon5);


