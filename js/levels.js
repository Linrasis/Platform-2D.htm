'use strict';

function level_logic(id){
    // Randomized lava corridor logic.
    if(id === -1){
        // Create next obstacle every 400px traveled.
        if(player['x'] > 400){
            // Move the player back 400px.
            player['x'] -= 400;

            // Move the lava wall back 400px.
            world_dynamic[0][0] -= 400;

            // Move all world objects back 400px, except for lava wall and floor/ceiling.
            var loop_counter = world_dynamic.length - 1;
            do{
                if(loop_counter > 1){
                    world_dynamic[loop_counter][0] -= 400;
                }
            }while(loop_counter--);

            // Randomly pick next obstacle.
            var obstacle = random_number(4);

            // Lava pit obstacle.
            if(obstacle === 0){
                world_dynamic.push(
                  [player['x'] + x, -25, 50, 75, 1, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 50, 0, 175, 50, 3, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 50 + random_number(150), 25, 25, 25, 3, 0, 0, 0, -200, 25, 2,],
                  [player['x'] + x + 225, -25, 50, 75, 1, 0, 0, 0, 0, 0, 0,]
                );

            // Booster obstacle.
            }else if(obstacle === 1){
                world_dynamic.push(
                  [player['x'] + x, -200, 25, 200, 3, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 75, 25, 25, 25, 4, 0, 0, 0, 0, 0, 0, -14,],
                  [player['x'] + x + 100, -125, 25, 175, 3, 0, 0, 0, 0, 0, 0,]
                );

            // Wall backtrack obstacle.
            }else if(obstacle === 2){
                world_dynamic.push(
                  [player['x'] + x + 25, -200, 25, 200, 1, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 50, -25, 25, 25, 1, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 175, -125, 25, 175, 1, 0, 0, 0, 0, 0, 0,]
                );

            // Lava pillars obstacle.
            }else{
                world_dynamic.push(
                  [player['x'] + x, 0, 25, 50, 3, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 100, -25, 25, 75, 3, 0, 0, 0, 0, 0, 0,],
                  [player['x'] + x + 200, 0, 25, 50, 3, 0, 0, 0, 0, 0, 0,]
                );
            }
            update_static_buffer();
        }

        // Set lava wall goal to player position to keep it moving.
        world_dynamic[0][6] = player['x'];

        // Reset floor X position to match player position.
        world_dynamic[1][0] = player['x'] - 50;

        // Delete objects that are eaten by the lava wall.
        var loop_counter = world_dynamic.length - 1;
        do{
            if(loop_counter > 1
              && world_dynamic[loop_counter][0] < world_dynamic[0][0]){
                world_dynamic.splice(
                  loop_counter,
                  1
                );

                // Might have to move this for performance reasons.
                update_static_buffer();
                break;
            }
        }while(loop_counter--);
    }
}

function load_level(id){
    world_text.length = 0;

    // Randomized level.
    if(id === -2){
        document.getElementById('canvas').style.backgroundColor = '#3c3c3c';

        world_background = {};

        var tile_count = random_number(9) + 1;
        if(tile_count % 2 === 0){
            tile_count += 1;
        }
        var total_tiles = tile_count;
        var endtile_left = 0;
        var endtile_right = 0;
        var side = Math.random() > .5 ? 1 : 0;

        world_dynamic = [
          [
            [(total_tiles * 200) / 2 + 200, -200, 25, 325, 1, 0, 0, 0, 0, 0, 0,],
            [(-total_tiles * 200) / 2 - 200, -175, 25, 300, 's', 0, 0, 0, 0, 0, 0,],
            [(-total_tiles * 200) / 2 - 225, -175, 25, 300, 2, 0, 0, 0, 0, 0, 0,],
          ],
          [
            [(-total_tiles * 200) / 2 - 225, -200, 25, 325, 1, 0, 0, 0, 0, 0, 0,],
            [(total_tiles * 200) / 2 + 175, -175, 25, 300, 's', 0, 0, 0, 0, 0, 0,],
            [(total_tiles * 200) / 2 + 200, -175, 25, 300, 2, 0, 0, 0, 0, 0, 0,],
          ],
        ][side];

        world_static = [
          {
            'blue': random_number(256),
            'green': random_number(256),
            'height': 75,
            'red': random_number(256),
            'width': 75,
            'x': -100,
            'y': -100,
          },
          {
            'blue': 0,
            'green': 100,
            'height': 25,
            'red': 190,
            'width': 100,
            'x': -75,
            'y': -50,
          },
        ];

        world_dynamic.push(
          [-100, 50, 200, 75, 1, 0, 0, 0, 0, 0, 0,]
        );

        do{
            var tile_type = random_number(9);
            var tile_middle_x = (-total_tiles * 200) / 2 + tile_count * 200 + (tile_count >= total_tiles / 2 ? 0 : -200);

            if(tile_count === 0){
                endtile_left = tile_type;

            }else if(tile_count === total_tiles){
                endtile_right = tile_type;
            }

            world_dynamic.push(
              [tile_middle_x, 75, 200, 50, 3, 0, 0, 0, 0, 0, 0,]
            );

            if(tile_type === 1){
                world_dynamic.push(
                  [tile_middle_x + 85, -100, 25, 175, 3, 0, 0, 0, 0, 0, 0,],
                  Math.random() > .5
                    ? [tile_middle_x + 70, -25, 55, 25, 1, tile_middle_x + 30, tile_middle_x + 110, Math.random()>.5 ? 1 : -1, 0, 0, 0,]
                    : [tile_middle_x + 65, 0, 65, 25, 1, 0, 0, 0, -25, 75, Math.random() > .5 ? 1 : -1,]
                );

            }else if(tile_type === 0
              || tile_type === 3){
                if(Math.random() < .25){
                    world_dynamic.push(
                      [tile_middle_x + 45, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0,],
                      [tile_middle_x + 130, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0,],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0,]
                    );
                }else if(Math.random() < .5){
                    world_dynamic.push(
                      [tile_middle_x, 0, 25, 75, 3, 0, 0, 0, -175, 0, Math.random() < .2 ? 1 : 0,],
                      [tile_middle_x + 87.5, -25, 25, 100, 3, 0, 0, 0, -175, -25, Math.random() < .2 ? 1 : 0,],
                      [tile_middle_x + 175, 0, 25, 75, 3, 0, 0, 0, -175, 0, Math.random() < .2 ? 1 : 0,],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0,]
                    );
                }else{
                    world_dynamic.push(
                      [tile_middle_x + random_number(175), -25, 25, 100, 3, tile_middle_x, tile_middle_x + 175, Math.random() < .4 ? 1 : 0, 0, 0, 0,],
                      [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0,]
                    );
                }

            }else if(tile_type === 2
              || tile_type === 4){
                if(Math.random() < .4){
                    world_dynamic.push(
                      [tile_middle_x + 40, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, 2,]
                    );
                }
                if(Math.random() < .4){
                    world_dynamic.push(
                      [tile_middle_x + 135, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, 2,]
                    );
                }
                world_dynamic.push(
                  [tile_middle_x + 85, 50, 25, 25, 1, 0, 0, 0, 0, 0, 0]
                );

            }else if(tile_type === 5){
                if(Math.random() < .2){
                    world_dynamic.push(
                      [tile_middle_x + random_number(175), -65, 25, 25,4, tile_middle_x, tile_middle_x + 175, Math.random() < .5 ? 2 : -2, 0, 0, 0, -12,],
                      [tile_middle_x, -200, 200, 25, 3, 0, 0, 0, 0, 0, 0,]
                    );
                }else{
                    world_dynamic.push(
                      [tile_middle_x + random_number(175), -65, 25, 25, 3, tile_middle_x, tile_middle_x + 175, Math.random() < .5 ? 2 : -2, 0, 0, 0,]
                    );
                }
                world_dynamic.push(
                  [tile_middle_x, 60, 200, 25,4, 0, 0, 0, 0, 0, 0, -12]
                );

            }else if(tile_type === 6){
                if(Math.random() < .6){
                    if(Math.random() < .5){
                        world_dynamic.push(
                          [tile_middle_x + 50, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, Math.random() > .5 ? 2 : -2,],
                          [tile_middle_x + 125, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, Math.random() > .5 ? 2 : -2,]
                        );
                    }else{
                        world_dynamic.push(
                          [tile_middle_x + (Math.random() * 125) + 25, 100 - random_number(275), 25, 25, 3, 0, 0, 0, -175, 100, 2,]
                        );
                    }
                }
                world_dynamic.push(
                  [tile_middle_x, 0, 25, 75, 1, 0, 0, 0, 0, 0, 0,],
                  [tile_middle_x + 175, 0, 25, 75, 1, 0, 0, 0, 0, 0, 0,]
                );

            }else if(tile_type === 7){
                world_dynamic.push(
                  [tile_middle_x, 50, 200, 25, 1, 0, 0, 0, 0, 0, 0,]
                );
                var tre = random_number(175);
                world_static.push({
                  'blue': random_number(256),
                  'green': random_number(256),
                  'red': random_number(256),
                  'height': 75,
                  'width': 75,
                  'x': tile_middle_x + tre - 25,
                  'y': -100,
                });
                world_static.push({
                  'blue': 190,
                  'green': 100,
                  'red': 0,
                  'height': 25,
                  'width': 100,
                  'x': tile_middle_x + tre,
                  'y': -50,
                });

            }else if(tile_type === 8){
                world_dynamic.push(
                  [tile_middle_x, 0, 50, 75, 1, 0, 0, 0, 0, 0, 0,],
                  [tile_middle_x + 150, 0, 50, 75, 1, 0, 0, 0, 0, 0, 0,],
                  [tile_middle_x + 50, 50, 100, 25, 1, 0, 0, 0, 0, 0, 0,],
                  [tile_middle_x, -random_number(150) - 25, 200, 50, 3, 0, 0, 0, -175, -50, Math.random() > .5 ? 1.5 : -1.5,]
                );
            }
            world_dynamic.push(
              [tile_middle_x + (tile_count > total_tiles / 2 ? 0 : 200), -190, 200, 15, 1, 0, 0, 0, 0, 0, 0,]
            );
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
          0,
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

            world_dynamic.push(
              [key_x, key_y, 50, 40, 5, 0, 0, 0, 0, 0, 0,]
            );

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

            world_dynamic.push(
              [key_x, key_y, 50, 40, 5, 0, 0, 0, 0, 0, 0,]
            );
        }
        world_static.push({
          'blue': 0,
          'green': 0,
          'height': 250,
          'red': 0,
          'width': total_tiles * 200 + 400,
          'x': (-total_tiles * 200) / 2 - 200,
          'y': -175,
        });

    // Randomized lava corridor.
    }else if(id === -1){
        document.getElementById('canvas').style.backgroundColor = '#3c3c3c';

        world_background = {};

        world_dynamic = [
          [-250, -200, 50, 250, 3, -250, 200, 3, 0, 0, 0,],
          [-50, 50, 100, 25, 1, 0, 0, 0, 0, 0, 0,],
        ];

        world_static = [
          {
            'blue': 0,
            'green': 0,
            'height': 250,
            'red': 0,
            'width': width + 400,
            'x': -x,
            'y': -200,
          },
        ];

        interval_logic = window.setInterval(
          'level_logic(-1)',
          100
        );

    // Premade levels.
    }else{
        world_background = [
          {
            'color-bottom': '#3c3c3c',
            'color-top': '#000',
            'y': -150,
          },
          {
            'color-bottom': '#3c3c3c',
            'color-top': '#000',
            'y': 60,
          },
          {},
          {
            'color-bottom': '#3c3c3c',
            'color-top': '#000',
            'y': 250,
          },
          {
            'color-bottom': '#3c3c3c',
            'color-top': '#000',
            'y': 125,
          },
        ][id];

        world_dynamic = [
          [
            [-45, -150, 25, 200, 1, 0, 0, 0, 0, 0, 0,],
            [-45, 50, 245, 500, 1, 0, 0, 0, 0, 0, 0,],
            [350, -150, 25, 565, 1, 0, 0, 0, 0, 0, 0,],
            [375, 250, 100, 25, 1, 0, 0, 0, 0, 0, 0,],
            [375, 390, 100, 25, 1, 0, 0, 0, 0, 0, 0,],
            [400, 475, 175, 25, 1, 0, 0, 0, 0, 0, 0,],
            [575, 325, 50, 175, 1, 0, 0, 0, 0, 0, 0,],
            [575, 160, 25, 25, 1, 0, 0, 0, 0, 0, 0,],
            [600, -150, 25, 500, 1, 0, 0, 0, 0, 0, 0,],
            [575, -125, 25, 25, 2, 0, 0, 0, 0, 0, 0,],
            [200, 525, 425, 25, 3, 0, 0, 0, 0, 0, 0,],
            [500, -150, 25, 25, 3, 0, 0, 0, -125, 450, 5,],
            [525, 450, 25, 25, 3, 0, 0, 0, -125, 450, 4,],
            [375, -50, 25, 25, 3, 375, 575, 5, 0, 0, 0,],
            [575, 275, 25, 25, 3, 375, 575, 5, 0, 0, 0,],
            [400, 75, 25, 25, 4, 0, 0, 0, 0, 0, 0, -13,],
            [200, 75, 50, 50, 5, 0, 0, 0, 0, 0, 0,],
            [300, 215, 50, 50, 5, 0, 0, 0, 0, 0, 0,],
            [200, 350, 50, 50, 5, 0, 0, 0, 0, 0, 0,],
            [200, 475, 200, 25, 's', 0, 0, 0, 0, 0, 0,],
          ],
          [
            [-45, -1050, 595, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-45, -1025, 25, 1160, 1, 0, 0, 0, 0, 0, 0,],
            [-20, 50, 295, 85, 1, 0, 0, 0, 0, 0, 0,],
            [525, -1025, 25, 1160, 1, 0, 0, 0, 0, 0, 0,],
            [275, -400, 25, 25, 2, 0, 0, 0, 0, 0, 0,],
            [150, -725, 25, 75, 3, 0, 0, 0, 0, 0, 0,],
            [-20, -375, 345, 25, 3, 0, 0, 0, 0, 0, 0,],
            [225, -700, 75, 25, 3, 0, 0, 0, 0, 0, 0,],
            [275, 85, 250, 50, 3, 0, 0, 0, 0, 0, 0,],
            [300, -925, 25, 550, 3, 0, 0, 0, 0, 0, 0,],
            [325, -800, 75, 25, 3, 0, 0, 0, 0, 0, 0,],
            [375, -290, 25, 375, 3, 0, 0, 0, 0, 0, 0,],
            [400, -540, 125, 25, 3, 0, 0, 0, 0, 0, 0,],
            [500, -515, 25, 600, 3, 0, 0, 0, 0, 0, 0,],
            [275, 60, 100, 25, 4, 0, 0, 0, 0, 0, 0, -20,],
            [400, -565, 125, 25, 4, 0, 0, 0, 0, 0, 0, -20,],
            [400, 60, 100, 25, 4, 0, 0, 0, 0, 0, 0, -26,],
          ],
          [
            [-45, -150, 1300, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-45, -125, 25, 335, 1, 0, 0, 0, 0, 0, 0,],
            [-20, 50, 210, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-20, 125, 300, 85, 1, 0, 0, 0, 0, 0, 0,],
            [280, 135, 950, 50, 3, 0, 0, 0, 0, 0, 0,],
            [425, 50, 205, 25, 1, 0, 0, 0, 0, 0, 0,],
            [500, 75, 50, 60, 1, 0, 0, 0, 0, 0, 0,],
            [775, 75, 223, 25, 1, 0, 0, 0, 0, 0, 0,],
            [1230, -125, 25, 335, 1, 0, 0, 0, 0, 0, 0,],
            [1205, 110, 25, 25, 2, 0, 0, 0, 0, 0, 0,],
            [320, 142, 25, 25, 3, 0, 0, 0, -64, 150, -3,],
            [675, -60, 25, 25, 3, 0, 0, 0, -75, 150, -3,],
            [700, -60, 25, 25, 3, 0, 0, 0, -75, 150, -2,],
            [-20, 75, 50, 50, 5, 0, 0, 0, 0, 0, 0,],
            [400, -125, 25, 200, 's', 0, 0, 0, 0, 0, 0,],
          ],
          [
            [-430, -150, 475, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-430, -125, 25, 600, 1, 0, 0, 0, 0, 0, 0,],
            [-430, 475, 900, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-405, 250, 500, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-355, 50, 400, 25, 1, 0, 0, 0, 0, 0, 0,],
            [20, -125, 25, 200, 1, 0, 0, 0, 0, 0, 0,],
            [245, 250, 125, 25, 1, 0, 0, 0, 0, 0, 0,],
            [445, 75, 25, 400, 1, 0, 0, 0, 0, 0, 0,],
            [-405, 325, 25, 25, 2, 0, 0, 0, 0, 0, 0,],
            [-405, 275, 800, 25, 3, 0, 0, 0, 0, 0, 0,],
            [-305, 420, 25, 25, 3, 0, 0, 0, 300, 450, -3,],
            [-205, 420, 25, 25, 3, 0, 0, 0, 300, 450, 1,],
            [-105, 420, 25, 25, 3, 0, 0, 0, 300, 450, 2,],
            [-5, 365, 25, 25, 3, 0, 0, 0, 300, 450, -1,],
            [95, 399, 25, 25, 3, 0, 0, 0, 300, 450, -2,],
            [195, 411, 25, 25, 3, 0, 0, 0, 300, 450, 4,],
            [370, 200, 25, 75, 3, 0, 0, 0, 0, 0, 0,],
          ],
          [
            [-715, 36, 35, 239, 1, 0, 0, 0, 0, 0, 0,],
            [-715, -175, 135, 15, 1, 0, 0, 0, 0, 0, 0,],
            [-680, 124, 320, 151, 1, 0, 0, 0, 0, 0, 0,],
            [-600, -50, 50, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-428, -120, 28, 170, 1, 0, 0, 0, 0, 0, 0,],
            [-360, 0, 16, 275, 1, 0, 0, 0, 0, 0, 0,],
            [-296, 124, 196, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-160, 0, 60, 25, 1, 0, 0, 0, 0, 0, 0,],
            [-40, 48, 80, 25, 1, 0, 0, 0, 0, 0, 0,],
            [105, -120, 16, 395, 1, 0, 0, 0, 0, 0, 0,],
            [-715, -300, 25, 125, 2, 0, 0, 0, 0, 0, 0,],
            [-715, -160, 25, 196, 3, 0, 0, 0, 0, 0, 0,],
            [-690, -160, 140, 25, 3, 0, 0, 0, 0, 0, 0,],
            [-550, 74, 50, 50, 3, -680, -410, -1, 0, 0, 0,],
            [-345, 250, 450, 25, 3, 0, 0, 0, 0, 0, 0,],
          ],
        ][id];

        world_static = [
          [
            {
              'blue': random_number(256),
              'green': random_number(256),
              'height': 75,
              'red': random_number(256),
              'width': 75,
              'x': 400,
              'y': 75,
            },
            {
              'blue': 0,
              'green': 100,
              'height': 125,
              'red': 190,
              'width': 25,
              'x': 425,
              'y': 125,
            },
          ],
          [
            {
              'blue': random_number(256),
              'green': random_number(256),
              'height': 75,
              'red': random_number(256),
              'width': 75,
              'x': -37,
              'y': -1200,
            },
            {
              'blue': 0,
              'green': 100,
              'height': 75,
              'red': 190,
              'width': 25,
              'x': -12,
              'y': -1125,
            },
          ],
          [
            {
              'blue': random_number(256),
              'green': random_number(256),
              'height': 75,
              'red': random_number(256),
              'width': 75,
              'x': 525,
              'y': -100,
            },
            {
              'blue': 0,
              'green': 100,
              'height': 100,
              'red': 190,
              'width': 25,
              'x': 550,
              'y': -50,
            },
            {
              'blue': 60,
              'green': 60,
              'height': 35,
              'red': 60,
              'width': 50,
              'x': 850,
              'y': 100,
            },
            {
              'blue': random_number(256),
              'green': random_number(256),
              'height': 50,
              'red': random_number(256),
              'width': 75,
              'x': 890,
              'y': 0,
            },
            {
              'blue': 0,
              'green': 100,
              'height': 25,
              'red': 190,
              'width': 25,
              'x': 915,
              'y': 50,
            },
            {
              'blue': 60,
              'green': 60,
              'height': 25,
              'red': 60,
              'width': 950,
              'x': 280,
              'y': 185,
            },
          ],
          [
            {
              'blue': 25,
              'green': 25,
              'height': 175,
              'red': 25,
              'width': 25,
              'x': 20,
              'y': 75,
            },
            {
              'blue': random_number(256),
              'green': random_number(256),
              'height': 75,
              'red': random_number(256),
              'width': 75,
              'x': 260,
              'y': 100,
            },
            {
              'blue': 0,
              'green': 0,
              'height': 100,
              'red': 190,
              'width': 25,
              'x': 285,
              'y': 150,
            },
          ],
          [
            {
              'blue': 60,
              'green': 60,
              'height': 575,
              'red': 60,
              'width': 15,
              'x': -730,
              'y': -300,
            },
          ],
        ][id];

        world_text = [
          [
            {
              'text': 'Trust No Mass',
              'x': 99,
              'y': -75,
            },
          ],
          [
            {
              'text': '☺',
              'x': -15,
              'y': -1090,
            },
            {
              'text': 'Booster',
              'x': 0,
              'y': -210,
            },
            {
              'text': 'Towers',
              'x': 0,
              'y': -170,
            },
            {
              'text': 'INC',
              'x': 0,
              'y': -130,
            },
          ],
          [
            {
              'text': 'Yellow keys guide',
              'x': 100,
              'y': -90,
            },
            {
              'text': 'you through life...',
              'x': 100,
              'y': -55,
            },
            {
              'text': '...but not often on the',
              'x': 899,
              'y': -90,
            },
            {
              'text': 'most logical of paths.',
              'x': 899,
              'y': -55,
            },
          ],
          [
            {
              'text': settings['movement-keys'][0] + ' = ←←←←←',
              'x': -250,
              'y': -89,
            },
            {
              'text': settings['movement-keys'][1] + ' = →→→→→',
              'x': -250,
              'y': 111,
            },
            {
              'text': '!!!!!',
              'x': -50,
              'y': 430,
            },
            {
              'text': settings['jump-key'] + ' = ↑↑↑↑↑',
              'x': 90,
              'y': 111,
            },
          ],
          [
            {
              'text': 'Village of the Wolves', 'x': -660, 'y': 100,},
          ],
        ][id];
    }
}
