import './text-extent.css';

const extentDiv = document.createElement('div');
extentDiv.className = 'text_extent';
const root = document.getElementById('root');
if (!root) throw new Error('no root');
root.appendChild(extentDiv);

export function getTextExtent(text: string, font: string) {
    extentDiv.style.font = font;
    const node = document.createTextNode(text);
    extentDiv.appendChild(node);
    const width = extentDiv.clientWidth;
    const height = extentDiv.clientHeight;
    extentDiv.removeChild(node);
    return {width, height};
}