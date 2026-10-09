// Stubs mínimos de ambiente de browser para os testes que correm em Node.
// Em ambiente jsdom (testes de renderização) os globais já existem e não são
// sobrescritos. Os módulos do dashboard referenciam window/document/localStorage
// no topo ou em funções; aqui garantimos que os imports não rebentem em Node.

if (typeof globalThis.document === 'undefined') {
  globalThis.window = {
    location: { hostname: 'localhost', href: 'http://localhost/' },
    innerWidth: 1024,
    addEventListener() {},
    open() {},
  };

  globalThis.document = {
    baseURI: 'http://localhost/',
    addEventListener() {},
    getElementById() {
      return null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return {};
    },
    createElementNS() {
      return {};
    },
    body: { appendChild() {}, removeChild() {} },
    head: { appendChild() {} },
  };

  globalThis.localStorage = {
    store: {},
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
    },
    setItem(key, value) {
      this.store[key] = String(value);
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}
