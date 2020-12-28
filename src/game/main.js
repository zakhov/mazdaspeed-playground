game.module('game.main')
    .require('game.assets', 'plugin.pixi')
    .body(function () {
        game.createScene('Main', {
            init: function () {
                this.moving_speed = 0
                this.vehicle_scale = 0.4
                this.sky_bg = new game.TilingSprite('assets/sky.jpg', game.width, game.height)
                this.sky_bg.position.set(0, -200)
                this.sky_bg.addTo(this.stage)
                this.road_tile = new game.TilingSprite('assets/asphalt.jpg', game.width, 100)
                this.mountain_tile = new game.TilingSprite('assets/mountain1.png', game.width, game.height)
                this.mountain_tile2 = new game.TilingSprite('assets/mountain2.png', game.width, game.height)
                this.mountain_tile.position.set(0, 0)
                this.mountain_tile2.position.set(0, -20)

                this.mountain_tile2.addTo(this.stage)
                this.mountain_tile.addTo(this.stage)

                this.roadside_tile = new game.TilingSprite('assets/roadside.png', game.width * 2, 200)
                this.roadside_tile.position.set(0, 510)
                this.roadside_tile.scale.x = this.roadside_tile.scale.y = 0.5
                this.roadside_tile.addTo(this.stage)

                this.road_tile.position.set(0, game.height - 100)
                this.road_tile.addTo(this.stage)

                this.mazdaspeed = new game.Container()
                this.mazdaspeed.position.set(150, 480)

                this.mps_body_iso = new game.Sprite('Mazda3MPS__mainframe-iso.png')
                this.mps_body = new game.Sprite('Mazda3MPS__mainframe.png')
                this.mps_mask = new game.Sprite('Mazda3MPS__mask.png')
                this.mps_ftyre = new game.Sprite('Mazda3MPS_tyre--front.png')
                this.mps_rtyre = new game.Sprite('Mazda3MPS_tyre--rear.png')

                this.mps_body.scale.x = this.mps_body.scale.y = this.vehicle_scale
                this.mps_body_iso.scale.x = this.mps_body_iso.scale.y = this.vehicle_scale
                this.mps_mask.scale.x = this.mps_mask.scale.y = this.vehicle_scale
                this.mps_ftyre.scale.x = this.mps_ftyre.scale.y = this.vehicle_scale
                this.mps_rtyre.scale.x = this.mps_rtyre.scale.y = this.vehicle_scale

                this.mps_ftyre.anchor.set(110, 106)
                this.mps_rtyre.anchor.set(110, 106)
                this.mps_body_iso.position.set(180, 0)
                this.mps_body.position.set(150, 0)
                this.mps_mask.position.set(150, 0)
                this.mps_ftyre.position.set(260, 160)
                this.mps_rtyre.position.set(620, 160)

                this.mps_mask.addTo(this.mazdaspeed)
                this.mps_body.addTo(this.mazdaspeed)
                this.mps_ftyre.addTo(this.mazdaspeed)
                this.mps_rtyre.addTo(this.mazdaspeed)

                this.mazdaspeed.addTo(this.stage)
                // this.mps_body_iso.addTo(this.stage);
            },
            update: function () {
                if (game.keyboard.down('SPACE')) this.moving_speed += 1
                else {
                    this.moving_speed -= this.moving_speed > 0 ? 1 : 0
                }
                this.mountain_tile.tilePosition.x += this.moving_speed * 0.97 * game.delta
                this.mountain_tile2.tilePosition.x += this.moving_speed * 0.95 * game.delta
                this.sky_bg.tilePosition.x += (this.moving_speed < 10 ? 10 : this.moving_speed) * 0.7 * game.delta
                this.roadside_tile.tilePosition.x += this.moving_speed * 20 * game.delta
                this.road_tile.tilePosition.x += this.moving_speed * 10 * game.delta
                this.mps_ftyre.rotation -= this.moving_speed * 0.3 * game.delta
                this.mps_rtyre.rotation -= this.moving_speed * 0.3 * game.delta
            },
        })
    })
