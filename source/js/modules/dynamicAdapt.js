/**
 * Класс для динамического перемещения DOM-элементов.
 * Атрибут: data-da="destinationSelector, breakpoint(max-width), position(index/last/first)"
 * Пример: data-da=".mobile-menu, 768, last"
 */
export class DynamicAdapt {
  constructor(type = 'max') {
    this.type = type;
    this.objects = [];
    this.daClass = 'dynamic-adapt';
  }

  init() {
    const elements = document.querySelectorAll('[data-da]');

    if (!elements.length) {
      return;
    }

    elements.forEach((element) => {
      const data = element.dataset.da.trim();
      const dataArray = data.split(',');
      const destinationSelector = dataArray[0].trim();
      const breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      const place = dataArray[2] ? dataArray[2].trim() : 'last';

      const destination = document.querySelector(destinationSelector);

      if (destination) {
        const object = {
          element,
          destination,
          breakpoint,
          place,
          parent: element.parentNode,
          index: this._indexInParent(element.parentNode, element),
          mediaQuery: window.matchMedia(`(${this.type}-width: ${breakpoint}px)`),
          anchor: document.createComment(`da-anchor-${breakpoint}`),
        };

        object.element.after(object.anchor);

        this.objects.push(object);
      }
    });

    this._sortObjects();

    this.objects.forEach((obj) => {
      obj.mediaQuery.addEventListener('change', () => this._handleMove(obj));
      this._handleMove(obj);
    });
  }

  _handleMove(obj) {
    if (obj.mediaQuery.matches) {
      this._moveTo(obj.element, obj.destination, obj.place);
    } else {
      this._moveBack(obj.element, obj.anchor);
    }
  }

  _moveTo(element, destination, place) {
    element.classList.add(this.daClass);

    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }

    if (place === 'first') {
      destination.prepend(element);
      return;
    }

    destination.children[place].before(element);
  }

  _moveBack(element, anchor) {
    element.classList.remove(this.daClass);
    anchor.before(element);
  }

  _indexInParent(parent, element) {
    return Array.prototype.indexOf.call(parent.children, element);
  }

  _sortObjects() {
    this.objects.sort((a, b) => {
      if (a.breakpoint === b.breakpoint) {
        return 0;
      }
      if (this.type === 'min') {
        return a.breakpoint > b.breakpoint ? 1 : -1;
      }
      return a.breakpoint < b.breakpoint ? 1 : -1;
    });
  }

  static init() {
    new DynamicAdapt().init();
  }
}
