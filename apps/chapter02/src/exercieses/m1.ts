class Book {
  #title: string;
  #pages: number;
  constructor(title: string, pages: number) {
    if (!title) throw new Error(`Book's title cannot be empty`);
    if (pages <= 0) throw new Error(`Book's pages cannot be 0 or negative`);
    this.#title = title;
    this.#pages = pages;
  }

  get title() {
    return this.#title;
  }

  get page() {
    return this.#pages;
  }
}

function mainFailed() {
  const b = new Book('', 0); // Should throw error
}

function mainSuccess() {
  const b = new Book('This is a title', 12); // Should success
}

function main() {
  mainSuccess();
  mainFailed();
}
