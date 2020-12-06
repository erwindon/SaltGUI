/* global */

export class Character {

  static init () {
    Character._VARIATION_SELECTOR_15 = "\uFE0E";

    Character.NO_BREAK_SPACE = "\u00A0";
    Character.NON_BREAKING_HYPHEN = "\u2011";
    Character.HORIZONTAL_ELLIPSIS = "\u2026";
    Character.UPWARDS_ARROW = "\u2191";
    Character.RIGHTWARDS_ARROW = "\u2192";
    Character.DOWNWARDS_ARROW = "\u2193";
    Character.CLOCKWISE_OPEN_CIRCLE_ARROW = "\u21BB";
    Character._MATHEMATICAL_OPERATOR_IDENTICAL_TO = "\u2261";
    Character.HOURGLASS_WITH_FLOWING_SAND_MONO =
      "\u23F3" + Character._VARIATION_SELECTOR_15;
    Character._DOUBLE_VERTICAL_BAR_MONO =
      "\u23F8" + Character._VARIATION_SELECTOR_15;
    Character._BLACK_RIGHT_POINTING_TRIANGLE_MONO =
      "\u25B6" + Character._VARIATION_SELECTOR_15;
    Character.WHITE_RIGHT_POINTING_TRIANGLE = "\u25B7";
    Character.BLACK_RIGHT_POINTING_POINTER = "\u25BA";
    Character.BLACK_DOWN_POINTING_TRIANGLE = "\u25BC";
    Character.WHITE_DOWN_POINTING_TRIANGLE = "\u25BD";
    Character.BLACK_CIRCLE = "\u25CF";
    Character.HEAVY_CHECK_MARK = "\u2714";
    Character.HEAVY_MULTIPLICATION_X_MONO =
      "\u2716" + Character._VARIATION_SELECTOR_15;
    Character.HEAVY_BALLOT_X = "\u2718";
    Character.BLACK_QUESTION_MARK_ORNAMENT_MONO =
      "\u2753" + Character._VARIATION_SELECTOR_15;
    Character._BLACK_MEDIUM_RIGHT_POINTING_TRIANGLE = "\u2BC8";

    // D83D DCD6 = 1F4D6 = A BOOK
    Character.A_BOOK = "\uD83D\uDCD6";

    // D83D DD0D = 1F50D = LEFT-POINTING MAGNIFYING GLASS
    Character.LEFT_POINTING_MAGNIFYING_GLASS_MONO =
      "\uD83D\uDD0D" + Character._VARIATION_SELECTOR_15;
    Character.LEFT_POINTING_MAGNIFYING_GLASS_COLOUR = "\uD83D\uDD0D";

    // Aliases
    Character.CH_HAMBURGER = Character._MATHEMATICAL_OPERATOR_IDENTICAL_TO;
    Character.CH_PAUSE_MONO = Character._DOUBLE_VERTICAL_BAR_MONO;
    // 'official' play-button
    // Character.PLAY = Character._BLACK_RIGHT_POINTING_TRIANGLE_MONO;
    // slightly smaller glyph
    Character.CH_PLAY_MONO = Character._BLACK_MEDIUM_RIGHT_POINTING_TRIANGLE;

    // Images
    Character.EXTERNAL_LINK_IMG = "<img src='static/images/externallink.png' width='12px'>";
  }
}
