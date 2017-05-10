;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-weidaoru" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M663.210667 0H145.066667a17.066667 17.066667 0 0 0-17.066667 17.066667v989.866666a17.066667 17.066667 0 0 0 17.066667 17.066667h733.866666a17.066667 17.066667 0 0 0 17.066667-17.066667V246.869333z" fill="#B9D1F1" ></path>' +
    '' +
    '<path d="M663.296 0l1.109333 246.869333H896L663.296 0z" fill="#EBF3FD" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-chengjizhengzaidaoru" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M664.271266 0H145.062401a17.062401 17.062401 0 0 0-17.062401 17.062401v989.619262a17.062401 17.062401 0 0 0 17.062401 17.062401h733.683246a17.062401 17.062401 0 0 0 17.062401-17.062401V245.869199z" fill="#848CE9" ></path>' +
    '' +
    '<path d="M664.271266 0.255936v245.613263H895.808048L664.271266 0.255936z" fill="#EBF3FD" ></path>' +
    '' +
    '<path d="M651.559777 702.459052h-17.744897a138.461385 138.461385 0 0 0-74.989253-136.499209 140.679497 140.679497 0 0 0 74.648005-141.873864h18.086145a13.564609 13.564609 0 1 0 0-27.129218H397.841873a13.564609 13.564609 0 0 0 0 27.129218h21.498625c-2.729984 23.802049-4.009664 98.961926 78.401733 141.959176-77.719237 40.523203-80.363909 109.540615-78.060485 136.499209h-21.839873a13.564609 13.564609 0 1 0 0 27.129218h253.717904a13.564609 13.564609 0 1 0 0-27.129218z m-33.18637 0a130.527368 130.527368 0 0 0-85.994502-31.90669V552.992419v-0.85312a84.373573 84.373573 0 0 0 59.718404-76.780805s0-2.900608-5.11872-2.900608-4.777472 2.900608-4.777473 2.900608c-3.497792 49.822211-52.466883 66.116804-53.405315 66.458052s-53.234691-16.550529-56.903108-66.458052c0 0 0-3.071232-5.289344-3.241856s-5.204032 3.241856-5.204032 3.241856 0 56.98842 64.410564 76.780805v118.413063a137.437641 137.437641 0 0 0-88.980422 31.992002h-0.85312c-8.531201-94.696326 80.363909-127.968008 80.363909-127.968008 14.417729-9.043073 2.218112-16.038657 0-17.062401l-1.023744-0.682496s-91.625094-34.124802-79.937349-132.830792h182.48238c11.090561 98.535366-76.268933 132.830792-76.268933 132.830792-5.033408 3.327168-6.569024 6.3984-6.569025 9.043072s1.535616 5.630592 6.569025 8.531201c0.085312 0.511872 84.885445 33.527618 76.695493 127.882696z" fill="#FFFFFF" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-chengjidaoruchenggong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M664.149333 0H145.066667a17.066667 17.066667 0 0 0-17.066667 17.066667v989.866666a17.066667 17.066667 0 0 0 17.066667 17.066667h733.866666a17.066667 17.066667 0 0 0 17.066667-17.066667V245.930667z" fill="#4DC3FC" ></path>' +
    '' +
    '<path d="M664.149333 0v245.674667h231.594667L664.149333 0z" fill="#EBF3FD" ></path>' +
    '' +
    '<path d="M699.733333 404.906667c-21.504-17.066667-34.133333 0-34.133333 0L492.970667 616.874667a22.442667 22.442667 0 0 1-32.512 2.474666l-58.026667-52.736a22.784 22.784 0 0 0-34.133333 1.536l-19.285334 22.698667a25.6 25.6 0 0 0 1.450667 35.328l95.658667 90.026667s29.781333 32 55.552-2.816C555.776 640.597333 699.733333 439.04 699.733333 439.04s17.066667-20.906667 0-34.133333z" fill="#FFFFFF" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-chengjidaoruchucuo" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M663.808 0H145.066667a17.066667 17.066667 0 0 0-17.066667 17.066667v989.866666a17.066667 17.066667 0 0 0 17.066667 17.066667h733.866666a17.066667 17.066667 0 0 0 17.066667-17.066667V245.930667z" fill="#FFB27A" ></path>' +
    '' +
    '<path d="M664.149333 0v245.674667h231.594667L664.149333 0z" fill="#EBF3FD" ></path>' +
    '' +
    '<path d="M627.370667 423.082667a46.762667 46.762667 0 0 0-86.186667-25.088l-0.597333 1.28a46.421333 46.421333 0 0 0-4.778667 10.069333L443.733333 614.656a28.501333 28.501333 0 0 0-3.498666 13.568 28.672 28.672 0 0 0 53.418666 14.762667l126.464-194.730667a46.506667 46.506667 0 0 0 7.253334-25.173333zM425.813333 678.570667a36.010667 36.010667 0 1 0 36.010667 36.010666 36.010667 36.010667 0 0 0-36.010667-36.010666z" fill="#FFFFFF" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)