function draw(){
    if(state < 1){
        var player_dx = 0;
        var player_dy = 0;

        if(key_left){
            player_dx -= settings['speed'];
        }

        if(key_right){
            player_dx += settings['speed'];
        }

        can_jump = false;
        var temp_key = 0;

        var loop_counter = world_dynamic.length - 1;
        do{
            // If current game is still going, move objects.
            if(state < 1){
                // X movement.
                if(world_dynamic[loop_counter][7] != 0){
                    if(world_dynamic[loop_counter][0] < world_dynamic[loop_counter][5]){
                        world_dynamic[loop_counter][7] = Math.abs(world_dynamic[loop_counter][7]);

                    }else if(world_dynamic[loop_counter][0] > world_dynamic[loop_counter][6]
                      && world_dynamic[loop_counter][7] > 0){
                        world_dynamic[loop_counter][7] = -world_dynamic[loop_counter][7];
                    }

                    // If player on moving platform, move player X.
                    if(platform === loop_counter){
                        player_dx += world_dynamic[loop_counter][7];
                    }

                    world_dynamic[loop_counter][0] += world_dynamic[loop_counter][7];
                }
                // Y movement.
                if(world_dynamic[loop_counter][10] != 0){
                    if(world_dynamic[loop_counter][1] < world_dynamic[loop_counter][8]){
                        world_dynamic[loop_counter][10] = Math.abs(world_dynamic[loop_counter][10]);

                    }else if(world_dynamic[loop_counter][1] > world_dynamic[loop_counter][9]
                      && world_dynamic[loop_counter][10] > 0){
                        world_dynamic[loop_counter][10] = -world_dynamic[loop_counter][10];
                    }

                    // If player on moving platform, move player Y.
                    if(platform === loop_counter){
                        player_dy += world_dynamic[loop_counter][10];
                    }

                    world_dynamic[loop_counter][1] += world_dynamic[loop_counter][10];
                }
            }

            // If player is moving or object is moving, check for collision.
            if(player_dx != 0
              || player_dy != 0
              || player_y_vel != 0
              || world_dynamic[loop_counter][7] != 0
              || world_dynamic[loop_counter][10] != 0){
                var temp_object_right_x = world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2];
                var temp_object_right_y = world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3];

                // Check if player position + movmenet is within bounds of object.
                if(!(player_x + player_dx - 20 > temp_object_right_x
                  || player_x + player_dx + 20 < world_dynamic[loop_counter][0]
                  || player_y + player_y_vel - 20 > temp_object_right_y
                  || player_y + player_y_vel + 20 < world_dynamic[loop_counter][1])
                ){
                    // Collide with platform or key-locked wall.
                    if(world_dynamic[loop_counter][4] === 1
                      || world_dynamic[loop_counter][4] === 's'){
                        // Handle collisions with platforms while jumping or falling.
                        if(player_y_vel != 0
                          && player_x != world_dynamic[loop_counter][0] - 20
                          && player_x != temp_object_right_x + 20){
                            if(player_y_vel > 0){
                                if(player_y + player_y_vel <= world_dynamic[loop_counter][1] - 10
                                  && player_y + player_y_vel > world_dynamic[loop_counter][1] - 20){
                                    can_jump = true;
                                    player_y_vel = world_dynamic[loop_counter][1] - player_y - 20;
                                    player_dy = 0;

                                    if(world_dynamic[loop_counter][7] != 0){
                                        player_dx += world_dynamic[loop_counter][7];
                                    }

                                    platform = loop_counter;
                                }

                            }else if(player_y + player_y_vel < temp_object_right_y + 20
                              && player_y + player_y_vel >= temp_object_right_y + 10){
                                player_y_vel = temp_object_right_y - player_y + 20;
                            }
                        }

                        // Handle collisions with platforms while moving left/right.
                        if(platform != loop_counter){
                            if(key_left
                              && player_y + 20 > world_dynamic[loop_counter][1]
                              && player_y - 20 < temp_object_right_y
                              && player_x != world_dynamic[loop_counter][0] - 20
                              && player_x > world_dynamic[loop_counter][0]){
                                player_dx = temp_object_right_x - player_x + 20;
                            }

                            if(key_right
                              && player_y + 20 > world_dynamic[loop_counter][1]
                              && player_y - 20 < temp_object_right_y
                              && player_x != temp_object_right_x + 20
                              && player_x < world_dynamic[loop_counter][0]){
                                player_dx = world_dynamic[loop_counter][0] - player_x - 20;
                            }
                        }

                    // Collided with booster.
                    }else if(world_dynamic[loop_counter][4] === 4){
                        player_y_vel = world_dynamic[loop_counter][11];

                    // Collided with green goal.
                    }else if(world_dynamic[loop_counter][4] === 2){
                        clearInterval(interval);
                        clearInterval(interval_logic);
                        state = 2;

                    // Collided with red rectangles.
                    }else if(world_dynamic[loop_counter][4] === 3){
                        clearInterval(interval);
                        clearInterval(interval_logic);
                        state = 3;

                    // Collided with a key.
                    }else if(world_dynamic[loop_counter][4] === 5){
                        temp_key = loop_counter;
                    }
                }
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

        platform = -1;
        player_x += Math.round(player_dx);
        player_y += Math.round(player_dy + player_y_vel);

        if(can_jump){
            if(hop_permission
              && key_jump){
                player_y_vel = settings['jump-speed'];
                hop_permission = false;

            }else{
                player_y_vel = 0;
            }

        }else if(player_y_vel < settings['terminal-velocity']){
            player_y_vel += settings['gravity'];
        }

        frames += 1;
    }

    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    // Draw background colors if level asks for it.
    if(world_background.length > 0){
        buffer.fillStyle = world_background[1];
        buffer.fillRect(
          0,
          0,
          width,
          y - player_y + world_background[0]
        );

        buffer.fillStyle = world_background[2];
        buffer.fillRect(
          0,
          y - player_y + world_background[0],
          width,
          height + player_y
        );
    }

    // Draw buffer_static.
    buffer.drawImage(
      document.getElementById('buffer-static'),
      x - player_x + buffer_static_left,
      y - player_y + buffer_static_top
    );

    x_offset = x - player_x;
    y_offset = y - player_y;

    // Draw dynamic world objects that aren't in the buffer_static.
    var loop_counter = world_dynamic.length - 1;
    do{
        // Only draw objects that are reds, keywalls, keys, or moving.
        if(world_dynamic[loop_counter][4] == 3
          || world_dynamic[loop_counter][4] == 5
          || world_dynamic[loop_counter][4] == 's'
          || world_dynamic[loop_counter][7] != 0
          || world_dynamic[loop_counter][10] != 0){
            // If dynamic object is on screen, draw it.
            if(world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2] + x_offset <= 0
              || world_dynamic[loop_counter][0] + x_offset >= width
              || world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3] + y_offset <= 0
              || world_dynamic[loop_counter][1] + y_offset >= height){
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
    buffer.textAlign = 'center';

    // If game is over, draw game over text.
    if(state > 0){
        buffer.fillText(
          settings['restart-key'] + ' = Restart',
          x,
          y / 2 + 60
        );
        buffer.fillText(
          'ESC = Main Menu',
          x,
          y / 2 + 99
        );

        buffer.font = '40pt sans-serif';
        buffer.fillStyle = state === 2
          ? '#2d8930'
          : '#e02d30';
        buffer.fillText(
          state === 2
            ? 'Level Complete! ☺'
            : 'You Failed! ☹',
          x,
          y / 2
        );
    }

    // If tracking frames, draw number of frames.
    if(settings['time-display']){
        buffer.textAlign = 'left';
        buffer.textBaseline = 'top';
        buffer.fillText(
          frames,
          5,
          5
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
    if(!confirm('Reset settings?')){
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

function save(){
    var loop_counter = 6;
    do{
        var id = [
          'audio-volume',
          'gravity',
          'jump-speed',
          'ms-per-frame',
          'speed',
          'terminal-velocity',
          'time-display',
        ][loop_counter];

        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value === [1, .5, -10, 25, 4, 9, 1,][loop_counter]){
            window.localStorage.removeItem('Platform-2D.htm-' + id);
            settings[id] = [
              1,
              .5,
              -10,
              25,
              4,
              9,
              1,
            ][loop_counter];
            document.getElementById(id).value = settings[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'Platform-2D.htm-' + id,
              settings[id]
            );
        }
    }while(loop_counter--);

    // Save time-display setting.
    settings['time-display'] = document.getElementById('time-display').checked;
    if(settings['time-display']){
        window.localStorage.removeItem('Platform-2D.htm-time-display');

    }else{
        window.localStorage.setItem(
          'Platform-2D.htm-time-display',
          1
        );
    }

    loop_counter = 3;
    do{
        id = [
          'color',
          'jump-key',
          'movement-keys',
          'restart-key',
        ][loop_counter];

        if(document.getElementById(id).value === ['#009900', 'W', 'AD', 'H',][loop_counter]){
            window.localStorage.removeItem('Platform-2D.htm-' + id);
            settings[id] = [
              '#009900',
              'W',
              'AD',
              'H',
            ][loop_counter];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'Platform-2D.htm-' + id,
              settings[id]
            );
        }
    }while(loop_counter--);
}

function setmode(newmode, newgame){
    clearInterval(interval);
    clearInterval(interval_logic);

    mode = newmode;

    // New game mode.
    if(mode > 0){
        frames = 0;

        key_left = false;
        key_right = false;
        key_jump = false;

        player_x = 0;
        player_y = 0;
        player_y_vel = 0;

        state = 0;

        if(newgame){
            save();
            document.getElementById('page').innerHTML = '<canvas id=canvas></canvas><canvas id=buffer style=display:none></canvas><canvas id=buffer-static style=display:none></canvas>';

            buffer = document.getElementById('buffer').getContext('2d');
            buffer_static = document.getElementById('buffer-static').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');

            resize();
        }

        load_level(mode - 5);

        update_static_buffer();

        interval = setInterval(
          'draw()',
          settings['ms-per-frame']
        );

    // Main menu mode.
    }else{
        buffer = 0;
        buffer_static = 0;
        canvas = 0;

        world_dynamic.length = 0;
        world_static.length = 0;
        world_text.length = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Platform-2D.htm</b></div><hr><div class=c><ul><li><a onclick=setmode(3,1)>Generate Random Level</a><li><a onclick=setmode(4,1)>Randomized Lava Corridor</a></ul></div><hr><div class=c><ul><li><a onclick=setmode(5,1)>A Pit of Your Design</a><li><a onclick=setmode(6,1)>Booster Towers</a><li><a onclick=setmode(7,1)>Keys of a Father</a><li><a onclick=setmode(8,1)>Tutorial Island</a><li><a onclick=setmode(9,1)>Village of the Wolves</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input id=jump-key maxlength=1 value='
          + settings['jump-key'] + '>Jump<br><input disabled style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
          + settings['movement-keys'] + '>Move ←→<br><input id=restart-key maxlength=1 value='
          + settings['restart-key'] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
          + settings['color'] + '>Color<br><input id=gravity value='
          + settings['gravity'] + '>Gravity<br><input id=jump-speed value='
          + settings['jump-speed'] + '>Jump Speed<br><input id=ms-per-frame value='
          + settings['ms-per-frame'] + '>ms/Frame<br><input id=speed value='
          + settings['speed'] + '>Speed<br><input id=terminal-velocity value='
          + settings['terminal-velocity'] + '>Terminal Velocity<br><label><input'
          + (settings['time-display'] ? ' checked' : '') + ' id=time-display type=checkbox>Time</label><br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

function update_static_buffer(){
    buffer_static_left = 0;
    buffer_static_top = 0;
    var temp_bottom = 0;
    var temp_right = 0;

    // Determine limits required to hold certain dynamic objects.
    var loop_counter = world_dynamic.length - 1;
    if(loop_counter >= 0){
        do{
            // Only check objects that aren't reds, keywalls, keys, or moving.
            if(world_dynamic[loop_counter][4] == 3
              || world_dynamic[loop_counter][4] == 5
              || world_dynamic[loop_counter][4] == 's'
              || world_dynamic[loop_counter][7] != 0
              || world_dynamic[loop_counter][10] != 0){
                continue;
            }

            // Check if object is leftmost object so far.
            if(world_dynamic[loop_counter][0] < buffer_static_left){
                buffer_static_left = world_dynamic[loop_counter][0];
            }

            // Check if object is rightmost object so far.
            if(world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2] > temp_right){
                temp_right = world_dynamic[loop_counter][0] + world_dynamic[loop_counter][2];
            }

            // Check if object is topmost object so far.
            if(world_dynamic[loop_counter][1] < buffer_static_top){
                buffer_static_top = world_dynamic[loop_counter][1];
            }

            // Check if object is bottommost object so far.
            if(world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3] > temp_bottom){
                temp_bottom = world_dynamic[loop_counter][1] + world_dynamic[loop_counter][3];
            }
        }while(loop_counter--);
    }

    // Determine limits required to hold static objects.
    loop_counter = world_static.length - 1;
    if(loop_counter >= 0){
        do{
            // Check if object is leftmost object so far.
            if(world_static[loop_counter][0] < buffer_static_left){
                buffer_static_left = world_static[loop_counter][0];
            }

            // Check if object is rightmost object so far.
            if(world_static[loop_counter][0] + world_static[loop_counter][2] > temp_right){
                temp_right = world_static[loop_counter][0] + world_static[loop_counter][2];
            }

            // Check if object is topmost object so far.
            if(world_static[loop_counter][1] < buffer_static_top){
                buffer_static_top = world_static[loop_counter][1];
            }

            // Check if object is bottommost object so far.
            if(world_static[loop_counter][1] + world_static[loop_counter][3] > temp_bottom){
                temp_bottom = world_static[loop_counter][1] + world_static[loop_counter][3];
            }
        }while(loop_counter--);
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
    loop_counter = world_static.length - 1;
    if(loop_counter >= 0){
        do{
            buffer_static.fillStyle = 'rgb('
              + world_static[loop_counter][4] + ', '
              + world_static[loop_counter][5] + ', '
              + world_static[loop_counter][6] + ')';
            buffer_static.fillRect(
              world_static[loop_counter][0],
              world_static[loop_counter][1],
              world_static[loop_counter][2],
              world_static[loop_counter][3]
            );
        }while(loop_counter--);
    }

    // Add certain dynamic world objects to the buffer_static.
    loop_counter = world_dynamic.length - 1;
    do{
        // Only check objects that aren't reds, keywalls, keys, or moving.
        if(world_dynamic[loop_counter][4] == 3
          || world_dynamic[loop_counter][4] == 5
          || world_dynamic[loop_counter][4] == 's'
          || world_dynamic[loop_counter][7] != 0
          || world_dynamic[loop_counter][10] != 0){
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
    loop_counter = world_text.length-1;
    if(loop_counter >= 0){
        buffer_static.fillStyle = '#fff';
        buffer_static.font = '23pt sans-serif';
        buffer_static.textAlign = 'center';
        buffer_static.textBaseline = 'top';

        do{
            buffer_static.fillText(
              world_text[loop_counter][0],
              world_text[loop_counter][1],
              world_text[loop_counter][2]
            );
        }while(loop_counter--);
    }
}

var assets_images = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
];
assets_images[0].src = 'assets/goal.png';
assets_images[1].src = 'assets/red.png';
assets_images[2].src = 'assets/boost.png';
assets_images[3].src = 'assets/key.png';
var buffer = 0;
var buffer_static = 0;
var buffer_static_left = 0;
var buffer_static_top = 0;
var canvas = 0;
var can_jump = false;
var frames = 0;
var height = 0;
var hop_permission = true;
var interval = 0;
var interval_logic = 0;
var key_left = false;
var key_right = false;
var key_jump = false;
var mode = 0;
var platform = -1;
var player_x = 0;
var player_y = 0;
var player_y_vel = 0;
var settings = {
  'audio-volume': window.localStorage.getItem('Platform-2D.htm-audio-volume') === null
    ? 1
    : parseFloat(window.localStorage.getItem('Platform-2D.htm-audio-volume')),
  'color': window.localStorage.getItem('Platform-2D.htm-color') === null
    ? '#009900'
    : window.localStorage.getItem('Platform-2D.htm-color'),
  'gravity': window.localStorage.getItem('Platform-2D.htm-gravity') === null
    ? .5
    : parseFloat(window.localStorage.getItem('Platform-2D.htm-gravity')),
  'jump-key': window.localStorage.getItem('Platform-2D.htm-jump-key') === null
    ? 'W'
    : window.localStorage.getItem('Platform-2D.htm-jump-key'),
  'jump-speed': window.localStorage.getItem('Platform-2D.htm-jump-speed') === null
    ? -10
    : parseFloat(window.localStorage.getItem('Platform-2D.htm-jump-speed')),
  'movement-keys': window.localStorage.getItem('Platform-2D.htm-movement-keys') === null
    ? 'AD'
    : window.localStorage.getItem('Platform-2D.htm-movement-keys'),
  'ms-per-frame': window.localStorage.getItem('Platform-2D.htm-ms-per-frame') === null
    ? 25
    : parseInt(window.localStorage.getItem('Platform-2D.htm-ms-per-frame')),
  'speed': window.localStorage.getItem('Platform-2D.htm-speed') === null
    ? 4
    : parseFloat(window.localStorage.getItem('Platform-2D.htm-speed')),
  'restart-key': window.localStorage.getItem('Platform-2D.htm-restart-key') === null
    ? 'H'
    : window.localStorage.getItem('Platform-2D.htm-restart-key'),
  'terminal-velocity': window.localStorage.getItem('Platform-2D.htm-terminal-velocity') === null
    ? 9
    : parseFloat(window.localStorage.getItem('Platform-2D.htm-terminal-velocity')),
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

setmode(0, 1);

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(0, 1);

    }else{
        key = String.fromCharCode(key);

        if(key === settings['movement-keys'][0]){
            key_left = true;

        }else if(key === settings['movement-keys'][1]){
            key_right = true;

        }else if(key === settings['jump-key']){
            key_jump = true;

        }else if(key === settings['restart-key']){
            setmode(mode, 0);
        }
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
        hop_permission = true;
    }
};

window.onresize = resize;
