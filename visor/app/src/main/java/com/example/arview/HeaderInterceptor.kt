package com.example.arview

import android.util.Log
import okhttp3.Interceptor
import okhttp3.Response

class HeaderInterceptor(token: String): Interceptor {

    val token: String = token

    override fun intercept(chain: Interceptor.Chain): Response {
        Log.d("get", "inside inerceptor")
        val request = chain.request().newBuilder().addHeader(
            "Authorization", "Bearer " + token
        )
            .build()
        return chain.proceed(request)
    }
}