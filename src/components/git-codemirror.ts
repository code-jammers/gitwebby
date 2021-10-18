import { css, customElement, html, LitElement, property } from 'lit-element';
import CodeMirrorStyles from '../styles/code-mirror-styles';
import '../../scripts/code-mirror.js';
import '../../scripts/javascript-mode.js';
import { SelectedFile } from '../types/SelectedFile';

@customElement('git-codemirror')
export default class GitCodemirrorElement extends LitElement {
  @property({ type: Object }) selectedFile: SelectedFile | null;

  static styles = [
    CodeMirrorStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];
  render() {
    return html`
      <wc-codemirror mode="javascript" theme="mdn-like">
        <script type="wc-content">
          ${this.selectedFile?.view}
        </script>
      </wc-codemirror>
    `;
  }
}
