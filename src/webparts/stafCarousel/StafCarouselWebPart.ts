import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export interface IJsonTipsViewerWebPartProps {}

export default class JsonTipsViewerWebPart extends BaseClientSideWebPart<IJsonTipsViewerWebPartProps> {

  public render(): void {
    const jsonUrl: string = "";

    
    this.domElement.innerHTML = `
      <div style="background:#E5E9F0; border:2px solid #D8DEE9; border-radius:12px; padding:20px; width:100%; box-sizing:border-box;">
        <div id="jsonTipsContainer" style="width:100%; box-sizing:border-box;">Loading team info...</div>
      </div>
    `;



    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        const people = data.people;
        let index = Math.floor(Math.random() * people.length);
        const container = document.getElementById('jsonTipsContainer');
        if (!container) return;

        const renderPerson = (i: number) => {
          const person = people[i];
          container.innerHTML = getPersonHtml(person);

          document.getElementById('prevBtn')?.addEventListener('click', () => {
            index = (index - 1 + people.length) % people.length;
            renderPerson(index);
          });

          document.getElementById('nextBtn')?.addEventListener('click', () => {
            index = (index + 1) % people.length;
            renderPerson(index);
          });
        };
const getPersonHtml = (person: any): string => {
  return `
    <div style="background:#ECEFF4; border:2px solid #D8DEE9; border-radius:10px; padding:20px; font-family:sans-serif; width:100%; box-sizing:border-box;">
      <div style="display:flex; align-items:flex-start; flex-wrap:wrap;">
        <img
          src="${person.photoURL}"
          alt="${person.name}"
          style="
            height: 180px;
            object-fit: cover;
            border-radius: 9999px;
            border: 10px dotted rgba(129, 161, 193, 0.9);
            padding: 10px;
            margin-right: 20px;
            box-shadow: inset 0 0 0 2px transparent;
            background: #ECEFF4;
          "
        >
        <div style="flex:1; min-width:200px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:1.3em; font-weight:bold; color:#2E3440;">${person.name}</div>
            <div style="color:#5E81AC; font-style:italic; font-size:1.1em;">${person.title}</div>
            <div style="margin-top:8px; color:#4C566A; font-size:1em;">${person.details}</div>
          </div>
          <div style="text-align:right; margin-top:15px;">
            <button id="prevBtn" style="background:#D8DEE9; border:none; padding:6px 12px; border-radius:4px; color:#2E3440; margin-right:8px; cursor:pointer;">&lt;</button>
            <button id="nextBtn" style="background:#81A1C1; border:none; padding:6px 12px; border-radius:4px; color:white; cursor:pointer;">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  `;
};



        renderPerson(index);
      })

      .catch(err => {
        const container = document.getElementById('jsonTipsContainer');
        if (container) container.innerHTML = `<div style="color:red;">Failed to load data.</div>`;
        console.error('JSON fetch error:', err);
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
