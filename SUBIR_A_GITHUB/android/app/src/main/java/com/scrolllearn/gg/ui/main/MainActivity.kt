package com.scrolllearn.gg.ui.main

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader
import androidx.core.content.FileProvider
import android.provider.MediaStore
import com.scrolllearn.gg.util.AndroidWebBridge
import java.io.File
import java.net.URLConnection

class MainActivity : AppCompatActivity() {

    companion object {
        private const val APP_HOST_DOMAIN = "scrolllearn-gg.app"
        private const val START_URL = "https://scrolllearn-gg.app/index.html"
    }

    private var webView: WebView? = null
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var cameraCaptureUri: Uri? = null

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val callback = filePathCallback
        filePathCallback = null
        if (callback == null) {
            return@registerForActivityResult
        }

        if (result.resultCode == Activity.RESULT_OK) {
            val dataUri = result.data?.data
            val uris = if (dataUri != null) {
                arrayOf(dataUri)
            } else if (cameraCaptureUri != null) {
                arrayOf(cameraCaptureUri!!)
            } else {
                WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
            }
            callback.onReceiveValue(uris)
        } else {
            callback.onReceiveValue(null)
        }
    }

    private val assetLoader: WebViewAssetLoader by lazy {
        WebViewAssetLoader.Builder()
            .setDomain(APP_HOST_DOMAIN)
            .addPathHandler(
                "/",
                WebViewAssetLoader.PathHandler { path ->
                    openBundledAsset(path)
                }
            )
            .build()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val configuredWebView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#090D16"))

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = false
                allowContentAccess = true
                loadsImagesAutomatically = true
                mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
                cacheMode = WebSettings.LOAD_DEFAULT
                useWideViewPort = true
                loadWithOverviewMode = true
                setSupportZoom(false)
                builtInZoomControls = false
                displayZoomControls = false
                mediaPlaybackRequiresUserGesture = false
            }

            CookieManager.getInstance().setAcceptCookie(true)
            CookieManager.getInstance().setAcceptThirdPartyCookies(this, true)

            addJavascriptInterface(
                AndroidWebBridge(this@MainActivity) { webView },
                "AndroidBridge"
            )

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {
                    val uri = request.url ?: return false
                    val scheme = uri.scheme?.lowercase() ?: ""

                    if (scheme == "mailto" || scheme == "tel" || scheme == "whatsapp") {
                        openExternalUri(uri)
                        return true
                    }

                    if (uri.host.equals(APP_HOST_DOMAIN, ignoreCase = true)) {
                        return false
                    }

                    if (scheme == "http" || scheme == "https") {
                        openExternalUri(uri)
                        return true
                    }

                    return false
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onShowFileChooser(
                    webView: WebView,
                    filePathCallback: ValueCallback<Array<Uri>>,
                    fileChooserParams: FileChooserParams
                ): Boolean {
                    this@MainActivity.filePathCallback?.onReceiveValue(null)
                    this@MainActivity.filePathCallback = filePathCallback
                    cameraCaptureUri = null

                    return try {
                        val acceptTypes = fileChooserParams.acceptTypes ?: emptyArray()
                        val isImage = acceptTypes.any { it.contains("image", ignoreCase = true) }
                        val isPdf = acceptTypes.any { it.contains("pdf", ignoreCase = true) }
                        val isJsonOnly = acceptTypes.any { it.contains("json", ignoreCase = true) }

                        // Setup camera intent if capture is enabled or image is accepted
                        var takePictureIntent: Intent? = null
                        if (fileChooserParams.isCaptureEnabled || isImage) {
                            try {
                                val exportDir = File(cacheDir, "exports").apply { if (!exists()) mkdirs() }
                                val photoFile = File(exportDir, "comprobante_${System.currentTimeMillis()}.jpg")
                                val uri = FileProvider.getUriForFile(
                                    this@MainActivity,
                                    "${packageName}.fileprovider",
                                    photoFile
                                )
                                cameraCaptureUri = uri
                                takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                                    putExtra(MediaStore.EXTRA_OUTPUT, uri)
                                    addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                }
                            } catch (_: Exception) {
                                cameraCaptureUri = null
                            }
                        }

                        if (fileChooserParams.isCaptureEnabled && takePictureIntent != null) {
                            fileChooserLauncher.launch(takePictureIntent)
                            return true
                        }

                        val chooserTitle: String
                        val contentIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            if (isJsonOnly) {
                                type = "*/*"
                                chooserTitle = "Seleccionar archivo de respaldo (.json)"
                                putExtra(
                                    Intent.EXTRA_MIME_TYPES,
                                    arrayOf("application/json", "text/plain", "application/octet-stream")
                                )
                            } else if (isImage && isPdf) {
                                type = "*/*"
                                chooserTitle = "Seleccionar o tomar comprobante bancario"
                                putExtra(
                                    Intent.EXTRA_MIME_TYPES,
                                    arrayOf("image/*", "application/pdf")
                                )
                            } else if (isImage) {
                                type = "image/*"
                                chooserTitle = "Tomar foto o seleccionar comprobante"
                            } else {
                                type = "*/*"
                                chooserTitle = "Seleccionar archivo"
                            }
                        }

                        val chooserIntent = Intent.createChooser(contentIntent, chooserTitle).apply {
                            if (takePictureIntent != null) {
                                putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(takePictureIntent))
                            }
                        }

                        fileChooserLauncher.launch(chooserIntent)
                        true
                    } catch (e: Exception) {
                        this@MainActivity.filePathCallback = null
                        this@MainActivity.cameraCaptureUri = null
                        Toast.makeText(
                            this@MainActivity,
                            "No se pudo abrir la cámara o selector de archivos.",
                            Toast.LENGTH_SHORT
                        ).show()
                        false
                    }
                }
            }
        }

        webView = configuredWebView
        setContentView(configuredWebView)

        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    val currentWebView = webView
                    if (currentWebView != null && currentWebView.canGoBack()) {
                        currentWebView.goBack()
                    } else {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            }
        )

        if (savedInstanceState != null) {
            configuredWebView.restoreState(savedInstanceState)
        } else {
            configuredWebView.loadUrl(START_URL)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView?.saveState(outState)
    }

    override fun onDestroy() {
        webView?.apply {
            stopLoading()
            destroy()
        }
        webView = null
        super.onDestroy()
    }

    private fun openExternalUri(uri: Uri) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, uri)
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(
                this,
                "No se encontró una aplicación compatible para abrir este enlace.",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    private fun openBundledAsset(rawPath: String): WebResourceResponse? {
        val cleanPath = rawPath.trimStart('/').ifEmpty { "index.html" }
        val candidateAssetPath = "www/$cleanPath"

        return try {
            val stream = try {
                assets.open(candidateAssetPath)
            } catch (_: Exception) {
                if (!cleanPath.contains('.')) {
                    assets.open("www/index.html")
                } else {
                    return null
                }
            }

            val resolvedPath = if (!cleanPath.contains('.') && cleanPath != "index.html") {
                "index.html"
            } else {
                cleanPath
            }

            val mimeType = resolveMimeType(resolvedPath)
            val encoding = if (
                mimeType.startsWith("text/") ||
                mimeType == "application/json" ||
                mimeType == "image/svg+xml"
            ) {
                "UTF-8"
            } else {
                null
            }

            WebResourceResponse(mimeType, encoding, stream)
        } catch (_: Exception) {
            null
        }
    }

    private fun resolveMimeType(path: String): String {
        val lower = path.lowercase()
        return when {
            lower.endsWith(".html") -> "text/html"
            lower.endsWith(".js") || lower.endsWith(".mjs") -> "text/javascript"
            lower.endsWith(".css") -> "text/css"
            lower.endsWith(".json") -> "application/json"
            lower.endsWith(".svg") -> "image/svg+xml"
            lower.endsWith(".png") -> "image/png"
            lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".jfif") -> "image/jpeg"
            lower.endsWith(".webp") -> "image/webp"
            lower.endsWith(".ico") -> "image/x-icon"
            lower.endsWith(".woff2") -> "font/woff2"
            lower.endsWith(".woff") -> "font/woff"
            lower.endsWith(".ttf") -> "font/ttf"
            else -> URLConnection.guessContentTypeFromName(lower) ?: "application/octet-stream"
        }
    }
}
