define('widgets/sidebar/most-commented-posts/1.0.2/most-commented-posts',
	['jquery', 'mw', 'templates/jst', 'logger', 'module', 'requirecss'],
	function ($, mw, jst, logger, module, requirecss) {
		'use strict';

		var logger = logger.getInstance(module.id);

		/**
		 * Most Commented Posts
		 */
		var mostCommentedPosts = function mostCommentedPosts(){

			function render(toSelector){
				mw.get('/api/v1/articles?rankBy=comment&fields=primaryImage&format=json&numRecords=5').done(function(response){
					var source = {
						posts: []
					};

					try {
						// Build config
						for (var i = 0; i < response.totalResults; i++) {
							var currentItem = response.items[i];

							// Items
							var item = {
								date: new Date(currentItem.publishedDate).toLocaleString().replace(/, ([\d]+:[\d]{2})(:[\d]{2})(.*)/, " | $1$3 PDT"),
								fragments: currentItem.fragments.length > 0 ? currentItem.fragments : false,
								primaryImage: typeof currentItem.assets.primaryImage === 'undefined' || typeof currentItem.assets.primaryImage[0].thumbnailUrls['139x99'] === 'undefined' ? false : currentItem.assets.primaryImage[0].thumbnailUrls['139x99'],
								url: window.SITE_BASEURL + currentItem.slug + '/',
								title: currentItem.title
							};

							if (item.fragments !== false) {
								item.fragments[0] += '<br/>';
							}

							source.posts[i] = item;
						}
					} catch (e) {
						logger.debug('Cannot add item to list.', currentItem);
					}


					var template = jst['widgets/sidebar/most-commented-posts'](source);
					$(toSelector).html(template);
				});
			};


			return {
				render: render
			};

		};

		return mostCommentedPosts();
	}
);
