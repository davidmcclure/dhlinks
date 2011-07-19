Fx.CSS.Parsers.Color.compute = function(from, to, delta) {

    from = _rgb_to_hsv(from);
    to = _rgb_to_hsv(to);

    var intermediary = [];
    for (var i=0; i<3; i++) {
        intermediary.push(
            (from[i] + ((to[i] - from[i]) * delta)).round()
        );
    }

    return _hsv_to_rgb(intermediary);

}

function _rgb_to_hsv(rgb) {

    var r = rgb[0]/255;
    var g = rgb[1]/255;
    var b = rgb[2]/255;

    var h = null;
    var s = null;
    var v = null;

    var min = Math.min(r,g,b);
    var max = Math.max(r,g,b);
    var delta = max - min;

    v = max;

    if (delta == 0) {
        h = 0;
        s = 0;
    }

    else {

        s = delta / max;
        var delta_r = (((max - r) / 6) + (delta / 2)) / delta;
        var delta_g = (((max - g) / 6) + (delta / 2)) / delta;
        var delta_b = (((max - b) / 6) + (delta / 2)) / delta;

        if (r == max) { h = delta_b - delta_g; }
        else if (g == max) { h = (1/3) + delta_r - delta_b; }
        else if (b == max) { h = (2/3) + delta_g - delta_r; }

        if (h < 0) { h += 1; }
        if (h > 1) { h -= 1; }

    }

    h *= 360;
    s *= 100;
    v *= 100;

    return [h.round(),s.round(),v.round()];

}

function _hsv_to_rgb(hsv) {

    var h = hsv[0]/360;
    var s = hsv[1]/100;
    var v = hsv[2]/100;

    var r = null;
    var g = null;
    var b = null;

    if (s == 0) {
        r = v * 255;
        g = v * 255;
        b = v * 255;
    }

    else {

        var var_h = h * 6;
        var var_i = Math.floor(var_h);
        var var_1 = v * (1 - s);
        var var_2 = v * (1 - s * (var_h - var_i));
        var var_3 = v * (1 - s * (1 - (var_h - var_i)));

        if (var_i == 0) { r = v; g = var_3; b = var_1; }
        else if (var_i == 1) { r = var_2; g = v; b = var_1; }
        else if (var_i == 2) { r = var_1; g = v; b = var_3; }
        else if (var_i == 3) { r = var_1; g = var_2; b = v; }
        else if (var_i == 4) { r = var_3; g = var_1; b = v; }
        else { r = v; g = var_1; b = var_2; }

        r *= 255;
        g *= 255;
        b *= 255;

    }

    return [r.round(),g.round(),b.round()];

}
