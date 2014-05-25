function draw(){
    if(state < 1){
        var player_dx = 0;
        var player_dy = 0;

        if(key_left){
            player_dx -= settings[6];
        }

        if(key_right){
            player_dx += settings[6];
        }

        can_jump = 0;
        var temp_key = 0;

        i = world_dynamic.length - 1;
        do{
            // if current game is still going, move objects
            if(state < 1){
                // x movement
                if(world_dynamic[i][7] != 0){
                    if(world_dynamic[i][0] < world_dynamic[i][5]){
                        world_dynamic[i][7] = Math.abs(world_dynamic[i][7]);

                    }else if(world_dynamic[i][0] > world_dynamic[i][6]
                      && world_dynamic[i][7] > 0){
                        world_dynamic[i][7] = -world_dynamic[i][7];
                    }

                    // if player on moving platform, move player x
                    if(platform === i){
                        player_dx += world_dynamic[i][7];
                    }

                    world_dynamic[i][0] += world_dynamic[i][7];
                }
                // y movement*/
                if(world_dynamic[i][10] != 0){
                    if(world_dynamic[i][1] < world_dynamic[i][8]){
                        world_dynamic[i][10] = Math.abs(world_dynamic[i][10]);

                    }else if(world_dynamic[i][1] > world_dynamic[i][9]
                      && world_dynamic[i][10] > 0){
                        world_dynamic[i][10] = -world_dynamic[i][10];
                    }

                    // if player on moving platform, move player y
                    if(platform === i){
                        player_dy += world_dynamic[i][10];
                    }

                    world_dynamic[i][1] += world_dynamic[i][10];
                }
            }

            // if player is moving or object is moving, check for collision
            if(player_dx != 0
              || player_dy != 0
              || player_y_vel != 0
              || world_dynamic[i][7] != 0
              || world_dynamic[i][10] != 0){
                var temp_object_right_x = world_dynamic[i][0] + world_dynamic[i][2];
                var temp_object_right_y = world_dynamic[i][1] + world_dynamic[i][3];

                // check if player position + movmenet is within bounds of object
                if(!(player_x + player_dx - 20 > temp_object_right_x
                  || player_x + player_dx + 20 < world_dynamic[i][0]
                  || player_y + player_y_vel - 20 > temp_object_right_y
                  || player_y + player_y_vel + 20 < world_dynamic[i][1])
                ){
                    // collide with platform or key-locked wall
                    if(world_dynamic[i][4] === 1 || world_dynamic[i][4] === 's'){

                        // handle collisions with platforms while jumping or falling
                        if(player_y_vel != 0
                          && player_x != world_dynamic[i][0] - 20
                          && player_x != temp_object_right_x + 20){
                            if(player_y_vel > 0){
                                if(player_y + player_y_vel <= world_dynamic[i][1] - 10
                                  && player_y + player_y_vel > world_dynamic[i][1] - 20){
                                    can_jump = 1;
                                    player_y_vel = world_dynamic[i][1] - player_y - 20;
                                    player_dy = 0;

                                    if(world_dynamic[i][7] != 0){
                                        player_dx += world_dynamic[i][7];
                                    }

                                    platform = i;
                                }

                            }else if(player_y + player_y_vel < temp_object_right_y + 20
                              && player_y + player_y_vel >= temp_object_right_y + 10){
                                player_y_vel = temp_object_right_y - player_y + 20;
                            }
                        }

                        // handle collisions with platforms while moving left/right
                        if(platform != i){
                            if(key_left
                              && player_y + 20 > world_dynamic[i][1]
                              && player_y - 20 < temp_object_right_y
                              && player_x != world_dynamic[i][0] - 20
                              && player_x > world_dynamic[i][0]){
                                player_dx = temp_object_right_x - player_x + 20;
                            }

                            if(key_right
                              && player_y + 20 > world_dynamic[i][1]
                              && player_y - 20 < temp_object_right_y
                              && player_x != temp_object_right_x + 20
                              && player_x < world_dynamic[i][0]){
                                player_dx = world_dynamic[i][0] - player_x - 20;
                            }
                        }

                    // collided with booster*/
                    }else if(world_dynamic[i][4] === 4){
                        player_y_vel = world_dynamic[i][11];

                    // collided with green goal
                    }else if(world_dynamic[i][4] === 2){
                        clearInterval(interval);
                        clearInterval(interval_logic);
                        state = 2;

                    // collided with red rectangles
                    }else if(world_dynamic[i][4] === 3){
                        clearInterval(interval);
                        clearInterval(interval_logic);
                        state = 3;

                    // collided with a key
                    }else if(world_dynamic[i][4] === 5){
                        temp_key = i;
                    }
                }
            }
        }while(i--);

        // delete keys and key-locked walls if collided with key
        if(temp_key > 1){
            world_dynamic.splice(temp_key, 1);

            i = world_dynamic.length - 1;
            do{
                if(world_dynamic[i][4] === 's'){
                    world_dynamic.splice(i, 1);
                }
            }while(i--);
        }

        platform = -1;
        player_x += Math.round(player_dx);
        player_y += Math.round(player_dy + player_y_vel);

        if(can_jump){
            if(hop_permission
              && key_jump){
                player_y_vel = settings[2];// jump velocity
                hop_permission = 0;

            }else{
                player_y_vel = 0;
            }

        }else if(player_y_vel < settings[4]){// terminal velocity
            player_y_vel += settings[3];// gravity
        }

        frames += 1;
    }

    if(settings[7]){// clear?
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }

    // draw background colors if level asks for it
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

    // draw buffer_static
    buffer.drawImage(
      document.getElementById('buffer-static'),
      x - player_x + buffer_static_left,
      y - player_y + buffer_static_top
    );

    x_offset = x - player_x;
    y_offset = y - player_y;

    // draw dynamic world objects that aren't in the buffer_static
    i = world_dynamic.length - 1;
    do{
        // only draw objects that are reds, keywalls, keys, or moving
        if(world_dynamic[i][4] == 3
          || world_dynamic[i][4] == 5
          || world_dynamic[i][4] == 's'
          || world_dynamic[i][7] != 0
          || world_dynamic[i][10] != 0){
            // if dynamic object is on screen, draw it
            if(world_dynamic[i][0] + world_dynamic[i][2] + x_offset > 0
              && world_dynamic[i][0] + x_offset < width
              && world_dynamic[i][1] + world_dynamic[i][3] + y_offset > 0
              && world_dynamic[i][1] + y_offset < height){

                // if object has a texture, draw texture. else draw rect
                if(world_dynamic[i][4] > 1
                  && world_dynamic[i][4] < 6){
                    var temp_x = world_dynamic[i][0] + x_offset;
                    var temp_y = world_dynamic[i][1] + y_offset;

                    buffer.translate(
                      temp_x,
                      temp_y
                    );

                    buffer.fillStyle = buffer.createPattern(
                      assets_images[world_dynamic[i][4] - 2],
                      'repeat'
                    );
                    buffer.fillRect(
                      0,
                      0,
                      world_dynamic[i][2],
                      world_dynamic[i][3]
                    );

                    buffer.translate(
                      -temp_x,
                      -temp_y
                    );

                }else{
                    buffer.fillStyle = '#3c3c3c';
                    buffer.fillRect(
                      world_dynamic[i][0] + x_offset,
                      world_dynamic[i][1] + y_offset,
                      world_dynamic[i][2],
                      world_dynamic[i][3]
                    );
                }
            }
        }
    }while(i--);

    // draw player
    buffer.fillStyle = '#090';
    buffer.fillRect(
      x - 20,
      y - 20,
      40,
      40
    );

    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'center';

    // if game is over, draw game over text
    if(state > 0){
        buffer.fillText(
          settings[10] + ' = Restart',
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

    // if tracking frames, draw number of frames
    if(settings[1]){
        buffer.textAlign = 'left';
        buffer.textBaseline = 'top';
        buffer.fillText(
          frames,
          5,
          5
        );
    }

    if(settings[7]){// clear?
        canvas.clearRect(
          0,
          0,
          width,
          height
        );
    }
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );
}

function play_audio(id){
    if(settings[0] > 0){// audio volume
        document.getElementById(id).currentTime = 0;
        document.getElementById(id).play();
    }
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('clear').checked = 1;
        document.getElementById('gravity').value = .5;
        document.getElementById('jump-speed').value = -10;
        document.getElementById('key-jump').value = 'W';
        document.getElementById('keys-move').value = 'AD';
        document.getElementById('key-restart').value = 'H';
        document.getElementById('ms-per-frame').value = 25;
        document.getElementById('speed').value = 4;
        document.getElementById('terminal-velocity').value = 9;
        document.getElementById('time-display').checked = 1;
        save();
    }
}

function resize(){
    if(mode > 0){
        height = window.innerHeight;
        document.getElementById('buffer').height = height;
        document.getElementById('canvas').height = height;
        y = height / 2;

        width = window.innerWidth;
        document.getElementById('buffer').width = width;
        document.getElementById('canvas').width = width;
        x = width / 2;

        // if game is over, draw if resized
        if(state > 0){
            draw();
        }
    }
}

function save(){
    i = 6;
    do{
        j = [
          'audio-volume',
          'time-display',
          'jump-speed',
          'gravity',
          'terminal-velocity',
          'ms-per-frame',
          'speed'
        ][i];

        if(isNaN(document.getElementById(j).value)
          || document.getElementById(j).value === [1, 1, -10, .5, 9, 25, 4][i]){
            window.localStorage.removeItem('platform-' + i);
            settings[i] = [
              1,
              1,
              -10,
              .5,
              9,
              25,
              4
            ][i];
            document.getElementById(j).value = settings[i];

        }else{
            settings[i] = parseFloat(document.getElementById(j).value);
            window.localStorage.setItem(
              'platform-' + i,
              settings[i]
            );
        }
    }while(i--);

    i = 1;
    do{
        settings[[1, 7][i]] = document.getElementById(['time-display', 'clear'][i]).checked;
        if(settings[[1, 7][i]]){
            window.localStorage.removeItem('platform-' + [1, 7][i]);

        }else{
            window.localStorage.setItem(
              'platform-' + [1, 7][i],
              0
            );
        }
    }while(i--);

    i = 2;
    do{
        if(document.getElementById(['key-jump', 'keys-move', 'key-restart'][i]).value === ['W', 'AD', 'H'][i]){
            window.localStorage.removeItem('platform-' + (i + 8));
            settings[i + 8] = [
              'W',
              'AD',
              'H'
            ][i];

        }else{
            settings[i + 8] = document.getElementById(['key-jump', 'keys-move', 'key-restart'][i]).value;
            window.localStorage.setItem(
              'platform-' + (i + 8),
              settings[i + 8]
            );
        }
    }while(i--);
}

function setmode(newmode, newgame){
    clearInterval(interval);
    clearInterval(interval_logic);

    mode = newmode;

    // new game mode
    if(mode > 0){
        frames = 0;

        key_left = 0;
        key_right = 0;
        key_jump = 0;

        player_x = 0;
        player_y = 0;
        player_y_vel = 0;

        state = 0;

        if(newgame){
            save();
            document.getElementById('page').innerHTML = '<canvas id=canvas></canvas>';
            buffer = document.getElementById('buffer').getContext('2d');
            buffer_static = document.getElementById('buffer-static').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');
            resize();
        }

        load_level(mode - 5);

        update_static_buffer();

        interval = setInterval(
          'draw()',
          settings[5]
        );

    // main menu mode
    }else{
        buffer = 0;
        buffer_static = 0;
        canvas = 0;

        world_dynamic.length = 0;
        world_static.length = 0;
        world_text.length = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Platform-2D</b></div><hr><div class=c><ul><li><a onclick=setmode(3,1)>Generate Random Level</a><li><a onclick=setmode(4,1)>Randomized Lava Corridor</a></ul></div><hr><div class=c><ul><li><a onclick=setmode(5,1)>A Pit of Your Design</a><li><a onclick=setmode(6,1)>Booster Towers</a><li><a onclick=setmode(7,1)>Keys of a Father</a><li><a onclick=setmode(8,1)>Tutorial Island</a><li><a onclick=setmode(9,1)>Village of the Wolves</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input id=key-jump maxlength=1 value='
          + settings[8] + '>Jump<br><input disabled style=border:0 value=ESC>Main Menu<br><input id=keys-move maxlength=2 value='
          + settings[9] + '>Move ←→<br><input id=key-restart maxlength=1 value='
          + settings[10] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings[0] + '>Audio<br><label><input '
          + (settings[7] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=gravity value='
          + settings[3] + '>Gravity<br><input id=jump-speed value='
          + settings[2] + '>Jump Speed<br><input id=ms-per-frame value='
          + settings[5] + '>ms/Frame<br><input id=speed value='
          + settings[6] + '>Speed<br><input id=terminal-velocity value='
          + settings[4] + '>Terminal Velocity<br><label><input'
          + (settings[1] ? ' checked' : '') + ' id=time-display type=checkbox>Time</label><br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

function update_static_buffer(){
    buffer_static_left = 0;
    buffer_static_top = 0;
    var temp_bottom = 0;
    var temp_right = 0;

    // determine limits required to hold certain dynamic objects
    i = world_dynamic.length - 1;
    if(i >= 0){
        do{
            // only check objects that aren't reds, keywalls, keys, or moving
            if(world_dynamic[i][4] != 3
              && world_dynamic[i][4] != 5
              && world_dynamic[i][4] != 's'
              && world_dynamic[i][7] == 0
              && world_dynamic[i][10] == 0){
                // check if object is leftmost object so far
                if(world_dynamic[i][0] < buffer_static_left){
                    buffer_static_left = world_dynamic[i][0];
                }

                // check if object is rightmost object so far
                if(world_dynamic[i][0] + world_dynamic[i][2] > temp_right){
                    temp_right = world_dynamic[i][0] + world_dynamic[i][2];
                }

                // check if object is topmost object so far
                if(world_dynamic[i][1] < buffer_static_top){
                    buffer_static_top = world_dynamic[i][1];
                }

                // check if object is bottommost object so far
                if(world_dynamic[i][1] + world_dynamic[i][3] > temp_bottom){
                    temp_bottom = world_dynamic[i][1] + world_dynamic[i][3];
                }
            }
        }while(i--);
    }

    // determine limits required to hold static objects
    i = world_static.length - 1;
    if(i >= 0){
        do{
            // check if object is leftmost object so far
            if(world_static[i][0] < buffer_static_left){
                buffer_static_left = world_static[i][0];
            }

            // check if object is rightmost object so far
            if(world_static[i][0] + world_static[i][2] > temp_right){
                temp_right = world_static[i][0] + world_static[i][2];
            }

            // check if object is topmost object so far
            if(world_static[i][1] < buffer_static_top){
                buffer_static_top = world_static[i][1];
            }

            // check if object is bottommost object so far
            if(world_static[i][1] + world_static[i][3] > temp_bottom){
                temp_bottom = world_static[i][1] + world_static[i][3];
            }
        }while(i--);
    }

    // calculate minimum width of buffer_static canvas, set and clear
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

    // translate to top left of canvas to simplify drawing code
    buffer_static.translate(
      -buffer_static_left,
      -buffer_static_top
    );

    // add static world objects to the buffer_static
    i = world_static.length - 1;
    if(i >= 0){
        do{
            buffer_static.fillStyle = 'rgb('
              + world_static[i][4] + ', '
              + world_static[i][5] + ', '
              + world_static[i][6] + ')';
            buffer_static.fillRect(
              world_static[i][0],
              world_static[i][1],
              world_static[i][2],
              world_static[i][3]
            );
        }while(i--);
    }

    // add certain dynamic world objects to the buffer_static
    i = world_dynamic.length - 1;
    do{
        // only check objects that aren't reds, keywalls, keys, or moving
        if(world_dynamic[i][4] != 3
         && world_dynamic[i][4] != 5
         && world_dynamic[i][4] != 's'
         && world_dynamic[i][7] == 0
         && world_dynamic[i][10] == 0){

            // if object has a texture, draw texture. else draw rect
            if(world_dynamic[i][4] > 1
             && world_dynamic[i][4] < 6){
                buffer_static.translate(
                  world_dynamic[i][0],
                  world_dynamic[i][1]
                );

                buffer_static.fillStyle = buffer_static.createPattern(
                  assets_images[world_dynamic[i][4] - 2],
                  'repeat'
                );
                buffer_static.fillRect(
                  0,
                  0,
                  world_dynamic[i][2],
                  world_dynamic[i][3]
                );

                buffer_static.translate(
                  -world_dynamic[i][0],
                  -world_dynamic[i][1]
                );
            }else{
                buffer_static.fillStyle = '#3c3c3c';
                buffer_static.fillRect(
                  world_dynamic[i][0],
                  world_dynamic[i][1],
                  world_dynamic[i][2],
                  world_dynamic[i][3]
                );
            }
        }
    }while(i--);

    // add world text to buffer_static
    i = world_text.length-1;
    if(i >= 0){
        buffer_static.fillStyle = '#fff';
        buffer_static.font = '23pt sans-serif';
        buffer_static.textAlign = 'center';
        buffer_static.textBaseline = 'top';

        do{
            buffer_static.fillText(
              world_text[i][0],
              world_text[i][1],
              world_text[i][2]
            );
        }while(i--);
    }
}

var assets_images = [
  new Image(),
  new Image(),
  new Image(),
  new Image()
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
var can_jump = 0;
var frames = 0;
var height = 0;
var hop_permission = 1;
var i = 0;
var interval = 0;
var interval_logic = 0;
var j = 0;
var key_left = 0;
var key_right = 0;
var key_jump = 0;
var mode = 0;
var platform = -1;
var player_x = 0;
var player_y = 0;
var player_y_vel = 0;
var settings = [
  window.localStorage.getItem('platform-0') === null
    ? 1
    : parseFloat(window.localStorage.getItem('platform-0')),// audio volume
  window.localStorage.getItem('platform-1') === null,// track frames
  window.localStorage.getItem('platform-2') === null
    ? -10
    : parseFloat(window.localStorage.getItem('platform-2')),// jump speed
  window.localStorage.getItem('platform-3') === null
    ? .5
    : parseFloat(window.localStorage.getItem('platform-3')),// gravity
  window.localStorage.getItem('platform-4') === null
    ? 9
    : parseFloat(window.localStorage.getItem('platform-4')),// terminal velocity
  window.localStorage.getItem('platform-5') === null
    ? 25
    : parseInt(window.localStorage.getItem('platform-5')),// milliseconds per frame
  window.localStorage.getItem('platform-6') === null
    ? 4
    : parseFloat(window.localStorage.getItem('platform-6')),// movement speed
  window.localStorage.getItem('platform-7') === null,// clear?
  window.localStorage.getItem('platform-8') === null
    ? 'W'
    : window.localStorage.getItem('platform-8'),// jump key
  window.localStorage.getItem('platform-9') === null
    ? 'AD'
    : window.localStorage.getItem('platform-9'),// movement keys
  window.localStorage.getItem('platform-10') === null
    ? 'H'
    : window.localStorage.getItem('platform-10')// restart key
];
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
    if(mode > 0){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        if(key === 27){// ESC
            setmode(0, 1);

        }else{
            key = String.fromCharCode(key);
            if(key === settings[9][0]){
                key_left = 1;

            }else if(key === settings[9][1]){
                key_right = 1;

            }else if(key === settings[8]){
                key_jump = 1;

            }else if(key === settings[10]){
                setmode(mode, 0);
            }
        }
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key === settings[9][0]){
        key_left = 0;

    }else if(key === settings[9][1]){
        key_right = 0;

    }else if(key === settings[8]){
        key_jump = 0;
        hop_permission = 1;
    }
};

window.onresize = resize;
