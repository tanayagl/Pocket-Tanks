export var res = {
    tankwatch_png: "src/res/tankwatch.png",
    tankwatch_plist: "src/res/tankwatch.plist",
    // terrain_plist:"src/res/green_tile.plist",
    terrain_brick:"src/res/greenbox.jpg"
    
};

export var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
