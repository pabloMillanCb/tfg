package com.example.arview

data class Model(
    val animation: String,
    val model_url: String,
    val position: List<Float>,
    val rotation: List<Float>,
    val scale: Float
)