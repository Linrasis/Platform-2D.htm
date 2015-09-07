'use strict';

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    x_offset = x - player['x'];
    y_offset = y - player['y'];

    // Draw background colors if level asks for it.
    if(world_background['y'] !== void 0){
        buffer.fillStyle = world_background['color-top'];
        buffer.fillRect(
          0,
          0,
          width,
          y_offset + world_background['y']
        );

        buffer.fillStyle = world_background['color-bottom'];
        buffer.fillRect(
          0,
          y_offset + world_background['y'],
          width,
          height + player['y']
        );
    }

    // Draw buffer_static.
    buffer.drawImage(
      document.getElementById('buffer-static'),
      x_offset + buffer_static_left,
      y_offset + buffer_static_top
    );

    // Draw dynamic world objects that aren't in the buffer_static.
    var loop_counter = world_dynamic.length - 1;
    do{
        // Only draw objects that are reds, keywalls, keys, or moving
        //   and are on the screen.
        if(!(world_dynamic[loop_counter][4] === 3
            || world_dynamic[loop_counter][4] === 5
            || world_dynamic[loop_counter][4] === 's'
            || world_dynamic[loop_counter][7] !== 0
            || world_dynamic[loop_counter][10] !== 0)
          && (world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2] + x_offset <= 0
            || world_dynamic[loop_counter][0] + x_offset >= width
            || world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3] + y_offset <= 0
            || world_dynamic[loop_counter][1] + y_offset >= height)){
            continue;
        }

        // If object has a texture, draw texture. else draw rect.
        if(world_dynamic[loop_counter][4] > 1
          && world_dynamic[loop_counter][4] < 6){
            var temp_x = world_dynamic[loop_counter][0] + x_offset;
            var temp_y = world_dynamic[loop_counter][1] + y_offset;

            // Save current buffer state.
            buffer.save();

            // Translate to object location.
            buffer.translate(
              temp_x,
              temp_y
            );

            buffer.fillStyle = buffer.createPattern(
              assets_images[world_dynamic[loop_counter][4] - 2],
              'repeat'
            );
            buffer.fillRect(
              0,
              0,
              world_dynamic[loop_counter][2],
              world_dynamic[loop_counter][3]
            );

            // Restore buffer state.
            buffer.restore();

        }else{
            buffer.fillStyle = '#3c3c3c';
            buffer.fillRect(
              world_dynamic[loop_counter][0] + x_offset,
              world_dynamic[loop_counter][1] + y_offset,
              world_dynamic[loop_counter][2],
              world_dynamic[loop_counter][3]
            );
        }
    }while(loop_counter--);

    // Draw player.
    buffer.fillStyle = settings['color'];
    buffer.fillRect(
      x - 20,
      y - 20,
      40,
      40
    );

    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';

    // If tracking frames, draw number of frames.
    if(settings['time-display']){
        buffer.fillText(
          frame_counter,
          5,
          25
        );
    }

    // If game is over, draw game over text.
    if(state > 0){
        buffer.fillText(
          settings['restart-key'] + ' = Restart',
          5,
          100
        );
        buffer.fillText(
          'ESC = Main Menu',
          5,
          125
        );

        buffer.font = '42pt sans-serif';
        buffer.fillStyle = state === 2
          ? '#2d8930'
          : '#e02d30';
        buffer.fillText(
          state === 2
            ? 'Level Complete! ☺'
            : 'You Failed! ☹',
          5,
          75
        );
    }

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function logic(){
    if(state >= 1){
        return;
    }

    var player_dx = 0;
    var player_dy = 0;

    if(key_left){
        player_dx -= settings['speed'];
    }

    if(key_right){
        player_dx += settings['speed'];
    }

    var can_jump = false;
    var temp_key = 0;

    var loop_counter = world_dynamic.length - 1;
    do{
        // X movement.
        if(world_dynamic[loop_counter][7] !== 0){
            if(world_dynamic[loop_counter][0] < world_dynamic[loop_counter][5]){
                world_dynamic[loop_counter][7] = Math.abs(world_dynamic[loop_counter][7]);

            }else if(world_dynamic[loop_counter][0] > world_dynamic[loop_counter][6]
              && world_dynamic[loop_counter][7] > 0){
                world_dynamic[loop_counter][7] = -world_dynamic[loop_counter][7];
            }

            world_dynamic[loop_counter][0] += world_dynamic[loop_counter][7];
        }

        // Y movement.
        if(world_dynamic[loop_counter][10] !== 0){
            if(world_dynamic[loop_counter][1] < world_dynamic[loop_counter][8]){
                world_dynamic[loop_counter][10] = Math.abs(world_dynamic[loop_counter][10]);

            }else if(world_dynamic[loop_counter][1] > world_dynamic[loop_counter][9]
              && world_dynamic[loop_counter][10] > 0){
                world_dynamic[loop_counter][10] = -world_dynamic[loop_counter][10];
            }

            world_dynamic[loop_counter][1] += world_dynamic[loop_counter][10];
        }

        // If player and object aren't moving, no collision checks.
        if(player_dx === 0
          && player_dy === 0
          && player['y-velocity'] === 0
          && world_dynamic[loop_counter][7] === 0
          && world_dynamic[loop_counter][10] === 0){
            continue;
        }

        var temp_object_right_x = world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2];
        var temp_object_right_y = world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3];

        // Check if player position + movement is within bounds of object.
        if(player['x'] + player_dx - 20 > temp_object_right_x
          || player['x'] + player_dx + 20 < world_dynamic[loop_counter][0]
          || player['y'] + player['y-velocity'] - 20 > temp_object_right_y
          || player['y'] + player['y-velocity'] + 20 < world_dynamic[loop_counter][1]){
            continue;
        }

        // Collide with platform or key-locked wall.
        if(world_dynamic[loop_counter][4] === 1
          || world_dynamic[loop_counter][4] === 's'){
            // Handle collisions with platforms while jumping or falling.
            if(player['y-velocity'] !== 0
              && player['x'] !== world_dynamic[loop_counter][0] - 20
              && player['x'] !== temp_object_right_x + 20){
                if(player['y-velocity'] > 0){
                    if(player['y'] + player['y-velocity'] <= world_dynamic[loop_counter][1] - 10
                      && player['y'] + player['y-velocity'] > world_dynamic[loop_counter][1] - 20){
                        can_jump = true;
                        player['y-velocity'] = world_dynamic[loop_counter][1] - player['y'] - 20;
                        player_dy = 0;

                        if(world_dynamic[loop_counter][7] !== 0){
                            player_dx += world_dynamic[loop_counter][7];
                        }
                    }

                }else if(player['y'] + player['y-velocity'] < temp_object_right_y + 20
                  && player['y'] + player['y-velocity'] >= temp_object_right_y + 10){
                    player['y-velocity'] = temp_object_right_y - player['y'] + 20;
                }
            }

            // Handle collisions with platforms while moving left/right.
            if(key_left
              && player['y'] + 20 > world_dynamic[loop_counter][1]
              && player['y'] - 20 < temp_object_right_y
              && player['x'] !== world_dynamic[loop_counter][0] - 20
              && player['x'] > world_dynamic[loop_counter][0]){
                player_dx = temp_object_right_x - player['x'] + 20;
            }

            if(key_right
              && player['y'] + 20 > world_dynamic[loop_counter][1]
              && player['y'] - 20 < temp_object_right_y
              && player['x'] !== temp_object_right_x + 20
              && player['x'] < world_dynamic[loop_counter][0]){
                player_dx = world_dynamic[loop_counter][0] - player['x'] - 20;
            }

        // Collided with booster.
        }else if(world_dynamic[loop_counter][4] === 4){
            player['y-velocity'] = world_dynamic[loop_counter][11];

        // Collided with green goal.
        }else if(world_dynamic[loop_counter][4] === 2){
            window.clearInterval(interval);
            window.clearInterval(interval_logic);
            state = 2;

        // Collided with red rectangles.
        }else if(world_dynamic[loop_counter][4] === 3){
            window.clearInterval(interval);
            window.clearInterval(interval_logic);
            state = 3;

        // Collided with a key.
        }else if(world_dynamic[loop_counter][4] === 5){
            temp_key = loop_counter;
        }
    }while(loop_counter--);

    // Delete keys and key-locked walls if collided with key.
    if(temp_key > 1){
        world_dynamic.splice(temp_key, 1);

        loop_counter = world_dynamic.length - 1;
        do{
            if(world_dynamic[loop_counter][4] === 's'){
                world_dynamic.splice(
                  loop_counter,
                  1
                );
            }
        }while(loop_counter--);
    }

    player['x'] += Math.round(player_dx);
    player['y'] += Math.round(player_dy + player['y-velocity']);

    if(can_jump){
        if(jump_permission
          && key_jump){
            player['y-velocity'] = settings['jump-speed'];
            jump_permission = false;

        }else{
            player['y-velocity'] = 0;
        }

    }else{
        player['y-velocity'] = Math.min(
          player['y-velocity'] + settings['gravity'],
          settings['terminal-velocity']
        );
    }

    frame_counter += 1;
}

function new_image(path){
    var image = new Image();
    image.src = path;
    return image;
}

function play_audio(id){
    if(settings['audio-volume'] <= 0){
        return;
    }

    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('color').value = '#009900';
    document.getElementById('gravity').value = .5;
    document.getElementById('jump-key').value = 'W';
    document.getElementById('jump-speed').value = -10;
    document.getElementById('movement-keys').value = 'AD';
    document.getElementById('ms-per-frame').value = 25;
    document.getElementById('restart-key').value = 'H';
    document.getElementById('speed').value = 4;
    document.getElementById('terminal-velocity').value = 9;
    document.getElementById('time-display').checked = true;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;

    // If game is over, draw if resized.
    if(state > 0){
        draw();
    }
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'gravity': .5,
      'jump-speed': -10,
      'ms-per-frame': 25,
      'speed': 4,
      'terminal-velocity': 9,
      'time-display': 1,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('Platform-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'Platform-2D.htm-' + id,
              settings[id]
            );
        }
    }

    settings['time-display'] = document.getElementById('time-display').checked;
    if(settings['time-display']){
        window.localStorage.removeItem('Platform-2D.htm-time-display');

    }else{
        window.localStorage.setItem(
          'Platform-2D.htm-time-display',
          1
        );
    }

    ids = {
      'color': '#009900',
      'jump-key': 'W',
      'movement-keys': 'AD',
      'restart-key': 'H',
    };
    for(id in ids){
        if(document.getElementById(id).value === ids[id]){
            window.localStorage.removeItem('Platform-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'Platform-2D.htm-' + id,
              settings[id]
            );
        }
    }
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);
    window.clearInterval(interval_logic);

    mode = newmode;

    // New game mode.
    if(mode > 0){
        frame_counter = 0;

        key_left = false;
        key_right = false;
        key_jump = false;

        player = {
          'x': 0,
          'y': 0,
          'y-velocity': 0,
        },

        state = 0;

        if(newgame){
            save();
            document.body.innerHTML =
              '<canvas id=canvas></canvas><canvas id=buffer></canvas><canvas id=buffer-static></canvas>';

            buffer = document.getElementById('buffer').getContext(
              '2d',
              {
                'alpha': false,
              }
            );
            buffer_static = document.getElementById('buffer-static').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');

            resize();
        }

        load_level(mode - 5);

        update_static_buffer();

        animationFrame = window.requestAnimationFrame(draw);
        interval = window.setInterval(
          'logic()',
          settings['ms-per-frame']
        );

        return;
    }

    // Main menu mode.
    buffer = 0;
    buffer_static = 0;
    canvas = 0;

    world_dynamic.length = 0;
    world_static.length = 0;
    world_text.length = 0;

    document.body.innerHTML = '<div><div><a onclick="setmode(3, true)">Generate Random Level</a><br><a onclick="setmode(4, true)">Randomized Lava Corridor</a></div><hr><div><a onclick="setmode(5, true)">A Pit of Your Design</a><br><a onclick="setmode(6, true)">Booster Towers</a><br><a onclick="setmode(8, true)">Tutorial Island</a><br><a onclick="setmode(9, true)">Village of the Wolves</a><br><a onclick="setmode(7, true)">Yellow Keys</a></div></div><div class=right><div><input id=jump-key maxlength=1 value='
      + settings['jump-key'] + '>Jump<br><input disabled value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
      + settings['movement-keys'] + '>Move ←→<br><input id=restart-key maxlength=1 value='
      + settings['restart-key'] + '>Restart</div><hr><div><input id=audio-volume max=1 min=0 step=.01 type=range value='
      + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
      + settings['color'] + '>Color<br><input id=gravity value='
      + settings['gravity'] + '>Gravity<br><input id=jump-speed value='
      + settings['jump-speed'] + '>Jump Speed<br><input id=ms-per-frame value='
      + settings['ms-per-frame'] + '>ms/Frame<br><input id=speed value='
      + settings['speed'] + '>Speed<br><input id=terminal-velocity value='
      + settings['terminal-velocity'] + '>Terminal Velocity<br><label><input'
      + (settings['time-display'] ? ' checked' : '') + ' id=time-display type=checkbox>Time</label><br><a onclick=reset()>Reset Settings</a></div></div>';
}

function update_static_buffer(){
    buffer_static_left = 0;
    buffer_static_top = 0;
    var temp_bottom = 0;
    var temp_right = 0;

    // Determine limits required to hold certain dynamic objects.
    for(var object in world_dynamic){
        // Only check objects that aren't reds, keywalls, keys, or moving.
        if(world_dynamic[object][4] === 3
          || world_dynamic[object][4] === 5
          || world_dynamic[object][4] === 's'
          || world_dynamic[object][7] !== 0
          || world_dynamic[object][10] !== 0){
            continue;
        }

        // Check if object is leftmost object so far.
        if(world_dynamic[object][0] < buffer_static_left){
            buffer_static_left = world_dynamic[object][0];
        }

        // Check if object is rightmost object so far.
        if(world_dynamic[object][0] + world_dynamic[object][2] > temp_right){
            temp_right = world_dynamic[object][0] + world_dynamic[object][2];
        }

        // Check if object is topmost object so far.
        if(world_dynamic[object][1] < buffer_static_top){
            buffer_static_top = world_dynamic[object][1];
        }

        // Check if object is bottommost object so far.
        if(world_dynamic[object][1] + world_dynamic[object][3] > temp_bottom){
            temp_bottom = world_dynamic[object][1] + world_dynamic[object][3];
        }
    }

    // Determine limits required to hold static objects.
    for(object in world_static){
        // Check if object is leftmost object so far.
        if(world_static[object]['x'] < buffer_static_left){
            buffer_static_left = world_static[object]['x'];
        }

        // Check if object is rightmost object so far.
        if(world_static[object]['x'] + world_static[object]['width'] > temp_right){
            temp_right = world_static[object]['x'] + world_static[object]['width'];
        }

        // Check if object is topmost object so far.
        if(world_static[object]['y'] < buffer_static_top){
            buffer_static_top = world_static[object]['y'];
        }

        // Check if object is bottommost object so far.
        if(world_static[object]['y'] + world_static[object]['height'] > temp_bottom){
            temp_bottom = world_static[object]['y'] + world_static[object]['height'];
        }
    }

    // Calculate minimum width of buffer_static canvas, set and clear.
    var temp_height = Math.abs(buffer_static_top) + Math.abs(temp_bottom);
    var temp_width = Math.abs(buffer_static_left) + Math.abs(temp_right);

    document.getElementById('buffer-static').height = temp_height;
    document.getElementById('buffer-static').width = temp_width;

    buffer_static.clearRect(
      0,
      0,
      temp_width,
      temp_height
    );

    // Translate to top left of canvas to simplify drawing code.
    buffer_static.translate(
      -buffer_static_left,
      -buffer_static_top
    );

    // Add static world objects to the buffer_static.
    var loop_counter = world_static.length - 1;
    if(loop_counter >= 0){
        do{
            buffer_static.fillStyle = 'rgb('
              + world_static[loop_counter]['red'] + ', '
              + world_static[loop_counter]['green'] + ', '
              + world_static[loop_counter]['blue'] + ')';
            buffer_static.fillRect(
              world_static[loop_counter]['x'],
              world_static[loop_counter]['y'],
              world_static[loop_counter]['width'],
              world_static[loop_counter]['height']
            );
        }while(loop_counter--);
    }

    // Add certain dynamic world objects to the buffer_static.
    loop_counter = world_dynamic.length - 1;
    do{
        // Only check objects that aren't reds, keywalls, keys, or moving.
        if(world_dynamic[loop_counter][4] === 3
          || world_dynamic[loop_counter][4] === 5
          || world_dynamic[loop_counter][4] === 's'
          || world_dynamic[loop_counter][7] !== 0
          || world_dynamic[loop_counter][10] !== 0){
            continue;
        }

        // If object has a texture, draw texture. else draw rect.
        if(world_dynamic[loop_counter][4] > 1
         && world_dynamic[loop_counter][4] < 6){
            // Save current buffer_static state.
            buffer_static.save();

            // Translate to object location.
            buffer_static.translate(
              world_dynamic[loop_counter][0],
              world_dynamic[loop_counter][1]
            );

            buffer_static.fillStyle = buffer_static.createPattern(
              assets_images[world_dynamic[loop_counter][4] - 2],
              'repeat'
            );
            buffer_static.fillRect(
              0,
              0,
              world_dynamic[loop_counter][2],
              world_dynamic[loop_counter][3]
            );

            // Restore buffer_static state.
            buffer_static.restore();

        }else{
            buffer_static.fillStyle = '#3c3c3c';
            buffer_static.fillRect(
              world_dynamic[loop_counter][0],
              world_dynamic[loop_counter][1],
              world_dynamic[loop_counter][2],
              world_dynamic[loop_counter][3]
            );
        }
    }while(loop_counter--);

    // Add world text to buffer_static.
    buffer_static.fillStyle = '#fff';
    buffer_static.font = '23pt sans-serif';

    for(var text in world_text){
        buffer_static.fillText(
          world_text[text]['text'],
          world_text[text]['x'],
          world_text[text]['y']
        );
    }
}

var animationFrame = 0;
var assets_images = [
  new_image('assets/goal.png'),
  new_image('assets/red.png'),
  new_image('assets/boost.png'),
  new_image('assets/key.png'),
];
var buffer = 0;
var buffer_static = 0;
var buffer_static_left = 0;
var buffer_static_top = 0;
var canvas = 0;
var frame_counter = 0;
var height = 0;
var interval = 0;
var interval_logic = 0;
var jump_permission = true;
var key_left = false;
var key_right = false;
var key_jump = false;
var mode = 0;
var player = {};
var settings = {
  'audio-volume': window.localStorage.getItem('Platform-2D.htm-audio-volume') !== null
    ? parseFloat(window.localStorage.getItem('Platform-2D.htm-audio-volume'))
    : 1,
  'color': window.localStorage.getItem('Platform-2D.htm-color') || '#009900',
  'gravity': window.localStorage.getItem('Platform-2D.htm-gravity') !== null
    ? parseFloat(window.localStorage.getItem('Platform-2D.htm-gravity'))
    : .5,
  'jump-key': window.localStorage.getItem('Platform-2D.htm-jump-key') || 'W',
  'jump-speed': window.localStorage.getItem('Platform-2D.htm-jump-speed') !== null
    ? parseFloat(window.localStorage.getItem('Platform-2D.htm-jump-speed'))
    : -10,
  'movement-keys': window.localStorage.getItem('Platform-2D.htm-movement-keys') || 'AD',
  'ms-per-frame': parseInt(window.localStorage.getItem('Platform-2D.htm-ms-per-frame')) || 25,
  'speed': window.localStorage.getItem('Platform-2D.htm-speed') !== null
    ? parseFloat(window.localStorage.getItem('Platform-2D.htm-speed'))
    : 4,
  'restart-key': window.localStorage.getItem('Platform-2D.htm-restart-key') || 'H',
  'terminal-velocity': window.localStorage.getItem('Platform-2D.htm-terminal-velocity') !== null
    ? parseFloat(window.localStorage.getItem('Platform-2D.htm-terminal-velocity'))
    : 9,
  'time-display': window.localStorage.getItem('Platform-2D.htm-time-display') === null,
};
var state = 0;
var width = 0;
var world_background = [];
var world_dynamic = [];
var world_static = [];
var world_text = [];
var x = 0;
var x_offset = 0;
var y = 0;
var y_offset = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(
          0,
          true
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings['jump-key']){
        key_jump = true;

    }else if(key === settings['restart-key']){
        setmode(
          mode,
          false
        );
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings['jump-key']){
        key_jump = false;
        jump_permission = true;
    }
};

window.onload = function(e){
    setmode(
      0,
      true
    );
};

window.onresize = resize;
