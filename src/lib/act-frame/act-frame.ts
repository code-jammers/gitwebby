import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/mwc-icon-button';

import { SelectedFile } from '../types/SelectedFile';

@customElement('act-frame')
export default class ActFrameElement extends LitElement {
  @property({ type: String }) selectedPage: string;
  @property({ type: Number}) width: int = 800;
  @property({ type: Number}) height: int = 700;
  @property({ type: Object }) selectedFile: SelectedFile | null;

  static styles = [
    css`
      :host {
        display: flex;
      }
      div[container] {
        background-color: #bf4fcf;
        padding: 4px;
        margin: 4px;
        border-radius: 5px;
      }
      div[frame] {
        background-color: white;
      }
    `,
  ];

  firstUpdated() {
    setTimeout(() => {
      // post-render hook
      console.log(`${this.selectedFile.name} (${this.selectedFile.hash}):
        ${this.selectedFile.view.substring(0,16)}.....`);
      this.renderRoot.querySelector('#actframe').contentWindow.postMessage("actframe"+this.selectedFile.view);
    }, 200);
  }

  render() {
    return html`
      <div container>
        <div frame>
          <iframe
            id="actframe"
            width=${this.width}
            height=${this.height}
            src="/src/lib/act-frame/index.html"
            title="Act Frame"
          ></iframe>
          </div>
      </div>
    `;
  }
}
