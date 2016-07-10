'use strict';

function draw_logic(){
    x_offset = x - player['x'];
    y_offset = y - player['y'];

    /*
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
    */

    // Draw static world objects.
    var loop_counter = world_static.length - 1;
    if(loop_counter >= 0){
        do{
            // Only draw objects that aren't on the buffer
            //   and are on the screen.
            if(world_static[loop_counter]['x'] + world_static[loop_counter]['width'] + x_offset <= 0
              || world_static[loop_counter]['x'] + x_offset >= width
              || world_static[loop_counter]['y'] + world_static[loop_counter]['height'] + y_offset <= 0
              || world_static[loop_counter]['y'] + y_offset >= height){
                continue;
            }

            buffer.fillStyle = 'rgb('
              + world_static[loop_counter]['red'] + ', '
              + world_static[loop_counter]['green'] + ', '
              + world_static[loop_counter]['blue'] + ')';
            buffer.fillRect(
              world_static[loop_counter]['x'] + x_offset,
              world_static[loop_counter]['y'] + y_offset,
              world_static[loop_counter]['width'],
              world_static[loop_counter]['height']
            );
        }while(loop_counter--);
    }

    // Draw world text.
    buffer.fillStyle = '#fff';
    buffer.font = fonts['medium'];

    for(var text in world_text){
        buffer.textAlign = world_text[text]['textAlign'] || 'left';
        buffer.fillText(
          world_text[text]['text'],
          world_text[text]['x'] + x_offset,
          world_text[text]['y'] + y_offset
        );
    }

    var loop_counter = world_dynamic.length - 1;
    do{
        // Only draw objects that aren't on the buffer
        //   and are on the screen.
        if(world_dynamic[loop_counter]['x'] + world_dynamic[loop_counter]['width'] + x_offset <= 0
          || world_dynamic[loop_counter]['x'] + x_offset >= width
          || world_dynamic[loop_counter]['y'] + world_dynamic[loop_counter]['height'] + y_offset <= 0
          || world_dynamic[loop_counter]['y'] + y_offset >= height){
            continue;
        }

        // If object has a texture, draw texture. else draw rect.
        if(world_dynamic[loop_counter]['type'] > 1
          && world_dynamic[loop_counter]['type'] < 6){
            var temp_x = world_dynamic[loop_counter]['x'] + x_offset;
            var temp_y = world_dynamic[loop_counter]['y'] + y_offset;

            // Save current buffer state.
            buffer.save();

            // Translate to object location.
            buffer.translate(
              temp_x,
              temp_y
            );

            buffer.fillStyle = buffer.createPattern(
              assets_images[world_dynamic[loop_counter]['type'] - 2],
              'repeat'
            );
            buffer.fillRect(
              0,
              0,
              world_dynamic[loop_counter]['width'],
              world_dynamic[loop_counter]['height']
            );

            // Restore buffer state.
            buffer.restore();

        }else{
            buffer.fillStyle = '#3c3c3c';
            buffer.fillRect(
              world_dynamic[loop_counter]['x'] + x_offset,
              world_dynamic[loop_counter]['y'] + y_offset,
              world_dynamic[loop_counter]['width'],
              world_dynamic[loop_counter]['height']
            );
        }
    }while(loop_counter--);

    // Draw player.
    buffer.fillStyle = settings_settings['color'];
    buffer.fillRect(
      x - 20,
      y - 20,
      40,
      40
    );

    // Draw UI text.
    buffer.fillStyle = '#fff';
    buffer.textAlign = 'left';

    // If tracking frames, draw number of frames.
    if(settings_settings['time-display']){
        buffer.fillText(
          frame_counter,
          5,
          25
        );
    }

    // If game is over, draw game over text.
    if(state > 0){
        buffer.fillText(
          settings_settings['restart-key'] + ' = Restart',
          5,
          100
        );
        buffer.fillText(
          'ESC = Main Menu',
          5,
          125
        );

        buffer.font = fonts['big'];
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
}

function logic(){
    if(state >= 1){
        return;
    }

    var player_dx = 0;
    var player_dy = 0;

    if(key_left){
        player_dx -= settings_settings['speed'];
    }

    if(key_right){
        player_dx += settings_settings['speed'];
    }

    var can_jump = false;
    var temp_key = 0;

    var loop_counter = world_dynamic.length - 1;
    do{
        // X movement.
        if(world_dynamic[loop_counter]['x-speed'] !== void 0){
            if(world_dynamic[loop_counter]['x'] < world_dynamic[loop_counter]['x-target-min']){
                world_dynamic[loop_counter]['x-speed'] = Math.abs(world_dynamic[loop_counter]['x-speed']);

            }else if(world_dynamic[loop_counter]['x'] > world_dynamic[loop_counter]['x-target-max']
              && world_dynamic[loop_counter]['x-speed'] > 0){
                world_dynamic[loop_counter]['x-speed'] = -world_dynamic[loop_counter]['x-speed'];
            }

            world_dynamic[loop_counter]['x'] += world_dynamic[loop_counter]['x-speed'];
        }

        // Y movement.
        if(world_dynamic[loop_counter]['y-speed'] !== void 0){
            if(world_dynamic[loop_counter]['y'] < world_dynamic[loop_counter]['y-target-min']){
                world_dynamic[loop_counter]['y-speed'] = Math.abs(world_dynamic[loop_counter]['y-speed']);

            }else if(world_dynamic[loop_counter]['y'] > world_dynamic[loop_counter]['y-target-max']
              && world_dynamic[loop_counter]['y-speed'] > 0){
                world_dynamic[loop_counter]['y-speed'] = -world_dynamic[loop_counter]['y-speed'];
            }

            world_dynamic[loop_counter]['y'] += world_dynamic[loop_counter]['y-speed'];
        }

        // If player and object aren't moving, no collision checks.
        if(player_dx === 0
          && player_dy === 0
          && player['y-velocity'] === 0
          && world_dynamic[loop_counter]['x-speed'] === void 0
          && world_dynamic[loop_counter]['y-speed'] === void 0){
            continue;
        }

        var temp_object_right_x = world_dynamic[loop_counter]['x'] + world_dynamic[loop_counter]['width'];
        var temp_object_right_y = world_dynamic[loop_counter]['y'] + world_dynamic[loop_counter]['height'];

        // Check if player position + movement is within bounds of object.
        if(player['x'] + player_dx - 20 > temp_object_right_x
          || player['x'] + player_dx + 20 < world_dynamic[loop_counter]['x']
          || player['y'] + player['y-velocity'] - 20 > temp_object_right_y
          || player['y'] + player['y-velocity'] + 20 < world_dynamic[loop_counter]['y']){
            continue;
        }

        // Collide with platform or key-locked wall.
        if(world_dynamic[loop_counter]['type'] === 1
          || world_dynamic[loop_counter]['type'] === 's'){
            // Handle collisions with platforms while jumping or falling.
            if(player['y-velocity'] !== 0
              && player['x'] !== world_dynamic[loop_counter]['x'] - 20
              && player['x'] !== temp_object_right_x + 20){
                if(player['y-velocity'] > 0){
                    if(player['y'] + player['y-velocity'] <= world_dynamic[loop_counter]['y'] - 10
                      && player['y'] + player['y-velocity'] > world_dynamic[loop_counter]['y'] - 20){
                        can_jump = true;
                        player['y-velocity'] = world_dynamic[loop_counter]['y'] - player['y'] - 20;
                        player_dy = 0;

                        if(world_dynamic[loop_counter]['x-speed'] !== void 0){
                            player_dx += world_dynamic[loop_counter]['x-speed'];
                        }
                    }

                }else if(player['y'] + player['y-velocity'] < temp_object_right_y + 20
                  && player['y'] + player['y-velocity'] >= temp_object_right_y + 10){
                    player['y-velocity'] = temp_object_right_y - player['y'] + 20;
                }
            }

            // Handle collisions with platforms while moving left/right.
            if(key_left
              && player['y'] + 20 > world_dynamic[loop_counter]['y']
              && player['y'] - 20 < temp_object_right_y
              && player['x'] !== world_dynamic[loop_counter]['x'] - 20
              && player['x'] > world_dynamic[loop_counter]['x']){
                player_dx = temp_object_right_x - player['x'] + 20;
            }

            if(key_right
              && player['y'] + 20 > world_dynamic[loop_counter]['y']
              && player['y'] - 20 < temp_object_right_y
              && player['x'] !== temp_object_right_x + 20
              && player['x'] < world_dynamic[loop_counter]['x']){
                player_dx = world_dynamic[loop_counter]['x'] - player['x'] - 20;
            }

        // Collided with booster.
        }else if(world_dynamic[loop_counter]['type'] === 4){
            player['y-velocity'] = world_dynamic[loop_counter]['boost'];

        // Collided with green goal.
        }else if(world_dynamic[loop_counter]['type'] === 2){
            window.clearInterval(interval);
            window.clearInterval(interval_logic);
            state = 2;

        // Collided with red rectangles.
        }else if(world_dynamic[loop_counter]['type'] === 3){
            window.clearInterval(interval);
            window.clearInterval(interval_logic);
            state = 3;

        // Collided with a key.
        }else if(world_dynamic[loop_counter]['type'] === 5){
            temp_key = loop_counter;
        }
    }while(loop_counter--);

    // Delete keys and key-locked walls if collided with key.
    if(temp_key > 1){
        world_dynamic.splice(temp_key, 1);

        loop_counter = world_dynamic.length - 1;
        do{
            if(world_dynamic[loop_counter]['type'] === 's'){
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
            player['y-velocity'] = settings_settings['jump-speed'];
            jump_permission = false;

        }else{
            player['y-velocity'] = 0;
        }

    }else{
        player['y-velocity'] = Math.min(
          player['y-velocity'] + settings_settings['gravity'],
          settings_settings['terminal-velocity']
        );
    }

    frame_counter += 1;
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function resize_logic(){
    // If game is over, draw if resized.
    if(state > 0){
        draw();
    }
}

function setmode_logic(newgame){
    window.clearInterval(interval_logic);

    world_dynamic.length = 0;
    world_static.length = 0;
    world_text.length = 0;

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick=setmode(3,true)>Generate Random Level</a><br>'
          + '<a onclick=setmode(4,true)>Randomized Lava Corridor</a></div><hr>'
          + '<div><a onclick="setmode(5, true)">A Pit of Your Design</a><br>'
          + '<a onclick=setmode(6,true)>Booster Towers</a><br>'
          + '<a onclick=setmode(7,true)>Tutorial Island</a><br>'
          + '<a onclick=setmode(8,true)>Village of the Wolves</a><br>'
          + '<a onclick=setmode(9,true)>Yellow Keys</a></div></div>'
          + '<div class=right><div><input id=jump-key maxlength=1>Jump<br>'
          + '<input disabled value=ESC>Main Menu<br>'
          + '<input id=movement-keys maxlength=2>Move ←→<br>'
          + '<input id=restart-key maxlength=1>Restart</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=color type=color>Color<br>'
          + '<input id=gravity>Gravity<br>'
          + '<input id=jump-speed>Jump Speed<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=speed>Speed<br>'
          + '<input id=terminal-velocity>Terminal Velocity<br>'
          + '<label><input id=time-display type=checkbox>Time</label><br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        frame_counter = 0;

        key_jump = false;
        key_left = false;
        key_right = false;

        player = {
          'x': 0,
          'y': 0,
          'y-velocity': 0,
        },

        state = 0;

        if(newgame){
            settings_save();
        }
    }
}

var assets_images = [
  new_image('../common/images/goal.png'),
  new_image('../common/images/red.png'),
  new_image('../common/images/boost.png'),
  new_image('../common/images/key.png'),
];
var frame_counter = 0;
var interval_logic = 0;
var jump_permission = true;
var key_left = false;
var key_right = false;
var key_jump = false;
var player = {};
var state = 0;
var world_background = [];
var world_dynamic = [];
var world_static = [];
var world_text = [];
var x_offset = 0;
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

    if(key === settings_settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings_settings['jump-key']){
        key_jump = true;

    }else if(key === settings_settings['restart-key']){
        setmode(
          mode,
          false
        );
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings_settings['jump-key']){
        key_jump = false;
        jump_permission = true;
    }
};

window.onload = function(e){
    settings_init(
      'Platform-2D.htm-',
      {
        'audio-volume': 1,
        'color': '#009900',
        'gravity': .5,
        'jump-key': 'W',
        'jump-speed': -10,
        'movement-keys': 'AD',
        'ms-per-frame': 25,
        'speed': 4,
        'restart-key': 'H',
        'terminal-velocity': 9,
        'time-display': true,
      }
    );
    init_canvas();
};
