package com.example.arview

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.Url
public val SERVER_URL = "https://tfg-backend-gu2x.onrender.com"
interface ApiService {

    @GET
    suspend fun getScenesFromUser(@Url url:String): List<SceneParameters>

}