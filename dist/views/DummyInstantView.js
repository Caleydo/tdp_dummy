import { AInstantView } from 'tdp_core';
export class DummyInstantView extends AInstantView {
    initImpl() {
        super.initImpl();
        this.build();
    }
    build() {
        const items = this.selection.items;
        this.node.innerHTML = `<table>
        <tbody>
          <tr>
            <th>ID</th>
            ${items.map((d) => `<td>${d._id}</td>`).join('')}
          </tr>
          <tr>
            <th>Name</th>
            ${items.map((d) => `<td>${d.id}</td>`).join('')}
          </tr>
          <tr>
            <th>Label</th>
            ${items.map((d) => `<td>${d.text}</td>`).join('')}
          </tr>
        </tbody>
    </table>`;
    }
}
//# sourceMappingURL=DummyInstantView.js.map