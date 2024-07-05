
    canvas.uniScaleTransform = true;
    canvas.selection = false;
    isCanvasClean[canvas_id] = false;
    isReset = false;
    draw_grid(canvas, cellWidth, cellHeight);

    canvas.on('mouse:down', function(o) {
        console.log('mouse:down');
