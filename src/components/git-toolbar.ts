import { css, customElement, html, LitElement, property } from 'lit-element';
import '@material/mwc-icon-button';
import allStyles from '../styles/all-styles';

@customElement('git-toolbar')
export default class GitToolbarElement extends LitElement {
  @property({ type: String }) selectedPage: string;

  static styles = [
    ...allStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 50px;
        background-color: #eee;
        border-bottom: 1px solid #ddd;
      }

      toolbar-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        display: flex;
        max-width: var(--app-max-width);
        margin: 0 auto;
      }

      svg {
        width: 24px;
        height: 24px;
      }

      [main-title] {
        color: #606c76;
        font-family: 'Righteous', cursive;
        font-size: 26px;
        display: flex;
        align-items: center;
      }

      [main-title] span {
        transition: color 0.3s ease-in-out;
      }

      [main-title] svg {
        margin-top: 4px;
        margin-left: 4px;
        color: #9b4dca;
        transition: 0.3s ease-in-out;
      }

      [main-title]:hover span {
        color: #9b4dca;
      }

      [main-title]:hover svg {
        transform: rotate(360deg);
      }

      link-container a {
        margin-right: 12px;
      }
      link-container a[selected] {
        text-decoration: underline;
      }
    `,
  ];
  render() {
    return html`
      <toolbar-container>
        <a main-title href="/"
          ><span>Git</span>webby
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" /></svg
        ></a>

        <link-container>
          <a ?selected="${this.selectedPage === 'repositories' || this.selectedPage === 'repository'}" href="/repositories">Repositories</a>
          <a ?selected="${this.selectedPage === 'branches'}" href="/branches">Branches</a>
        </link-container>

        <a target="_blank" href="https://github.com/code-jammers/gitwebby">
          <mwc-icon-button>
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
          </mwc-icon-button>
        </a>
      </toolbar-container>
    `;
  }
}
