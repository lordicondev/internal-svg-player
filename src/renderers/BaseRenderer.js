function BaseRenderer() { }
BaseRenderer.prototype.checkLayers = function (num) {
    var i;
    var len = this.layers.length;
    var data;
    this.completeLayers = true;
    for (i = len - 1; i >= 0; i -= 1) {
        if (!this.elements[i]) {
            data = this.layers[i];
            if (data.ip - data.st <= (num - this.layers[i].st) && data.op - data.st > (num - this.layers[i].st)) {
                this.buildItem(i);
            }
        }
        this.completeLayers = this.elements[i] ? this.completeLayers : false;
    }
    this.checkPendingElements();
};

BaseRenderer.prototype.createItem = function (layer) {
    switch (layer.ty) {

        case 0:
            return this.createComp(layer);
        case 1:
            return this.createSolid(layer);
        case 3:
            return this.createNull(layer);
        case 4:
            return this.createShape(layer);
        default:
            return this.createNull(layer);
    }
};


BaseRenderer.prototype.buildAllItems = function () {
    var i;
    var len = this.layers.length;
    for (i = 0; i < len; i += 1) {
        this.buildItem(i);
    }
    this.checkPendingElements();
};

BaseRenderer.prototype.includeLayers = function (newLayers) {
    this.completeLayers = false;
    var i;
    var len = newLayers.length;
    var j;
    var jLen = this.layers.length;
    for (i = 0; i < len; i += 1) {
        j = 0;
        while (j < jLen) {
            if (this.layers[j].id === newLayers[i].id) {
                this.layers[j] = newLayers[i];
                break;
            }
            j += 1;
        }
    }
};

BaseRenderer.prototype.setProjectInterface = function (pInterface) {
    this.globalData.projectInterface = pInterface;
};

BaseRenderer.prototype.initItems = function () {
    if (!this.globalData.progressiveLoad) {
        this.buildAllItems();
    }
};
BaseRenderer.prototype.buildElementParenting = function (element, parentName, hierarchy) {
    var elements = this.elements;
    var layers = this.layers;
    var i = 0;
    var len = layers.length;
    while (i < len) {
        if (layers[i].ind == parentName) { // eslint-disable-line eqeqeq
            if (!elements[i] || elements[i] === true) {
                this.buildItem(i);
                this.addPendingElement(element);
            } else {
                hierarchy.push(elements[i]);
                elements[i].setAsParent();
                if (layers[i].parent !== undefined) {
                    this.buildElementParenting(element, layers[i].parent, hierarchy);
                } else {
                    element.setHierarchy(hierarchy);
                }
            }
        }
        i += 1;
    }
};

BaseRenderer.prototype.addPendingElement = function (element) {
    this.pendingElements.push(element);
};

BaseRenderer.prototype.searchExtraCompositions = function (assets) {
    var i;
    var len = assets.length;
    for (i = 0; i < len; i += 1) {
        if (assets[i].xt) {
            var comp = this.createComp(assets[i]);
            comp.initExpressions();
            this.globalData.projectInterface.registerComposition(comp);
        }
    }
};

BaseRenderer.prototype.getElementById = function (ind) {
    var i;
    var len = this.elements.length;
    for (i = 0; i < len; i += 1) {
        if (this.elements[i].data.ind === ind) {
            return this.elements[i];
        }
    }
    return null;
};

BaseRenderer.prototype.getElementByPath = function (path) {
    var pathValue = path.shift();
    var element;
    if (typeof pathValue === 'number') {
        element = this.elements[pathValue];
    } else {
        var i;
        var len = this.elements.length;
        for (i = 0; i < len; i += 1) {
            if (this.elements[i].data.nm === pathValue) {
                element = this.elements[i];
                break;
            }
        }
    }
    if (path.length === 0) {
        return element;
    }
    return element.getElementByPath(path);
};

BaseRenderer.prototype.setupGlobalData = function (animData, fontsContainer) {

    this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
    this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
    this.globalData.frameId = 0;
    this.globalData.frameRate = animData.fr;
    this.globalData.nm = animData.nm;
    this.globalData.compSize = {
        w: animData.w,
        h: animData.h,
    };

};

export default BaseRenderer;
