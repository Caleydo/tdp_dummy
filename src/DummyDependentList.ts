/**
 * Created by Samuel Gratzl on 29.01.2016.
 */


import * as ajax from 'phovea_core/src/ajax';
import * as idtypes from 'phovea_core/src/idtype';
import {IViewContext, ISelection} from 'targid2/src/View';
import {ALineUpView, stringCol, numberCol2, useDefaultLayout} from 'targid2/src/LineUpView';
import {types, samples, ParameterFormIds} from './Configs';
import {FormBuilder, FormElementType, IFormSelectDesc} from 'targid2/src/FormBuilder';
import {showErrorModalDialog} from 'targid2/src/Dialogs';

class DummyDependentList extends ALineUpView {

  private lineupPromise : Promise<any>;

  private paramForm:FormBuilder;
  private paramDesc:IFormSelectDesc[] = [
    {
      type: FormElementType.SELECT,
      label: 'Type',
      id: ParameterFormIds.TYPE,
      options: {
        optionsData: types
      },
      useSession: true
    },
    {
      type: FormElementType.SELECT,
      label: 'Sample Type',
      id: ParameterFormIds.SAMPLE,
      options: {
        optionsData: samples
      },
      useSession: true
    }
  ];

  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
  }

  init() {
    this.build();
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    this.paramForm = new FormBuilder($parent);

    // map FormElement change function to provenance graph onChange function
    this.paramDesc.forEach((p) => {
      p.options.onChange = (selection, formElement) => onChange(formElement.id, selection.value);
    });

    this.paramForm.build(this.paramDesc);

    // add other fields
    super.buildParameterUI($parent.select('form'), onChange);
  }

  getParameter(name: string): any {
    return this.paramForm.getElementById(name).value.data;
  }

  setParameter(name: string, value: any) {
    this.paramForm.getElementById(name).value = value;
    return this.update();
  }

  changeSelection(selection: ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    const id = this.selection.range.first;
    const idtype = this.selection.idtype;

    this.setBusy(true);

    const promise = Promise.all([
        this.lineupPromise,
        this.resolveId(idtype, id, 'IDTypeA')
      ])
      .then((args) => {
        const gene_name = args[1];
        return ajax.getAPIJSON('/targid/db/dummy/dummy_dependent', {
          _assignids : true, //assign globally ids on the server side
          a_id: gene_name,
          ab_cat: this.getParameter(ParameterFormIds.TYPE),
          b_cat2: this.getParameter(ParameterFormIds.SAMPLE)
        });
      });

    // on success
    promise.then((rows) => {
      this.fillIDTypeMapCache(idtype, rows);
      this.replaceLineUpData(rows);
      this.updateMapping('score', rows);
      this.setBusy(false);
    });

    // on error
    promise.catch(showErrorModalDialog)
      .catch((error) => {
        console.error(error);
        this.setBusy(false);
      });

    return promise;
  }

  private build() {
    //generate random data
    this.setBusy(true);
    const columns = [
      stringCol('a_name','Name'),
      numberCol2('score', 0, 100),
    ];
    var lineup = this.buildLineUp([], columns, idtypes.resolve('IDTypeA'),(d) => d._id);
    useDefaultLayout(lineup);
    lineup.update();
    this.initializedLineUp();

    this.lineupPromise = Promise.resolve(lineup);
  }
}
export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new DummyDependentList(context, selection, parent, options);
}


