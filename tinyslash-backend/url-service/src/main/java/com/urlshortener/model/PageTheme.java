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
  private Object fontSize; // SM, MD, LG or Integer px
  private String fontWeight; // NORMAL, SEMIBOLD, BOLD
  private String textColor; // Hex color (primary text)

  private Object socialIconSize; // SM, MD, LG or Integer px
  private String socialStyle; // FILLED, OUTLINE, MONOCHROME
  private Integer socialIconSpacing; // Gap in px
  private String socialIconColor; // Hex color
  private String socialBackgroundColor; // Hex color

  // Banner
  private String bannerType; // NONE, GRADIENT, IMAGE
  private String bannerImage;
  private String bannerGradientStart;
  private String bannerGradientEnd;
  private Integer bannerHeight;

  // Buttons (Extended)
  private String buttonShape; // ROUNDED, PILL, SHARP
  private String buttonShadow; // NONE, SUBTLE, STRONG, GLOW
  private String buttonFont;
  private Object buttonSize; // String (SM) or Integer (px)
  private Integer buttonTextSize;

  // Profile
  private String profileImageStyle; // CIRCLE, ROUNDED, SQUARE
  private String profileImageSize; // SM, MD, LG
  private String nameSize; // SM, MD, LG

  // Advanced
  private Integer pageMaxWidth;
  private String contentSpacing;

  private boolean showBranding = true; // Powered by TinySlash

  public PageTheme() {
  }

  public PageTheme(String backgroundType, String background, String gradientStart, String gradientEnd,
      String gradientDirection, String buttonStyle, String buttonColor, String buttonTextColor, String font,
      Object fontSize, String fontWeight, String textColor, Object socialIconSize, String socialStyle,
      Integer socialIconSpacing, String socialIconColor,
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
    this.socialStyle = socialStyle;
    this.socialIconSpacing = socialIconSpacing;
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

  public Object getFontSize() {
    return fontSize;
  }

  public void setFontSize(Object fontSize) {
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

  public Object getSocialIconSize() {
    return socialIconSize;
  }

  public void setSocialIconSize(Object socialIconSize) {
    this.socialIconSize = socialIconSize;
  }

  public String getSocialStyle() {
    return socialStyle;
  }

  public void setSocialStyle(String socialStyle) {
    this.socialStyle = socialStyle;
  }

  public Integer getSocialIconSpacing() {
    return socialIconSpacing;
  }

  public void setSocialIconSpacing(Integer socialIconSpacing) {
    this.socialIconSpacing = socialIconSpacing;
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

  // New Getters and Setters

  public String getBannerType() {
    return bannerType;
  }

  public void setBannerType(String bannerType) {
    this.bannerType = bannerType;
  }

  public String getBannerImage() {
    return bannerImage;
  }

  public void setBannerImage(String bannerImage) {
    this.bannerImage = bannerImage;
  }

  public String getBannerGradientStart() {
    return bannerGradientStart;
  }

  public void setBannerGradientStart(String bannerGradientStart) {
    this.bannerGradientStart = bannerGradientStart;
  }

  public String getBannerGradientEnd() {
    return bannerGradientEnd;
  }

  public void setBannerGradientEnd(String bannerGradientEnd) {
    this.bannerGradientEnd = bannerGradientEnd;
  }

  public Integer getBannerHeight() {
    return bannerHeight;
  }

  public void setBannerHeight(Integer bannerHeight) {
    this.bannerHeight = bannerHeight;
  }

  public String getButtonShape() {
    return buttonShape;
  }

  public void setButtonShape(String buttonShape) {
    this.buttonShape = buttonShape;
  }

  public String getButtonShadow() {
    return buttonShadow;
  }

  public void setButtonShadow(String buttonShadow) {
    this.buttonShadow = buttonShadow;
  }

  public String getButtonFont() {
    return buttonFont;
  }

  public void setButtonFont(String buttonFont) {
    this.buttonFont = buttonFont;
  }

  public Object getButtonSize() {
    return buttonSize;
  }

  public void setButtonSize(Object buttonSize) {
    this.buttonSize = buttonSize;
  }

  public Integer getButtonTextSize() {
    return buttonTextSize;
  }

  public void setButtonTextSize(Integer buttonTextSize) {
    this.buttonTextSize = buttonTextSize;
  }

  public String getProfileImageStyle() {
    return profileImageStyle;
  }

  public void setProfileImageStyle(String profileImageStyle) {
    this.profileImageStyle = profileImageStyle;
  }

  public String getProfileImageSize() {
    return profileImageSize;
  }

  public void setProfileImageSize(String profileImageSize) {
    this.profileImageSize = profileImageSize;
  }

  public String getNameSize() {
    return nameSize;
  }

  public void setNameSize(String nameSize) {
    this.nameSize = nameSize;
  }

  public Integer getPageMaxWidth() {
    return pageMaxWidth;
  }

  public void setPageMaxWidth(Integer pageMaxWidth) {
    this.pageMaxWidth = pageMaxWidth;
  }

  public String getContentSpacing() {
    return contentSpacing;
  }

  public void setContentSpacing(String contentSpacing) {
    this.contentSpacing = contentSpacing;
  }
}
