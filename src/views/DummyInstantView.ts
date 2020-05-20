import AInstantView from 'tdp_core/src/views/AInstantView';


export class DummyInstantView extends AInstantView {

  protected initImpl() {
    super.initImpl();

    this.build();
  }

  private build() {
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
