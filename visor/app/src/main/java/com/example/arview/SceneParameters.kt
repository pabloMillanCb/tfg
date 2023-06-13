package com.example.arview

data class SceneParameters(
    val coordinates: List<Double>,
    val image_url: String,
    val loop: Boolean,
    val model_url: String,
    val animations: List<String>,
    val name: String,
    val sound: String,
    val type: String
)