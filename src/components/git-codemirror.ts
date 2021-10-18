import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import CodeMirrorStyles from '../styles/code-mirror-styles';
import '../../scripts/code-mirror';
import '../../scripts/javascript-mode';
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
