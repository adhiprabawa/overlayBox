(function($) {
    $.fn.extend({
        overlayBox: function(htmlData, options) {
            var self = this;

            this.defaults = {
                closeBtnId: '#overlay-close',
                contentBlockWidth: '500',
                onOverlayLoaded: function(el) {
                    console.info(el);
                },
                onOverlayClosed: function() {
                    console.info('CLOSED OVERLAY');
                }
            };

            this.init = function(opt) {
                self.htmlData = htmlData;
                self.onOverlayLoaded = opt.onOverlayLoaded;
                self.onOverlayClosed = opt.onOverlayClosed;
                self.overlayContentClass = 'overlay-content';
                self.contentBlockWidth = opt.contentBlockWidth;
                self.zIndexValue = opt.zIndexValue;
                self.closeBtnId = opt.closeBtnId;
                self.overlayEl = $(this);
                self.closeBtnEl = undefined;

                self.displayOverlay();
            };

            this.displayOverlay = function() {

                self.overlayEl.css({
                    width: $(document).width(),
                    height: $(document).height(),
                    zIndex: self.zIndexValue
                }).animate({
                    opacity: 1
                }, function() {
                    self.displayContent();
                });

            };

            this.displayContent = function() {
                self.overlayEl.append('<div class=' + self.overlayContentClass + '>' + self.htmlData + '</div>');

                if (self.closeBtnId !== undefined) {
                    self.closeBtnEl = $(self.closeBtnId);
                }

                self.addEvents();

                $.when(self.setCenterContent()).done(function() {

                    self.overlayEl.find('.' + self.overlayContentClass).eq(0).css({
                        visibility: 'visible'
                    });

                    self.overlayEl.trigger('onOverlayLoaded');
                }

                );

            };

            this.setCenterContent = function() {
                var contentEl = self.overlayEl.find('.' + self.overlayContentClass).eq(0),
                        top, left, scrollTop;

                top = (self.overlayEl.height() - contentEl.height()) / 2;
                left = (self.overlayEl.width() - self.contentBlockWidth) / 2;
                scrollTop = $(document).scrollTop();

                if (scrollTop > 0) {
                    top = scrollTop + contentEl.height() / 4;
                }

                contentEl.css({
                    margin: '0 auto',
                    position: 'absolute',
                    top: top,
                    left: left,
                    width: self.contentBlockWidth + 'px'
                });
            };

            this.hideOverlay = function(el, containerEl) {

                el.animate({
                    opacity: 0
                }, function() {
                    containerEl.remove();
                    $(this).css({
                        zIndex: 0
                    });
                    self.removeEvents();
                    if (typeof(self.onOverlayClosed) === 'function') {
                        self.onOverlayClosed();
                    }
                });

            };

            this.addEvents = function() {

                if (self.closeBtnEl !== undefined) {
                    self.closeBtnEl.on({
                        'click.overlayEvent': function(e) {
                            e.preventDefault();
                            self.hideOverlay(self.overlayEl, e.data.contentContainerEl);
                        }
                    }, {contentContainerEl: $(this).find('.' + self.overlayContentClass)});
                }

                $(window).on({
                    'keydown.overlayEvent': function(e) {
                        e.preventDefault();
                        
                        if (e.keyCode === 27) {
                            self.hideOverlay(self.overlayEl, e.data.contentContainerEl);
                        }
                    }        
                }, {contentContainerEl: $(this).find('.' + self.overlayContentClass)});

                self.overlayEl.on({
                    'onOverlayLoaded.overlayEvent': function(el) {
                        self.onOverlayLoaded(el.data.contentContainerEl);
                    },
                    'click.overlayEvent': function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (e.target.id === 'overlay') {
                            self.hideOverlay($(this), e.data.contentContainerEl);
                        }
                    }
                }, {contentContainerEl: $(this).find('.' + self.overlayContentClass)});
            };

            this.removeEvents = function() {
                var eventName = '.overlayEvent';

                self.overlayEl.off(eventName);
                $(window).off(eventName);
                if (self.closeBtnEl.size() > 0) {
                    self.closeBtnEl.off(eventName);
                }
            };

            constructor = function() {
                self.options = $.extend(self.defaults, options);
                self.init(self.options);
            }();

        }
    });
})(jQuery);


