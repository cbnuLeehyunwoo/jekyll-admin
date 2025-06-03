import React, { Component } from 'react'; 
import PropTypes from 'prop-types';
import SimpleMDE from 'simplemde';
import hljs from '../utils/highlighter';
import FilePicker from './FilePicker';
import { getExtensionFromPath } from '../utils/helpers';

const classNames = [
  'editor-toolbar',
  'CodeMirror',
  'editor-preview-side',
  'editor-statusbar',
];

class MarkdownEditor extends Component {
  constructor(props) {
    super(props);
    this.editor = null; // SimpleMDE instance
  }

  componentDidMount() {
    this.create();
    window.hljs = hljs; // TODO: fix this after the next release of SimpleMDE



    if (this.editor && this.editor.codemirror) {
        const editorWrapper = this.editor.codemirror.getWrapperElement();
        editorWrapper.addEventListener('dragover', this.handleDragOver);
        editorWrapper.addEventListener('dragleave', this.handleDragLeave);
        editorWrapper.addEventListener('drop', this.handleDrop);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.initialValue !== this.props.initialValue;
  }

  componentDidUpdate() {
    this.destroy();
    this.create();
  }

  componentWillUnmount() {
    this.destroy();
    if (this.editor && this.editor.codemirror) {
        const editorWrapper = this.editor.codemirror.getWrapperElement();
        editorWrapper.removeEventListener('dragover', this.handleDragOver);
        editorWrapper.removeEventListener('dragleave', this.handleDragLeave);
        editorWrapper.removeEventListener('drop', this.handleDrop);
    }
  }

  create() {
    const { onChange, onSave } = this.props;
    let opts = Object.create(this.props);
    opts['element'] = this.refs.text;
    opts['autoDownloadFontAwesome'] = false;
    opts['spellChecker'] = false;
    opts['renderingConfig'] = {
      codeSyntaxHighlighting: true,
    };
    opts['insertTexts'] = {
      image: ['![', '](#url#)'], 
    };
    let toolbarIcons = [
      'bold',
      'italic',
      'heading',
      '|',
      'code',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'table',
      {
        name: 'filepicker',
        action: () => this.refs.filepicker.refs.trigger.click(),
        className: 'fa fa-paperclip',
        title: 'Insert Static File',
      },
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
    ];
    if (onSave) {
      toolbarIcons.push({
        name: 'save',
        action: onSave,
        className: 'fa fa-floppy-o',
        title: 'Save',
      });
    }
    opts['toolbar'] = toolbarIcons;
    const editor = new SimpleMDE(opts);
    if (editor.codemirror) {
      editor.codemirror.on('change', () => {
        onChange(editor.value());
      });
    }
    this.editor = editor;
  }

  destroy() {
    for (let i in classNames) {
      let elementToRemove = this.refs.container.querySelector(
        '.' + classNames[i]
      );
      elementToRemove && elementToRemove.remove();
    }
    if (this.editor) {
        this.editor.toTextArea(); 
        this.editor = null;
    }
  }

  // Helper to replace selected text in CodeMirror
  _replaceSelectedText = (cm, headNTail, url) => {
    const startPoint = cm.getCursor('start');
    const endPoint = cm.getCursor('end');
    const text = cm.getSelection();

    let [head, tail] = headNTail;
    if (url) {
      tail = tail.replace('#url#', url);
    }

    cm.replaceSelection(`${head}${text}${tail}`);
    startPoint.ch += head.length;

    if (startPoint !== endPoint) {
      endPoint.ch += head.length;
    }

    cm.setSelection(startPoint, endPoint);
    cm.focus();
  };

  handleFilePick = path => {
    const { codemirror, options } = this.editor;
    const { image, link } = options.insertTexts;
    const url = `{{ '${path}' | relative_url }}`; // Jekyll relative_url filter
    const ext = getExtensionFromPath(path);

    const type = /png|jpg|gif|jpeg|svg|ico/i.test(ext) ? image : link;
    this._replaceSelectedText(codemirror, type, url);
  };

  // Drag and drop event handlers
  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over-effect'); // Visual feedback for drag over
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over-effect'); // Remove visual feedback
  };

  handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over-effect');

    let imageUrl = null;
    let imageAltText = 'Image';
    const cm = this.editor.codemirror;

    // Prioritize web-to-web drag and drop (inserting existing URL)
    // Check data types in order: text/uri-list > text/html > text/plain
    if (e.dataTransfer.types.includes('text/uri-list')) {
        const uriList = e.dataTransfer.getData('text/uri-list');
        const urls = uriList.split('\n').filter(url => url.match(/\.(jpeg|jpg|gif|png|webp|webp|svg)$/i));
        if (urls.length > 0) {
            imageUrl = urls[0];
            imageAltText = imageUrl.split('/').pop().split('.')[0];
        }
    }
    
    if (!imageUrl && e.dataTransfer.types.includes('text/html')) {
        const html = e.dataTransfer.getData('text/html');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const img = doc.querySelector('img');
        if (img && img.src) {
            imageUrl = img.src;
            imageAltText = img.alt || imageAltText;
        }
    }

    if (!imageUrl && e.dataTransfer.types.includes('text/plain')) {
        const plainText = e.dataTransfer.getData('text/plain');
        if (plainText.match(/^https?:\/\/[^\s$.?#].*\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
            imageUrl = plainText;
            imageAltText = plainText.split('/').pop().split('.')[0];
        }
    }
    
    // If a valid image URL is found from web content, insert it as markdown and exit.
    if (imageUrl) {
        const markdown = `![${imageAltText}](${imageUrl})`;
        if (cm) {
            cm.replaceSelection(markdown);
            this.props.onChange(this.editor.value());
        }
        console.log(`[Jekyll Admin D&D] Web image URL inserted: ${imageUrl}`);
        return; 
    }

    // Fallback: If no recognizable web image URL is found, check if it's a local file.
    // NOTE: Local file upload requires a separate server implementation, so we just alert.
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const imageFile = files[0];
        if (imageFile.type.startsWith('image/')) {
            console.warn('[Jekyll Admin D&D] Local file detected, but upload feature is not implemented.');
            alert('Local file upload requires separate server setup and implementation.');
            return;
        }
    }

    // If no recognizable image file or URL is found after all checks.
    console.warn('[Jekyll Admin D&D] No recognizable image or URL found in dropped content.');
    alert('Could not recognize a valid image or URL in the dropped content.');
  };

  render() {
    return (
      <div>
        <div style={{ display: 'none' }}>
          <FilePicker ref="filepicker" onPick={this.handleFilePick} />
        </div>
        <div ref="container">
          <textarea ref="text" />
        </div>
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

MarkdownEditor.defaultProps = {
  initialValue: '',
  placeholder: '',
};

export default MarkdownEditor;
