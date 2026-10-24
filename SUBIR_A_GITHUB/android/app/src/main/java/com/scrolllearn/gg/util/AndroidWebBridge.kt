package com.scrolllearn.gg.util

import android.app.Activity
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Environment
import android.print.PrintAttributes
import android.print.PrintManager
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import androidx.core.content.FileProvider
import java.io.File

class AndroidWebBridge(
    private val activity: Activity,
    private val webViewProvider: () -> WebView?
) {

    @JavascriptInterface
    fun isNativeAndroid(): Boolean {
        return true
    }

    @JavascriptInterface
    fun printDocument(jobName: String) {
        activity.runOnUiThread {
            try {
                val webView = webViewProvider() ?: return@runOnUiThread
                val printManager = activity.getSystemService(Context.PRINT_SERVICE) as? PrintManager
                if (printManager == null) {
                    Toast.makeText(
                        activity,
                        "El servicio de impresión no está disponible en este dispositivo.",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@runOnUiThread
                }

                val safeJobName = jobName.ifBlank { "Reporte_Iglesia_Celebracion" }
                val printAdapter = webView.createPrintDocumentAdapter(safeJobName)
                val attributes = PrintAttributes.Builder()
                    .setMediaSize(PrintAttributes.MediaSize.NA_LETTER)
                    .build()

                printManager.print(safeJobName, printAdapter, attributes)
            } catch (e: Exception) {
                Toast.makeText(
                    activity,
                    "No se pudo abrir la vista de impresión o PDF.",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    @JavascriptInterface
    fun saveOrShareFile(fileName: String, mimeType: String, content: String) {
        activity.runOnUiThread {
            try {
                val cleanFileName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
                    .ifBlank { "Respaldo_Iglesia_Celebracion.json" }
                val cleanMimeType = mimeType.substringBefore(";").ifBlank { "application/octet-stream" }
                val bytes = content.toByteArray(Charsets.UTF_8)

                var savedToDownloads = false
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    try {
                        val values = ContentValues().apply {
                            put(MediaStore.Downloads.DISPLAY_NAME, cleanFileName)
                            put(MediaStore.Downloads.MIME_TYPE, cleanMimeType)
                            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                        }
                        val resolver = activity.contentResolver
                        val downloadUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                        if (downloadUri != null) {
                            resolver.openOutputStream(downloadUri)?.use { out ->
                                out.write(bytes)
                            }
                            savedToDownloads = true
                        }
                    } catch (_: Exception) {
                        savedToDownloads = false
                    }
                }

                val exportDir = File(activity.cacheDir, "exports")
                if (!exportDir.exists()) {
                    exportDir.mkdirs()
                }
                val tempFile = File(exportDir, cleanFileName)
                tempFile.writeBytes(bytes)

                val fileUri = FileProvider.getUriForFile(
                    activity,
                    "${activity.packageName}.fileprovider",
                    tempFile
                )

                if (savedToDownloads) {
                    Toast.makeText(
                        activity,
                        "Guardado en Descargas: $cleanFileName",
                        Toast.LENGTH_LONG
                    ).show()
                }

                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = cleanMimeType
                    putExtra(Intent.EXTRA_STREAM, fileUri)
                    putExtra(Intent.EXTRA_SUBJECT, cleanFileName)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }

                activity.startActivity(
                    Intent.createChooser(shareIntent, "Guardar o compartir $cleanFileName")
                )
            } catch (e: Exception) {
                Toast.makeText(
                    activity,
                    "No se pudo exportar el archivo en el dispositivo.",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    @JavascriptInterface
    fun saveOrShareBase64File(fileName: String, mimeType: String, base64Data: String) {
        activity.runOnUiThread {
            try {
                val cleanFileName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
                    .ifBlank { "Comprobante_Bancario.jpg" }
                val cleanMimeType = mimeType.substringBefore(";").ifBlank { "image/jpeg" }
                val bytes = Base64.decode(base64Data, Base64.DEFAULT)

                var savedToDownloads = false
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    try {
                        val values = ContentValues().apply {
                            put(MediaStore.Downloads.DISPLAY_NAME, cleanFileName)
                            put(MediaStore.Downloads.MIME_TYPE, cleanMimeType)
                            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                        }
                        val resolver = activity.contentResolver
                        val downloadUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                        if (downloadUri != null) {
                            resolver.openOutputStream(downloadUri)?.use { out ->
                                out.write(bytes)
                            }
                            savedToDownloads = true
                        }
                    } catch (_: Exception) {
                        savedToDownloads = false
                    }
                }

                val exportDir = File(activity.cacheDir, "exports")
                if (!exportDir.exists()) {
                    exportDir.mkdirs()
                }
                val tempFile = File(exportDir, cleanFileName)
                tempFile.writeBytes(bytes)

                val fileUri = FileProvider.getUriForFile(
                    activity,
                    "${activity.packageName}.fileprovider",
                    tempFile
                )

                if (savedToDownloads) {
                    Toast.makeText(
                        activity,
                        "Comprobante guardado en Descargas: $cleanFileName",
                        Toast.LENGTH_LONG
                    ).show()
                }

                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = cleanMimeType
                    putExtra(Intent.EXTRA_STREAM, fileUri)
                    putExtra(Intent.EXTRA_SUBJECT, cleanFileName)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }

                activity.startActivity(
                    Intent.createChooser(shareIntent, "Guardar o compartir $cleanFileName")
                )
            } catch (e: Exception) {
                Toast.makeText(
                    activity,
                    "No se pudo guardar el comprobante.",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    @JavascriptInterface
    fun shareReportText(subject: String, body: String) {
        activity.runOnUiThread {
            try {
                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_SUBJECT, subject)
                    putExtra(Intent.EXTRA_TEXT, body)
                }
                activity.startActivity(
                    Intent.createChooser(shareIntent, "Compartir reporte")
                )
            } catch (e: Exception) {
                Toast.makeText(
                    activity,
                    "No se encontró una aplicación para compartir el reporte.",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
}
