/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/ThemeContext.js":
/*!**********************************!*\
  !*** ./contexts/ThemeContext.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst useTheme = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (!context) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n};\nconst ThemeProvider = ({ children })=>{\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"light\");\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    // Load theme from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedTheme = localStorage.getItem(\"humanet-theme\");\n        if (savedTheme) {\n            setTheme(savedTheme);\n        } else {\n            // Check system preference\n            const systemTheme = window.matchMedia(\"(prefers-color-scheme: dark)\").matches ? \"dark\" : \"light\";\n            setTheme(systemTheme);\n        }\n        setMounted(true);\n    }, []);\n    // Save theme to localStorage and update document class\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (mounted) {\n            localStorage.setItem(\"humanet-theme\", theme);\n            document.documentElement.classList.remove(\"light\", \"dark\");\n            document.documentElement.classList.add(theme);\n        }\n    }, [\n        theme,\n        mounted\n    ]);\n    // Listen for system theme changes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const mediaQuery = window.matchMedia(\"(prefers-color-scheme: dark)\");\n        const handleChange = (e)=>{\n            // Only update if user hasn't manually set a preference\n            if (!localStorage.getItem(\"humanet-theme\")) {\n                setTheme(e.matches ? \"dark\" : \"light\");\n            }\n        };\n        mediaQuery.addEventListener(\"change\", handleChange);\n        return ()=>mediaQuery.removeEventListener(\"change\", handleChange);\n    }, []);\n    const toggleTheme = ()=>{\n        setTheme((prev)=>prev === \"light\" ? \"dark\" : \"light\");\n    };\n    const value = {\n        theme,\n        toggleTheme,\n        isDark: theme === \"dark\",\n        isLight: theme === \"light\"\n    };\n    // Prevent flash of unstyled content\n    if (!mounted) {\n        return null;\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\Sanskar\\\\programming\\\\projects\\\\Humanet\\\\apps\\\\web\\\\contexts\\\\ThemeContext.js\",\n        lineNumber: 73,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9UaGVtZUNvbnRleHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUF1RTtBQUV2RSxNQUFNSSw2QkFBZUosb0RBQWFBO0FBRTNCLE1BQU1LLFdBQVc7SUFDdEIsTUFBTUMsVUFBVUwsaURBQVVBLENBQUNHO0lBQzNCLElBQUksQ0FBQ0UsU0FBUztRQUNaLE1BQU0sSUFBSUMsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1QsRUFBRTtBQUVLLE1BQU1FLGdCQUFnQixDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUN4QyxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR1QsK0NBQVFBLENBQUM7SUFDbkMsTUFBTSxDQUFDVSxTQUFTQyxXQUFXLEdBQUdYLCtDQUFRQSxDQUFDO0lBRXZDLHdDQUF3QztJQUN4Q0MsZ0RBQVNBLENBQUM7UUFDUixNQUFNVyxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsSUFBSUYsWUFBWTtZQUNkSCxTQUFTRztRQUNYLE9BQU87WUFDTCwwQkFBMEI7WUFDMUIsTUFBTUcsY0FBY0MsT0FBT0MsVUFBVSxDQUFDLGdDQUNuQ0MsT0FBTyxHQUNOLFNBQ0E7WUFDSlQsU0FBU007UUFDWDtRQUNBSixXQUFXO0lBQ2IsR0FBRyxFQUFFO0lBRUwsdURBQXVEO0lBQ3ZEVixnREFBU0EsQ0FBQztRQUNSLElBQUlTLFNBQVM7WUFDWEcsYUFBYU0sT0FBTyxDQUFDLGlCQUFpQlg7WUFDdENZLFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDQyxNQUFNLENBQUMsU0FBUztZQUNuREgsU0FBU0MsZUFBZSxDQUFDQyxTQUFTLENBQUNFLEdBQUcsQ0FBQ2hCO1FBQ3pDO0lBQ0YsR0FBRztRQUFDQTtRQUFPRTtLQUFRO0lBRW5CLGtDQUFrQztJQUNsQ1QsZ0RBQVNBLENBQUM7UUFDUixNQUFNd0IsYUFBYVQsT0FBT0MsVUFBVSxDQUFDO1FBQ3JDLE1BQU1TLGVBQWVDLENBQUFBO1lBQ25CLHVEQUF1RDtZQUN2RCxJQUFJLENBQUNkLGFBQWFDLE9BQU8sQ0FBQyxrQkFBa0I7Z0JBQzFDTCxTQUFTa0IsRUFBRVQsT0FBTyxHQUFHLFNBQVM7WUFDaEM7UUFDRjtRQUVBTyxXQUFXRyxnQkFBZ0IsQ0FBQyxVQUFVRjtRQUN0QyxPQUFPLElBQU1ELFdBQVdJLG1CQUFtQixDQUFDLFVBQVVIO0lBQ3hELEdBQUcsRUFBRTtJQUVMLE1BQU1JLGNBQWM7UUFDbEJyQixTQUFTc0IsQ0FBQUEsT0FBU0EsU0FBUyxVQUFVLFNBQVM7SUFDaEQ7SUFFQSxNQUFNQyxRQUFRO1FBQ1p4QjtRQUNBc0I7UUFDQUcsUUFBUXpCLFVBQVU7UUFDbEIwQixTQUFTMUIsVUFBVTtJQUNyQjtJQUVBLG9DQUFvQztJQUNwQyxJQUFJLENBQUNFLFNBQVM7UUFDWixPQUFPO0lBQ1Q7SUFFQSxxQkFDRSw4REFBQ1IsYUFBYWlDLFFBQVE7UUFBQ0gsT0FBT0E7a0JBQVF6Qjs7Ozs7O0FBRTFDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AaHVtYW5ldC93ZWIvLi9jb250ZXh0cy9UaGVtZUNvbnRleHQuanM/YjczOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZVRoZW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFRoZW1lUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgW3RoZW1lLCBzZXRUaGVtZV0gPSB1c2VTdGF0ZSgnbGlnaHQnKTtcclxuICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIC8vIExvYWQgdGhlbWUgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gbW91bnRcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3Qgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdodW1hbmV0LXRoZW1lJyk7XHJcbiAgICBpZiAoc2F2ZWRUaGVtZSkge1xyXG4gICAgICBzZXRUaGVtZShzYXZlZFRoZW1lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIENoZWNrIHN5c3RlbSBwcmVmZXJlbmNlXHJcbiAgICAgIGNvbnN0IHN5c3RlbVRoZW1lID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKVxyXG4gICAgICAgIC5tYXRjaGVzXHJcbiAgICAgICAgPyAnZGFyaydcclxuICAgICAgICA6ICdsaWdodCc7XHJcbiAgICAgIHNldFRoZW1lKHN5c3RlbVRoZW1lKTtcclxuICAgIH1cclxuICAgIHNldE1vdW50ZWQodHJ1ZSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyBTYXZlIHRoZW1lIHRvIGxvY2FsU3RvcmFnZSBhbmQgdXBkYXRlIGRvY3VtZW50IGNsYXNzXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtb3VudGVkKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdodW1hbmV0LXRoZW1lJywgdGhlbWUpO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbGlnaHQnLCAnZGFyaycpO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGVtZSk7XHJcbiAgICB9XHJcbiAgfSwgW3RoZW1lLCBtb3VudGVkXSk7XHJcblxyXG4gIC8vIExpc3RlbiBmb3Igc3lzdGVtIHRoZW1lIGNoYW5nZXNcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJyk7XHJcbiAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSBlID0+IHtcclxuICAgICAgLy8gT25seSB1cGRhdGUgaWYgdXNlciBoYXNuJ3QgbWFudWFsbHkgc2V0IGEgcHJlZmVyZW5jZVxyXG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdodW1hbmV0LXRoZW1lJykpIHtcclxuICAgICAgICBzZXRUaGVtZShlLm1hdGNoZXMgPyAnZGFyaycgOiAnbGlnaHQnKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtZWRpYVF1ZXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUNoYW5nZSk7XHJcbiAgICByZXR1cm4gKCkgPT4gbWVkaWFRdWVyeS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVDaGFuZ2UpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlVGhlbWUgPSAoKSA9PiB7XHJcbiAgICBzZXRUaGVtZShwcmV2ID0+IChwcmV2ID09PSAnbGlnaHQnID8gJ2RhcmsnIDogJ2xpZ2h0JykpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHZhbHVlID0ge1xyXG4gICAgdGhlbWUsXHJcbiAgICB0b2dnbGVUaGVtZSxcclxuICAgIGlzRGFyazogdGhlbWUgPT09ICdkYXJrJyxcclxuICAgIGlzTGlnaHQ6IHRoZW1lID09PSAnbGlnaHQnLFxyXG4gIH07XHJcblxyXG4gIC8vIFByZXZlbnQgZmxhc2ggb2YgdW5zdHlsZWQgY29udGVudFxyXG4gIGlmICghbW91bnRlZCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PntjaGlsZHJlbn08L1RoZW1lQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lIiwiY29udGV4dCIsIkVycm9yIiwiVGhlbWVQcm92aWRlciIsImNoaWxkcmVuIiwidGhlbWUiLCJzZXRUaGVtZSIsIm1vdW50ZWQiLCJzZXRNb3VudGVkIiwic2F2ZWRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzeXN0ZW1UaGVtZSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwic2V0SXRlbSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwibWVkaWFRdWVyeSIsImhhbmRsZUNoYW5nZSIsImUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvZ2dsZVRoZW1lIiwicHJldiIsInZhbHVlIiwiaXNEYXJrIiwiaXNMaWdodCIsIlByb3ZpZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/ThemeContext.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/ThemeContext */ \"./contexts/ThemeContext.js\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"D:\\\\Sanskar\\\\programming\\\\projects\\\\Humanet\\\\apps\\\\web\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Sanskar\\\\programming\\\\projects\\\\Humanet\\\\apps\\\\web\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBK0I7QUFDMEI7QUFFMUMsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ0gsaUVBQWFBO2tCQUNaLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGh1bWFuZXQvd2ViLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL1RoZW1lQ29udGV4dCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiVGhlbWVQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();