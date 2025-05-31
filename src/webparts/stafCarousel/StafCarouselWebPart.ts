import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export interface IJsonTipsViewerWebPartProps {}

export default class JsonTipsViewerWebPart extends BaseClientSideWebPart<IJsonTipsViewerWebPartProps> {

  public render(): void {
    const jsonUrl: string = "https://COMPANY.sharepoint.com/sites/IT/SiteAssets/teamCarousel/staff.json";

    this.domElement.innerHTML = `
      <div id="cardWrapper" style="background:#ECEFF4; border:2px solid #D8DEE9; border-radius:10px; padding:20px; font-family:sans-serif; width:100%; box-sizing:border-box;">
        <div id="jsonTipsContainer" style="transition: opacity 0.3s ease; opacity: 1;"></div>
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
          const container = document.getElementById('jsonTipsContainer');
          if (!container) return;

          container.style.opacity = '0';

          setTimeout(() => {
            const person = people[i];
            container.innerHTML = getPersonHtml(person);
            container.style.opacity = '1';

            document.getElementById('prevBtn')?.addEventListener('click', () => {
              index = (index - 1 + people.length) % people.length;
              renderPerson(index);
            });

            document.getElementById('nextBtn')?.addEventListener('click', () => {
              index = (index + 1) % people.length;
              renderPerson(index);
            });
          }, 300);
        };

        const getPersonHtml = (person: any): string => {
  return `
    <style>
      .navBtn {
        background: #D8DEE9;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        color: #2E3440;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .navBtn:hover {
        background: #81A1C1;
        color: #ffffff;
      }
    </style>
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
      <div style="flex:1; min-width:200px;">
        <div style="font-size:1.3em; font-weight:bold; color:#2E3440;">${person.name}</div>
        <div style="color:#5E81AC; font-style:italic; font-size:1.1em;">${person.title}</div>
        <div style="margin-top:8px; color:#4C566A; font-size:1em;">${person.details}</div>
      </div>
    </div>
    <div style="text-align:right; margin-top:0;">
      <button class="navBtn" id="prevBtn">&lt;</button>
      <button class="navBtn" id="nextBtn">&gt;</button>
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
