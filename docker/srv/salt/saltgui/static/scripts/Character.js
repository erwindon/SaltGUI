/* global */

export class Character {

  static init () {
    // VS15 = request text representation
    Character._VARIATION_SELECTOR_15 = "\uFE0E";

    // VS16 = request emoji representation
    Character._VARIATION_SELECTOR_16 = "\uFE0F";

    Character.MULTIPLICATION_SIGN = "\u00D7";
    Character.NO_BREAK_SPACE = "\u00A0";
    Character.NON_BREAKING_HYPHEN = "\u2011";
    Character.EM_DASH = "\u2014";
    Character.HORIZONTAL_ELLIPSIS = "\u2026";
    Character._UPWARDS_ARROW = "\u2191";
    Character.RIGHTWARDS_ARROW = "\u2192";
    Character._DOWNWARDS_ARROW = "\u2193";
    Character.CLOCKWISE_OPEN_CIRCLE_ARROW = "\u21BB";
    Character._MATHEMATICAL_OPERATOR_IDENTICAL_TO = "\u2261";
    Character.HOURGLASS_WITH_FLOWING_SAND = "\u23F3" + Character._VARIATION_SELECTOR_15;
    Character._DOUBLE_VERTICAL_BAR = "\u23F8" + Character._VARIATION_SELECTOR_15;
    Character._BLACK_RIGHT_POINTING_TRIANGLE = "\u25B6" + Character._VARIATION_SELECTOR_15;
    Character.WHITE_RIGHT_POINTING_TRIANGLE = "\u25B7";
    Character.BLACK_RIGHT_POINTING_POINTER = "\u25BA";
    Character.WHITE_DOWN_POINTING_TRIANGLE = "\u25BD";
    Character.BLACK_DIAMOND = "\u25C6";
    Character.BLACK_CIRCLE = "\u25CF";
    Character.GEAR = "\u2699";
    Character.WARNING_SIGN = "\u26A0" + Character._VARIATION_SELECTOR_16;
    Character.HEAVY_CHECK_MARK = "\u2714";
    Character.HEAVY_MULTIPLICATION_X = "\u2716" + Character._VARIATION_SELECTOR_15;
    Character.BLACK_QUESTION_MARK_ORNAMENT = "\u2753" + Character._VARIATION_SELECTOR_15;
    Character._BLACK_MEDIUM_RIGHT_POINTING_TRIANGLE = "\u2BC8";

    // D83D DCD6 = 1F4D6 = OPEN BOOK
    Character.OPEN_BOOK = "\uD83D\uDCD6" + Character._VARIATION_SELECTOR_15;

    // D83D DD0D = 1F50D = LEFT-POINTING MAGNIFYING GLASS
    Character.LEFT_POINTING_MAGNIFYING_GLASS = "\uD83D\uDD0D" + Character._VARIATION_SELECTOR_15;

    // D83D DEC8 = 1F6C8 = CIRCLED INFORMATION SOURCE
    Character.CIRCLED_INFORMATION_SOURCE = "\uD83D\uDEC8" + Character._VARIATION_SELECTOR_16;


    // Aliases
    Character.CH_HAMBURGER = Character._MATHEMATICAL_OPERATOR_IDENTICAL_TO;

    Character.CH_PAUSE = Character._DOUBLE_VERTICAL_BAR;
    // 'official' play-button
    // Character.CH_PLAY = Character._BLACK_RIGHT_POINTING_TRIANGLE;
    // slightly smaller glyph
    Character.CH_PLAY = Character._BLACK_MEDIUM_RIGHT_POINTING_TRIANGLE;

    Character.CH_SORT_NORMAL = Character._DOWNWARDS_ARROW;
    Character.CH_SORT_REVERSE = Character._UPWARDS_ARROW;


    // Images
    Character.EXTERNAL_LINK_IMG = "<img src='static/images/externallink.png' width='12px'>";
  }

  static buttonInText (txt) {
    return "<span style=\"background-color:#eee\">&nbsp;" + txt + "&nbsp;</span>";
  }
}
