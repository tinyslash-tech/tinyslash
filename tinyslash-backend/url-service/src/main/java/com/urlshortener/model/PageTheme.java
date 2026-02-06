package com.urlshortener.model;

public class PageTheme {
  private String backgroundType; // SOLID, GRADIENT, IMAGE
  private String background; // Hex color or Image URL
  private String gradientStart; // Hex color
  private String gradientEnd; // Hex color
  private String gradientDirection; // "to right", "to bottom", etc.

  private String buttonStyle; // ROUNDED, SHARP, OUTLINE, FILL
  private String buttonColor; // Hex color
  private String buttonTextColor; // Hex color

  private String font; // Font family name
  private String fontSize; // SM, MD, LG
  private String fontWeight; // NORMAL, SEMIBOLD, BOLD
  private String textColor; // Hex color (primary text)

  private String socialIconSize; // SM, MD, LG
  private String socialIconColor; // Hex color
  private String socialBackgroundColor; // Hex color

  private boolean showBranding = true; // Powered by TinySlash

  public PageTheme() {
  }

  public PageTheme(String backgroundType, String background, String gradientStart, String gradientEnd,
      String gradientDirection, String buttonStyle, String buttonColor, String buttonTextColor, String font,
      String fontSize, String fontWeight, String textColor, String socialIconSize, String socialIconColor,
      String socialBackgroundColor, boolean showBranding) {
    this.backgroundType = backgroundType;
    this.background = background;
    this.gradientStart = gradientStart;
    this.gradientEnd = gradientEnd;
    this.gradientDirection = gradientDirection;
    this.buttonStyle = buttonStyle;
    this.buttonColor = buttonColor;
    this.buttonTextColor = buttonTextColor;
    this.font = font;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.textColor = textColor;
    this.socialIconSize = socialIconSize;
    this.socialIconColor = socialIconColor;
    this.socialBackgroundColor = socialBackgroundColor;
    this.showBranding = showBranding;
  }

  // Getters and Setters

  public String getBackgroundType() {
    return backgroundType;
  }

  public void setBackgroundType(String backgroundType) {
    this.backgroundType = backgroundType;
  }

  public String getBackground() {
    return background;
  }

  public void setBackground(String background) {
    this.background = background;
  }

  public String getGradientStart() {
    return gradientStart;
  }

  public void setGradientStart(String gradientStart) {
    this.gradientStart = gradientStart;
  }

  public String getGradientEnd() {
    return gradientEnd;
  }

  public void setGradientEnd(String gradientEnd) {
    this.gradientEnd = gradientEnd;
  }

  public String getGradientDirection() {
    return gradientDirection;
  }

  public void setGradientDirection(String gradientDirection) {
    this.gradientDirection = gradientDirection;
  }

  public String getButtonStyle() {
    return buttonStyle;
  }

  public void setButtonStyle(String buttonStyle) {
    this.buttonStyle = buttonStyle;
  }

  public String getButtonColor() {
    return buttonColor;
  }

  public void setButtonColor(String buttonColor) {
    this.buttonColor = buttonColor;
  }

  public String getButtonTextColor() {
    return buttonTextColor;
  }

  public void setButtonTextColor(String buttonTextColor) {
    this.buttonTextColor = buttonTextColor;
  }

  public String getFont() {
    return font;
  }

  public void setFont(String font) {
    this.font = font;
  }

  public String getFontSize() {
    return fontSize;
  }

  public void setFontSize(String fontSize) {
    this.fontSize = fontSize;
  }

  public String getFontWeight() {
    return fontWeight;
  }

  public void setFontWeight(String fontWeight) {
    this.fontWeight = fontWeight;
  }

  public String getTextColor() {
    return textColor;
  }

  public void setTextColor(String textColor) {
    this.textColor = textColor;
  }

  public String getSocialIconSize() {
    return socialIconSize;
  }

  public void setSocialIconSize(String socialIconSize) {
    this.socialIconSize = socialIconSize;
  }

  public String getSocialIconColor() {
    return socialIconColor;
  }

  public void setSocialIconColor(String socialIconColor) {
    this.socialIconColor = socialIconColor;
  }

  public String getSocialBackgroundColor() {
    return socialBackgroundColor;
  }

  public void setSocialBackgroundColor(String socialBackgroundColor) {
    this.socialBackgroundColor = socialBackgroundColor;
  }

  public boolean isShowBranding() {
    return showBranding;
  }

  public void setShowBranding(boolean showBranding) {
    this.showBranding = showBranding;
  }
}
