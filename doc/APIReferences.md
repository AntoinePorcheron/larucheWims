# Dessin JSXGraph API References

### x.x inputbox

L'inputbox accepte deux parametre `label` qui est le titre du input, et `type` qui est le type du input (par defaut `"text"`).

Il renvoie un `$.Deferred().promise()` objet, qui `done` avec le valeur du input, et `fail` avec un message de error.

Pour les informations sur `$.Deferred()` objet, voyez sur le document de jQuery.

Un exemple est,

```javascript
$.when(self.inputbox("Entrer un nom : "))
					.done(function (nom) {
						element.name = nom;
						self.brd.update()
					})
					.fail(function (err) {
						alert(err)
					})
```



### x.x popUpImageUploader

Notice: `this.popUpImageUploader`  a besoin de `FileReader` module inclut dans IE9+, chrome, firefox, et opera (Tout plateforme) et safari (Mac OSX).

Il va ouvrir une fenetre pour choisir et upload un image.

Il accepte 2 parametre: `readSuccess` qui est la fonction callback tant que l'image est uploade avec `event` dont `event.target.result` est le url de l'image uploade, et `readFail` quand un erreur est emis.

Un exemple est,

```javascript
            var self = essaimJSXGraph;
            self.popupImageUploader(function (event) {
                var result = event.target.result;
                self.brd.create("image", [result, [0, 0], [5, 5]]);
                self.brd.update()
            }, function (err) {
  				throw err
```

