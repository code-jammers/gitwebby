import { customElement, html, LitElement, property } from 'lit-element';
import { Branch } from '../types/Branch';

@customElement('git-branches')
export default class GitBranchesElement extends LitElement {
  @property({ type: Array }) branches: Array<Branch> = [];
  render() {
    return html`
      <h1>branches</h1>
      ${this.branches?.map(branch => html` ${branch.main}`)}
    `;
  }
}
