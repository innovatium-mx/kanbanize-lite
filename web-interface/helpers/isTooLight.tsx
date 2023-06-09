

function isTooLight(color: string) {
    const hex: string = color.replace('#', '');
    const c_r:number = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g:number = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b:number = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness:number = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;

    console.log(brightness);
    // 0 - darkest, 255 - brightest
    return brightness > 155; //true, false
}

export default isTooLight;