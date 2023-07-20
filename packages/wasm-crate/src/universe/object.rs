use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum ObjectType {
    Rock = 0,
    Paper = 1,
    Scissors = 2,
}

#[wasm_bindgen(js_name = RsObject)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Object {
    pub t: ObjectType,

    pub x: f32,
    pub y: f32,

    pub move_x: f32,
    pub move_y: f32,
}

impl Object {
    pub fn get_target_type(&self) -> ObjectType {
        match self.t {
            ObjectType::Rock => ObjectType::Scissors,
            ObjectType::Paper => ObjectType::Rock,
            ObjectType::Scissors => ObjectType::Paper,
        }
    }
}
