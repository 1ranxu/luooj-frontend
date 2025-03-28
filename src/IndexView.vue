<template class="indexView">
  <div class="vi">
    <h1 class="animate-slide-in-down">落畔题</h1>
    <div class="quote">
      <span class="quote-line quote-line-start animate-slide-in-left"></span>
      <span class="quote-icon quote-icon-start animate-slide-in-down">
        <i class="icon icon-quotes-left"></i>
      </span>
      <p class="quote-content animate-slide-in-down">
        不积跬步，无以至千里。不积小流，无以成江海。
      </p>
      <p class="quote-author animate-slide-in-down">
        《劝学篇》—— <em>荀子</em>
      </p>
      <span class="quote-icon quote-icon-end animate-slide-in-up">
        <i class="icon icon-quotes-right"></i>
      </span>
      <span class="quote-line quote-line-end animate-slide-in-right"></span>
    </div>
    <div class="links">
      <a href="https://github.com/1ranxu" class="animate-slide-in-down" target="_blank"
        >GitHub</a
      >
      <a href="https://leetcode.cn/u/ranxu/" class="animate-slide-in-down" target="_blank"
        >LeetCode</a
      >
    </div>
<!--    <div class="location">
      <span class="location-icon animate-slide-in-up">
        <i class="icon icon-map-pin"></i>
      </span>
      <span class="location-text animate-slide-in-down">XiaMen - China</span>
    </div>-->
    <div class="relocating">
      Navigating to: <span class="relocate-location"></span>...
    </div>
  </div>
</template>

<script setup>
import $ from "jquery";

document.title = "主页";



(function (H) {
  H.className = H.className.replace(/\bno-js\b/, "js");
})(document.documentElement);
$(function () {
  var SLIDE_IN_DOWN = { opacity: 1, top: 0 };
  var SLIDE_IN_UP = { opacity: 1, bottom: 0 };
  var SLIDE_IN_LEFT = { left: 0 };
  var SLIDE_IN_RIGHT = { right: 0 };

  registerCheatCode();
  executeAnimations();

  function executeAnimations() {
    $.when()
      .then(animateTitle)
      .then(animateQuote)
      .then(animateLinks)
      .then(animateLocation);
  }

  function animateTitle() {
    return animate("h1", SLIDE_IN_DOWN);
  }

  function animateQuote() {
    return $.when(
      animate(".quote-line-start", SLIDE_IN_LEFT),
      animate(".quote-line-end", SLIDE_IN_RIGHT),
      animate(".quote-icon-start", SLIDE_IN_DOWN),
      animate(".quote-icon-end", SLIDE_IN_UP)
    )
      .then(function () {
        return animate(".quote-content", SLIDE_IN_DOWN);
      })
      .then(function () {
        return animate(".quote-author", SLIDE_IN_DOWN);
      });
  }

  function animateLinks() {
    var DELAY_STEP = 200;
    var elements = $(".links a");
    var concurrent = $.makeArray(elements).map(function (element, index) {
      return animate(element, SLIDE_IN_DOWN, index * DELAY_STEP);
    });

    return $.when.apply($, concurrent);
  }

  function animateLocation() {
    return $.when(
      animate(".location-icon", SLIDE_IN_UP),
      animate(".location-text", SLIDE_IN_DOWN)
    );
  }

  function animate(selector, properties, delay, options) {
    delay = delay || 0;
    return $(selector).delay(delay).animate(properties, options).promise();
  }

  function registerCheatCode() {
    $(document.body).on("keydown", function (event) {
      var KEY_B = 66;

      if (event.which === KEY_B) {
        $(".relocate-location").text("Bookmark Page");
        $(".relocating").css("opacity", 1);

        window.setTimeout(function () {
          window.location.href = "/bookmarks.html";
        }, 1000);
      }
    });
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

html {
  transition: background-color 0.3s ease;
}

body {
  font: 16px/1.8 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Microsoft YaHei", Helvetica, Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji";

}

p {
  margin: 20px 0;
}

ul,
ol {
  list-style: none;
}

/* Fonts
/* ================================================= */
@font-face {
  font-family: "icomoon";
  src: url("./assets/fonts/icomoon.ttf") format("truetype"),
    url("./assets/fonts/icomoon.woff") format("woff"),
    url("./assets/fonts/icomoon.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"],
[class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "icomoon" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-map-pin:before {
  content: "\e902";
}

.icon-moon:before {
  content: "\e900";
}

.icon-sun:before {
  content: "\e901";
}

.icon-quotes-left:before {
  content: "\e977";
}

.icon-quotes-right:before {
  content: "\e978";
}

/* Animation
/* ================================================= */
.animate-slide-in-down,
.animate-slide-in-up {
  position: relative;
  opacity: 0;
}

.animate-slide-in-down {
  top: -10px;
}

.animate-slide-in-up {
  bottom: -10px;
}

.no-js .animate-slide-in-down,
.no-js .animate-slide-in-up {
  opacity: 1;
}

.no-js .animate-slide-in-down {
  top: 0;
}

.no-js .animate-slide-in-up {
  bottom: 0;
}

.animate-slide-in-left {
  left: -100%;
}

.no-js .animate-slide-in-left {
  left: 0;
}

.animate-slide-in-right {
  right: -100%;
}

.no-js .animate-slide-in-right {
  right: 0;
}

/* Headline
/* ================================================= */
.vi {
  margin: 100px auto 0;
  max-width: 780px;
  text-align: center;
}

@media (max-width: 767px) {
  .vi {
    margin-top: 50px;
  }
}

/* Quote
/* ================================================= */
.quote {
  position: relative;
  overflow: hidden;
  margin: 40px 20px;
}

.quote-line {
  display: block;
  position: relative;
  height: 1px;
  transition: all 0.3s ease;
}

.quote cite::before {
  content: "-";
  padding: 0 5px;
}

.quote-icon {
  position: absolute;
}

.quote-icon.animate-slide-in-down,
.quote-icon.animate-slide-in-up {
  opacity: 0;
}

.no-js .quote-icon.animate-slide-in-down,
.no-js .quote-icon.animate-slide-in-up {
  opacity: 1;
}

.quote-icon-start {
  left: 0;
}

.quote-icon-start.animate-slide-in-down {
  top: -10px;
}

.no-js .quote-icon-start.animate-slide-in-down {
  top: 0;
}

.quote-icon-end {
  right: 0;
}

.quote-icon-end.animate-slide-in-up {
  bottom: -10px;
}

.no-js .quote-icon-end.animate-slide-in-up {
  bottom: 0;
}

.quote-content {
  margin: 30px auto 0;
}

.quote-author {
  margin: 10px auto 30px;
}

/* Links
/* ================================================= */
.links {
  margin-top: 40px;
  font-size: 14px;
}

.links a {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  text-decoration: none;
  border-bottom: 1px dotted;
  transition: border 0.3s ease, color 0.3s ease;
}

.links a:hover {
  border-bottom: 1px solid;
}

.links a:active {
  top: 1px !important;
}

.links a:first-child {
  margin-left: 0;
}

/* Location
/* ================================================= */
.location {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.location-icon {
  font-size: 14px;
}

.location-text {
  margin-left: 6px;
  font-size: 13px;
}

.relocating {
  opacity: 0;
  font-size: 13px;
  transition: all 0.3s ease;
}

/* LIGHT MODE
/* ================================================= */
html {
  background-color: white;
}

body {
  color: #333;
}

::selection {
  background: #222;
  color: white;
}

h1 {
  color: #222;
}

.quote {
  color: #666;
}

.quote-icon {
  color: #ccc;
}

.quote-line {
  background: #eee;
}

a {
  color: #333;
}

.links a {
  border-bottom-color: #999;
}

.links a:hover {
  border-bottom-color: #333;
}

.location {
  color: #666;
}

.relocating {
  color: #ccc;
}

/* DARK MODE
/* ================================================= */
@media (prefers-color-scheme: dark) {
  html {
    background: #121621;
  }

  body {
    color: #6c7486;
  }

  ::selection {
    background: #222;
    color: #99a3ba;
  }

  h1 {
    color: #e4ecfa;
  }

  .quote {
    color: #6c7486;
  }

  .quote-icon {
    color: #3f4656;
  }

  .quote-line {
    background: #242836;
  }

  a {
    color: #99a3ba;
  }

  .links a {
    border-bottom-color: #6c7486;
  }

  .links a:hover {
    color: #e4ecfa;
    border-bottom-color: #99a3ba;
  }

  .location {
    color: #6c7486;
  }
}
</style>