'use strict';

function level_logic(id){
    // Randomized lava corridor logic.
    if(id === -1){
        // Create next obstacle every 400px traveled.
        if(player['x'] > 400){
            // Move the player back 400px.
            player['x'] -= 400;

            // Move the lava wall back 400px.
            world_dynamic[0]['x'] -= 400;

            // Move all world objects back 400px, except for lava wall and floor/ceiling.
            var loop_counter = world_dynamic.length - 1;
            do{
                if(loop_counter > 1){
                    world_dynamic[loop_counter]['x'] -= 400;
                }
            }while(loop_counter--);

            // Randomly pick next obstacle.
            var obstacle = random_number(4);

            // Lava pit obstacle.
            if(obstacle === 0){
                world_dynamic.push(
                  {
                    'height': 75,
                    'type': 1,
                    'width': 50,
                    'x': player['x'] + x,
                    'y': -25,
                  },
                  {
                    'height': 50,
                    'type': 3,
                    'width': 175,
                    'x': player['x'] + x + 50,
                    'y': 0,
                  },
                  {
                    'height': 25,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x + 50 + random_number(150),
                    'y': 25,
                    'y-speed': 2,
                    'y-target-max': 25,
                    'y-target-min': -200,
                  },
                  {
                    'height': 75,
                    'type': 1,
                    'width': 50,
                    'x': player['x'] + x + 225,
                    'y': -25,
                  }
                );

            // Booster obstacle.
            }else if(obstacle === 1){
                world_dynamic.push(
                  {
                    'height': 200,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x,
                    'y': -200,
                  },
                  {
                    'boost': -14,
                    'height': 25,
                    'type': 4,
                    'width': 25,
                    'x': player['x'] + x + 75,
                    'y': 25,
                  },
                  {
                    'height': 175,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x + 100,
                    'y': -125,
                  }
                );

            // Wall backtrack obstacle.
            }else if(obstacle === 2){
                world_dynamic.push(
                  {
                    'height': 200,
                    'type': 1,
                    'width': 25,
                    'x': player['x'] + x + 25,
                    'y': -200,
                  },
                  {
                    'height': 25,
                    'type': 1,
                    'width': 25,
                    'x': player['x'] + x + 50,
                    'y': -25,
                  },
                  {
                    'height': 175,
                    'type': 1,
                    'width': 25,
                    'x': player['x'] + x + 175,
                    'y': -125,
                  }
                );

            // Lava pillars obstacle.
            }else{
                world_dynamic.push(
                  {
                    'height': 50,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x,
                    'y': 0,
                  },
                  {
                    'height': 75,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x + 100,
                    'y': -25,
                  },
                  {
                    'height': 50,
                    'type': 3,
                    'width': 25,
                    'x': player['x'] + x + 200,
                    'y': 0,
                  }
                );
            }
            update_static_buffer();
        }

        // Set lava wall goal to player position to keep it moving.
        world_dynamic[0]['x-target-max'] = player['x'];

        // Reset floor X position to match player position.
        world_dynamic[1]['x'] = player['x'] - 50;

        // Delete objects that are eaten by the lava wall.
        var loop_counter = world_dynamic.length - 1;
        do{
            if(loop_counter > 1
              && world_dynamic[loop_counter]['x'] < world_dynamic[0]['x']){
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
            {
              'height': 300,
              'type': 1,
              'width': 25,
              'x': (total_tiles * 200) / 2 + 200,
              'y': -175,
            },
            {
              'height': 300,
              'type': 's',
              'width': 25,
              'x': (-total_tiles * 200) / 2 - 200,
              'y': -175,
            },
            {
              'height': 300,
              'type': 2,
              'width': 25,
              'x': (-total_tiles * 200) / 2 - 225,
              'y': -175,
            },
          ],
          [
            {
              'height': 300,
              'type': 1,
              'width': 25,
              'x': (-total_tiles * 200) / 2 - 225,
              'y': -175,
            },
            {
              'height': 300,
              'type': 's',
              'width': 25,
              'x': (total_tiles * 200) / 2 + 175,
              'y': -175,
            },
            {
              'height': 300,
              'type': 2,
              'width': 25,
              'x': (total_tiles * 200) / 2 + 200,
              'y': -175,
            },
          ],
        ][side];

        var tree_y = random_number(100);
        world_static = [
          {
            'blue': random_number(256),
            'green': random_number(256),
            'height': 75,
            'red': random_number(256),
            'width': 75,
            'x': -100,
            'y': -50 - tree_y,
          },
          {
            'blue': 0,
            'green': 100,
            'height': -50 - tree_y,
            'red': 190,
            'width': 25,
            'x': -75,
            'y': 50,
          },
        ];

        world_dynamic.push({
          'height': 75,
          'type': 1,
          'width': 200,
          'x': -100,
          'y': 50,
        });

        do{
            var tile_type = random_number(9);
            var tile_middle_x = (-total_tiles * 200) / 2 + tile_count * 200 + (tile_count >= total_tiles / 2 ? 0 : -200);

            if(tile_count === 0){
                endtile_left = tile_type;

            }else if(tile_count === total_tiles){
                endtile_right = tile_type;
            }

            world_dynamic.push({
              'height': 50,
              'type': 3,
              'width': 200,
              'x': tile_middle_x,
              'y': 75,
            });

            if(tile_type === 1){
                world_dynamic.push(
                  {
                    'height': 175,
                    'type': 3,
                    'width': 25,
                    'x': tile_middle_x + 85,
                    'y': -100,
                  },
                  Math.random() > .5
                    ? {
                        'height': 25,
                        'type': 1,
                        'width': 55,
                        'x': tile_middle_x + 70,
                        'x-speed': Math.random() > .5
                          ? 1
                          : -1,
                        'x-target-max': tile_middle_x + 110,
                        'x-target-min': tile_middle_x + 30,
                        'y': -25,
                      }
                    : {
                        'height': 25,
                        'type': 1,
                        'width': 65,
                        'x': tile_middle_x + 65,
                        'y': 0,
                        'y-speed': Math.random() > .5
                          ? 1
                          : -1,
                        'y-target-max': 75,
                        'y-target-min': -25,
                      }
                );

            }else if(tile_type === 0
              || tile_type === 3){
                if(Math.random() < .25){
                    world_dynamic.push(
                      {
                        'height': 100,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 45,
                        'y': -25,
                        'y-speed': Math.random() < .2
                          ? 1
                          : 0,
                        'y-target-max': -25,
                        'y-target-min': -175,
                      },
                      {
                        'height': 100,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 130,
                        'y': -25,
                        'y-speed': Math.random() < .2
                          ? 1
                          : 0,
                        'y-target-max': -25,
                        'y-target-min': -175,
                      },
                      {
                        'height': 25,
                        'type': 1,
                        'width': 200,
                        'x': tile_middle_x,
                        'y': 50,
                      }
                    );
                }else if(Math.random() < .5){
                    world_dynamic.push(
                      {
                        'height': 75,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x,
                        'y': 0,
                        'y-speed': Math.random() < .2
                          ? 1
                          : 0,
                        'y-target-max': 0,
                        'y-target-min': -175,
                      },
                      {
                        'height': 100,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 87.5,
                        'y': -25,
                        'y-speed': Math.random() < .2
                          ? 1
                          : 0,
                        'y-target-max': -25,
                        'y-target-min': -175,
                      },
                      {
                        'height': 75,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 175,
                        'y': 0,
                        'y-speed': Math.random() < .2
                          ? 1
                          : 0,
                        'y-target-max': 0,
                        'y-target-min': -175,
                      },
                      {
                        'height': 25,
                        'type': 1,
                        'width': 200,
                        'x': tile_middle_x,
                        'y': 50,
                      }
                    );
                }else{
                    world_dynamic.push(
                      {
                        'height': 100,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + random_number(175),
                        'x-speed': Math.random() < .4
                          ? 1
                          : 0,
                        'x-target-max': tile_middle_x,
                        'x-target-min': tile_middle_x + 175,
                        'y': -25,
                      },
                      {
                        'height': 25,
                        'type': 1,
                        'width': 200,
                        'x': tile_middle_x,
                        'y': 50,
                      }
                    );
                }

            }else if(tile_type === 2
              || tile_type === 4){
                if(Math.random() < .4){
                    world_dynamic.push(
                      {
                        'height': 25,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 40,
                        'y': 100 - random_number(275),
                        'y-speed': 2,
                        'y-target-max': 100,
                        'y-target-min': -175,
                      }
                    );
                }
                if(Math.random() < .4){
                    world_dynamic.push(
                      {
                        'height': 25,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + 135,
                        'y': 100 - random_number(275),
                        'y-speed': 2,
                        'y-target-max': 100,
                        'y-target-min': -175,
                      }
                    );
                }
                world_dynamic.push({
                  'height': 25,
                  'type': 1,
                  'width': 25,
                  'x': tile_middle_x + 85,
                  'y': 50,
                });

            }else if(tile_type === 5){
                if(Math.random() < .2){
                    world_dynamic.push(
                      {
                        'boost': -12,
                        'height': 25,
                        'type': 4,
                        'width': 25,
                        'x': tile_middle_x + random_number(175),
                        'x-speed': Math.random() < .5
                          ? 2
                          : -2,
                        'x-target-max': tile_middle_x + 175,
                        'x-target-min': tile_middle_x,
                        'y': -65,
                      },
                      {
                        'height': 25,
                        'type': 3,
                        'width': 200,
                        'x': tile_middle_x,
                        'y': -200,
                      }
                    );
                }else{
                    world_dynamic.push(
                      {
                        'height': 25,
                        'type': 3,
                        'width': 25,
                        'x': tile_middle_x + random_number(175),
                        'x-speed': Math.random() < .5
                          ? 2
                          : -2,
                        'x-target-max': tile_middle_x + 175,
                        'x-target-min': tile_middle_x,
                        'y': -65,
                      }
                    );
                }
                world_dynamic.push({
                  'boost': -12,
                  'height': 25,
                  'type': 4,
                  'width': 200,
                  'x': tile_middle_x,
                  'y': 60,
                });

            }else if(tile_type === 6){
                if(Math.random() < .6){
                    if(Math.random() < .5){
                        world_dynamic.push(
                          {
                            'height': 25,
                            'type': 3,
                            'width': 25,
                            'x': tile_middle_x + 50,
                            'y': 100 - random_number(275),
                            'y-speed': Math.random() < .5
                              ? 2
                              : -2,
                            'y-target-max': 100,
                            'y-target-min': -175,
                          },
                          {
                            'height': 25,
                            'type': 3,
                            'width': 25,
                            'x': tile_middle_x + 125,
                            'y': 100 - random_number(275),
                            'y-speed': Math.random() < .5
                              ? 2
                              : -2,
                            'y-target-max': 100,
                            'y-target-min': -175,
                          }
                        );
                    }else{
                        world_dynamic.push({
                          'height': 25,
                          'type': 3,
                          'width': 25,
                          'x': tile_middle_x + (Math.random() * 125) + 25,
                          'y': 100 - random_number(275),
                          'y-speed': 2,
                          'y-target-max': 100,
                          'y-target-min': -175,
                        });
                    }
                }
                world_dynamic.push(
                  {
                    'height': 75,
                    'type': 1,
                    'width': 25,
                    'x': tile_middle_x,
                    'y': 0,
                  },
                  {
                    'height': 75,
                    'type': 1,
                    'width': 25,
                    'x': tile_middle_x + 175,
                    'y': 0,
                  }
                );

            }else if(tile_type === 7){
                world_dynamic.push({
                  'height': 75,
                  'type': 1,
                  'width': 200,
                  'x': tile_middle_x,
                  'y': 50,
                });
                var tree_x = random_number(175);
                tree_y = random_number(100);
                world_static.push({
                  'blue': random_number(256),
                  'green': random_number(256),
                  'red': random_number(256),
                  'height': 75,
                  'width': 75,
                  'x': tile_middle_x + tree_x - 25,
                  'y': -50 - tree_y,
                });
                world_static.push({
                  'blue': 0,
                  'green': 100,
                  'red': 190,
                  'height': -50 - tree_y,
                  'width': 25,
                  'x': tile_middle_x + tree_x,
                  'y': 50,
                });

            }else if(tile_type === 8){
                world_dynamic.push(
                  {
                    'height': 75,
                    'type': 1,
                    'width': 50,
                    'x': tile_middle_x,
                    'y': 0,
                  },
                  {
                    'height': 75,
                    'type': 1,
                    'width': 50,
                    'x': tile_middle_x + 150,
                    'y': 0,
                  },
                  {
                    'height': 25,
                    'type': 1,
                    'width': 100,
                    'x': tile_middle_x + 50,
                    'y': 50,
                  },
                  {
                    'height': 50,
                    'type': 3,
                    'width': 200,
                    'x': tile_middle_x,
                    'y': -random_number(150) - 25,
                    'y-speed': Math.random() < .5
                      ? 1.5
                      : -1.5,
                    'y-target-max': -50,
                    'y-target-min': -175,
                  }
                );
            }
            world_dynamic.push({
              'height': 15,
              'type': 1,
              'width': 200,
              'x': tile_middle_x + (tile_count > total_tiles / 2 ? 0 : 200),
              'y': -190,
            });
        }while(tile_count--);

        world_dynamic.push({
          'height': 15,
          'type': 1,
          'width': 200,
          'x': tile_middle_x,
          'y': -190,
        });

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

            world_dynamic.push({
              'height': 40,
              'type': 5,
              'width': 50,
              'x': key_x,
              'y': key_y,
            });

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

            world_dynamic.push({
              'height': 40,
              'type': 5,
              'width': 50,
              'x': key_x,
              'y': key_y,
            });
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
          {
            'height': 250,
            'type': 3,
            'width': 50,
            'x': -250,
            'x-speed': 3,
            'x-target-max': 200,
            'x-target-min': -250,
            'y': -200,
          },
          {
            'height': 25,
            'type': 1,
            'width': 100,
            'x': -50,
            'y': 50,
          }
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
            {
              'height': 200,
              'type': 1,
              'width': 25,
              'x': -45,
              'y': -150,
            },
            {
              'height': 500,
              'type': 1,
              'width': 245,
              'x': -45,
              'y': 50,
            },
            {
              'height': 565,
              'type': 1,
              'width': 25,
              'x': 350,
              'y': -150,
            },
            {
              'height': 25,
              'type': 1,
              'width': 100,
              'x': 375,
              'y': 250,
            },
            {
              'height': 25,
              'type': 1,
              'width': 100,
              'x': 375,
              'y': 390,
            },
            {
              'height': 25,
              'type': 1,
              'width': 175,
              'x': 400,
              'y': 475,
            },
            {
              'height': 175,
              'type': 1,
              'width': 50,
              'x': 575,
              'y': 325,
            },
            {
              'height': 25,
              'type': 1,
              'width': 25,
              'x': 160,
              'y': 575,
            },
            {
              'height': 500,
              'type': 1,
              'width': 25,
              'x': 600,
              'y': -150,
            },
            {
              'height': 25,
              'type': 2,
              'width': 25,
              'x': 575,
              'y': -125,
            },
            {
              'height': 25,
              'type': 3,
              'width': 400,
              'x': 200,
              'y': 525,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 500,
              'y': -150,
              'y-speed': 5,
              'y-target-max': 450,
              'y-target-min': -125,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 525,
              'y': 450,
              'y-speed': 4,
              'y-target-max': 450,
              'y-target-min': -125,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 375,
              'x-speed': 5,
              'x-target-max': 575,
              'x-target-min': 375,
              'y': -50,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 575,
              'x-speed': 5,
              'x-target-max': 575,
              'x-target-min': 375,
              'y': 275,
            },
            {
              'boost': -13,
              'height': 25,
              'type': 4,
              'width': 25,
              'x': 400,
              'y': 75,
            },
            {
              'height': 50,
              'type': 5,
              'width': 50,
              'x': 200,
              'y': 75,
            },
            {
              'height': 50,
              'type': 5,
              'width': 50,
              'x': 300,
              'y': 215,
            },
            {
              'height': 50,
              'type': 5,
              'width': 50,
              'x': 200,
              'y': 350,
            },
            {
              'height': 25,
              'type': 's',
              'width': 200,
              'x': 200,
              'y': 475,
            },
          ],
          [
            {
              'height': 25,
              'type': 1,
              'width': 595,
              'x': -45,
              'y': -1050,
            },
            {
              'height': 1160,
              'type': 1,
              'width': 25,
              'x': -45,
              'y': -1025,
            },
            {
              'height': 85,
              'type': 1,
              'width': 295,
              'x': -20,
              'y': 50,
            },
            {
              'height': 1160,
              'type': 1,
              'width': 25,
              'x': 525,
              'y': -1025,
            },
            {
              'height': 25,
              'type': 2,
              'width': 25,
              'x': 275,
              'y': -400,
            },
            {
              'height': 75,
              'type': 3,
              'width': 25,
              'x': 150,
              'y': -725,
            },
            {
              'height': 25,
              'type': 3,
              'width': 345,
              'x': -20,
              'y': -375,
            },
            {
              'height': 25,
              'type': 3,
              'width': 75,
              'x': 225,
              'y': -700,
            },
            {
              'height': 50,
              'type': 3,
              'width': 250,
              'x': 275,
              'y': 85,
            },
            {
              'height': 550,
              'type': 3,
              'width': 25,
              'x': 300,
              'y': -925,
            },
            {
              'height': 25,
              'type': 3,
              'width': 75,
              'x': 325,
              'y': -800,
            },
            {
              'height': 375,
              'type': 3,
              'width': 25,
              'x': 375,
              'y': -290,
            },
            {
              'height': 25,
              'type': 3,
              'width': 125,
              'x': 400,
              'y': -540,
            },
            {
              'height': 600,
              'type': 3,
              'width': 25,
              'x': 500,
              'y': -515,
            },
            {
              'boost': -20,
              'height': 25,
              'type': 4,
              'width': 100,
              'x': 275,
              'y': 60,
            },
            {
              'boost': -20,
              'height': 25,
              'type': 4,
              'width': 125,
              'x': 400,
              'y': -565,
            },
            {
              'boost': -26,
              'height': 25,
              'type': 4,
              'width': 100,
              'x': 400,
              'y': 60,
            },
          ],
          [
            {
              'height': 25,
              'type': 1,
              'width': 1300,
              'x': -45,
              'y': -150,
            },
            {
              'height': 335,
              'type': 1,
              'width': 25,
              'x': -45,
              'y': -125,
            },
            {
              'height': 25,
              'type': 1,
              'width': 210,
              'x': -20,
              'y': 50,
            },
            {
              'height': 85,
              'type': 1,
              'width': 300,
              'x': -20,
              'y': 125,
            },
            {
              'height': 50,
              'type': 3,
              'width': 950,
              'x': 280,
              'y': 135,
            },
            {
              'height': 25,
              'type': 1,
              'width': 205,
              'x': 425,
              'y': 50,
            },
            {
              'height': 60,
              'type': 1,
              'width': 50,
              'x': 500,
              'y': 75,
            },
            {
              'height': 25,
              'type': 1,
              'width': 223,
              'x': 775,
              'y': 75,
            },
            {
              'height': 335,
              'type': 1,
              'width': 25,
              'x': 1230,
              'y': -125,
            },
            {
              'height': 25,
              'type': 2,
              'width': 25,
              'x': 1205,
              'y': 110,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 320,
              'y': 142,
              'y-speed': -3,
              'y-target-max': 150,
              'y-target-min': -64,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 675,
              'y': -60,
              'y-speed': -3,
              'y-target-max': 150,
              'y-target-min': -75,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 700,
              'y': -60,
              'y-speed': -2,
              'y-target-max': 150,
              'y-target-min': -75,
            },
            {
              'height': 50,
              'type': 5,
              'width': 50,
              'x': -20,
              'y': 75,
            },
            {
              'height': 200,
              'type': 's',
              'width': 25,
              'x': 400,
              'y': -125,
            },
          ],
          [
            {
              'height': 25,
              'type': 1,
              'width': 475,
              'x': -430,
              'y': -150,
            },
            {
              'height': 600,
              'type': 1,
              'width': 25,
              'x': -430,
              'y': -125,
            },
            {
              'height': 25,
              'type': 1,
              'width': 900,
              'x': -430,
              'y': 475,
            },
            {
              'height': 25,
              'type': 1,
              'width': 500,
              'x': -405,
              'y': 250,
            },
            {
              'height': 25,
              'type': 1,
              'width': 400,
              'x': -355,
              'y': 50,
            },
            {
              'height': 200,
              'type': 1,
              'width': 25,
              'x': 20,
              'y': -125,
            },
            {
              'height': 25,
              'type': 1,
              'width': 125,
              'x': 245,
              'y': 250,
            },
            {
              'height': 400,
              'type': 1,
              'width': 25,
              'x': 445,
              'y': -75,
            },
            {
              'height': 25,
              'type': 2,
              'width': 25,
              'x': -405,
              'y': 325,
            },
            {
              'height': 25,
              'type': 3,
              'width': 800,
              'x': -405,
              'y': 275,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': -305,
              'y': 420,
              'y-speed': -3,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': -205,
              'y': 420,
              'y-speed': 1,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': -105,
              'y': 420,
              'y-speed': 2,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': -5,
              'y': 365,
              'y-speed': -1,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 95,
              'y': 399,
              'y-speed': -2,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 25,
              'type': 3,
              'width': 25,
              'x': 195,
              'y': 411,
              'y-speed': 4,
              'y-target-max': 450,
              'y-target-min': 300,
            },
            {
              'height': 75,
              'type': 3,
              'width': 25,
              'x': 370,
              'y': 200,
            },
          ],
          [
            {
              'height': 239,
              'type': 1,
              'width': 35,
              'x': -715,
              'y': 36,
            },
            {
              'height': 15,
              'type': 1,
              'width': 135,
              'x': -715,
              'y': -175,
            },
            {
              'height': 151,
              'type': 1,
              'width': 320,
              'x': -680,
              'y': 124,
            },
            {
              'height': 25,
              'type': 1,
              'width': 50,
              'x': -600,
              'y': -50,
            },
            {
              'height': 170,
              'type': 1,
              'width': 28,
              'x': -428,
              'y': -120,
            },
            {
              'height': 275,
              'type': 1,
              'width': 16,
              'x': -360,
              'y': 0,
            },
            {
              'height': 25,
              'type': 1,
              'width': 196,
              'x': -296,
              'y': 124,
            },
            {
              'height': 25,
              'type': 1,
              'width': 60,
              'x': -160,
              'y': 0,
            },
            {
              'height': 25,
              'type': 1,
              'width': 80,
              'x': -40,
              'y': 48,
            },
            {
              'height': 395,
              'type': 1,
              'width': 16,
              'x': 105,
              'y': -120,
            },
            {
              'height': 125,
              'type': 2,
              'width': 25,
              'x': -715,
              'y': -300,
            },
            {
              'height': 196,
              'type': 3,
              'width': 25,
              'x': -715,
              'y': -160,
            },
            {
              'height': 25,
              'type': 3,
              'width': 140,
              'x': -690,
              'y': -160,
            },
            {
              'height': 50,
              'type': 3,
              'width': 50,
              'x': -550,
              'x-speed': -1,
              'x-target-max': -410,
              'x-target-min': -680,
              'y': 74,
            },
            {
              'height': 25,
              'type': 3,
              'width': 450,
              'x': -345,
              'y': 250,
            },
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
            {
              'blue': 0,
              'green': 0,
              'height': 675,
              'red': 0,
              'width': 625,
              'x': -25,
              'y': -150,
            },
          ],
          [
            {
              'blue': 40,
              'green': 40,
              'height': 1185,
              'red': 40,
              'width': 400,
              'x': -600,
              'y': -1125,
            },
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
            {
              'blue': 40,
              'green': 40,
              'height': 1185,
              'red': 40,
              'width': 400,
              'x': 700,
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
              'blue': 0,
              'green': 0,
              'height': 225,
              'red': 0,
              'width': 850,
              'x': -405,
              'y': 250,
            },
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
            {
              'blue': 0,
              'green': 0,
              'height': 125,
              'red': 0,
              'width': 450,
              'x': -343,
              'y': 125,
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
              'text': 'Village of the Wolves',
              'x': -660,
              'y': 100,
            },
          ],
        ][id];
    }
}
