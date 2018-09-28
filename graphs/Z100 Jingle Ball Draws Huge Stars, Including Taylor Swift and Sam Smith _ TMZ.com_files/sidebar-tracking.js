define('sidebar-tracking/1.0.0/sidebar-tracking', ['jquery'],
  function ($) {
    'use strict';

    var $activeWidgets;

    /**
     * Determines if a widget is active or not by checking height and visibility
     *
     * @param {jQuery} $widget element to check
     * @return {boolean}
     */
    function isWidgetActive($widget) {
      return $widget.height() > 0 && $widget.is(':visible');
    }

    /**
     * Finds all widgets that are active and add a class of active
     *
     * @param {jQuery} $trackedWidgets
     * @param {string} activeClassName
     * @return {number}
     */
    function markActiveWidgets($trackedWidgets, activeClassName) {
      var activeCount = 0;
      var $trackedWidget;
      $.each($trackedWidgets, function () {
        $trackedWidget = $(this);
        if (isWidgetActive($trackedWidget)) {
          $trackedWidget.addClass(activeClassName);
          activeCount++;
        }
      });
      return activeCount;
    }

    /**
     * Returns all activated widgets
     *
     * @param {jQuery} $foundWidgets
     * @param {string} activeClassName
     * @return {jQuery}
     */
    function getActiveWidgets($foundWidgets, activeClassName) {
      var activeWidgetQuery;
      activeClassName = activeClassName || 'js-sidebar-tracking-active';

      markActiveWidgets($foundWidgets, activeClassName);
      activeWidgetQuery = $foundWidgets.selector + '.' + activeClassName;

      return $(activeWidgetQuery);
    }

    /**
     * Determines the widget position on the sidebar
     *
     * @param {jQuery} $allActiveWidgets
     * @param {jQuery} $clickedWidget
     * @return {number}
     */
    function getWidgetPosition($allActiveWidgets, $clickedWidget) {
      return $allActiveWidgets.index($clickedWidget) + 1;
    }

    /**
     * Execute tracking by submitting to Omniture API
     *
     * @param {event} event
     */
    function executeTracking(event) {
      var trackingValue;
      trackingValue = 'rr-slot-' + getWidgetPosition($activeWidgets, $(this));
      s.linkTrackVars = 'prop46,eVar46';
      s.prop46 = s.eVar46 = trackingValue;
      s.tl(true, 'o', trackingValue);
    }

    /**
     * Initialize tracking of widgets by binding a click event on the target slots
     *
     * @param {jQuery} $trackedWidgets
     * @return {jQuery}
     */
    function init($trackedWidgets) {
      if($activeWidgets){
        return $activeWidgets;
      }
      var $allWidgets = $trackedWidgets || $('.js-sidebar-tracking');
      $activeWidgets = getActiveWidgets($allWidgets);
      $activeWidgets.bind('click', executeTracking);
      return $activeWidgets;
    }

    return {
      init: init
    };

  });
