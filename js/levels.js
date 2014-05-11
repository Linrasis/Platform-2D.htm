function level_logic(id){
    // randomized lava corridor logic
    if(id == -1){
        // create next obstacle every 400px traveled
        if(player_x > 400){
            // move the player back 400px
            player_x -= 400;

            // move the lava wall back 400px
            world_dynamic[0][0] -= 400;

            // move all world objects back 400px, except for lava wall and floor/ceiling
            i = world_dynamic.length - 1;
            do{
                if(i > 1){
                    world_dynamic[i][0] -= 400;
                }
            }while(i--);

            // randomly pick next obstacle*/
            i = random_number(4);

            // lava pit obstacle
            if(i == 0){
                world_dynamic.push([
                  player_x + x,
                  -25,
                  50,
                  75,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 50,
                  0,
                  175,
                  50,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 50 + random_number(150),
                  25,
                  25,
                  25,
                  3,
                  0,
                  0,
                  0,
                  -200,
                  25,
                  2
                ]);
                world_dynamic.push([
                  player_x + x + 225,
                  -25,
                  50,
                  75,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);

            // booster obstacle
            }else if(i == 1){
                world_dynamic.push([
                  player_x + x,
                  -200,
                  25,
                  200,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 75,
                  25,
                  25,
                  25,
                  4,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  -14
                ]);
                world_dynamic.push([
                  player_x + x + 100,
                  -125,
                  25,
                  175,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);

            // wall backtrack obstacle
            }else if(i == 2){
                world_dynamic.push([
                  player_x + x,
                  -200,
                  25,
                  200,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 25,
                  -25,
                  125,
                  25,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 75,
                  -125,
                  125,
                  25,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 200,
                  -125,
                  25,
                  175,
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);

            // lava pillars obstacle
            }else{
                world_dynamic.push([
                  player_x + x,
                  0,
                  25,
                  50,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 100,
                  -25,
                  25,
                  75,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
                world_dynamic.push([
                  player_x + x + 200,
                  0,
                  25,
                  50,
                  3,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]);
            }
            update_static_buffer();
        }

        // set lava wall goal to player position to keep it moving
        world_dynamic[0][6] = player_x;

        // reset floor x position to match player position
        world_dynamic[1][0] = player_x - 50;

        // delete objects that are eaten by the lava wall
        i = world_dynamic.length - 1;
        do{
            if(i > 1
              && world_dynamic[i][0] < world_dynamic[0][0]){
                world_dynamic.splice(i, 1);

                // might have to move this for performance reasons
                update_static_buffer();
                break;
            }
        }while(i--);
    }
}

function load_level(id){
    world_text.length = 0;

    // randomized level
    if(id == -2){
        document.getElementById('canvas').style.backgroundColor = '#3c3c3c';

        world_background = [];

        tile_count = random_number(9) + 1;
        if(tile_count % 2 === 0){
            tile_count += 1
        }
        var total_tiles = tile_count;
        var endtile_left = 0;
        var endtile_right = 0;
        var side = Math.random() > .5 ? 1 : 0;

        world_dynamic = [
          [
            [ (total_tiles * 200) / 2 + 200, -200, 25, 325,   1, 0, 0, 0, 0, 0, 0],
            [(-total_tiles * 200) / 2 - 200, -200, 25, 325, 's', 0, 0, 0, 0, 0, 0],
            [(-total_tiles * 200) / 2 - 225, -200, 25, 325,   2, 0, 0, 0, 0, 0, 0]
          ],
          [
            [(-total_tiles * 200) / 2 - 225, -200, 25, 325,   1, 0, 0, 0, 0, 0, 0],
            [ (total_tiles * 200) / 2 + 175, -200, 25, 325, 's', 0, 0, 0, 0, 0, 0],
            [ (total_tiles * 200) / 2 + 200, -200, 25, 325,   2, 0, 0, 0, 0, 0, 0]
          ]
        ][side];

        world_static = [
          [-100, -100, 75, 75, random_number(256), random_number(256), random_number(256)],
          [-75, -50, 25, 100, 190, 100, 0]
        ];

        world_dynamic.push([
          -100,
          50,
          200,
          75,
          1,
          0,
          0,
          0,
          0,
          0,
          0
        ]);

        do{
            var tile_type = random_number(9);
            var tile_middle_x = (-total_tiles * 200) / 2 + tile_count * 200 + (tile_count >= total_tiles / 2 ? 0 : -200);

            if(tile_count === 0){
                endtile_left = tile_type;

            }else if(tile_count === total_tiles){
                endtile_right = tile_type;
            }

            world_dynamic.push([
              tile_middle_x,
              75,
              200,
              50,
              3,
              0,
              0,
              0,
              0,
              0,
              0
            ]);

            if(tile_type === 1){
                world_dynamic.push(
                  [tile_middle_x + 85, -100, 25, 175, 3, 0, 0, 0, 0, 0, 0],
                  Math.random() > .5
                    ? [tile_middle_x + 70, -25, 55, 25, 1, tile_middle_x + 30, tile_middle_x + 110, Math.random()>.5 ? 1 : -1, 0, 0, 0]
                    : [tile_middle_x + 65, 0, 65, 25, 1, 0, 0, 0, -25, 75, Math.random() > .5 ? 1 : -1]
                );

            }else if(tile_type === 0
              || tile_type === 3){
                if(Math.random() < .25){
                    world_dynamic.push(
                      [tile_middle_x + 45, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0],
                      [tile_middle_x + 130, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0]
                    );
                }else if(Math.random() < .5){
                    world_dynamic.push(
                      [tile_middle_x, 0, 25, 75, 3, 0, 0, 0, -175, 0, Math.random() < .2 ? 1 : 0],
                      [tile_middle_x + 87.5, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0],
                      [tile_middle_x + 175, 0, 25, 75, 3, 0, 0, 0, -175, 0, Math.random() < .2 ? 1 : 0],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0]
                    );
                }else{
                    world_dynamic.push(
                      [tile_middle_x + random_number(175), -25, 25, 100, 3, tile_middle_x, tile_middle_x + 175, Math.random() < .4 ? 1 : 0, 0, 0, 0],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0]
                    );
                }

            }else if(tile_type === 2
              || tile_type === 4){
                if(Math.random() < .4){
                    world_dynamic.push([tile_middle_x + 40, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, 2]);
                }
                if(Math.random() < .4){
                    world_dynamic.push([tile_middle_x + 135, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, 2]);
                }
                world_dynamic.push([tile_middle_x + 85, 50, 25, 25, 1, 0, 0, 0, 0, 0, 0]);

            }else if(tile_type === 5){
                if(Math.random() < .2){
                    world_dynamic.push(
                      [tile_middle_x + random_number(175), -65, 25, 25,4, tile_middle_x, tile_middle_x + 175, Math.random() < .5 ? 2 : -2, 0, 0, 0, -12],
                      [tile_middle_x, -200, 200, 25, 3, 0, 0, 0, 0, 0, 0]
                    );
                }else{
                    world_dynamic.push([
                      tile_middle_x + random_number(175),
                      -65,
                      25,
                      25,
                      3,
                      tile_middle_x,
                      tile_middle_x + 175,
                      Math.random() < .5 ? 2 : -2,
                      0,
                      0,
                      0
                    ]);
                }
                world_dynamic.push([tile_middle_x, 60, 200, 25,4, 0, 0, 0, 0, 0, 0, -12]);

            }else if(tile_type === 6){
                if(Math.random() < .6){
                    if(Math.random() < .5){
                        world_dynamic.push(
                          [tile_middle_x + 50, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, Math.random() > .5 ? 2 : -2],
                          [tile_middle_x + 125, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, Math.random() > .5 ? 2 : -2]
                        );
                    }else{
                        world_dynamic.push([
                          tile_middle_x + (Math.random() * 125) + 25, 100 - random_number(275),
                          25,
                          25,
                          3,
                          0,
                          0,
                          0,
                          -175,
                          100,
                          2
                        ]);
                    }
                }
                world_dynamic.push(
                  [tile_middle_x, 0, 25, 75, 1, 0, 0, 0, 0, 0, 0],
                  [tile_middle_x + 175, 0, 25, 75, 1, 0, 0, 0, 0, 0, 0]
                );

            }else if(tile_type === 7){
                world_dynamic.push([tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0]);
                var tre = random_number(175);
                world_static.push(
                  [tile_middle_x + tre - 25, -100, 75, 75, random_number(256), random_number(256), random_number(256)],
                  [tile_middle_x + tre, -50, 25, 100, 190, 100, 0]
                );

            }else if(tile_type === 8){
                world_dynamic.push(
                  [tile_middle_x, 0, 50, 75, 1, 0, 0, 0, 0, 0, 0],
                  [tile_middle_x + 150, 0, 50, 75, 1, 0, 0, 0, 0, 0, 0],
                  [tile_middle_x + 50, 50, 100, 25, 1, 0, 0, 0, 0, 0, 0],
                  [tile_middle_x, -random_number(150) - 25, 200, 50, 3, 0, 0, 0, -175, -50, Math.random() > .5 ? 1.5 : -1.5]
                );
            }
            world_dynamic.push([
              tile_middle_x + (tile_count > total_tiles / 2 ? 0 : 200),
              -190,
              200,
              15,
              1,
              0,
              0,
              0,
              0,
              0,
              0
            ]);
        }while(tile_count--);

        world_dynamic.push([
          tile_middle_x,
          -190,
          200,
          15,
          1,
          0,
          0,
          0,
          0,
          0,
          0
        ]);

        var key_y = 10;
        if(side){
            if(endtile_left === 1){
                key_y = -90;

            }else if(endtile_left === 6
              || endtile_left === 8){
                key_y = -50;

            }else if(endtile_left === 9){
                key_y = -110;
            }

            var key_x = (-total_tiles * 200) / 2 - 200;
            if(endtile_left === 0
              || endtile_left === 3){
                key_x += 25;

            }else if(endtile_left === 2
              || endtile_left === 4){
                key_x += 75;

            }else if(endtile_left === 7){
                key_x += 75;
                key_y = 0;
            }

            world_dynamic.push([
              key_x,
              key_y,
              50,
              40,
              5,
              0,
              0,
              0,
              0,
              0,
              0
            ]);

        }else{
            if(endtile_right === 1){
                key_y = -90;

            }else if(endtile_right === 6
              || endtile_right === 8){
                key_y = -50;

            }else if(endtile_right === 9){
                key_y = -110;
            }

            var key_x = (total_tiles * 200) / 2 + 150;
            if(endtile_right === 0
              || endtile_right === 3){
                key_x -= 25;

            }else if(endtile_right === 2
              || endtile_right === 4){
                key_x -= 75;

            }else if(endtile_right === 7){
                key_x -= 75;
                key_y = 0;
            }

            world_dynamic.push([
              key_x,
              key_y,
              50,
              40,
              5,
              0,
              0,
              0,
              0,
              0,
              0
            ]);
        }
        world_static.push([
          (-total_tiles * 200) / 2 - 200,
          -175,
          total_tiles * 200 + 400,
          250,
          0,
          0,
          0
        ]);

    // randomized lava corridor
    }else if(id == -1){
        document.getElementById('canvas').style.backgroundColor = '#3c3c3c';

        world_background = [];

        world_dynamic = [
          [-250, -200,  50, 250, 3, -250, 200, 3, 0, 0, 0],
          [ -50,   50, 100,  25, 1,    0,   0, 0, 0, 0, 0]
        ];

        world_static = [
          [-x, -200, width + 400, 250, 0, 0, 0]
        ];

        interval_logic = setInterval('level_logic(-1)', 100);

    // premade levels
    }else{
        world_background = [
          [-150, '#000', '#3c3c3c'],
          [  60, '#000', '#3c3c3c'],
          [],
          [ 250, '#000', '#3c3c3c'],
          [ 125, '#000', '#3c3c3c']
        ][id];

        world_dynamic = [
          [
            [-20,   50, 220,  25,   1,   0,   0, 0,    0,   0, 0],
            [175,   75,  25, 475,   1,   0,   0, 0,    0,   0, 0],
            [200,  525, 200,  25,   1,   0,   0, 0,    0,   0, 0],
            [350, -150,  25, 565,   1,   0,   0, 0,    0,   0, 0],
            [375,  250, 100,  25,   1,   0,   0, 0,    0,   0, 0],
            [375,  390, 100,  25,   1,   0,   0, 0,    0,   0, 0],
            [400,  475, 175,  25,   1,   0,   0, 0,    0,   0, 0],
            [400,  500,  25,  50,   1,   0,   0, 0,    0,   0, 0],
            [575,  325,  25, 175,   1,   0,   0, 0,    0,   0, 0],
            [575,  160,  25,  25,   1,   0,   0, 0,    0,   0, 0],
            [600, -150,  25, 500,   1,   0,   0, 0,    0,   0, 0],
            [575, -125,  25,  25,   2,   0,   0, 0,    0,   0, 0],
            [200,  500, 200,  25,   3,   0,   0, 0,    0,   0, 0],
            [500, -150,  25,  25,   3,   0,   0, 0, -125, 450, 5],
            [525,  450,  25,  25,   3,   0,   0, 0, -125, 450, 4],
            [375,  -50,  25,  25,   3, 375, 575, 5,    0,   0, 0],
            [575,  275,  25,  25,   3, 375, 575, 5,    0,   0, 0],
            [400,   75,  25,  25,   4,   0,   0, 0,    0,   0, 0, -13],
            [200,   75,  50,  50,   5,   0,   0, 0,    0,   0, 0],
            [300,  215,  50,  50,   5,   0,   0, 0,    0,   0, 0],
            [200,  350,  50,  50,   5,   0,   0, 0,    0,   0, 0],
            [200,  475, 200,  25, 's',   0,   0, 0,    0,   0, 0]
          ],
          [
            [-45, -1050, 595,   25, 1, 0, 0, 0, 0, 0, 0],
            [-45, -1025,  25, 1160, 1, 0, 0, 0, 0, 0, 0],
            [-20,    50, 295,   85, 1, 0, 0, 0, 0, 0, 0],
            [525, -1025,  25, 1160, 1, 0, 0, 0, 0, 0, 0],
            [275,  -400,  25,   25, 2, 0, 0, 0, 0, 0, 0],
            [150,  -725,  25,   75, 3, 0, 0, 0, 0, 0, 0],
            [-20,  -375, 345,   25, 3, 0, 0, 0, 0, 0, 0],
            [225,  -700,  75,   25, 3, 0, 0, 0, 0, 0, 0],
            [275,    85, 225,   25, 3, 0, 0, 0, 0, 0, 0],
            [300,  -925,  25,  550, 3, 0, 0, 0, 0, 0, 0],
            [325,  -800,  75,   25, 3, 0, 0, 0, 0, 0, 0],
            [375,  -290,  25,  375, 3, 0, 0, 0, 0, 0, 0],
            [400,  -540, 125,   25, 3, 0, 0, 0, 0, 0, 0],
            [500,  -515,  25,  625, 3, 0, 0, 0, 0, 0, 0],
            [275,    60, 100,   25, 4, 0, 0, 0, 0, 0, 0, -20],
            [400,  -565, 125,   25, 4, 0, 0, 0, 0, 0, 0, -20],
            [400,    60, 100,   25, 4, 0, 0, 0, 0, 0, 0, -26]
          ],
          [
            [ -45, -150, 1300,  25,   1, 0, 0, 0,   0,   0,  0],
            [ -45, -125,   25, 335,   1, 0, 0, 0,   0,   0,  0],
            [ -20,   50,  210,  25,   1, 0, 0, 0,   0,   0,  0],
            [ -20,  125,  300,  85,   1, 0, 0, 0,   0,   0,  0],
            [ 280,  135,  950,  50,   3, 0, 0, 0,   0,   0,  0],
            [ 425,   50,  205,  25,   1, 0, 0, 0,   0,   0,  0],
            [ 500,   75,   50,  60,   1, 0, 0, 0,   0,   0,  0],
            [ 775,   75,  223,  25,   1, 0, 0, 0,   0,   0,  0],
            [1230, -125,   25, 335,   1, 0, 0, 0,   0,   0,  0],
            [1205,  110,   25,  25,   2, 0, 0, 0,   0,   0,  0],
            [ 320,  142,   25,  25,   3, 0, 0, 0, -64, 150, -3],
            [ 675,  -60,   25,  25,   3, 0, 0, 0, -75, 150, -3],
            [ 700,  -60,   25,  25,   3, 0, 0, 0, -75, 150, -2],
            [ -20,   75,   50,  50,   5, 0, 0, 0,   0,   0,  0],
            [ 400, -125,   25, 200, 's', 0, 0, 0,   0,   0,  0]
          ],
          [
            [-430, -150, 475,  25, 1, 0, 0, 0,   0,   0,  0],
            [-430, -125,  25, 600, 1, 0, 0, 0,   0,   0,  0],
            [-430,  475, 900,  25, 1, 0, 0, 0,   0,   0,  0],
            [-405,  250, 500,  25, 1, 0, 0, 0,   0,   0,  0],
            [-355,   50, 400,  25, 1, 0, 0, 0,   0,   0,  0],
            [  20, -125,  25, 200, 1, 0, 0, 0,   0,   0,  0],
            [ 245,  250, 125,  25, 1, 0, 0, 0,   0,   0,  0],
            [ 445,   75,  25, 400, 1, 0, 0, 0,   0,   0,  0],
            [-405,  325,  25,  25, 2, 0, 0, 0,   0,   0,  0],
            [-405,  275, 800,  25, 3, 0, 0, 0,   0,   0,  0],
            [-305,  420,  25,  25, 3, 0, 0, 0, 325, 450, -3],
            [-205,  420,  25,  25, 3, 0, 0, 0, 325, 450,  1],
            [-105,  420,  25,  25, 3, 0, 0, 0, 325, 450,  2],
            [  -5,  365,  25,  25, 3, 0, 0, 0, 325, 450, -1],
            [  95,  399,  25,  25, 3, 0, 0, 0, 325, 450, -2],
            [ 195,  411,  25,  25, 3, 0, 0, 0, 325, 450,  4],
            [ 370,  200,  25,  75, 3, 0, 0, 0,   0,   0,  0]
          ],
          [
            [-715,   36,  35, 113, 1,    0,    0,  0, 0, 0, 0],
            [-700, -175, 120,  15, 1,    0,    0,  0, 0, 0, 0],
            [-680,  124, 320,  25, 1,    0,    0,  0, 0, 0, 0],
            [-600,  -50,  50,  25, 1,    0,    0,  0, 0, 0, 0],
            [-428, -120,  28, 170, 1,    0,    0,  0, 0, 0, 0],
            [-360,    0,  16, 275, 1,    0,    0,  0, 0, 0, 0],
            [-296,  124, 196,  25, 1,    0,    0,  0, 0, 0, 0],
            [-160,    0,  60,  25, 1,    0,    0,  0, 0, 0, 0],
            [ -40,   48,  80,  25, 1,    0,    0,  0, 0, 0, 0],
            [ 105, -120,  16, 395, 1,    0,    0,  0, 0, 0, 0],
            [-700, -300,  25, 125, 2,    0,    0,  0, 0, 0, 0],
            [-715, -160,  25, 196, 3,    0,    0,  0, 0, 0, 0],
            [-690, -160, 140,  25, 3,    0,    0,  0, 0, 0, 0],
            [-550,   74,  50,  50, 3, -680, -410, -1, 0, 0, 0],
            [-345,  250, 450,  25, 3,    0,    0,  0, 0, 0, 0]
          ]
        ][id];

        world_static = [
          [
            [400,  75, 75,  75, random_number(256), random_number(256), random_number(256)],
            [425, 125, 25, 125,                190,                100,                  0],
            [-20,-155,620, 205,                  0,                  0,                  0],
            [200,  50,400, 450,                  0,                  0,                  0]
          ],
          [
            [-37, -1200,  75, 75, random_number(256), random_number(256), random_number(256)],
            [-12, -1125,  25, 75,                190,                100,                  0]
          ],
          [
            [525, -100,  75,  75, random_number(256), random_number(256), random_number(256)],
            [550,  -50,  25, 100,                190,                100,                  0],
            [850,  100,  50,  35,                 60,                 60,                 60],
            [890,    0,  75,  50, random_number(256), random_number(256), random_number(256)],
            [915,   50,  25,  25,                190,                100,                  0],
            [280,  185, 950,  25,                 60,                 60,                 60]
          ],
          [
            [-405, 300, 800,  25,                 60,                 60,                 60],
            [  20,  75,  25, 175,                 25,                 25,                 25],
            [ 260, 100,  75,  75, random_number(256), random_number(256), random_number(256)],
            [ 285, 150,  25, 100,                190,                100,                  0],
            [-405, 245, 850, 255,                  0,                  0,                  0]
          ],
          [
            [-360, 120, 481, 130, 0, 0, 0]
          ]
        ][id];

        world_text = [
          [
            ['Trust No Mass', 165, -75]
          ],
          [
            [     '☺',  .5, -1090],
            ['Booster', 150,  -210],
            [ 'Towers', 150,  -170],
            [    'INC', 150,  -130]
          ],
          [
            [      'Yellow keys guide', 200, -90],
            [    'you through life...', 200, -55],
            ['...but not often on the', 999, -90],
            [ 'most logical of paths.', 999, -55]
          ],
          [
            [ settings[9][0] + ' = Move Left', -185, -99],
            [settings[9][1] + ' = Move Right', -185, 101],
            [                'Avoid the Red!',    0, 420],
            [         settings[8] + ' = Jump',  170, 101]
          ],
          [
            ['Village of the Wolves', -535, 175]
          ]
        ][id];
    }
}
