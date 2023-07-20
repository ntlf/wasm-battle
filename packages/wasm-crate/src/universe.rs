use wasm_bindgen::prelude::*;

use crate::utils::{self, get_random};

use self::object::Object;

pub mod object;

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    object_size: u32,

    objects: Vec<Object>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32, object_size: u32, val: JsValue) -> Universe {
        utils::set_panic_hook();

        let objects: Vec<Object> = serde_wasm_bindgen::from_value(val).unwrap();

        Universe {
            width,
            height,
            object_size,
            objects,
        }
    }

    pub fn tick(&mut self) {
        let mut next = self.objects.clone();

        self.objects
            .iter()
            .enumerate()
            .for_each(|(index, current)| {
                let hunter_weight = -0.5;
                let prey_weight = 2.0;
                let team_weight = -0.05;
                let obstacle_weight = -0.2;

                let mut x = 0.0;
                let mut y = 0.0;

                let wall_n = (current.x, 0.0_f32);
                let wall_e = (self.width as f32, current.y);
                let wall_s = (current.x, self.height as f32);
                let wall_w = (0.0_f32, current.y);

                for wall in [wall_n, wall_e, wall_s, wall_w].iter() {
                    let distance =
                        ((wall.0 - current.x).powi(2) + (wall.1 - current.y).powi(2)).sqrt();

                    if distance > 0.0 {
                        x += (wall.0 - current.x) / distance * obstacle_weight / distance;
                        y += (wall.1 - current.y) / distance * obstacle_weight / distance;
                    }
                }

                let mut target: Option<(usize, f32)> = None;

                for (i, object) in self.objects.iter().enumerate() {
                    if i == index {
                        continue;
                    }

                    let distance = self.distance(current, object);

                    if object.t == current.get_target_type() {
                        if distance < self.object_size as f32 && next[index].t == current.t {
                            next[i].t = current.t;
                        }

                        if let Some((_, min_distance)) = target {
                            if distance < min_distance {
                                target = Some((i, distance));
                            }
                        } else {
                            target = Some((i, distance));
                        }

                        continue;
                    } else if distance > self.object_size as f32 * 5.0 {
                        continue;
                    }

                    let weight = if current.t == object.get_target_type() {
                        hunter_weight
                    } else {
                        team_weight
                    };

                    if distance != 0.0 {
                        x += (object.x - current.x) / distance * weight / distance;
                        y += (object.y - current.y) / distance * weight / distance;
                    }
                }

                if let Some((i, distance)) = target {
                    if distance != 0.0 {
                        x += (self.objects[i].x - current.x) / distance * prey_weight / distance;
                        y += (self.objects[i].y - current.y) / distance * prey_weight / distance;
                    }
                }

                let distance = (x.powi(2) + y.powi(2)).sqrt();

                let speed = if get_random() > 0.2 { 1.0 } else { 0.2 };

                let normalized_x = x / distance * speed;
                let normalized_y = y / distance * speed;

                next[index].x += normalized_x;
                next[index].y += normalized_y;
                next[index].move_x = normalized_x;
                next[index].move_y = normalized_y;
            });

        self.objects = next;
    }

    fn distance(&self, a: &Object, b: &Object) -> f32 {
        let distance_x = a.x - b.x;
        let distance_y = a.y - b.y;

        (distance_x.powi(2) + distance_y.powi(2)).sqrt()
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn object_size(&self) -> u32 {
        self.object_size
    }

    pub fn objects(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.objects).unwrap()
    }
}
