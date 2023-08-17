export function formatModifier(modifier) {
    if (modifier > 0) {
        return `+${modifier}`;
    } else if (modifier < 0) {
        return `-${Math.abs(modifier)}`;
    } else {
        return '';
    }
}