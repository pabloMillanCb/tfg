package com.example.arview

import java.io.Serializable

data class SceneParameters(
    val animations: List<String>,
    val audio: String,
    val coordinates: List<Double>,
    val id: String,
    val image_url: String,
    val loop: Boolean,
    val model_url: String,
    val name: String,
    val scene_type: String,
    val uid: String
) : Serializable