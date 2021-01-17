game.module('game.main')
    .require('game.assets', 'plugin.pixi')
    .body(function () {
        game.createScene('Main', {
            init: function () {
                this.pedal_timeout = -1
                this.max_speed = 280
                this.is_vehicle_iso = false
                this.is_vehicle_touched = false
                this.moving_speed = 0
                this.vehicle_scale = 0.4
                this.vehicle_turn_on = new game.Sound('audio/car_turn-on.m4a')
                this.world = new game.Container()
                // this.vehicle_idle_sound = new game.Sound('audio/car_idle--loop.m4a')
                // this.vehicle_idle_sound.volume = 0.3
                // this.vehicle_idle_sound.loop = true
                // this.vehicle_low_rpm = new game.Sound('audio/car_rpm--low-loop.m4a')
                // this.vehicle_low_rpm.loop = true
                // this.vehicle_low_rpm.volume = 0.1
                // this.vehicle_med_rpm = new game.Sound('audio/car_rpm--medium-loop.m4a')
                // this.vehicle_med_rpm.loop = true
                // this.vehicle_high_rpm = new game.Sound('audio/car_rpm--high-loop.m4a')
                // this.vehicle_high_rpm.loop = true
                this.sky_bg = new game.TilingSprite('assets/sky.jpg', game.width, game.height)
                this.sky_bg.position.set(0, -200)
                this.sky_bg.addTo(this.world)
                this.road_tile = new game.TilingSprite('assets/asphalt.jpg', game.width, 100)
                this.mountain_tile = new game.TilingSprite('assets/mountain1.png', game.width, game.height)
                this.mountain_tile2 = new game.TilingSprite('assets/mountain2.png', game.width, game.height)

                this.motion_blur = new game.filters.MotionBlurFilter()
                this.mps_blur = new game.filters.MotionBlurFilter()
                this.radial_blur = new game.filters.RadialBlurFilter()
                this.radial_blur.padding = 2
                this.radial_blur.kernelSize = 5
                this.radial_blur.center = [20, 20]

                this.mountain_tile.position.set(0, 0)
                this.mountain_tile2.position.set(0, -20)

                this.mountain_tile2.addTo(this.world)
                this.mountain_tile.addTo(this.world)

                this.roadside_tile = new game.TilingSprite('assets/roadside.png', game.width * 2, 200)

                this.roadside_tile.position.set(0, 510)
                this.roadside_tile.scale.x = this.roadside_tile.scale.y = 0.5

                this.roadside_tile.addTo(this.world)

                this.road_tile.position.set(0, game.height - 100)
                this.road_tile.addTo(this.world)

                this.ui_gauge = new game.Container()
                this.ui_gauge.position.set(960, 400)

                this.odometer = new game.Sprite('odometer.png')
                this.odometer.alpha = 0.6
                this.odometer_needle = new game.Sprite('odometer-needle.png')
                this.odometer.scale.x = this.odometer.scale.y = 0.6
                this.odometer_needle.scale.x = this.odometer_needle.scale.y = 0.55
                this.odometer_needle.position.set(this.odometer.width / 2, this.odometer.height / 2)
                this.odometer_needle.anchor.set(255, 11)

                this.mazdaspeed = new game.Container()
                this.mazdaspeed.position.set(150, 480)

                this.mazdaspeed.interactive = true
                var self = this
                this.mazdaspeed.mousedown = function () {
                    if (game.device.mobile) self.is_vehicle_touched = true
                }

                this.mazdaspeed.mouseup = function () {
                    if (game.device.mobile) self.is_vehicle_touched = false
                }

                this.mps_body = new game.Sprite('Mazda3MPS__mainframe.png')
                this.mps_mask = new game.Sprite('Mazda3MPS__mask.png')
                this.mps_ftyre = new game.Sprite('Mazda3MPS_tyre--front.png')
                this.mps_rtyre = new game.Sprite('Mazda3MPS_tyre--rear.png')

                this.mps_body.scale.x = this.mps_body.scale.y = this.vehicle_scale
                this.mps_mask.scale.x = this.mps_mask.scale.y = this.vehicle_scale
                this.mps_ftyre.scale.x = this.mps_ftyre.scale.y = this.vehicle_scale
                this.mps_rtyre.scale.x = this.mps_rtyre.scale.y = this.vehicle_scale

                this.mps_ftyre.anchor.set(110, 106)
                this.mps_rtyre.anchor.set(110, 106)
                this.mps_body.position.set(150, 0)
                this.mps_mask.position.set(150, 0)
                this.mps_ftyre.position.set(260, 160)
                this.mps_rtyre.position.set(620, 160)

                this.world.filters = [this.motion_blur]

                this.mps_mask.addTo(this.mazdaspeed)
                this.mps_body.addTo(this.mazdaspeed)
                this.mps_ftyre.addTo(this.mazdaspeed)
                this.mps_rtyre.addTo(this.mazdaspeed)

                this.mazdaspeed.filters = [this.mps_blur]

                this.odometer.addTo(this.ui_gauge)
                this.odometer_needle.addTo(this.ui_gauge)

                this.world.addTo(this.stage)
                this.mazdaspeed.addTo(this.stage)
                this.ui_gauge.addTo(this.stage)
            },
            toggleISO: function (is_iso) {
                this.is_vehicle_iso = is_iso
                if (is_iso) {
                    this.mps_body.setTexture('Mazda3MPS__mainframe-iso.png')
                    this.mps_ftyre.alpha = 0
                    this.mps_mask.alpha = 0
                    this.mps_rtyre.alpha = 0
                    this.mps_body.position.set(190, -12)
                } else {
                    this.mps_body.setTexture('Mazda3MPS__mainframe.png')
                    this.mps_ftyre.alpha = 1
                    this.mps_mask.alpha = 1
                    this.mps_rtyre.alpha = 1
                    this.mps_body.position.set(150, 0)
                }
            },
            releasePedal: function () {
                clearInterval(this.pedal_timeout)
                this.pedal_timeout = -1
            },
            pressPedal: function (gear) {
                var self = this
                if (this.pedal_timeout === -1) {
                    if (gear === 'reverse') {
                        self.reverse()
                    } else {
                        self.accelerate()
                    }
                }
            },
            accelerate: function () {
                var self = this
                var pedal_pressed_interval = 0
                var throttling_speed = this.moving_speed >= this.max_speed ? 0 : 1.5
                this.moving_speed += throttling_speed
                this.odometer_needle.rotation += 4 * game.delta
                this.pedal_timeout = setInterval(function () {
                    pedal_pressed_interval += 1
                    if (self.odometer_needle.rotation < 3.3) {
                        self.odometer_needle.rotation += 4 * game.delta
                    }
                    throttling_speed = self.moving_speed >= self.max_speed ? 0 : 1.5
                    self.moving_speed += throttling_speed * (1 + pedal_pressed_interval / 100)
                }, 25)
            },
            reverse: function () {
                var self = this
                this.moving_speed -= this.moving_speed <= -60 ? 0 : 1.5
                this.pedal_timeout = setInterval(function () {
                    self.moving_speed -= self.moving_speed <= -60 ? 0 : 1.5
                }, 90)
            },
            brakes: function () {
                var self = this
                var brakes_pressed_interval = 0
                if (this.moving_speed <= 0) {
                    this.moving_speed += this.moving_speed === 0 ? 0 : 1.5
                } else {
                    this.moving_speed -= this.moving_speed === 0 ? 0 : 1.5
                }
                this.pedal_timeout = setInterval(function () {
                    brakes_pressed_interval += 1
                    if (self.moving_speed <= 0) {
                        self.moving_speed += self.moving_speed === 0 ? 0 : 1.5
                    } else {
                        self.moving_speed -= self.moving_speed === 0 ? 0 : 1.5
                    }

                    if (brakes_pressed_interval > 120 || (brakes_pressed_interval > 30 && Math.abs(self.moving_speed) < 2)) {
                        self.moving_speed = 0
                    }
                }, 25)
            },
            keyup: function (key) {
                if (key === 'LEFT' || key === 'RIGHT' || key === 'SPACE') {
                    this.releasePedal()
                }
            },
            keydown: function (key) {
                if (key === 'V') {
                    if (this.moving_speed !== 0) {
                        return
                    }
                    this.toggleISO((this.is_vehicle_iso = !this.is_vehicle_iso))
                } else if (key === 'LEFT') {
                    this.releasePedal()
                    this.toggleISO(false)
                    this.pressPedal()
                } else if (key === 'RIGHT') {
                    this.releasePedal()
                    this.toggleISO(false)
                    this.pressPedal('reverse')
                } else if (key === 'SPACE') {
                    this.releasePedal()
                    this.brakes()
                }
            },
            update: function () {
                this.moving_speed -= this.moving_speed > 40 ? 0.5 : 0

                var world_blur_velocity = this.moving_speed * 0.084
                var radial_blur_angle = this.moving_speed * 0.0214
                this.motion_blur.velocity = [world_blur_velocity > 30 ? 30 : world_blur_velocity, 0]
                this.radial_blur.angle = [radial_blur_angle > 6] ? 6 : radial_blur_angle

                if (this.moving_speed > 260) {
                    this.mps_ftyre.filters = this.mps_rtyre.filters = [this.radial_blur]
                } else {
                    this.mps_ftyre.filters = this.mps_rtyre.filters = []
                }
                if (this.moving_speed > 240) {
                    var car_velocity = this.moving_speed * 0.0357
                    this.mps_blur.velocity = [car_velocity > 10 ? 10 : car_velocity, 0]
                } else {
                    this.mps_blur.velocity = [0, 0]
                }

                this.mountain_tile.tilePosition.x += this.moving_speed * 0.97 * game.delta
                this.mountain_tile2.tilePosition.x += this.moving_speed * 0.95 * game.delta
                this.sky_bg.tilePosition.x += (this.moving_speed < 10 ? 10 : this.moving_speed) * 0.7 * game.delta
                this.roadside_tile.tilePosition.x += this.moving_speed * 20 * game.delta
                this.road_tile.tilePosition.x += this.moving_speed * 10 * game.delta
                this.mps_ftyre.rotation -= this.moving_speed * 0.3 * game.delta
                this.mps_rtyre.rotation -= this.moving_speed * 0.3 * game.delta
                if (this.odometer_needle.rotation >= -0.37) {
                    this.odometer_needle.rotation -= 1 * game.delta
                }
            },
        })
    })
