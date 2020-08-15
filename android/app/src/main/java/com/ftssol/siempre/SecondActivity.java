package com.ftssol.siempre;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

public class SecondActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "Siempre";
  }
}
