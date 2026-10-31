// Stubs mínimos de ambiente de browser para os testes que correm em Node.
// Em ambiente jsdom (testes de renderização) os globais já existem e não são
// sobrescritos. Os módulos do dashboard referenciam window/document/localStorage
// no topo ou em funções; aqui garantimos que os imports não rebentem em Node.
import { beforeEach } from 'vitest';

// O store de setores é um singleton de módulo: cada teste começa limpo para
// não herdar caches de outro teste. Import dinâmico porque config.js usa
// window, que só existe depois dos stubs abaixo.
beforeEach(async () => {
  const { resetSectorStore } = await import('./sector-store.js');
  resetSectorStore();
});

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
