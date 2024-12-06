package chat.rocket.reachout

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.uimanager.ViewManager
import android.content.ContentResolver
import android.content.ContentValues
import android.provider.CalendarContract
import android.view.View
import java.util.TimeZone

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "CalendarModule"

    @ReactMethod
    fun addEvent(details: ReadableMap, promise: Promise) {
     try {
        val cr: ContentResolver = reactApplicationContext.contentResolver

        // Get default calendar ID
        val projection = arrayOf(CalendarContract.Calendars._ID)
        val selection = "(${CalendarContract.Calendars.VISIBLE} = 1) AND (${CalendarContract.Calendars.IS_PRIMARY} = 1)"
        val cursor = cr.query(
            CalendarContract.Calendars.CONTENT_URI,
            projection,
            selection,
            null,
            null
        )

        var calendarId: Long = -1
        cursor?.use {
            if (it.moveToFirst()) {
                calendarId = it.getLong(0)
            }
        }

        if (calendarId == -1L) {
            promise.reject("NO_CALENDAR", "No default calendar found")
            return
        }

        val values = ContentValues().apply {
            put(CalendarContract.Events.CALENDAR_ID, calendarId)
            put(CalendarContract.Events.TITLE, details.getString("title"))
            put(CalendarContract.Events.DESCRIPTION, details.getString("notes"))
            put(CalendarContract.Events.EVENT_LOCATION, details.getString("location"))
            put(CalendarContract.Events.DTSTART, details.getDouble("startTime").toLong())
            put(CalendarContract.Events.DTEND, details.getDouble("endTime").toLong())
            put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().id)
        }

        val uri = cr.insert(CalendarContract.Events.CONTENT_URI, values)
        uri?.let {
            promise.resolve(it.lastPathSegment)
        } ?: promise.reject("EVENT_NOT_ADDED", "Failed to add event to calendar")
    } catch (e: Exception) {
        promise.reject("ERROR", e.message)
    }
}
}

class CalendarPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<View, *>> {
        return emptyList()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(CalendarModule(reactContext))
    }
}
