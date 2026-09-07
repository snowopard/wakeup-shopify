(function () {
	'use strict';

	var PROGRESS_VAR = '--wu-transition-progress';
	var reducedMotionQuery = window.matchMedia
		? window.matchMedia('(prefers-reduced-motion: reduce)')
		: null;

	function prefersReducedMotion() {
		return !!(reducedMotionQuery && reducedMotionQuery.matches);
	}

	function clamp01(value) {
		if (value < 0) return 0;
		if (value > 1) return 1;
		return value;
	}

	function setupInstance(section) {
		if (!section || section.hasAttribute('data-wu-transition-ready')) return;
		section.setAttribute('data-wu-transition-ready', 'true');

		var motionEnabled = section.getAttribute('data-enable-motion') !== 'false';

		if (!motionEnabled || prefersReducedMotion()) {
			// No scroll-linked work is set up at all. The blended, static
			// end state is provided entirely by CSS (see the
			// [data-enable-motion="false"] / prefers-reduced-motion /
			// html.no-js rules in wakeup-transition.css), so there is
			// nothing for this script to do here.
			return;
		}

		var rafId = null;
		var isActive = false;

		function readProgress() {
			var rect = section.getBoundingClientRect();
			var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			var scrollDistance = rect.height - viewportHeight;

			if (scrollDistance <= 0) {
				section.style.setProperty(PROGRESS_VAR, '1');
				return;
			}

			var progress = clamp01((0 - rect.top) / scrollDistance);
			section.style.setProperty(PROGRESS_VAR, String(progress));
		}

		function tick() {
			if (!isActive) return;
			readProgress();
			rafId = window.requestAnimationFrame(tick);
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						if (!isActive) {
							isActive = true;
							section.classList.add('is-transition-active');
							tick();
						}
					} else if (isActive) {
						isActive = false;
						section.classList.remove('is-transition-active');
						if (rafId !== null) {
							window.cancelAnimationFrame(rafId);
							rafId = null;
						}
					}
				});
			},
			{rootMargin: '15% 0px 15% 0px', threshold: 0}
		);

		observer.observe(section);

		section._wuTransitionCleanup = function () {
			isActive = false;
			section.classList.remove('is-transition-active');
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId);
				rafId = null;
			}
			observer.disconnect();
		};
	}

	function teardownInstance(section) {
		if (section && typeof section._wuTransitionCleanup === 'function') {
			section._wuTransitionCleanup();
			section.removeAttribute('data-wu-transition-ready');
		}
	}

	function init(root) {
		var scope = root && root.querySelectorAll ? root : document;
		var sections = scope.querySelectorAll('.wakeup-transition');
		Array.prototype.forEach.call(sections, setupInstance);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			init(document);
		});
	} else {
		init(document);
	}

	// Shopify theme editor re-renders a section's markup via AJAX on
	// setting changes, without a full page reload -- re-init/teardown
	// so instances stay correct without duplicating observers.
	document.addEventListener('shopify:section:load', function (event) {
		init(event.target);
	});

	document.addEventListener('shopify:section:unload', function (event) {
		var target = event.target;
		var section = null;

		if (target && target.classList && target.classList.contains('wakeup-transition')) {
			section = target;
		} else if (target && target.querySelector) {
			section = target.querySelector('.wakeup-transition');
		}

		teardownInstance(section);
	});
})();
