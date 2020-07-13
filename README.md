# Mia-Platform v5.0

[Read the doc from GitLab](docs/index.md)
To the official documentation go to [https://docs.mia-platform.eu][doc-site]

## How-to

### Install

```sh
pip install mkdocs
pip install mkdocs-material
pip install mkdocs-monorepo-plugin
pip install pymdown-extensions
pip install mkdocs-minify-plugin
```

!!! note
    Use `pip3` for installation

### Publish

When you want to publish a document launch

```sh
./publish.sh "your comment"
```

Please remember to change the sentence "your comment" with the modifications

### Test locally

To read the doc locally use

```sh
 mkdocs serve
```

### Test using Docker

```sh
docker run --rm -p 8000:8000 --mount "type=bind,source=$(pwd),target=/docs,readonly" squidfunk/mkdocs-material:3.1.0
```

After this command the site will be reachable on http://localhost:8000 and every changes made to the markdown files
will be hot reloaded to be immidiatly available inside your browser.

## Come contribuire a questa guida

Questa guida è interamente scritta in Markdown.

Ogni directory è una sezione specifica. Ogni file è un capitolo della guida. Sotto img vanno tutte le immagini.
Ricordarsi di aggiornare mkdocs.yml se si vogliono aggiungere menu al documento online.


### Scrivere la documentazione

Per aggiungere informazioni è sufficiente seguire i seguenti passi:

- fare clone di git@git.tools.mia-platform.eu:platform/documentations.git;
- creare un branch con il nome `prefix-name`
  - **prefix**: può essere
      `edit` se stai cambiando una pagina,
      `new` se stai lavorando ad una nuova sezione che è già in produzione,
      `prj` se stai scrivendo la documentazione per un progetto non ancora approvato
  - **name**: nome della pagina, della modifica o del progetto

- editare i/il file in modifica;
- usare ```mkdocs serve``` per vedere sul proprio pc la guida live mentre si modificano i files;
- quando finito eseguire  ``` ./publish.sh "your comment" ```
- aprire una merge request avvisando il PO del Prodotto
- una volta approvata la merge request la documentazione aggiornata sarà visibile a [questo sito][doc-site]

## References

For more info read the [documentation at www.mkdocs.org][mkdocs]

[doc-site]: https://docs.mia-platform.eu
[mkdocs]: http://www.mkdocs.org/user-guide/writing-your-docs/#configure-pages-and-navigation
