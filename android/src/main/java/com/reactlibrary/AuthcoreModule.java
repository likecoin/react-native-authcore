package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.support.customtabs.CustomTabsIntent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;

public class AuthcoreModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private static final int CANCEL_EVENT_DELAY = 100;

    private final ReactApplicationContext reactContext;
    private Callback callback;

    public AuthcoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Authcore";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("bundleIdentifier", reactContext.getApplicationInfo().packageName);
        return constants;
    }

    @ReactMethod
    public void hide() {}

    @ReactMethod
    public void showUrl(String url, boolean closeOnLoad, Callback callback) {
        final Activity activity = getCurrentActivity();

        this.callback = callback;
        if (activity != null) {
            CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
            CustomTabsIntent customTabsIntent = builder.build();
            customTabsIntent.launchUrl(activity, Uri.parse(url));
        } else {
            final Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setData(Uri.parse(url));
            getReactApplicationContext().startActivity(intent);
        }
    }

    @Override
    public void onHostResume() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Callback cb = AuthcoreModule.this.callback;
                if (cb != null) {
                    final WritableMap error = Arguments.createMap();
                    error.putString("error", "a0.session.user_cancelled");
                    error.putString("error_description", "User cancelled the Auth");
                    cb.invoke(error);
                    AuthcoreModule.this.callback = null;
                }
            }
        }, CANCEL_EVENT_DELAY);
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }
}
