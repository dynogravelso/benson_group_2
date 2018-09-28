/**
 * TMZ Polls Module
 */
define(
    'tmz/polls/1.0.4/polls',
    [
        'jquery',
        'mw',
        'templates/jst',
        'handlebars',
        'logger',
        'module',
        'requirecss',
        'window',
        'document'
    ],

    function ($, mwClient, templates, Handlebars, loggerFactory, module, css, window) {
        'use strict';

        var logger = loggerFactory.getInstance(module.id);

        /**
         * TMZ - Polls
         */
        function polls() {
            // Local variables
            var toRender = {},
                api =
                {
                    get: '/api/v1/Polls?ids=',
                    post: '/api/v1/polls/'
                },
                containers = [],
                _this = {};

            /**
             * @return {!Object} _this
             */
            function init() {
                return _this;
            }

            /**
             * @param {string} guid
             * @param {string} template
             * @return {!Object} _this
             */
            function addPoll(guid, template) {
                toRender[guid] = template;
                return _this;
            }

            /**
             * @return {array}
             */
            function toRenderGuids() {
                var list = [];
                $.each(toRender, function (index, value) {
                    list[list.length] = index;
                });
                return list;
            }

            /**
             * @return {!Object} _this
             */
            function processQueue() {
                var guids = toRenderGuids();
                if (!guids.length) {
                    return;
                }

                // Load polls
                mwClient
                    .get(api.get + guids.join(","))
                    .done(function (response) {
                        for (var i = 0; i < response.items.length; i++) {
                            var poll, template, containerSelector;
                            poll = response.items[i];
                            template = toRender[poll.id];
                            containerSelector = '.tmz-poll[data-guid="' + poll.id + '"]';

                            // Needed template variables
                            poll.guid = poll.id;
                            poll.template = template;

                            // Load required CSS
                            css.load('css/tmz/polls/1.0.3/' + template + '.css');

                            // Inject template
                            var container = $(containerSelector);
                            containers[poll.guid] = container;
                            container.html(templates['polls/' + template](poll));
//						logger.debug("Poll", poll);
//						logger.debug('Container', container);
//						logger.debug('Trying to inject poll into ', containerSelector);
//						logger.debug('Template: ', template);
//						logger.debug('Rendered Poll', poll);
//						logger.debug(templates['polls/' + template](poll));

                            // Submit Button Event Handler
                            container.find('button.btn-vote').click(function () {
                                var guid = $(this).closest('.poll').data('guid');
                                var template = toRender[guid];
                                postAnswer(guid, template);
                                if (template == 'poll-homepage-post-wide') {
                                    $(this).closest('.poll-homepage-post-wide').addClass('poll-post-results');
                                }
                            });
                        }
                    });

                // When clicking the note
                $(document).on('click', '.tmz-poll .note-on', function (e) {
                    e.preventDefault();
                    var container = $(this).closest('.tmz-poll');
                    container.find('.results-wrapper').hide();
                    container.find('.note-on-results').show();
                });

                // When clicking poll results from note
                $(document).on('click', '.tmz-poll .back-to-results a', function (e) {
                    e.preventDefault();
                    var guid = $(this).closest('.tmz-poll').data('guid');
                    var template = $(this).closest('.poll-results').data('answers-template');
                    var args = {__nc: true};

                    mwClient.get(api.post + guid, args, {cache: false})
                        .done(function (response) {
                            var templateHandler = templates[template];
                            response.guid = guid;

                            containers[response.guid].children('div.poll').html(templateHandler(formatResponseForResults(response)));
                        });
                });

                return _this;
            }

            /**
             * @param {string} guid
             * @param {string} template
             * @returns {boolean}
             */
            function postAnswer(guid, template) {
                var choice = $('div[data-guid=' + guid + '] input:checked');

                // Make sure the user selected something
                if (choice.length === 0) {
                    alert('Please select a choice.');
                    return false;
                }

                // Post choice to MW
                mwClient.post(api.post + guid, {VoteId: choice.val()})
                    .done(function (response) {
                        response.guid = guid;
                        var containerSelector = '.tmz-poll[data-guid="' + guid + '"]';
                        var templateHandler = templates['polls/' + template + '-results'];
                        var formattedResponse = formatResponseForResults(response);

                        $(containerSelector + ' div.poll').html(templateHandler(formattedResponse));
                    });

                // So the form doesn't do anything
                return false;
            }

            /**
             * @param {Object} results
             * @returns {Object}
             */
            function formatResponseForResults(results) {
                // Calculate Total
                var total = 0;
                for (var i = 0; i < results.item.answers.length; i++) {
                    total += parseInt(results.item.answers[i].count);
                }
                results['total-votes'] = numberFormat(total);

                // Calculate Percentages
                for (var i = 0; i < results.item.answers.length; i++) {
                    var percent = Math.round(parseInt(results.item.answers[i].count) / total * 100);
                    results.item.answers[i].percent = numberFormat(percent) + "%";
                }

                // Sort answers by highest first
                results.item.answers.sort(function (a, b) {
                    return a.count < b.count;
                });

                return results;
            }

            /**
             * @param number
             * @param decimals
             * @param dec_point
             * @param thousands_sep
             * @returns {string}
             */
            function numberFormat(number, decimals, dec_point, thousands_sep) {
                number = (number + '')
                    .replace(/[^0-9+\-Ee.]/g, '');
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = thousands_sep || ',',
                    dec = dec_point || '.',
                    s = '',
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + (Math.round(n * k) / k)
                            .toFixed(prec);
                    };
                s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            }

            /**
             * Public methods
             */
            _this.init = init;
            _this.processQueue = processQueue;
            _this.addPoll = addPoll;
            _this.test = function () {
                return 'werks';
            };

            return _this;
        }

        return polls();
    });
