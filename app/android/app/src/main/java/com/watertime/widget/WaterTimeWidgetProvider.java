package com.watertime.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.RemoteViews;

import com.watertimeapp.MainActivity;
import com.watertimeapp.R;

/**
 * WaterTime Widget Provider
 * Displays daily water intake with progress bar and quick add button
 */
public class WaterTimeWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "WaterTimeWidget";
    private static final String KEY_TOTAL_AMOUNT = "totalAmount";
    private static final String KEY_GOAL = "goal";
    private static final String ACTION_ADD_WATER = "com.watertimeapp.ADD_WATER";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
        updateAppWidget(context, appWidgetManager, appWidgetId);
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int totalAmount = prefs.getInt(KEY_TOTAL_AMOUNT, 0);
        int goal = prefs.getInt(KEY_GOAL, 2000);
        int percentage = goal > 0 ? (int) ((totalAmount * 100.0) / goal) : 0;
        int remaining = Math.max(0, goal - totalAmount);

        // Get widget size
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH);
        int widgetLayout = getWidgetLayout(minWidth);

        // Construct RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), widgetLayout);

        // Update UI based on widget size
        if (widgetLayout == R.layout.widget_water_small) {
            views.setTextViewText(R.id.widget_amount_small, String.valueOf(totalAmount));
            views.setTextViewText(R.id.widget_goal_small, "/" + goal + "ml");
            views.setProgressBar(R.id.widget_progress_small, 100, percentage, false);
        } else if (widgetLayout == R.layout.widget_water_medium) {
            views.setTextViewText(R.id.widget_amount, String.valueOf(totalAmount) + "ml");
            views.setTextViewText(R.id.widget_goal, String.valueOf(goal) + "ml");
            views.setTextViewText(R.id.widget_percentage, percentage + "%");
            views.setTextViewText(R.id.widget_remaining, remaining + "ml left");
            views.setProgressBar(R.id.widget_progress, 100, percentage, false);
        }

        // Create intent to launch app
        Intent launchIntent = new Intent(context, MainActivity.class);
        PendingIntent launchPendingIntent = PendingIntent.getActivity(
                context,
                0,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_container, launchPendingIntent);

        // Create intent for quick add button
        Intent addWaterIntent = new Intent(context, WaterTimeWidgetProvider.class);
        addWaterIntent.setAction(ACTION_ADD_WATER);
        addWaterIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        PendingIntent addWaterPendingIntent = PendingIntent.getBroadcast(
                context,
                appWidgetId,
                addWaterIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_add_button, addWaterPendingIntent);

        // Update progress bar color based on percentage
        if (percentage >= 100) {
            views.setColor(R.id.widget_progress, "setProgressTintList",
                    Color.parseColor("#4CAF50"));
        } else {
            views.setColor(R.id.widget_progress, "setProgressTintList",
                    Color.parseColor("#2196F3"));
        }

        // Update widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static int getWidgetLayout(int minWidth) {
        if (minWidth < 150) {
            return R.layout.widget_water_small;
        } else if (minWidth < 250) {
            return R.layout.widget_water_small;
        } else {
            return R.layout.widget_water_medium;
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (ACTION_ADD_WATER.equals(intent.getAction())) {
            int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                    AppWidgetManager.INVALID_APPWIDGET_ID);

            if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                // Add water (default 250ml)
                SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                int currentAmount = prefs.getInt(KEY_TOTAL_AMOUNT, 0);
                prefs.edit().putInt(KEY_TOTAL_AMOUNT, currentAmount + 250).apply();

                // Update widget
                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Called when first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Called when last widget is removed
    }
}
