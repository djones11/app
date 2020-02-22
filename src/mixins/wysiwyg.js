var infiniteWhile = 1;

var getNodeOffset = function(start, dest) {
  var offset = 0;
  var node = start;
  var stack = [];

  while (infiniteWhile == 1) {
    if (node === dest) {
      return offset;
    }

    // Go into children
    if (node.firstChild) {
      // Going into first one doesn't count
      if (node !== start) offset += 1;
      stack.push(node);
      node = node.firstChild;
    }
    // If can go to next sibling
    else if (stack.length > 0 && node.nextSibling) {
      // If text, count length (plus 1)
      if (node.nodeType === 3) offset += node.nodeValue.length + 1;
      else offset += 1;

      node = node.nextSibling;
    } else {
      // If text, count length
      if (node.nodeType === 3) offset += node.nodeValue.length + 1;
      else offset += 1;

      // No children or siblings, move up stack
      while (infiniteWhile == 1) {
        if (stack.length <= 1) return offset;

        var next = stack.pop();

        // Go to sibling
        if (next.nextSibling) {
          node = next.nextSibling;
          break;
        }
      }
    }
  }
};

// Calculate the total offsets of a node
var calculateNodeOffset = function(node) {
  var offset = 0;

  // If text, count length
  if (node.nodeType === 3) offset += node.nodeValue.length + 1;
  else offset += 1;

  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      offset += calculateNodeOffset(node.childNodes[i]);
    }
  }

  return offset;
};

// Determine total offset length from returned offset from ranges
var totalOffsets = function(parentNode, offset) {
  if (parentNode.nodeType == 3) return offset;

  if (parentNode.nodeType == 1) {
    var total = 0;
    // Get child nodes
    for (var i = 0; i < offset; i++) {
      total += calculateNodeOffset(parentNode.childNodes[i]);
    }
    return total;
  }

  return 0;
};

var getNodeAndOffsetAt = function(start, offset) {
  var node = start;
  var stack = [];

  while (infiniteWhile == 1) {
    // If arrived
    if (offset <= 0) return { node: node, offset: 0 };

    // If will be within current text node
    if (node.nodeType == 3 && offset <= node.nodeValue.length)
      return { node: node, offset: Math.min(offset, node.nodeValue.length) };

    // Go into children (first one doesn't count)
    if (node.firstChild) {
      if (node !== start) offset -= 1;
      stack.push(node);
      node = node.firstChild;
    }
    // If can go to next sibling
    else if (stack.length > 0 && node.nextSibling) {
      // If text, count length
      if (node.nodeType === 3) offset -= node.nodeValue.length + 1;
      else offset -= 1;

      node = node.nextSibling;
    } else {
      // No children or siblings, move up stack
      while (infiniteWhile == 1) {
        if (stack.length <= 1) {
          // No more options, use current node
          if (node.nodeType == 3)
            return {
              node: node,
              offset: Math.min(offset, node.nodeValue.length)
            };
          else return { node: node, offset: 0 };
        }

        var next = stack.pop();

        // Go to sibling
        if (next.nextSibling) {
          // If text, count length
          if (node.nodeType === 3) offset -= node.nodeValue.length + 1;
          else offset -= 1;

          node = next.nextSibling;
          break;
        }
      }
    }
  }
};

// Various wysiwyg operations

export default {
  methods: {
    makeBold(focusFunction, updateFunction) {
      focusFunction();

      this.$nextTick(() => {
        this.changeTextStyle("bold");
        updateFunction();
      });
    },
    makeItalic(focusFunction, updateFunction) {
      focusFunction();

      this.$nextTick(() => {
        this.changeTextStyle("italic");
        updateFunction();
      });
    },
    makeUnderline(focusFunction, updateFunction) {
      focusFunction();

      this.$nextTick(() => {
        this.changeTextStyle("underline");
        updateFunction();
      });
    },
    placeCaretAtEnd(el) {
      el.focus();

      if (
        typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined"
      ) {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
      }
    },
    insertTextAtCursor(text) {
      let sel, range;

      sel = window.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();

      let textNode = document.createElement("div");

      textNode.innerHTML = text;

      range.insertNode(textNode);
      range.setStartAfter(textNode);

      sel.removeAllRanges();
      sel.addRange(range);
    },
    insertAtCursorTextarea(myField, myValue) {
      if (typeof myField == "string") {
        myField = document.getElementById(myField);
      }

      //IE support
      if (document.selection) {
        myField.focus();
        let sel = document.selection.createRange();
        sel.text = myValue;
      }
      //MOZILLA and others
      else if (myField.selectionStart || myField.selectionStart == "0") {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        myField.value =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length);
      } else {
        myField.value += myValue;
      }
    },
    pasteHtmlAtCaret(html) {
      var sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();

          // Range.createContextualFragment() would be useful here but is
          // non-standard and not supported in all browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }
    },
    saveCaretPosition(containerEl) {
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        return {
          start:
            getNodeOffset(containerEl, range.startContainer) +
            totalOffsets(range.startContainer, range.startOffset),
          end:
            getNodeOffset(containerEl, range.endContainer) +
            totalOffsets(range.endContainer, range.endOffset)
        };
      } else return null;
    },
    restoreCaretPosition(containerEl, savedSel) {
      if (!savedSel) {
        containerEl.focus();
        return;
      }

      var range = document.createRange();

      var startNodeOffset, endNodeOffset;
      startNodeOffset = getNodeAndOffsetAt(containerEl, savedSel.start);
      endNodeOffset = getNodeAndOffsetAt(containerEl, savedSel.end);

      range.setStart(startNodeOffset.node, startNodeOffset.offset);
      range.setEnd(endNodeOffset.node, endNodeOffset.offset);

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getSelectionHtml() {
      var html = "";

      if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
          var container = document.createElement("div");
          for (var i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML;
        }
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText;
        }
      }
      return html;
    },
    changeTextStyle(styleType, optParam) {
      if (typeof optParam == "undefined" || optParam == null) {
        optParam = null;
      }
      var range;

      if (window.getSelection) {
        // IE9 and non-IE
        try {
          /*if (!document.execCommand("BackColor", false, colour)) {
                makeEditableAndHighlight(colour);
            }*/
          if (!document.execCommand(styleType, false, optParam)) {
            this.makeEditableAndHighlight(styleType, optParam);
          }
        } catch (ex) {
          this.makeEditableAndHighlight(styleType, optParam);
        }
      } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand(styleType, false, optParam);
        //range.execCommand("BackColor", false, colour);
      }
    },
    makeEditableAndHighlight(styleType, optParam) {
      if (typeof optParam == "undefined" || optParam == null) {
        optParam = null;
      }
      var range,
        sel = window.getSelection();
      if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
      }
      document.designMode = "on";
      if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      // Use HiliteColor since some browsers apply BackColor to the whole block
      /*if (!document.execCommand("HiliteColor", false, colour)) {
          document.execCommand("BackColor", false, colour);
      }*/
      document.execCommand(styleType, false, optParam);
      document.designMode = "off";
    }
  }
};
