export const makeId = () => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};
