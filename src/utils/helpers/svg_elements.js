const svgNS = 'http://www.w3.org/2000/svg';

function createNS(type) {
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElementNS(svgNS, type);
}

export default createNS;
