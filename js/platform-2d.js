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
        var temp_player_x = player_x + player_dx;
        var temp_player_y = player_y + player_y_vel;

        i = world_dynamic.length - 1;
        do{
            /* if current game is still going, move objects */
            if(state < 1){
                /* x movement */
                if(world_dynamic[i][7] != 0){
                    if(world_dynamic[i][0] < world_dynamic[i][5]){
                        world_dynamic[i][7] = Math.abs(world_dynamic[i][7]);
                    }else if(world_dynamic[i][0] > world_dynamic[i][6] && world_dynamic[i][7] > 0){
                        world_dynamic[i][7] = -world_dynamic[i][7];
                    }

                    /* if player on moving platform, move player x */
                    if(platform === i){
                        player_dx += world_dynamic[i][7];
                    }

                    world_dynamic[i][0] += world_dynamic[i][7];
                }
                /* y movement*/
                if(world_dynamic[i][10] != 0){
                    if(world_dynamic[i][1] < world_dynamic[i][8]){
                        world_dynamic[i][10] = Math.abs(world_dynamic[i][10]);
                    }else if(world_dynamic[i][1] > world_dynamic[i][9] && world_dynamic[i][10] > 0){
                        world_dynamic[i][10] = -world_dynamic[i][10];
                    }

                    /* if player on moving platform, move player y */
                    if(platform === i){
                        player_dy += world_dynamic[i][10];
                    }

                    world_dynamic[i][1] += world_dynamic[i][10];
                }
            }

            /* if player is moving or object is moving, check for collision */
            if(player_dx != 0
             || player_dy != 0
             || player_y_vel != 0
             || world_dynamic[i][7] != 0
             || world_dynamic[i][10] != 0){
                var temp_object_right_x = world_dynamic[i][0] + world_dynamic[i][2];
                var temp_object_right_y = world_dynamic[i][1] + world_dynamic[i][3];

                /* check if player position + movmenet is within bounds of object */
                if(!(temp_player_x - 20 > temp_object_right_x
                    || temp_player_x + 20 < world_dynamic[i][0]
                    || temp_player_y - 20 > temp_object_right_y
                    || temp_player_y + 20 < world_dynamic[i][1])
                  ){
                    /* collide with platform or key-locked wall */
                    if(world_dynamic[i][4] === 1 || world_dynamic[i][4] === 's'){

                        /* handle collisions with platforms while jumping or falling */
                        if(player_y_vel != 0
                         && player_x != world_dynamic[i][0] - 20
                         && player_x != temp_object_right_x + 20){
                            if(player_y_vel > 0){
                                if(temp_player_y <= world_dynamic[i][1]-10 && temp_player_y > world_dynamic[i][1] - 20){
                                    can_jump = 1;
                                    player_y_vel = world_dynamic[i][1] - player_y - 20;
                                    player_dy = 0;
                                    temp_player_y = player_y + player_y_vel;

                                    if(world_dynamic[i][7] != 0){
                                        player_dx += world_dynamic[i][7];
                                    }

                                    platform = i;
                                }
                            }else if(temp_player_y < temp_object_right_y + 20 && temp_player_y >= temp_object_right_y + 10){
                                player_y_vel = temp_object_right_y - player_y + 20;
                                temp_player_y = player_y + player_y_vel;
                            }
                        }

                        /* handle collisions with platforms while moving left/right */
                        if(platform != i){
                            if(key_left && !key_right
                             && player_y + 20 > world_dynamic[i][1]
                             && player_y - 20 < temp_object_right_y
                             && player_x != world_dynamic[i][0] - 20
                             && player_x > world_dynamic[i][0]){
                                player_dx = temp_object_right_x - player_x + 20;
                                temp_player_x = player_x + player_dx;
                            }
                            if(key_right && !key_left
                             && player_y + 20 > world_dynamic[i][1]
                             && player_y - 20 < temp_object_right_y
                             && player_x != temp_object_right_x + 20
                             && player_x < world_dynamic[i][0]){
                                player_dx = world_dynamic[i][0] - player_x - 20;
                                temp_player_x = player_x + player_dx;
                            }
                        }

                    /* collided with booster*/
                    }else if(world_dynamic[i][4] === 4){
                        player_y_vel = world_dynamic[i][11];

                    /* collided with green goal */
                    }else if(world_dynamic[i][4] === 2){
                        clearInterval(interval);
                        state = 2;

                    /* collided with red rectangles */
                    }else if(world_dynamic[i][4] === 3){
                        clearInterval(interval);
                        state = 3;

                    /* collided with a key */
                    }else if(world_dynamic[i][4] === 5){
                        temp_key = i;
                    }
                }
            }
        }while(i--);

        /* delete keys and key-locked walls if collided with key */
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
            if(hop_permission && key_jump){
                player_y_vel = settings[2];/* jump velocity */
                hop_permission = 0;
            }else{
                player_y_vel = 0;
            }
        }else if(player_y_vel < settings[4]){/* terminal velocity */
            player_y_vel += settings[3];/* gravity */
        }

        frames += 1;
    }

    if(settings[7]){/* clear? */
        buffer.clearRect(
            0,
            0,
            width,
            height
        );
    }

    x_offset = x - player_x;
    y_offset = y - player_y;

    i = world_static.length - 1;
    if(i >= 0){
        do{
            /* if static object is on screen, draw it */
            if(world_static[i][0] + world_static[i][2] + x_offset > 0
             && world_static[i][0] + x_offset < width
             && world_static[i][1] + world_static[i][3] + y_offset > 0
             && world_static[i][1] + y_offset < height){
                buffer.fillStyle = 'rgb(' + world_static[i][4] + ',' + world_static[i][5] + ',' + world_static[i][6] + ')';
                buffer.fillRect(
                    world_static[i][0] + x_offset,
                    world_static[i][1] + y_offset,
                    world_static[i][2],
                    world_static[i][3]
                );
            }
        }while(i--);
    }

    i = world_dynamic.length - 1;
    do{
        /* if dynamic object is on screen, draw it */
        if(world_dynamic[i][0] + world_dynamic[i][2] + x_offset > 0
         && world_dynamic[i][0] + x_offset < width
         && world_dynamic[i][1] + world_dynamic[i][3] + y_offset > 0
         && world_dynamic[i][1] + y_offset < height){

            /* if object has a texture, draw texture. else draw rect */
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
    }while(i--);

    /* draw player */
    buffer.fillStyle = '#fff';
    buffer.fillRect(
        x - 20,
        y - 20,
        40,
        40
    );

    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'center';
    buffer.textBaseline = 'top';

    /* if game is over, draw game over text */
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
        buffer.fillStyle = state === 2 ? '#2d8930' : '#e02d30';
        buffer.fillText(
            state === 2 ? 'Level Complete! ☺' : 'You Failed! ☹',
            x,
            y / 2
        );

    /* if game is running, draw world text */
    }else{
        i = world_text.length-1;
        if(i >= 0){
            do{
                if(world_text[i][1] + x_offset > 0
                 && world_text[i][1] + x_offset < width
                 && world_text[i][2] + y_offset > 0
                 && world_text[i][2] + y_offset < height){
                    buffer.fillText(
                        world_text[i][0],
                        world_text[i][1] + x_offset,
                        world_text[i][2] + y_offset
                    );
                }
            }while(i--);
        }
    }

    /* if tracking frames, draw number of frames */
    if(settings[1]){
        buffer.textAlign = 'left';
        buffer.fillText(
            frames,
            5,
            5
        );
    }

    if(settings[7]){/* clear? */
        canvas.clearRect(
            0,
            0,
            width,
            height
        );
    }
    canvas.drawImage(
        get('buffer'),
        0,
        0
    );
}

function get(i){
    return document.getElementById(i);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function play_audio(i){
    if(settings[0] > 0){/* audio volume */
        get(i).currentTime=0;
        get(i).play();
    }
}

function resize(){
    if(mode > 0){
        width = get('buffer').width = get('canvas').width = window.innerWidth;
        height = get('buffer').height = get('canvas').height = window.innerHeight;

        x = width/2;
        y = height/2;
    }
}

function save(){
    i = 6;
    do{
        j = [
            'sv',
            'tz',
            'jv',
            'gg',
            'tv',
            'si',
            'sp'
        ][i];
        if(isNaN(get(j).value) || get(j).value === [1, 1, -10, .5, 9, 25, 4][i]){
            ls.removeItem('platform-' + i);
            settings[i] = [
                1,
                1,
                -10,
                .5,
                9,
                25,
                4
            ][i];
            get(j).value = settings[i];
        }else{
            settings[i] = parseFloat(get(j).value);
            ls.setItem(
                'platform-' + i,
                settings[i]
            );
        }
    }while(i--);

    i = 1;
    do{
        settings[[1, 7][i]] = get(['tz', 'cl'][i]).checked;
        if(settings[[1, 7][i]]){
            ls.removeItem('platform-' + [1, 7][i]);
        }else{
            ls.setItem(
                'platform-' + [1, 7][i],
                0
            );
        }
    }while(i--);

    i = 2;
    do{
        if(get(['kj', 'km', 'kr'][i]).value === ['W', 'AD', 'H'][i]){
            ls.removeItem('platform-' + (i + 8));
            settings[i + 8] = [
                'W',
                'AD',
                'H'
            ][i];
        }else{
            settings[i + 8] = get(['kj', 'km', 'kr'][i]).value;
            ls.setItem(
                'platform-' + (i + 8),
                settings[i + 8]
            );
        }
    }while(i--);
}

function setmode(newmode, newgame){
    clearInterval(interval);

    mode = newmode;

    /* new game mode */
    if(mode > 0){
        if(newgame){
            save();
        }

        frames=0;

        key_left=0;
        key_right=0;
        key_jump=0;

        player_x=0;
        player_y=0;
        player_y_vel=0;

        state=0;

        if(newgame){
            get('page').innerHTML='<canvas id=canvas></canvas>';
        }

        load_level(mode - 4);

        if(newgame){
            buffer = get('buffer').getContext('2d');
            canvas = get('canvas').getContext('2d');
            resize();
        }

        interval = setInterval('draw()', settings[5]);

    /* main menu mode */
    }else{
        buffer = 0;
        canvas = 0;

        world_dynamic = [];
        world_static = [];
        world_text = [];

        get('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Platform-2D</b></div><hr><div class=c><a onclick=setmode(3,1)>Generate Random Level</a></div><hr><div class=c><a onclick=setmode(4,1)>A Pit of Your Design</a><br><a onclick=setmode(5,1)>Booster Towers</a><br><a onclick=setmode(6,1)>Keys of a Father</a><br><a onclick=setmode(7,1)>Tutorial Island</a><br><a onclick=setmode(8,1)>Village of the Wolves</a></div><hr><div class=c><label><input'
            + (settings[1] ? ' checked' : '') + ' id=tz type=checkbox>Time</label></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input id=kj maxlength=1 size=3 type=text value='
            + settings[8] + '>Jump<br><input disabled size=3 style=border:0 type=text value=ESC>Main Menu<br><input id=km maxlength=2 size=3 type=text value='
            + settings[9] + '>Move ←→<br><input id=kr maxlength=1 size=3 type=text value='
            + settings[10] + '>Restart</div><hr><div class=c><input id=sv max=1 min=0 step=.01 type=range value='
            + settings[0] + '>Audio<br><label><input '
            + (settings[7] ? 'checked ' : '') + 'id=cl type=checkbox>Clear</label><br><a onclick="if(confirm(\'Reset settings?\')){get(\'cl\').checked=get(\'sv\').value=get(\'tz\').checked=1;get(\'gg\').value=.5;get(\'kj\').value=\'W\';get(\'km\').value=\'AD\';get(\'kr\').value=\'H\';get(\'jv\').value=-10;get(\'si\').value=25;get(\'sp\').value=4;get(\'tv\').value=9;save();setmode(0,1)}">Reset Settings</a><br><a onclick="get(\'hz\').style.display=get(\'hz\').style.display===\'none\'?\'inline\':\'none\'">Hack</a><span id=hz style=display:none><br><br><input id=gg size=1 type=text value='
            + settings[3] + '>Gravity<br><input id=jv size=1 type=text value='
            + settings[2] + '>Jump Speed<br><input id=si size=1 type=text value='
            + settings[5] + '>ms/Frame<br><input id=sp size=1 type=text value='
            + settings[6] + '>Speed<br><input id=tv size=1 type=text value='
            + settings[4] + '>Terminal Velocity</span></div></div>';
    }
}

var assets_images = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];
var buffer = 0;
var canvas = 0;
var can_jump = 0;
var frames = 0;
var height = 0;
var hop_permission = 1;
var i = 3;
var interval = 0;
var j = 0;
var key_left = 0;
var key_right = 0;
var key_jump = 0;
var ls = window.localStorage;
var mode = 0;
var platform = -1;
var player_x = 0;
var player_y = 0;
var player_y_vel = 0;
var settings = [
    ls.getItem('platform-0') === null ? 1 : parseFloat(ls.getItem('platform-0')),/* audio volume */
    ls.getItem('platform-1') === null,/* track frames */
    ls.getItem('platform-2') === null ? -10 : parseFloat(ls.getItem('platform-2')),/* jump speed */
    ls.getItem('platform-3') === null ? .5 : parseFloat(ls.getItem('platform-3')),/* gravity */
    ls.getItem('platform-4') === null ? 9 : parseFloat(ls.getItem('platform-4')),/* terminal velocity */
    ls.getItem('platform-5') === null ? 25 : parseInt(ls.getItem('platform-5')),/* milliseconds per frame */
    ls.getItem('platform-6') === null ? 4 : parseFloat(ls.getItem('platform-6')),/* movement speed */
    ls.getItem('platform-7') === null,/* clear? */
    ls.getItem('platform-8') === null ? 'W' : ls.getItem('platform-8'),/* jump key */
    ls.getItem('platform-9') === null ? 'AD' : ls.getItem('platform-9'),/* movement keys */
    ls.getItem('platform-10') === null ? 'H' : ls.getItem('platform-10')/* restart key */
];
var state = 0;
var width = 0;
var world_dynamic = [];
var world_static = [];
var world_text = [];
var x = 0;
var x_offset = 0;
var y = 0;
var y_offset = 0;

do{
    assets_images[i].src = 'assets/' + ['goal', 'red', 'boost', 'key'][i] + '.png';
}while(i--);

setmode(0, 1);

window.onkeydown = function(e){
    if(mode > 0){
        i = window.event ? event : e;
        i = i.charCode ? i.charCode : i.keyCode;

        if(String.fromCharCode(i) === settings[9][0]){
            key_left = 1;

        }else if(String.fromCharCode(i) === settings[9][1]){
            key_right = 1;

        }else if(String.fromCharCode(i) === settings[8]){
            key_jump = 1;

        }else if(i === 27){/* ESC */
            setmode(0, 1);

        }else if(String.fromCharCode(i) === settings[10]){
            setmode(mode, 0);
        }
    }
};

window.onkeyup = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    if(String.fromCharCode(i) === settings[9][0]){
        key_left = 0;

    }else if(String.fromCharCode(i) === settings[9][1]){
        key_right = 0;

    }else if(String.fromCharCode(i) === settings[8]){
        key_jump = 0;
        hop_permission = 1;
    }
};

window.onresize = resize;
