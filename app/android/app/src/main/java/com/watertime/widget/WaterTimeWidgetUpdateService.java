package com.watertime.widget;

import android.app.IntentService;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.content.Context;

/**
 * Service to update widgets periodically
 */
public class WaterTimeWidgetUpdateService extends IntentService {

    public WaterTimeWidgetUpdateService() {
        super("WaterTimeWidgetUpdateService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null && intent.hasExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS)) {
            int[] appWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(this);
                for (int appWidgetId : appWidgetIds) {
                    WaterTimeWidgetProvider.updateAppWidget(this, appWidgetManager, appWidgetId);
                }
            }
        }
    }
}
