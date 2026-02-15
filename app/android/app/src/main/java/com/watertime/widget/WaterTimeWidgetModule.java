package com.watertime.widget;

import android.content.Context;
import android.content.SharedPreferences;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;

/**
 * Native Module for Widget Updates
 * Allows React Native to update Android widget data
 */
@ReactModule(name = "WaterTimeWidgetModule")
public class WaterTimeWidgetModule extends ReactContextBaseJavaModule {

    private static final String PREFS_NAME = "WaterTimeWidget";
    private static final String KEY_TOTAL_AMOUNT = "totalAmount";
    private static final String KEY_GOAL = "goal";

    public WaterTimeWidgetModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WaterTimeWidgetModule";
    }

    /**
     * Update widget data
     * @param totalAmount Current water intake amount
     * @param goal Daily goal
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    public void updateWidget(int totalAmount, int goal, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

            // Save data
            prefs.edit()
                .putInt(KEY_TOTAL_AMOUNT, totalAmount)
                .putInt(KEY_GOAL, goal)
                .apply();

            // Update widget
            Intent intent = new Intent(context, WaterTimeWidgetProvider.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, getAppWidgetIds(context));
            context.sendBroadcast(intent);

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("WIDGET_ERROR", "Failed to update widget: " + e.getMessage());
        }
    }

    /**
     * Clear widget data
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    public void clearWidgetData(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

            // Reset to defaults
            prefs.edit()
                .putInt(KEY_TOTAL_AMOUNT, 0)
                .putInt(KEY_GOAL, 2000)
                .apply();

            // Update widget
            Intent intent = new Intent(context, WaterTimeWidgetProvider.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, getAppWidgetIds(context));
            context.sendBroadcast(intent);

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("WIDGET_ERROR", "Failed to clear widget data: " + e.getMessage());
        }
    }

    /**
     * Get active widget IDs
     */
    private int[] getAppWidgetIds(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        return appWidgetManager.getAppWidgetIds(
            new android.content.ComponentName(context, WaterTimeWidgetProvider.class)
        );
    }
}
