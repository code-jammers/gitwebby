// NODE SNAPPING
const snSnapThreshold = 11;
window.snNodeSnapper = class {
    snapX(x, target) {
        return (Math.abs(x - target) < snSnapThreshold) ? target : x;
    }
    snapY(y, target) {
        return (Math.abs(y - target) < snSnapThreshold) ? target : y;
    }
    snapNdAttr(val, nd, attr) {
        let target = parseInt(nd.attrs.filter(a => a.name == attr)[0].value);
        return (Math.abs(val - target) < snSnapThreshold) ? target : val;
    }
    snapXYToEnv(type, x, y) {
        return { x: x, y: y };// todo: implementation
    }
}
