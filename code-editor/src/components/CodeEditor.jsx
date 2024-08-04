import React, { useState, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import "./CodeEditor.css";
import clsx from "clsx";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("oneDark");
  const textAreaRef = useRef(null);
  const highlightAreaRef = useRef(null);

  const caretColor = [
    "github",
    "oneLight",
    "duotoneLight",
    "jettwaveLight",
    "nightOwlLight",
    "ultramin",
    "vsLight",
  ].includes(theme)
    ? "black"
    : "white";

  useEffect(() => {
    const textarea = textAreaRef.current;
    const highlightArea = highlightAreaRef.current;

    const maxHeight = window.innerHeight;
    const maxWidth = window.innerWidth;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    textarea.style.width = maxWidth;
    textarea.style.width = `${textarea.scrollWidth}px`;

    if (textarea.scrollHeight <= maxHeight) {
      highlightArea.style.height = "100vh";
    } else {
      highlightArea.style.height = `${textarea.scrollHeight}px`; // Expand highlight area if textarea grows
    }

    if (textarea.scrollWidth <= maxWidth) {
      highlightArea.style.width = "100vw";
    } else {
      highlightArea.style.width = `${textarea.scrollWidth}px`;
    }
  }, [code]); // Dependency on `code` so it adjusts whenever `code` changes

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const handleKeyDown = (event) => {
    const { selectionStart, selectionEnd } = event.target;

    if (event.key === "Tab") {
      event.preventDefault();
      const newCode =
        code.substring(0, selectionStart) + "  " + code.substring(selectionEnd);
      setCode(newCode);
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd =
        selectionStart + 2;
    }
  };

  return (
    <div className="wrapper">
      <div className="headerBar">
        <select
          value={language}
          className="languageSelect"
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="jsx">Javascript with React</option>
        </select>
        &nbsp;
        <select
          value={theme}
          className="languageSelect"
          onChange={handleThemeChange}
        >
          {Object.keys(themes).map((themeKey) => (
            <option key={themeKey} value={themeKey}>
              {themeKey}
            </option>
          ))}
        </select>
      </div>
      <div className="editor-container">
        <div className="scroll-container">
          <textarea
            ref={textAreaRef}
            className="code-input"
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ caretColor }}
          />
          <div className="highlight-container">
            <Highlight theme={themes[theme]} code={code} language={language}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  ref={highlightAreaRef}
                  className={clsx(className, "code-highlight")}
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="lineNumber">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
